'use strict';

/**
 * Moteur de notation RegAudit.
 *
 * Le moteur ne contient aucune règle AIRMS en dur : il lit les simulations,
 * critères, actions et niveaux depuis regaudit-simulations-scoring.json.
 */

function normalizeSelectedOptionIds(value, questionType) {
  if (questionType === 'multi_select') {
    if (Array.isArray(value)) return [...new Set(value)];
    if (typeof value === 'string' && value.length > 0) return [value];
    return [];
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? [value[0]] : [];
  }

  return typeof value === 'string' && value.length > 0 ? [value] : [];
}

function getSimulation(catalog, simulationId) {
  if (!catalog || !Array.isArray(catalog.simulations)) {
    throw new Error('Catalogue RegAudit invalide : simulations manquantes.');
  }

  const simulation = catalog.simulations.find((item) => item.id === simulationId);
  if (!simulation) {
    throw new Error(`Simulation introuvable : ${simulationId}`);
  }

  return simulation;
}

function getLevel(scoring, score) {
  const level = scoring.levels.find(
    (item) => score >= item.minScore && score <= item.maxScore,
  );

  return level || {
    id: 'unknown',
    label: 'Niveau non défini',
    minScore: 0,
    maxScore: 0,
  };
}

function buildActionIndex(simulation) {
  const actionIndex = new Map();
  const criterionIndex = new Map();

  for (const criterion of simulation.criteria) {
    criterionIndex.set(criterion.id, criterion);
    for (const action of criterion.actions) {
      actionIndex.set(action.id, {
        ...action,
        criterionId: criterion.id,
      });
    }
  }

  return { actionIndex, criterionIndex };
}

function evaluateSimulation(catalog, simulationId, responses = {}) {
  const simulation = getSimulation(catalog, simulationId);
  const { actionIndex, criterionIndex } = buildActionIndex(simulation);
  const awardedActionIds = new Set();
  const criticalErrorIds = new Set();
  const questionResults = [];

  for (const question of simulation.questions) {
    const selectedOptionIds = normalizeSelectedOptionIds(
      responses[question.id],
      question.type,
    );
    const selectedOptions = question.options.filter((option) =>
      selectedOptionIds.includes(option.id),
    );
    const questionActionIds = new Set();
    const questionCriticalErrors = new Set();
    let feedback = [];

    for (const option of selectedOptions) {
      for (const actionId of option.actionIds || []) {
        if (actionIndex.has(actionId)) {
          awardedActionIds.add(actionId);
          questionActionIds.add(actionId);
        }
      }

      if (option.criticalErrorId) {
        criticalErrorIds.add(option.criticalErrorId);
        questionCriticalErrors.add(option.criticalErrorId);
      }

      if (option.feedback) {
        feedback.push(option.feedback);
      }
    }

    const earnedPoints = [...questionActionIds].reduce(
      (total, actionId) => total + actionIndex.get(actionId).points,
      0,
    );

    questionResults.push({
      questionId: question.id,
      selectedOptionIds,
      awardedActionIds: [...questionActionIds],
      earnedPoints,
      feedback,
      criticalErrorIds: [...questionCriticalErrors],
      isAnswered: selectedOptions.length > 0,
    });
  }

  const rawScore = [...awardedActionIds].reduce(
    (total, actionId) => total + actionIndex.get(actionId).points,
    0,
  );
  const hasCriticalError = criticalErrorIds.size > 0;
  const criticalMaximum =
    catalog.scoring.criticalErrorPolicy.maximumScoreAfterCriticalError;
  const score = hasCriticalError
    ? Math.min(rawScore, criticalMaximum)
    : rawScore;

  const criterionResults = simulation.criteria.map((criterion) => {
    const awardedPoints = criterion.actions
      .filter((action) => awardedActionIds.has(action.id))
      .reduce((total, action) => total + action.points, 0);

    return {
      criterionId: criterion.id,
      label: criterion.label,
      score: awardedPoints,
      maxScore: criterion.maxPoints,
      percentage: Math.round((awardedPoints / criterion.maxPoints) * 100),
    };
  });

  const level = getLevel(catalog.scoring, score);

  return {
    simulationId: simulation.id,
    title: simulation.title,
    rawScore,
    score,
    maxScore: catalog.scoring.maxScore,
    passed: score >= catalog.scoring.passScore && !hasCriticalError,
    level,
    criticalErrors: [...criticalErrorIds],
    requiresFeedbackReview: hasCriticalError,
    awardedActionIds: [...awardedActionIds],
    criterionResults,
    questionResults,
  };
}

function validateCatalog(catalog) {
  const errors = [];

  if (!catalog || !catalog.scoring || !Array.isArray(catalog.simulations)) {
    return ['Le catalogue doit contenir scoring et simulations.'];
  }

  const knownCriticalErrors = new Set(
    (catalog.scoring.criticalErrorPolicy.errors || []).map((item) => item.id),
  );

  for (const simulation of catalog.simulations) {
    const actionIds = new Set();
    const criterionIds = new Set();

    if (!Array.isArray(simulation.criteria) || simulation.criteria.length !== 5) {
      errors.push(`${simulation.id}: la simulation doit avoir 5 critères.`);
      continue;
    }

    for (const criterion of simulation.criteria) {
      criterionIds.add(criterion.id);
      const actionPoints = (criterion.actions || []).reduce(
        (total, action) => total + action.points,
        0,
      );

      if (criterion.maxPoints !== 20 || actionPoints !== 20) {
        errors.push(
          `${simulation.id}/${criterion.id}: le critère doit totaliser 20 points.`,
        );
      }

      for (const action of criterion.actions || []) {
        if (actionIds.has(action.id)) {
          errors.push(`${simulation.id}: action dupliquée ${action.id}.`);
        }
        actionIds.add(action.id);
        if (action.criticalErrorId && !knownCriticalErrors.has(action.criticalErrorId)) {
          errors.push(
            `${simulation.id}/${action.id}: erreur critique inconnue ${action.criticalErrorId}.`,
          );
        }
      }
    }

    if (!Array.isArray(simulation.questions) || simulation.questions.length !== 5) {
      errors.push(`${simulation.id}: la simulation doit avoir 5 questions.`);
      continue;
    }

    const mappedActionIds = new Set();
    for (const question of simulation.questions) {
      if (!criterionIds.has(question.criterionId)) {
        errors.push(
          `${simulation.id}/${question.id}: critère inexistant ${question.criterionId}.`,
        );
      }

      for (const option of question.options || []) {
        for (const actionId of option.actionIds || []) {
          mappedActionIds.add(actionId);
          if (!actionIds.has(actionId)) {
            errors.push(
              `${simulation.id}/${question.id}: action inexistante ${actionId}.`,
            );
          }
        }

        if (
          option.criticalErrorId &&
          !knownCriticalErrors.has(option.criticalErrorId)
        ) {
          errors.push(
            `${simulation.id}/${question.id}: erreur critique inconnue ${option.criticalErrorId}.`,
          );
        }
      }
    }

    for (const actionId of actionIds) {
      if (!mappedActionIds.has(actionId)) {
        errors.push(`${simulation.id}: action non reliée à une réponse ${actionId}.`);
      }
    }
  }

  return errors;
}

function assertValidCatalog(catalog) {
  const errors = validateCatalog(catalog);
  if (errors.length > 0) {
    throw new Error(`Catalogue RegAudit invalide :\n- ${errors.join('\n- ')}`);
  }
  return true;
}

module.exports = {
  assertValidCatalog,
  evaluateSimulation,
  getLevel,
  getSimulation,
  validateCatalog,
};
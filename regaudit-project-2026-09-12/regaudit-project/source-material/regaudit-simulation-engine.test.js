'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  assertValidCatalog,
  evaluateSimulation,
  validateCatalog,
} = require('./regaudit-simulation-engine');

const catalogPath = path.join(__dirname, 'regaudit-simulations-scoring.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

function bestAnswers(simulation) {
  return Object.fromEntries(
    simulation.questions.map((question) => {
      const recommended = question.options.find((option) => option.isRecommended);
      const recommendedIds = question.options
        .filter((option) => option.actionIds && option.actionIds.length > 0)
        .map((option) => option.id);
      return [
        question.id,
        question.type === 'multi_select'
          ? recommendedIds
          : recommended.id,
      ];
    }),
  );
}

assert.deepEqual(validateCatalog(catalog), []);
assert.equal(assertValidCatalog(catalog), true);
assert.equal(catalog.simulations.length, 10);

const simulation1 = catalog.simulations[0];
const perfectResult = evaluateSimulation(
  catalog,
  simulation1.id,
  bestAnswers(simulation1),
);
assert.equal(perfectResult.score, 100);
assert.equal(perfectResult.passed, true);
assert.equal(perfectResult.level.id, 'rigorous_mastery');
assert.equal(perfectResult.criticalErrors.length, 0);

const simulation2 = catalog.simulations[1];
const criticalResponses = bestAnswers(simulation2);
criticalResponses['q1-comprendre-alerte'] = 'q1-critical';
const criticalResult = evaluateSimulation(
  catalog,
  simulation2.id,
  criticalResponses,
);
assert.equal(criticalResult.rawScore, 88);
assert.equal(criticalResult.score, 59);
assert.equal(criticalResult.passed, false);
assert.deepEqual(criticalResult.criticalErrors, ['present_unvalidated_rule']);
assert.equal(criticalResult.requiresFeedbackReview, true);

const simulation3 = catalog.simulations[2];
const multiSelectResponses = bestAnswers(simulation3);
multiSelectResponses['q1-reperer-erreurs'] = [
  'q1-error-1',
  'q1-error-2',
  'q1-error-3',
];
const multiSelectResult = evaluateSimulation(
  catalog,
  simulation3.id,
  multiSelectResponses,
);
assert.equal(multiSelectResult.score, 100);
assert.equal(multiSelectResult.passed, true);

console.log('RegAudit simulation engine: tests passed');
# RegAudit — Cahier des charges fonctionnel et technique

**Version :** 1.0  
**Date :** 11 septembre 2026  
**Porteur :** APEX SKY  
**Nom de code :** RegAudit  
**Format cible :** Progressive Web App mobile-first  
**Langue de référence :** Français simple  
**Statut :** Document de cadrage à valider par un expert AIRMS

> **Important — validation réglementaire**  
> Ce document traduit la vision produit fournie pour RegAudit. Les règles, délais, seuils, pièces exigées, sanctions et formulations présentés dans les contenus pédagogiques devront être relus et validés par un expert AIRMS ou un conseil juridique compétent avant leur mise en production. L’application est un outil de préparation et de formation ; elle ne se substitue pas à une instruction officielle de l’AIRMS.

---

## 1. Résumé exécutif

RegAudit est une application mobile très simple qui aide le personnel des mutuelles à comprendre les contrôles AIRMS, à vérifier leurs documents et à s’entraîner à répondre à un auditeur.

L’expérience doit être aussi accessible qu’une application d’apprentissage grand public :

- trois actions principales depuis l’accueil : **Apprendre**, **Simuler**, **Manager** ;
- des séquences de 5 à 10 minutes ;
- un langage sans jargon ou immédiatement expliqué ;
- de grosses zones tactiles et une navigation en trois clics maximum ;
- une progression sauvegardée automatiquement ;
- un fonctionnement dégradé lorsque la connexion est faible ou absente ;
- un certificat téléchargeable en fin de parcours ;
- un bouton de contact vers un expert AIRMS via WhatsApp ;
- un espace administrateur permettant à APEX SKY de suivre les utilisateurs et les mutuelles.

Le produit doit commencer par un MVP permettant de tester la valeur sur quelques mutuelles à Abidjan, puis évoluer vers une plateforme de formation complète.

---

## 2. Vision et objectifs

### 2.1 Vision en une phrase

> Une application mobile ultra-simple, de type Duolingo pour mutuelles, qui forme le personnel administratif à ne plus rater un contrôle AIRMS.

### 2.2 Problème à résoudre

Les équipes administratives des mutuelles doivent pouvoir :

1. savoir ce que l’autorité peut contrôler ;
2. retrouver rapidement les pièces utiles ;
3. identifier les manquements avant une mission ;
4. comprendre les conséquences d’un dossier incomplet ou d’une mauvaise organisation ;
5. répartir les responsabilités entre accueil, secrétariat, comptabilité, gestion et direction ;
6. agir malgré une connexion internet faible.

### 2.3 Objectifs produit

| Objectif | Indicateur de succès proposé |
|---|---|
| Rendre les exigences compréhensibles | Au moins 80 % des utilisateurs pilotes réussissent le quiz de fin de module |
| Améliorer la préparation aux contrôles | Chaque mutuelle pilote réalise au moins une simulation complète |
| Faire progresser les équipes | 70 % des utilisateurs inscrits terminent au moins 4 micro-modules |
| Identifier les lacunes | Chaque session produit un score et une liste d’actions |
| Rester utilisable sur mobile | Parcours principal réalisable sur un téléphone Android d’entrée de gamme |
| Fonctionner avec une connexion instable | Les contenus déjà téléchargés restent consultables hors connexion |
| Faciliter l’accompagnement APEX SKY | Le back-office affiche la progression par mutuelle et par utilisateur |

### 2.4 Objectifs non inclus dans la première version

RegAudit ne doit pas, dans le MVP :

- se présenter comme un outil officiel de l’AIRMS ;
- produire un avis juridique ou garantir le résultat d’un contrôle ;
- remplacer un logiciel comptable, un registre officiel ou un système de gestion de mutuelle ;
- envoyer automatiquement des documents à l’AIRMS ;
- stocker des pièces sensibles de manière permanente sans politique de conservation validée ;
- calculer une solvabilité réglementaire définitive si les formules officielles n’ont pas été confirmées ;
- gérer la paie, la comptabilité ou les remboursements des adhérents.

---

## 3. Cadre réglementaire de référence à intégrer

La structure pédagogique reprend les trois missions AIRMS indiquées dans la vision produit.

### 3.1 Agrément

L’application doit apprendre à l’utilisateur à vérifier la pertinence, la cohérence et la régularité juridique d’un dossier d’agrément.

**À traiter dans les contenus :**

- pièces attendues ;
- cohérence entre les documents ;
- informations manquantes ou contradictoires ;
- responsabilités de validation ;
- procédure de correction avant transmission.

### 3.2 Registre

L’application doit expliquer l’immatriculation et la mise à jour obligatoire des informations de la mutuelle.

**À traiter dans les contenus :**

- informations devant être déclarées ;
- changements nécessitant une mise à jour ;
- responsable interne du suivi ;
- pièces justificatives ;
- calendrier et preuve de transmission, après validation par l’expert.

### 3.3 Contrôle

L’application doit préparer l’équipe à la surveillance financière, à la solvabilité, au fonctionnement de la mutuelle et aux suites possibles d’un contrôle.

**À traiter dans les contenus :**

- organisation de l’accueil de l’auditeur ;
- pièces comptables et administratives ;
- gouvernance ;
- suivi financier ;
- plaintes et adhérents ;
- mesures conservatoires ;
- sanctions possibles ;
- appel au Fonds National de Garantie, selon les règles officiellement confirmées.

### 3.4 Gouvernance du contenu réglementaire

Chaque contenu réglementaire doit avoir les métadonnées suivantes :

- auteur ;
- relecteur réglementaire ;
- date de validation ;
- version ;
- source ou référence interne ;
- date de prochaine revue ;
- statut : brouillon, en revue, validé, archivé.

Une modification d’un seuil, d’un délai ou d’une pièce exigée doit créer une nouvelle version et ne pas écraser silencieusement l’historique.

---

## 4. Utilisateurs et rôles

### 4.1 Public cible

| Profil | Besoin principal | Niveau numérique attendu |
|---|---|---|
| Agent d’accueil | Savoir orienter l’auditeur et retrouver une pièce | Débutant à intermédiaire |
| Secrétaire | Tenir les dossiers et procès-verbaux à jour | Débutant à intermédiaire |
| Comptable | Comprendre les pièces et alertes financières | Intermédiaire |
| Gestionnaire | Vérifier les adhérents, plaintes et opérations | Intermédiaire |
| Gérant / DG | Suivre le niveau de préparation et décider des actions | Intermédiaire |
| Formateur APEX SKY | Former, corriger et suivre plusieurs mutuelles | Intermédiaire |
| Administrateur APEX SKY | Administrer les comptes, contenus et rapports | Avancé |

### 4.2 Rôles applicatifs

1. **Apprenant**
   - consulte les modules ;
   - répond aux quiz ;
   - réalise les simulations ;
   - voit sa progression et son certificat.

2. **Responsable de mutuelle**
   - consulte la progression de son équipe ;
   - affecte des modules ;
   - visualise les lacunes collectives ;
   - prépare un plan d’action.

3. **Formateur**
   - consulte les cohortes ;
   - assigne un parcours ;
   - ajoute un commentaire pédagogique ;
   - exporte un rapport.

4. **Administrateur APEX SKY**
   - gère les mutuelles et les utilisateurs ;
   - publie les contenus validés ;
   - configure les simulations ;
   - consulte les statistiques globales ;
   - gère les modèles de certificats.

5. **Référent réglementaire**
   - relit et valide les contenus ;
   - laisse une trace de validation ;
   - demande l’archivage d’une version obsolète.

---

## 5. Principes d’expérience utilisateur

### 5.1 Règles de simplicité

- Une seule action principale par écran.
- Maximum trois clics pour commencer un module ou une simulation depuis l’accueil.
- Une question par écran dans les quiz.
- Une phrase courte, une idée à la fois.
- Les mots techniques sont accompagnés d’une explication simple.
- Les erreurs sont expliquées sans culpabiliser.
- L’utilisateur peut quitter et reprendre sans perdre sa progression.
- Les boutons principaux sont visibles sans défilement sur un écran mobile courant.

### 5.2 Ton éditorial

Le ton doit être :

- simple ;
- concret ;
- professionnel mais non administratif ;
- encourageant ;
- adapté à un public de niveaux scolaires variés.

**Exemple à privilégier :**

> « Le registre doit être à jour. Si le responsable a changé, vérifiez que la modification a bien été déclarée et que la preuve est classée. »

**Formulation à éviter :**

> « Procéder à la régularisation subséquente des éléments modificatifs afférents à la gouvernance. »

### 5.3 Accessibilité

- contraste lisible en mode clair et sombre ;
- taille de texte réglable ;
- boutons d’au moins 44 × 44 px ;
- icônes accompagnées d’un libellé ;
- audio facultatif en français simple ;
- sous-titres pour toutes les vidéos ;
- pas d’information transmise uniquement par une couleur ;
- compatibilité avec les lecteurs d’écran pour les parcours principaux ;
- messages d’erreur lisibles et actionnables.

### 5.4 Identité visuelle initiale

La palette peut s’inspirer de la Côte d’Ivoire sans reproduire un signe officiel :

- orange pour l’action et l’attention ;
- blanc pour les surfaces ;
- vert pour la réussite et la progression ;
- gris foncé pour le texte ;
- rouge réservé aux alertes importantes.

L’utilisation de symboles officiels, logos ou formulations laissant croire à une application AIRMS doit être validée séparément.

---

## 6. Architecture fonctionnelle

```text
Accueil
├── Apprendre
│   ├── Parcours recommandé
│   ├── 8 micro-modules Audit & Contrôle
│   ├── Résultat du quiz
│   └── Fiche mémo / audio / vidéo
├── Simuler
│   ├── L’auditeur arrive
│   ├── Alerte solvabilité
│   ├── Dossier incomplet
│   ├── Rapport de contrôle
│   └── Résultats et plan d’action
├── Manager
│   ├── 4 micro-modules de management
│   ├── Scénarios interactifs
│   └── Suivi de l’équipe
├── Ma progression
├── Mon certificat
├── Aide / FAQ
└── Appeler un expert AIRMS
```

---

## 7. Parcours utilisateur principal

### 7.1 Première connexion

1. L’utilisateur saisit son numéro de téléphone.
2. Il reçoit un code à usage unique.
3. Il choisit sa mutuelle ou rejoint une mutuelle avec un code.
4. Il choisit son rôle : accueil, secrétaire, comptable, gestionnaire, direction ou autre.
5. L’application affiche un mini-diagnostic de cinq questions.
6. L’application propose un parcours de départ.

**Données minimales demandées :**

- numéro de téléphone ;
- prénom ou nom d’affichage ;
- mutuelle ;
- rôle ;
- consentement aux conditions d’utilisation et à la politique de confidentialité.

### 7.2 Retour d’un utilisateur

L’accueil affiche :

- le pourcentage de préparation ;
- le dernier module ouvert ;
- une action recommandée ;
- le nombre de points à revoir ;
- l’accès aux trois grandes tuiles.

### 7.3 Fin d’un module

1. L’utilisateur termine la leçon.
2. Il répond à cinq questions.
3. Il voit son score et les réponses expliquées.
4. Il peut recommencer les questions incorrectes.
5. La progression est enregistrée.
6. Le module est marqué comme terminé si le seuil configuré est atteint.

### 7.4 Fin d’une simulation

1. L’utilisateur lit le contexte.
2. Il prend une décision ou sélectionne les pièces / actions.
3. Il obtient un retour immédiat ou à la fin, selon le scénario.
4. Il reçoit un score sur 100.
5. L’application affiche les risques et les actions prioritaires.
6. Le responsable peut créer un plan de redressement à partir des erreurs.

---

## 8. Modules pédagogiques

## 8.1 Module 1 — Formation Audit & Contrôle AIRMS

Huit micro-modules de 10 minutes environ.

| N° | Titre | Résultat attendu |
|---:|---|---|
| 1 | Dossier d’agrément parfait | Repérer les pièces manquantes et incohérences |
| 2 | Registre national : quoi déclarer et quand ? | Identifier les changements à signaler |
| 3 | Gouvernance | Vérifier les PV d’AG et du Conseil d’Administration |
| 4 | Solvabilité expliquée simplement | Comprendre les principaux signaux financiers |
| 5 | Trésorerie et pièces comptables | Préparer les justificatifs utiles |
| 6 | Adhérents et plaintes | Organiser les dossiers et le suivi des réclamations |
| 7 | Mesures conservatoires | Reconnaître les situations à risque et réagir correctement |
| 8 | Fonds National de Garantie | Comprendre le rôle du fonds selon les règles validées |

### Format de chaque micro-module

- objectif en une phrase ;
- vidéo de trois minutes maximum ;
- fiche mémo ;
- audio en français simple ;
- quiz de cinq questions ;
- exercice « Trouve l’erreur dans ce dossier » ;
- rappel des points à vérifier ;
- bouton « Revoir ce module ».

### Règle de validation proposée

- module consulté : progression enregistrée ;
- quiz réussi : score minimum configurable, proposé à 70 % ;
- module terminé : leçon consultée et quiz validé ;
- possibilité de recommencer sans pénalité.

Le seuil de validation devra être confirmé par APEX SKY.

## 8.2 Module 2 — Préparation d’audit par simulations

Ce module est le cœur de la proposition de valeur.

### Simulateur 1 — L’auditeur arrive

**Situation :** un auditeur se présente et demande le registre ainsi que plusieurs pièces.

**Actions utilisateur :**

- choisir les documents à présenter ;
- identifier la personne responsable ;
- classer les pièces dans le bon ordre ;
- répondre à une demande imprévue.

**Évaluation :**

- document correctement sélectionné ;
- document obsolète écarté ;
- absence de promesse ou d’invention ;
- réponse claire et professionnelle ;
- escalade vers le responsable si nécessaire.

### Simulateur 2 — Alerte solvabilité

**Situation :** la mutuelle a dépensé 90 % des cotisations.

**Actions utilisateur :**

- interpréter l’alerte ;
- choisir trois actions immédiates ;
- indiquer les personnes à prévenir ;
- sélectionner les données à vérifier.

**Important :** le seuil de 90 % est un cas pédagogique fourni dans la vision produit. Il ne doit pas être présenté comme un seuil réglementaire sans validation officielle.

### Simulateur 3 — Dossier incomplet

**Situation :** un dossier d’agrément contient trois erreurs.

**Actions utilisateur :**

- repérer les erreurs ;
- associer chaque erreur à son risque ;
- choisir la correction ;
- produire une checklist de retour.

### Simulateur 4 — Rapport de contrôle

**Situation :** la mutuelle reçoit un faux rapport contenant des recommandations.

**Actions utilisateur :**

- prioriser les recommandations ;
- attribuer un responsable ;
- fixer une échéance ;
- rédiger un plan de redressement ;
- traiter un délai de 48 heures comme contrainte de scénario.

Le délai de 48 heures devra être confirmé avant d’être présenté comme une obligation réelle.

### Simulateur 5 — Vérification du registre

**Situation :** plusieurs informations de la mutuelle ont changé depuis la dernière mise à jour.

**Actions utilisateur :**

- repérer les informations qui doivent être actualisées ;
- associer chaque changement à sa pièce justificative ;
- identifier le responsable de la déclaration ;
- classer les preuves de mise à jour.

### Simulateur 6 — Gouvernance et procès-verbaux

**Situation :** l’auditeur demande les procès-verbaux d’Assemblée Générale et du Conseil d’Administration.

**Actions utilisateur :**

- sélectionner les procès-verbaux pertinents ;
- vérifier les dates, signatures et décisions ;
- repérer une incohérence entre deux documents ;
- préparer une réponse lorsque la pièce est introuvable.

### Simulateur 7 — Trésorerie et pièces comptables

**Situation :** une vérification met en évidence des écarts entre les mouvements de trésorerie et les pièces disponibles.

**Actions utilisateur :**

- rapprocher une opération avec son justificatif ;
- distinguer une pièce manquante d’une pièce incorrecte ;
- choisir les documents à demander au comptable ;
- prioriser les corrections.

### Simulateur 8 — Adhérent et plainte non traitée

**Situation :** un adhérent affirme que sa plainte n’a pas reçu de réponse.

**Actions utilisateur :**

- retrouver les éléments du dossier ;
- reconstituer la chronologie ;
- choisir une réponse professionnelle ;
- enregistrer l’action de suivi et son responsable.

### Simulateur 9 — Mesure conservatoire et escalade

**Situation :** un signal important nécessite une décision rapide de la direction.

**Actions utilisateur :**

- reconnaître les signaux nécessitant une escalade ;
- prévenir la bonne personne ;
- éviter de prendre une décision hors de son rôle ;
- préparer les informations utiles pour la direction.

Les conséquences et la terminologie de ce scénario devront être validées par le référent réglementaire avant publication.

### Simulateur 10 — Clôture du contrôle et plan de suivi

**Situation :** la mission de contrôle se termine et plusieurs recommandations restent ouvertes.

**Actions utilisateur :**

- reformuler les recommandations ;
- les classer par priorité et risque ;
- attribuer un responsable et une échéance ;
- définir la preuve attendue pour clôturer chaque action ;
- préparer un point de suivi pour la direction.

### 8.2.1 Grille de notation des 10 simulations

Chaque simulation est notée sur **100 points**. La grille mesure non seulement la bonne réponse, mais aussi la méthode de travail : vérification des faits, classement des pièces, respect du rôle, traçabilité et capacité à escalader une situation sensible.

#### Niveaux de résultat

| Score | Niveau affiché | Interprétation |
|---:|---|---|
| 0 à 59 | À reprendre | Les réflexes essentiels ne sont pas encore maîtrisés |
| 60 à 79 | En progrès | Les bases sont présentes, mais plusieurs points doivent être consolidés |
| 80 à 89 | Prêt pour l’exercice | La simulation est réussie avec quelques améliorations possibles |
| 90 à 100 | Maîtrise rigoureuse | La démarche est structurée, complète et correctement tracée |

**Seuil de réussite recommandé : 80/100.** Ce seuil est une règle pédagogique RegAudit et ne constitue pas un seuil officiel AIRMS.

#### Règles communes de notation

1. Une action correcte et réalisée au bon moment obtient la totalité des points du critère.
2. Une action partiellement correcte obtient 50 % des points du critère.
3. Une action oubliée obtient 0 point.
4. Une réponse non justifiée peut obtenir le résultat opérationnel, mais pas les points de méthode et de traçabilité.
5. L’utilisateur peut consulter le corrigé après la simulation, avec une explication simple pour chaque perte de points.
6. Le score doit être reproductible : deux utilisateurs donnant la même réponse obtiennent le même résultat.

#### Erreurs critiques

Une erreur critique déclenche une alerte spécifique et limite le score maximal à **59/100**, même si les autres réponses sont correctes :

- inventer une pièce, une information ou une transmission qui n’a pas été faite ;
- cacher volontairement une anomalie à l’auditeur ;
- présenter comme officielle une information non validée ;
- prendre une décision hors de son rôle alors qu’une escalade est nécessaire ;
- supprimer ou modifier une preuve pour faire disparaître un écart ;
- divulguer une donnée personnelle à une personne non autorisée.

L’utilisateur doit pouvoir recommencer la simulation après avoir lu le corrigé.

#### Matrice détaillée par simulation

| N° | Simulation | Critères de notation — 20 points chacun |
|---:|---|---|
| 1 | L’auditeur arrive | 1. Accueil et posture professionnelle ; 2. Sélection des bonnes pièces ; 3. Vérification de la version des documents ; 4. Réponse factuelle sans invention ; 5. Escalade et traçabilité |
| 2 | Alerte solvabilité | 1. Compréhension de l’alerte ; 2. Vérification des données ; 3. Priorisation des trois actions ; 4. Information des responsables ; 5. Suivi documenté |
| 3 | Dossier incomplet | 1. Repérage des trois erreurs ; 2. Association erreur/risque ; 3. Choix des corrections ; 4. Classement des pièces de retour ; 5. Contrôle final avant transmission |
| 4 | Rapport de contrôle | 1. Lecture des recommandations ; 2. Classement par urgence et risque ; 3. Attribution d’un responsable ; 4. Définition d’une échéance réaliste ; 5. Plan de redressement traçable |
| 5 | Vérification du registre | 1. Repérage des changements ; 2. Choix des justificatifs ; 3. Identification du responsable ; 4. Vérification de la mise à jour ; 5. Archivage de la preuve |
| 6 | Gouvernance et procès-verbaux | 1. Sélection des PV pertinents ; 2. Vérification des dates ; 3. Vérification des signatures et décisions ; 4. Détection de l’incohérence ; 5. Réponse et action corrective |
| 7 | Trésorerie et pièces comptables | 1. Rapprochement opération/justificatif ; 2. Détection de l’écart ; 3. Demande des pièces manquantes ; 4. Priorisation de la correction ; 5. Conservation de la piste d’audit |
| 8 | Adhérent et plainte non traitée | 1. Recherche du dossier ; 2. Reconstitution de la chronologie ; 3. Réponse professionnelle ; 4. Respect de la confidentialité ; 5. Enregistrement du suivi |
| 9 | Mesure conservatoire et escalade | 1. Reconnaissance du signal de risque ; 2. Respect du périmètre de rôle ; 3. Alerte de la bonne personne ; 4. Préparation des faits vérifiables ; 5. Traçabilité de l’escalade |
| 10 | Clôture du contrôle et plan de suivi | 1. Reformulation des recommandations ; 2. Classement par priorité ; 3. Attribution des responsables ; 4. Définition des preuves et échéances ; 5. Préparation du suivi direction |

#### Feedback affiché après chaque simulation

Le résultat doit présenter :

- le score global et le niveau ;
- le score obtenu sur chacun des cinq critères ;
- les deux points forts de l’utilisateur ;
- les erreurs ou oublis prioritaires ;
- la bonne méthode en trois étapes maximum ;
- les modules à revoir ;
- un bouton « Recommencer la simulation » ;
- un bouton « Créer un point dans le plan d’action » pour un responsable.

#### Utilisation du score dans la progression

Pour éviter qu’une seule simulation ne masque une faiblesse importante :

- une simulation réussie est enregistrée à partir de 80/100 ;
- une erreur critique impose de revoir le corrigé avant de poursuivre ;
- le score affiché dans le dashboard est la moyenne des simulations terminées ;
- le dashboard doit aussi afficher le nombre de simulations réussies sur 10 ;
- le niveau global « Maîtrise rigoureuse » peut être attribué uniquement si l’utilisateur a obtenu au moins 80/100 dans 8 simulations sur 10 et au moins 60/100 dans les deux restantes ;
- les règles de progression restent configurables par l’administrateur.

#### 8.2.2 Barèmes détaillés par simulation

Les barèmes ci-dessous sont une proposition fonctionnelle. Les formulations liées aux obligations AIRMS devront être validées par le référent réglementaire avant publication.

**Règle de calcul :**

- chaque ligne correspond à un critère sur 20 points ;
- chaque action validée rapporte les points indiqués ;
- une action partiellement réalisée rapporte la moitié des points, arrondie à l’entier inférieur ;
- une action absente ou incorrecte rapporte 0 point ;
- le score de la simulation est la somme des 25 actions, sur 100.

##### Simulation 1 — L’auditeur arrive

| Critère | Actions attendues | Points |
|---|---|---:|
| Accueil et posture | Saluer et accueillir correctement (8) ; se présenter ou identifier son rôle (6) ; prévenir le responsable désigné (6) | 20 |
| Sélection des pièces | Présenter le registre demandé (8) ; utiliser la checklist de préparation (6) ; ne pas remettre de document sans rapport (6) | 20 |
| Vérification des versions | Vérifier la date ou version de chaque pièce (10) ; écarter ou signaler une pièce obsolète (10) | 20 |
| Réponse factuelle | Répondre avec une information vérifiée (10) ; signaler clairement une pièce manquante (5) ; ne rien inventer (5) | 20 |
| Traçabilité et escalade | Noter la demande de l’auditeur (8) ; attribuer le suivi à une personne (6) ; escalader si la réponse dépasse son rôle (6) | 20 |

##### Simulation 2 — Alerte solvabilité

| Critère | Actions attendues | Points |
|---|---|---:|
| Compréhension de l’alerte | Identifier le signal financier (8) ; comprendre que 90 % est un cas pédagogique à vérifier et non une règle automatique (6) ; ne pas conclure sans données complètes (6) | 20 |
| Vérification des données | Vérifier la période concernée (6) ; comparer cotisations et prestations (7) ; demander les données ou justificatifs manquants (7) | 20 |
| Actions prioritaires | Choisir une analyse immédiate (7) ; proposer une mesure de suivi documentée (7) ; éviter une décision précipitée non autorisée (6) | 20 |
| Information des responsables | Prévenir le responsable financier ou la direction (8) ; présenter les faits et non une rumeur (6) ; préciser le niveau d’urgence (6) | 20 |
| Suivi | Créer une action avec responsable (7) ; définir une échéance (6) ; conserver les données ayant servi à l’analyse (7) | 20 |

##### Simulation 3 — Dossier incomplet

| Critère | Actions attendues | Points |
|---|---|---:|
| Repérage des erreurs | Trouver la première erreur (7) ; trouver la deuxième erreur (7) ; trouver la troisième erreur (6) | 20 |
| Association erreur/risque | Associer correctement la première erreur à son risque (7) ; faire de même pour la deuxième (7) ; faire de même pour la troisième (6) | 20 |
| Corrections | Choisir la correction de la première erreur (7) ; choisir celle de la deuxième (7) ; choisir celle de la troisième (6) | 20 |
| Dossier de retour | Ajouter les pièces ou informations demandées (8) ; identifier la personne qui doit corriger (6) ; garder la preuve de la correction (6) | 20 |
| Contrôle final | Relire la checklist complète (7) ; vérifier la cohérence entre les documents (7) ; obtenir une validation avant transmission (6) | 20 |

##### Simulation 4 — Rapport de contrôle

| Critère | Actions attendues | Points |
|---|---|---:|
| Lecture | Identifier les recommandations du rapport (8) ; distinguer un constat d’une recommandation (6) ; repérer les informations à clarifier (6) | 20 |
| Priorisation | Classer l’action la plus urgente (8) ; identifier le risque le plus important (6) ; distinguer l’urgent du simplement souhaitable (6) | 20 |
| Responsabilités | Attribuer chaque action au bon rôle (8) ; ne pas attribuer une action sans accord ou capacité (6) ; désigner un responsable de coordination (6) | 20 |
| Échéances | Fixer une date pour chaque action (7) ; tenir compte des dépendances (6) ; signaler une échéance irréaliste (7) | 20 |
| Plan de redressement | Décrire l’action à réaliser (7) ; préciser la preuve attendue (7) ; prévoir une revue par la direction (6) | 20 |

##### Simulation 5 — Vérification du registre

| Critère | Actions attendues | Points |
|---|---|---:|
| Changements à repérer | Identifier le changement de responsable (7) ; identifier le changement d’adresse ou d’information administrative (7) ; repérer toute autre modification signalée dans le cas (6) | 20 |
| Justificatifs | Associer la bonne pièce au premier changement (7) ; associer la bonne pièce au deuxième (7) ; signaler une pièce insuffisante (6) | 20 |
| Responsabilité | Identifier qui prépare le dossier (6) ; identifier qui valide (7) ; identifier qui effectue ou suit la déclaration (7) | 20 |
| Vérification | Contrôler que les informations concordent (7) ; vérifier la date de mise à jour (6) ; repérer une information encore ancienne (7) | 20 |
| Preuve et archivage | Enregistrer la date d’action (6) ; conserver la preuve de transmission ou de dépôt (8) ; classer la version finale (6) | 20 |

##### Simulation 6 — Gouvernance et procès-verbaux

| Critère | Actions attendues | Points |
|---|---|---:|
| Sélection des PV | Choisir le PV d’Assemblée Générale pertinent (7) ; choisir le PV du Conseil d’Administration pertinent (7) ; écarter un document hors période (6) | 20 |
| Dates et périodes | Vérifier la date de réunion (7) ; vérifier la période couverte (6) ; repérer une chronologie impossible (7) | 20 |
| Signatures et décisions | Vérifier les signatures attendues (7) ; vérifier que les décisions sont lisibles (6) ; signaler une validation manquante (7) | 20 |
| Incohérences | Repérer l’incohérence entre deux documents (10) ; expliquer simplement pourquoi elle pose question (10) | 20 |
| Correction | Informer le responsable compétent (6) ; demander la pièce ou correction adaptée (7) ; conserver la trace du traitement (7) | 20 |

##### Simulation 7 — Trésorerie et pièces comptables

| Critère | Actions attendues | Points |
|---|---|---:|
| Rapprochement | Relier l’opération à la bonne pièce (8) ; vérifier le montant (6) ; vérifier la date ou la référence (6) | 20 |
| Écart | Identifier l’écart principal (8) ; distinguer erreur, absence de pièce et opération à clarifier (6) ; ne pas corriger sans preuve (6) | 20 |
| Pièces manquantes | Lister précisément les pièces à demander (8) ; demander à la bonne personne (6) ; fixer une échéance de retour (6) | 20 |
| Priorité | Traiter d’abord l’écart à risque élevé (8) ; justifier la priorité (6) ; distinguer les corrections immédiates des contrôles complémentaires (6) | 20 |
| Piste d’audit | Enregistrer la correction effectuée (7) ; conserver l’ancienne et la nouvelle preuve si nécessaire (7) ; faire valider la clôture (6) | 20 |

##### Simulation 8 — Adhérent et plainte non traitée

| Critère | Actions attendues | Points |
|---|---|---:|
| Recherche du dossier | Retrouver l’identité ou référence du dossier (6) ; retrouver la plainte (7) ; retrouver les réponses ou actions déjà réalisées (7) | 20 |
| Chronologie | Reconstituer la date de réception (6) ; reconstituer les étapes de traitement (7) ; signaler le retard ou le manque d’information (7) | 20 |
| Réponse | Accuser réception ou reconnaître la situation (7) ; donner une réponse compréhensible et factuelle (7) ; proposer la prochaine étape (6) | 20 |
| Confidentialité | Vérifier l’identité de l’interlocuteur (7) ; ne pas divulguer d’information à un tiers (7) ; utiliser le canal approprié (6) | 20 |
| Suivi | Nommer un responsable (6) ; fixer une échéance de réponse (7) ; enregistrer la clôture ou la relance (7) | 20 |

##### Simulation 9 — Mesure conservatoire et escalade

| Critère | Actions attendues | Points |
|---|---|---:|
| Signal de risque | Repérer le signal important (8) ; séparer les faits des suppositions (6) ; mesurer ce qui doit être vérifié (6) | 20 |
| Périmètre de rôle | Identifier ce qui peut être fait immédiatement (7) ; reconnaître ce qui nécessite une décision supérieure (7) ; ne pas outrepasser son autorité (6) | 20 |
| Escalade | Prévenir la bonne personne (8) ; transmettre les faits essentiels (6) ; indiquer le niveau d’urgence (6) | 20 |
| Préparation des faits | Rassembler les documents utiles (7) ; dater les informations (6) ; distinguer original, copie et information non vérifiée (7) | 20 |
| Traçabilité | Noter l’heure et le destinataire de l’alerte (7) ; enregistrer la décision reçue (7) ; planifier le suivi (6) | 20 |

##### Simulation 10 — Clôture du contrôle et plan de suivi

| Critère | Actions attendues | Points |
|---|---|---:|
| Reformulation | Reformuler chaque recommandation sans la déformer (8) ; demander une clarification si nécessaire (6) ; distinguer recommandation et décision (6) | 20 |
| Priorité | Classer les actions par risque (7) ; classer les actions par urgence (7) ; identifier les dépendances (6) | 20 |
| Responsables | Attribuer un responsable opérationnel (7) ; désigner un responsable de suivi (6) ; obtenir l’accord des personnes concernées (7) | 20 |
| Preuves et échéances | Définir la preuve attendue (7) ; fixer une échéance réaliste (7) ; prévoir une alerte avant l’échéance (6) | 20 |
| Revue direction | Préparer une synthèse courte (7) ; présenter les actions en retard ou à risque (7) ; programmer la prochaine revue (6) | 20 |

#### Exemple de calcul

Dans la simulation « L’auditeur arrive », un utilisateur :

- accueille correctement l’auditeur : 20/20 ;
- sélectionne les bonnes pièces mais oublie la checklist : 14/20 ;
- vérifie les versions : 20/20 ;
- répond correctement mais ne signale pas la pièce manquante : 15/20 ;
- trace la demande mais n’attribue pas de responsable : 14/20.

**Score final : 83/100 — Prêt pour l’exercice.**

Le détail affiché à l’utilisateur doit expliquer les 17 points perdus et proposer le module ou la fiche mémo correspondant à chaque lacune.

### Résultat des simulations

Chaque simulation produit :

- score sur 100 ;
- niveau : à reprendre, en progrès, prêt pour l’exercice ;
- erreurs commises ;
- explication simple ;
- actions recommandées ;
- possibilité d’exporter le résultat pour le responsable.

## 8.3 Module 3 — Management & leadership

Quatre micro-modules sous forme de scénarios interactifs :

1. Organiser son équipe administrative.
2. Accueillir et fidéliser les adhérents.
3. Diriger en situation de crise, par exemple un retard de remboursement.
4. Communiquer avec le Conseil d’Administration.

**Scénario type :**

> « Votre comptable est absent le jour du contrôle. Que faites-vous ? »

L’utilisateur choisit une réponse, voit ses conséquences et reçoit une recommandation.

---

## 9. Dashboard d’accueil

### 9.1 Éléments obligatoires

- logo et nom RegAudit ;
- message personnalisé ;
- barre « Vous êtes à X % prêt pour l’audit AIRMS » ;
- trois grandes tuiles :
  - **Apprendre** ;
  - **Simuler** ;
  - **Manager** ;
- dernier module ;
- prochaine action conseillée ;
- bouton d’aide ;
- bouton « Appeler un expert AIRMS ».

### 9.2 Calcul de la progression

Le score global proposé :

- 50 % : modules de formation terminés ;
- 30 % : simulations réussies ;
- 20 % : modules de management terminés.

Ces pondérations doivent être configurables dans le back-office.

Le score ne doit pas être présenté comme une probabilité de réussir un contrôle AIRMS. Le libellé recommandé est :

> « Niveau de préparation dans RegAudit »

---

## 10. Fonctionnalités transverses

### 10.1 Authentification par téléphone

- connexion par numéro de téléphone ;
- code à usage unique ;
- possibilité de demander un nouveau code ;
- limitation des tentatives ;
- déconnexion ;
- gestion du changement de numéro par l’administrateur ;
- aucun mot de passe à mémoriser dans le MVP.

### 10.2 Mode hors-ligne et faible connexion

Le mode hors-ligne doit permettre :

- la consultation des fiches déjà téléchargées ;
- l’écoute des audios téléchargés ;
- la réalisation des quiz ;
- la réalisation des scénarios disponibles hors ligne ;
- l’enregistrement local de la progression ;
- la synchronisation automatique au retour de la connexion.

Contraintes :

- afficher clairement l’état de synchronisation ;
- éviter de télécharger automatiquement de grosses vidéos ;
- proposer une option « Télécharger en Wi-Fi » ;
- gérer les conflits si la même activité est réalisée sur deux appareils ;
- ne jamais perdre une réponse déjà enregistrée localement.

### 10.3 Vidéos et audio

- vidéos de trois minutes maximum pour les leçons ;
- sous-titres systématiques ;
- qualité adaptative si le fournisseur le permet ;
- audio séparé pour le français facile ;
- anglais optionnel prévu dans le modèle de contenu, non prioritaire pour le MVP ;
- hébergement YouTube non répertorié uniquement si cela respecte les exigences de confidentialité et d’accès ;
- solution de repli à prévoir si la vidéo n’est pas accessible.

### 10.4 Certificat

Le certificat final doit comporter :

- nom d’affichage ;
- nom de la mutuelle ;
- parcours terminé ;
- date de délivrance ;
- score ou niveau obtenu ;
- identifiant de vérification ;
- signature ou identité visuelle APEX SKY ;
- mention indiquant qu’il s’agit d’une attestation de formation RegAudit et non d’une certification AIRMS officielle.

Le certificat est téléchargeable en PDF et partageable par lien ou fichier.

### 10.5 Contact expert

Le bouton WhatsApp doit :

- ouvrir une conversation ou un lien configuré par APEX SKY ;
- afficher un message prérempli facultatif ;
- ne pas promettre une réponse instantanée ;
- respecter les règles de consentement et de confidentialité ;
- être configurable sans nouvelle version de l’application.

---

## 11. Back-office APEX SKY

### 11.1 Tableau de bord

Indicateurs :

- nombre de mutuelles actives ;
- nombre d’utilisateurs actifs ;
- progression moyenne ;
- taux de complétion par module ;
- score moyen par simulation ;
- questions les plus souvent ratées ;
- utilisateurs inactifs depuis 7, 14 ou 30 jours ;
- certificats délivrés.

### 11.2 Gestion des mutuelles

- créer une mutuelle ;
- modifier ses informations ;
- générer un code de rattachement ;
- inviter ou retirer des utilisateurs ;
- désigner un responsable ;
- consulter sa progression ;
- exporter un rapport.

### 11.3 Gestion des utilisateurs

- rechercher par nom, téléphone, mutuelle ou rôle ;
- modifier le rôle ;
- réinitialiser le rattachement à une mutuelle ;
- désactiver un compte ;
- consulter la progression ;
- consulter les certificats ;
- ne jamais afficher le code d’authentification.

### 11.4 Gestion des contenus

- créer un module ;
- ajouter texte, audio, vidéo, mémo et questions ;
- associer une simulation ;
- enregistrer une version ;
- envoyer en revue ;
- valider ;
- publier ;
- archiver ;
- planifier une date de revue ;
- exporter le contenu.

### 11.5 Rapports

Exports proposés :

- CSV pour les utilisateurs et scores ;
- PDF pour un rapport de mutuelle ;
- certificat individuel ;
- rapport de plan d’action.

---

## 12. Modèle de données minimal

### Entités

**User**

- id ;
- displayName ;
- phoneNumber chiffré ou protégé ;
- role ;
- organizationId ;
- language ;
- createdAt ;
- lastActiveAt ;
- status.

**Organization**

- id ;
- name ;
- location ;
- managerUserId ;
- joinCode ;
- status ;
- createdAt.

**LearningModule**

- id ;
- category ;
- title ;
- shortDescription ;
- estimatedMinutes ;
- contentVersion ;
- regulatoryStatus ;
- reviewDate ;
- status.

**LessonAsset**

- id ;
- moduleId ;
- type : video, audio, text, memo ;
- url ou référence de stockage ;
- duration ;
- transcript ;
- downloadable.

**Quiz**

- id ;
- moduleId ;
- passingScore ;
- version.

**Question**

- id ;
- quizId ;
- prompt ;
- options ;
- correctAnswer ;
- explanation ;
- order.

**Simulation**

- id ;
- title ;
- category ;
- scenario ;
- steps ;
- scoringRules ;
- regulatoryStatus ;
- version.

**Attempt**

- id ;
- userId ;
- activityId ;
- activityType ;
- score ;
- answers ;
- completedAt ;
- offlineCreatedAt ;
- syncedAt.

**Certificate**

- id ;
- userId ;
- organizationId ;
- courseVersion ;
- score ;
- issuedAt ;
- verificationCode ;
- pdfUrl.

**ActionPlan**

- id ;
- organizationId ;
- sourceAttemptId ;
- action ;
- owner ;
- dueDate ;
- status ;
- comment.

**ContentReview**

- id ;
- contentId ;
- reviewerId ;
- decision ;
- comment ;
- decidedAt.

---

## 13. Exigences techniques

### 13.1 Architecture recommandée

Pour une première livraison rapide :

- **Frontend :** React avec interface responsive et PWA ;
- **Backend :** Firebase Authentication, Firestore et Cloud Storage, ou équivalent validé ;
- **Notifications :** mécanisme léger configurable ;
- **PDF :** génération côté serveur ou service contrôlé ;
- **Vidéos :** hébergement externe non répertorié ou stockage adapté ;
- **Analytics :** événements anonymisés et minimisés ;
- **Déploiement :** hébergement HTTPS avec domaine ou sous-domaine APEX SKY.

FlutterFlow peut être retenu si la priorité absolue est la vitesse de prototypage et si les limites du mode hors-ligne, du back-office et de la maintenance sont acceptées.

### 13.2 Compatibilité cible

- Android récent et appareils Android d’entrée de gamme ;
- Safari iOS récent ;
- Chrome Android ;
- connexion 3G/4G instable ;
- largeur d’écran mobile de 320 px minimum ;
- installation depuis le navigateur ;
- fonctionnement sans téléchargement obligatoire depuis un store.

### 13.3 Performance

Objectifs indicatifs :

- affichage de l’accueil en moins de 3 secondes sur une connexion mobile correcte ;
- interface utilisable après chargement du shell PWA ;
- taille initiale limitée ;
- aucune vidéo chargée avant action explicite ;
- synchronisation non bloquante ;
- retour visuel immédiat lors d’une réponse à un quiz.

### 13.4 Sécurité et confidentialité

- HTTPS partout ;
- authentification par code à usage unique ;
- règles d’accès par rôle ;
- séparation stricte des mutuelles ;
- chiffrement en transit et au repos selon les capacités du fournisseur ;
- journaux d’administration ;
- sauvegardes ;
- suppression ou anonymisation sur demande selon la politique applicable ;
- aucune pièce réelle d’un dossier d’agrément dans les simulations du MVP ;
- données de test fictives clairement marquées ;
- limitation et protection contre les abus du système OTP.

Une analyse juridique de la protection des données et des obligations applicables en Côte d’Ivoire doit être réalisée avant la collecte en production.

### 13.5 Observabilité

- journal des erreurs frontend et backend ;
- suivi des échecs de synchronisation ;
- suivi des échecs de génération de certificat ;
- alerte sur les erreurs d’authentification anormales ;
- tableau de santé de la synchronisation hors ligne ;
- procédure de support documentée.

---

## 14. Analytics produit

Événements à prévoir :

- `signup_started`
- `signup_completed`
- `module_opened`
- `lesson_completed`
- `quiz_started`
- `quiz_completed`
- `question_answered`
- `simulation_started`
- `simulation_completed`
- `action_plan_created`
- `certificate_issued`
- `content_downloaded`
- `offline_attempt_saved`
- `offline_attempt_synced`
- `expert_contact_clicked`

Les analytics doivent éviter de collecter le contenu sensible des réponses lorsque des identifiants anonymisés suffisent.

---

## 15. Écrans à concevoir

### Parcours apprenant

1. Écran de bienvenue.
2. Connexion par téléphone.
3. Vérification du code.
4. Rattachement à une mutuelle.
5. Choix du rôle.
6. Diagnostic initial.
7. Dashboard.
8. Liste des modules.
9. Détail d’un module.
10. Lecteur vidéo / audio.
11. Fiche mémo.
12. Quiz.
13. Résultat du quiz.
14. Liste des simulations.
15. Étape de simulation.
16. Résultat et plan d’action.
17. Progression.
18. Certificat.
19. Aide et contact.
20. Paramètres.

### Parcours manager

21. Équipe.
22. Progression collective.
23. Détail d’un utilisateur.
24. Plan d’action de la mutuelle.
25. Rapport exportable.

### Back-office

26. Connexion administrateur.
27. Vue globale.
28. Mutuelles.
29. Utilisateurs.
30. Contenus.
31. Éditeur de module.
32. Éditeur de quiz.
33. Éditeur de simulation.
34. File de validation réglementaire.
35. Rapports et exports.
36. Paramètres.

---

## 16. Périmètre du MVP

Le MVP doit permettre de tester l’usage, la compréhension et la valeur de l’application sans attendre la production de tout le catalogue.

### Inclus dans le MVP

- PWA installable ;
- connexion par téléphone ;
- création ou rattachement à une mutuelle ;
- dashboard ;
- progression sauvegardée ;
- 2 micro-modules complets au minimum ;
- 1 simulation « L’auditeur arrive » ;
- quiz de cinq questions par module ;
- résultat sur 100 ;
- mode hors-ligne pour texte, quiz et progression ;
- audio ou vidéo sur au moins un module ;
- certificat simple après parcours pilote ;
- bouton WhatsApp configurable ;
- back-office minimal :
  - gestion des mutuelles ;
  - gestion des utilisateurs ;
  - suivi de progression ;
  - gestion des contenus ;
  - export CSV.

### Reporté après validation du MVP

- huit micro-modules complets ;
- dix simulations ;
- quatre modules de management ;
- anglais ;
- rapports avancés ;
- plan de redressement collaboratif ;
- notifications poussées ;
- bibliothèque vidéo complète ;
- intégrations avec des systèmes externes ;
- personnalisation avancée par mutuelle.

### Définition du MVP réussi

Le MVP est accepté lorsqu’un utilisateur pilote peut :

1. créer son accès en moins de cinq minutes ;
2. comprendre le dashboard sans accompagnement permanent ;
3. commencer un module en trois clics maximum ;
4. terminer un quiz ;
5. reprendre son parcours après fermeture du navigateur ;
6. réaliser la simulation pilote ;
7. voir une explication claire de ses erreurs ;
8. obtenir un certificat si les conditions sont remplies ;
9. être visible dans le back-office de sa mutuelle.

---

## 17. Planning indicatif sur quatre semaines

### Semaine 1 — Cadrage, contenus et maquette

- valider les missions et formulations avec l’expert AIRMS ;
- finaliser les deux contenus MVP ;
- écrire les questions et règles de score ;
- produire les wireframes ;
- tester le vocabulaire auprès de deux gérants de mutuelles ;
- décider de la solution vidéo et audio ;
- définir la politique de données.

**Livrables :**

- arborescence validée ;
- maquette mobile ;
- scripts de contenu ;
- backlog priorisé ;
- matrice de validation réglementaire.

### Semaine 2 — Socle et formation

- mettre en place l’authentification ;
- développer le dashboard ;
- développer les profils et mutuelles ;
- développer le premier module ;
- développer les quiz ;
- enregistrer la progression ;
- commencer le mode hors-ligne.

**Livrables :**

- version interne installable ;
- premier module fonctionnel ;
- dashboard connecté ;
- premier test utilisateur.

### Semaine 3 — Simulation et back-office

- développer la simulation pilote ;
- ajouter score et feedback ;
- développer le back-office minimal ;
- ajouter certificat ;
- ajouter le bouton de contact ;
- finaliser la synchronisation hors ligne ;
- intégrer les analytics essentiels.

**Livrables :**

- parcours MVP de bout en bout ;
- suivi des utilisateurs ;
- export de progression ;
- rapport de simulation.

### Semaine 4 — Tests et déploiement pilote

- tester sur plusieurs téléphones ;
- tester avec une connexion faible ;
- corriger les erreurs ;
- faire relire les contenus ;
- tester auprès de trois mutuelles à Abidjan ;
- former les formateurs ;
- publier la PWA ;
- générer le QR code ;
- recueillir les retours.

**Livrables :**

- PWA pilote ;
- guide utilisateur d’une page ;
- guide administrateur ;
- rapport de test ;
- backlog V1.1.

---

## 18. Plan de recette

### 18.1 Tests fonctionnels

- [ ] L’utilisateur peut s’inscrire avec un numéro de téléphone.
- [ ] Un code incorrect est refusé sans révéler d’information sensible.
- [ ] L’utilisateur peut rejoindre la bonne mutuelle.
- [ ] Le dashboard affiche une progression cohérente.
- [ ] Un module peut être commencé, quitté puis repris.
- [ ] Les réponses au quiz sont sauvegardées.
- [ ] Les corrections expliquent les erreurs.
- [ ] Une simulation peut être terminée.
- [ ] Le score est calculé de façon reproductible.
- [ ] Le certificat n’est délivré que si les conditions sont remplies.
- [ ] Le responsable voit les utilisateurs de sa mutuelle.
- [ ] Une mutuelle ne voit pas les données d’une autre mutuelle.
- [ ] Un administrateur peut publier une nouvelle version de contenu.
- [ ] Le bouton WhatsApp ouvre le lien configuré.

### 18.2 Tests hors-ligne

- [ ] Le contenu téléchargé reste accessible sans réseau.
- [ ] Un quiz hors ligne peut être terminé.
- [ ] La progression locale est visible.
- [ ] Une tentative hors ligne est synchronisée au retour du réseau.
- [ ] Une coupure pendant la synchronisation ne supprime pas la tentative.
- [ ] L’utilisateur voit clairement ce qui est synchronisé ou en attente.

### 18.3 Tests de compréhension

Auprès d’au moins six utilisateurs représentant les rôles cibles :

- leur demander de commencer un module sans explication ;
- mesurer le temps pour trouver la simulation ;
- observer les mots incompris ;
- vérifier qu’ils savent interpréter leur score ;
- vérifier qu’ils distinguent un conseil pédagogique d’une obligation officielle ;
- recueillir les points de blocage.

### 18.4 Tests de sécurité

- contrôle des permissions par rôle ;
- test d’accès inter-mutuelle ;
- protection des routes d’administration ;
- expiration des sessions ;
- limitation des tentatives OTP ;
- vérification des logs ;
- vérification des sauvegardes ;
- contrôle des fichiers téléchargés.

---

## 19. Risques et réponses

| Risque | Conséquence | Réponse |
|---|---|---|
| Contenu réglementaire inexact | Perte de confiance ou mauvais conseil | Validation obligatoire et versionnage |
| Utilisateurs peu à l’aise avec le numérique | Abandon | Test terrain, grosses icônes, parcours court |
| Connexion faible | Progression interrompue | Cache local et synchronisation robuste |
| Vidéos trop lourdes | Coût et lenteur | Audio, mémo et téléchargement Wi-Fi |
| Confusion avec une application officielle | Risque juridique et réputationnel | Marquage clair « outil de formation » |
| Partage d’un téléphone | Données mélangées | Déconnexion, profil clair, procédure de changement |
| Mauvaise interprétation du score | Fausse assurance | Libellé « niveau de préparation RegAudit » |
| Absence de référent contenu | Modules bloqués | Désigner un responsable de validation |
| Données personnelles excessives | Risque de conformité | Minimisation et politique de conservation |
| Back-office trop complexe | Coût de maintenance | MVP limité aux fonctions essentielles |

---

## 20. Questions à trancher avant développement

### Réglementaire

1. Quelle est la dénomination exacte et actuelle de l’autorité à utiliser ?
2. Quelles missions, pièces, délais et sanctions doivent être cités mot pour mot ?
3. Le seuil de 90 % est-il pédagogique ou réglementaire ?
4. Le délai de 48 heures correspond-il à une règle officielle ou à un exercice fictif ?
5. Quelles mentions obligatoires doivent apparaître sur le certificat ?
6. Qui est le référent réglementaire signataire des contenus ?

### Produit

1. Le parcours est-il destiné à un utilisateur individuel ou à toute une mutuelle ?
2. Le responsable doit-il voir les scores individuels ou uniquement des statistiques agrégées ?
3. Le certificat est-il obtenu après un parcours, un score minimal ou une validation humaine ?
4. Quel numéro WhatsApp d’expert doit être configuré ?
5. Quel est le nombre de mutuelles et d’utilisateurs du pilote ?

### Technique et opérations

1. Firebase est-il acceptable pour les données et l’hébergement ?
2. Où les données doivent-elles être hébergées ?
3. Les vidéos peuvent-elles être hébergées sur YouTube non répertorié ?
4. Quel budget de maintenance mensuelle est prévu ?
5. Qui répond aux demandes d’assistance ?
6. Quelle est la politique de suppression des comptes et des données ?

---

## 21. Backlog priorisé

### Priorité P0 — indispensable pour le pilote

- authentification par téléphone ;
- mutuelle et rôles ;
- dashboard ;
- progression ;
- deux modules ;
- quiz ;
- simulation « L’auditeur arrive » ;
- score et feedback ;
- mode hors-ligne de base ;
- certificat ;
- back-office de suivi ;
- validation des contenus.

### Priorité P1 — importante après le pilote

- six modules supplémentaires ;
- trois simulations supplémentaires ;
- quatre modules de management ;
- plan d’action collaboratif ;
- audio complet ;
- rapports PDF ;
- notifications ;
- filtres avancés du back-office ;
- anglais.

### Priorité P2 — évolution

- bibliothèque documentaire par mutuelle ;
- import de checklists ;
- calendrier de revue ;
- comparaisons anonymisées entre équipes ;
- espace formateur avancé ;
- intégration avec un outil de gestion existant ;
- recommandations personnalisées par rôle ;
- génération de parcours par niveau.

---

## 22. Livrables attendus

### Produit

- PWA installable sur Android et iPhone ;
- dashboard ;
- trois espaces Apprendre / Simuler / Manager ;
- progression personnelle et collective ;
- mode clair et sombre ;
- mode hors-ligne défini dans le périmètre MVP ;
- certificat téléchargeable ;
- bouton de contact expert ;
- QR code d’accès.

### Contenus

- 8 micro-modules Audit & Contrôle ;
- 4 micro-modules Management & Leadership ;
- 12 vidéos courtes ou formats équivalents ;
- 30 quiz minimum ;
- 10 simulations ;
- fiches mémo ;
- scripts audio ;
- corrigés et explications.

### Administration

- back-office APEX SKY ;
- gestion des mutuelles ;
- gestion des utilisateurs ;
- publication et versionnage des contenus ;
- suivi de progression ;
- exports.

### Documentation

- guide apprenant ;
- guide responsable de mutuelle ;
- guide administrateur ;
- fichier JSON des scénarios et barèmes, exploitable par le moteur de simulation ;
- moteur JavaScript de notation et tests de validation du catalogue ;
- matrice de validation réglementaire ;
- politique de confidentialité ;
- plan de sauvegarde ;
- rapport de recette ;
- backlog d’évolution.

---

## 23. Critères de décision pour le lancement public

Le lancement public est recommandé uniquement si les conditions suivantes sont réunies :

- les contenus réglementaires ont été validés ;
- les mentions de non-officialité sont visibles ;
- le parcours principal fonctionne sur les téléphones ciblés ;
- le mode hors-ligne a été testé sur le terrain ;
- les données sont séparées par mutuelle ;
- le certificat ne peut pas être confondu avec une certification AIRMS ;
- le support et le contact expert sont opérationnels ;
- les trois mutuelles pilotes ont fourni un retour exploitable ;
- un responsable est désigné pour les mises à jour réglementaires ;
- la procédure de correction d’une information obsolète est documentée.

---

## 24. Conclusion produit

RegAudit doit être lancé comme un outil de préparation pratique, pas comme une encyclopédie réglementaire. La valeur initiale viendra d’un parcours court et concret : comprendre une exigence, vérifier une pièce, prendre une décision, recevoir une correction et savoir quoi faire ensuite.

La meilleure séquence de lancement est donc :

1. valider les contenus avec un expert AIRMS ;
2. construire un MVP avec deux modules et une simulation ;
3. le tester avec trois mutuelles à Abidjan ;
4. corriger le vocabulaire, les scénarios et le mode hors-ligne ;
5. étendre le catalogue à 12 modules, 30 quiz et dix simulations ;
6. transformer les résultats en outil de pilotage pour APEX SKY.

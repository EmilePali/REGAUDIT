# RegAudit — Addendum : Contact-to-Revenue Engine

**Statut :** Architecture backend implémentée (multi-tenant, facturation, vérification de certificats). Aucune interface utilisateur pour ces fonctionnalités pour l'instant — voir « Ce qui reste à faire ».

Ce document complète le `RegAudit-cahier-des-charges.md` : il transforme RegAudit en plateforme multi-tenant en marque blanche pour APEX SKY, avec un moteur d'abonnement essai→payant et une vérification de certificat qui génère des prospects (« leads ») à chaque scan.

---

## 1. Principe

- **1 tenant = 1 régulateur** (ex. ARMP, GCM), avec son propre sous-domaine (`armp.myplatform.com`), son logo et ses couleurs.
- **Chaque institution supervisée** par ce régulateur (jusqu'à 79) est une `organization` rattachée à ce tenant. Elle n'a pas de sous-domaine propre : elle voit uniquement ses propres données à l'intérieur du sous-domaine de son régulateur.
- **Le régulateur** voit la progression de toutes ses institutions ; **une institution** ne voit que la sienne.
- **2 administrateurs attendus par tenant** (régulateur) et **2 par institution** — règle appliquée au niveau applicatif, pas en contrainte SQL dure (voir `lib/db/src/schema.ts`, commentaires sur `users`).
- **Chaque certificat** porte un QR code qui pointe **toujours** vers le domaine de vérification d'APEX SKY (`verify.myplatform.com/c/{code}`), jamais vers le sous-domaine du tenant. Chaque scan est enregistré comme un lead (`certificate_scans`), même si le vérificateur ne remplit aucun formulaire (capture passive — décision validée avec vous).
- **Essai gratuit de 3 mois** à la création du tenant, extensible manuellement par un super_admin APEX SKY. Ensuite, abonnement payant sur 3, 6 ou 12 mois.

## 2. Ce qui a été construit

| Package | Rôle |
|---|---|
| `lib/db` | Schéma Drizzle complet : `tenants`, `organizations`, `users`, `subscriptions`, `plan_pricing`, `payments`, `certificates`, `certificate_scans`. |
| `lib/billing` | Moteur d'abonnement pur (testé, 9 tests) : essai 3 mois par défaut, extension du gratuit, activation d'un plan payant (3/6/12 mois), calcul de l'état d'accès (essai / actif / grâce / expiré / résilié) recalculé à partir des dates à chaque appel — reproductible, comme le moteur de notation des simulations. |
| `lib/tenancy` | Résolution de sous-domaine depuis l'en-tête `Host` + validation/liste de mots réservés (testé, 9 tests). Génération de codes de vérification non devinables et construction de l'URL de vérification — **cette fonction ne prend aucun paramètre de tenant**, il est donc structurellement impossible de générer par erreur un QR pointant vers un sous-domaine. Hachage de l'IP du scanneur (jamais stockée en clair). |
| `artifacts/api-server` | API Express : résolution de tenant, contrôle d'accès selon l'abonnement, endpoints de provisioning tenant + extension d'essai (super_admin), endpoints de facturation (plans, checkout, confirmation manuelle, webhook), endpoint public de vérification de certificat avec journalisation du scan, endpoint de reporting des leads. |

Tout est typé, compile sans erreur (`pnpm run typecheck`), et démarre réellement (testé en local : `/healthz`, protection 401 des routes super_admin).

## 3. Décisions déjà prises avec vous

- **Paiement :** agrégateur mobile money ouest-africain (Orange Money / MTN Money / Wave via un acteur comme CinetPay ou PayDunya). L'interface `PaymentProvider` est prête ; le fournisseur `manual` (confirmation par un admin APEX SKY) est pleinement fonctionnel dès maintenant ; `MobileMoneyAggregatorProvider` est un point d'extension documenté, en attente du choix du prestataire exact.
- **Vérification de certificat / capture de lead :** capture passive — le résultat s'affiche immédiatement avec votre image de marque, le scan est journalisé automatiquement, aucun formulaire ne bloque le vérificateur.

## 4. Ce qui reste à trancher ou à construire

### Décisions produit encore ouvertes
1. **Quel agrégateur mobile money exactement** (CinetPay, PayDunya, autre) et ses identifiants API.
2. **Montants des 3 offres** (3/6/12 mois) en XOF — la table `plan_pricing` est prête, il suffit d'y insérer les montants une fois décidés.
3. **Durée de la période de grâce** après expiration avant coupure réelle de l'accès (7 jours par défaut dans `lib/billing`, configurable).

### Travaux techniques restants
1. **Authentification réelle** (téléphone + code à usage unique, sessions par rôle) — les routes super_admin utilisent pour l'instant une clé API d'interim (`SUPER_ADMIN_API_KEY`), clairement documentée comme temporaire dans `middleware/require-super-admin.ts`.
2. **Interface utilisateur** : le provisioning de tenant et la page d'accueil en marque blanche existent (§6). Restent à construire : le paiement (checkout, confirmation), la page de vérification publique de certificat, et tous les écrans produit (modules, quiz, simulations) du cahier des charges d'origine.
3. **DNS et certificats TLS wildcard** pour `*.myplatform.com` — nécessaire en production pour que chaque sous-domaine de régulateur fonctionne ; dépend de l'hébergeur choisi (voir aussi section 13.1 du cahier des charges, Firebase y était évoqué — à confirmer si toujours le choix retenu vu l'architecture Express/Postgres déjà en place ici).
4. **Géolocalisation approximative du scan** (`certificate_scans.approx_country/approx_city`) — colonnes prêtes mais non renseignées ; nécessite un service de géolocalisation IP à brancher.
5. **Base de données réelle** : ce sandbox n'a pas de Postgres actif ; `lib/db` doit être pointé vers une vraie instance (`DATABASE_URL`) puis `pnpm --filter @workspace/db run push` pour créer les tables.

## 5. Variables d'environnement requises (`artifacts/api-server`)

| Variable | Exemple |
|---|---|
| `PORT` | `5000` |
| `PLATFORM_ROOT_DOMAIN` | `myplatform.com` |
| `VERIFICATION_DOMAIN` | `verify.myplatform.com` |
| `IP_HASH_SALT` | valeur secrète aléatoire |
| `SUPER_ADMIN_API_KEY` | valeur secrète aléatoire (temporaire, voir ci-dessus) |
| `DATABASE_URL` | chaîne de connexion Postgres |

## 6. Écrans construits pour la première présentation

Deux écrans existent maintenant dans `artifacts/regaudit-app` :

- **`/admin`** — console APEX SKY : saisie de la clé d'administration, formulaire de création d'un régulateur (nom, sous-domaine, e-mail de contact, logo, couleur de marque), liste des régulateurs avec leur statut d'essai/abonnement.
- **`/`** — page d'accueil du régulateur : une fois sur le sous-domaine du régulateur, affiche son logo/couleur, le badge d'essai ("Essai gratuit — X jours restants"), et les trois tuiles Apprendre/Simuler/Manager (en attente de contenu, marquées « Bientôt »). Sur le domaine racine (sans sous-domaine), affiche une page d'accueil générique de la plateforme.

Le thème visuel (`index.css`) était entièrement en placeholders non renseignés ("red") — il porte maintenant la palette orange/vert/blanc du cahier des charges (section 5.4), en mode clair et sombre.

### Pour lancer une démonstration

1. **Base de données** : ce sandbox n'a pas de Postgres actif. Il faut une vraie base (ex. Neon, Supabase, ou toute instance Postgres) et lui appliquer le schéma :
   ```bash
   DATABASE_URL=postgres://... pnpm --filter @workspace/db run push
   ```
2. **Démarrer les deux serveurs** (deux terminaux, avec un `DATABASE_URL` identique) :
   ```bash
   PORT=5000 PLATFORM_ROOT_DOMAIN=localhost VERIFICATION_DOMAIN=verify.localhost \
     IP_HASH_SALT=... SUPER_ADMIN_API_KEY=... DATABASE_URL=... \
     pnpm --filter @workspace/api-server run dev

   PORT=5173 BASE_PATH=/ API_SERVER_PORT=5000 pnpm --filter @workspace/regaudit run dev
   ```
3. **Ouvrir `http://localhost:5173/admin`**, saisir la clé, créer un régulateur avec le sous-domaine `armp`.
4. **Ouvrir `http://armp.localhost:5173`** (les navigateurs modernes résolvent `*.localhost` automatiquement, sans configuration DNS) pour voir son espace en marque blanche.

En production, `PLATFORM_ROOT_DOMAIN` devient votre vrai domaine (ex. `myplatform.com`) et il faut un DNS wildcard + certificat TLS pour `*.myplatform.com` (voir point ouvert §4).

Le flux a été vérifié dans un vrai navigateur (Playwright) pendant cette session : rendu correct de la console admin et de la page d'accueil, gestion propre de l'échec quand la base de données est indisponible (message d'erreur clair plutôt qu'un chargement infini).

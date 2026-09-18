# RegAudit — archive du projet

Cette archive contient l'état du projet au moment de sa création.

- `artifacts/regaudit-app/` : application React/Vite actuelle.
- `artifacts/api-server/` : API Express (multi-tenant, facturation, vérification de certificats).
- `lib/db/` : schéma Drizzle partagé (tenants, organisations, utilisateurs, abonnements, certificats).
- `lib/billing/`, `lib/tenancy/` : logique métier pure (moteur d'abonnement, résolution de sous-domaine, codes de vérification).
- `source-material/` : cahier des charges, catalogue des simulations et moteur de notation préparés pour l'intégration.
- Les dépendances installées (`node_modules`) et les caches ne sont pas inclus.

Pour relancer l'application après extraction :

```bash
pnpm install
pnpm --filter @workspace/regaudit run dev
pnpm --filter @workspace/api-server run dev
```

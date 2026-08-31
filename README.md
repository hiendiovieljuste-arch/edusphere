# EduSphere

EduSphere est une plateforme éducative complète pensée pour les établissements, filières, promotions, classes, enseignants, étudiants et administration.

## Branding

- Logo principal : `app/icon.svg`
- Icônes PWA : `public/icon-192.png`, `public/icon-512.png`
- Manifest installable : `app/manifest.ts`

## Démarrer le projet

```bash
npm install
cp .env.example .env
npm run dev
```

Puis ouvrez : http://localhost:3000

## Installer l’application localement

Dans un navigateur Chromium (Chrome / Edge) :

1. Ouvre la page de l’application.
2. Clique sur l’icône d’installation du navigateur.
3. Installe EduSphere comme application locale.

La plateforme est prête pour un comportement PWA grâce au manifest et aux icônes.

## Guide d’utilisation

Voir le fichier [guide-utilisation.md](guide-utilisation.md).

## Déploiement

Voir le fichier [DEPLOYMENT.md](DEPLOYMENT.md).

## Accès administrateur

L’admin principal de la plateforme est configuré via la base de données locale ou la variable d’environnement de production.

## Build de production

```bash
npm run build
npm run start
```

## Structure clé

- `app/` : pages, layouts, manifest, icône
- `app/api/` : API de données pédagogiques et admin
- `prisma/` : schéma et seed de données
- `components/` : UI partagée et blocs métier
- `lib/` : auth et connexions backend

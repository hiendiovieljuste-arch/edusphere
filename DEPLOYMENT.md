# Déploiement d'EduSphere

## 1. Préparer les variables d’environnement

Copiez le fichier exemple :

```bash
cp .env.example .env
```

Puis modifiez :

- `DATABASE_URL` : base de données SQLite locale ou distante
- `NEXTAUTH_SECRET` : clé secrète forte
- `NEXTAUTH_URL` : URL publique de production

## 2. Construire la production

```bash
npm install
npx prisma generate
npm run build
```

## 3. Lancer en production

```bash
npm run start
```

## 4. Déploiement Docker

```bash
docker build -t edusphere .
docker run -p 3000:3000 --env-file .env edusphere
```

## 5. Déploiement recommandé

- Vercel : compatible Next.js
- Railway : idéal pour un backend Node + SQLite
- Render : compatible avec Docker
- VPS Linux : utiliser le build Next.js avec `npm run start`

## 6. Vérification

-ouvrir l’application sur le port 3000
- se connecter avec les comptes de démonstration
- vérifier les pages admin, étudiant et enseignant

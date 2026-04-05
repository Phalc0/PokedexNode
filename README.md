# 🎮 Pokémon App — Full Stack (Node.js + Next.js)

## 📁 Structure du projet

```
/
├── backend/        # API REST — Node.js / Express
│   └── package.json
└── frontend/       # Interface utilisateur — Next.js
    └── package.json
```

Le projet est divisé en **deux dossiers indépendants**, chacun avec ses propres dépendances. Il est donc nécessaire d'installer les packages séparément dans chacun d'eux.

---

## ⚙️ Installation des dépendances

Depuis la racine du projet, ouvrir deux terminaux et exécuter :

```bash
# Dans le dossier backend
cd backend
npm install

# Dans le dossier frontend
cd frontend
npm install
```

---


## 🐾 Ajouter des Pokémons

Deux méthodes sont disponibles pour peupler la base de données :

### Option 1 — Insertion manuelle

Utilise les commandes comme `createPkmn` pour insérer des Pokémons manuellement dans la base de données.

### Option 2 — Import automatique via PokéAPI

Depuis le dossier `/backend`, exécute le script de seed :

```bash
cd backend
node src/scripts/seedPokeAPI.js
```

Ce script récupère les données directement depuis [PokéAPI](https://pokeapi.co/) et les insère en base.

---

## 🚀 Lancer les serveurs

Il faut démarrer **deux serveurs** simultanément, chacun sur un port précis.
Lancer le back en premier puis le front en 2eme devrait permettre d'avoir les bon ports.

### Backend (port 3000)

```bash
cd backend
npm start
```

> Le serveur API sera disponible sur : `http://localhost:3000`

### Frontend (port 3001)

```bash
cd frontend
npm run dev
```

> L'interface sera disponible sur : `http://localhost:3001`

---

## 📖 Documentation de l'API — Swagger

Toutes les routes disponibles sont documentées et consultables via **Swagger UI** une fois le backend démarré :

```
http://localhost:3000/api/docs
```

---


## ⚠️ Important — Ports obligatoires

La communication entre le frontend et le backend est configurée pour fonctionner **uniquement** sur ces ports :

| Service  | Port |
|----------|------|
| Backend  | `3000` |
| Frontend | `3001` |

> Si l'un des serveurs tourne sur un port différent, la connexion entre les deux ne fonctionnera **pas**. Assurez-vous qu'aucun autre service n'occupe ces ports avant de démarrer l'application.


bin/mongod.exe --dbpath data
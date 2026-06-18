# Conteneur Docker SingleStage

## Objectif

L'objectif de cet exercice est de créer une image Docker **singlestage** permettant d'exécuter une API Node.js tout en optimisant le temps de build grâce à une organisation efficace des layers.

L'idée principale est de profiter du mécanisme de cache de Docker afin d'éviter la réinstallation des dépendances à chaque modification du code source.

---

## Structure du projet

```text
.
├── Dockerfile
├── package.json
├── package-lock.json
└── srvweb.js
```

---

## Dockerfile

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev \
    && npm cache clean --force
COPY . .
EXPOSE 3030
CMD ["node", "srvweb.js"]
```

---

## Utilisation du Dockerfile  

### 1. Build de l'image 
docker build -f dockerfile.singlestage -t srvweb:singlestage. 

### 2. Run de l'image 
docker run -p 3030:3030 srvweb:singlestage

### 3. Test de fonctionnement 
curl.exe http://localhost:3030/ping
Les headers sont bien retournés.

---

## Explication des différentes étapes dans le Dockerfile 

### 1. Image de base

```dockerfile
FROM node:22-alpine
```

Cette image fournit :

* Node.js 22 ;
* npm ;
* Alpine Linux, une distribution légère permettant de réduire la taille finale de l'image.

---

### 2. Répertoire de travail

```dockerfile
WORKDIR /app
```

Définit le dossier `/app` comme répertoire de travail du conteneur.

Toutes les commandes suivantes seront exécutées depuis ce dossier.

---

### 3. Copie des fichiers de dépendances

```dockerfile
COPY package.json package-lock.json ./
```

Seuls les fichiers décrivant les dépendances sont copiés.

Cette étape permet à Docker de mettre en cache l'installation des dépendances et d'éviter leur réinstallation lorsque seuls les fichiers `.js` sont modifiés.

---

### 4. Installation des dépendances

```dockerfile
RUN npm ci --omit=dev \
    && npm cache clean --force
```

#### `npm ci`

Installe exactement les versions définies dans `package-lock.json`.

Cette commande est plus rapide et plus adaptée aux environnements de production que `npm install`.

#### `--omit=dev`

Empêche l'installation des dépendances de développement :

* nodemon ;
* jest ;
* eslint ;
* typescript ;
* etc.

Cela permet de réduire la taille de l'image.

#### `npm cache clean --force`

Supprime le cache npm afin de ne pas conserver de fichiers inutiles dans l'image finale.

---

### 5. Copie du code source

```dockerfile
COPY . .
```

Cette étape ajoute l'ensemble des fichiers de l'application :

* srvweb.js ;
* .env ;

Comme cette instruction est située après l'installation des dépendances, une modification du code n'entraîne pas leur réinstallation.

---

### 6. Exposition du port

```dockerfile
EXPOSE 3030
```

Indique que l'application écoute sur le port 3030.

---

### 7. Démarrage de l'application

```dockerfile
CMD ["node", "srvweb.js"]
```

Commande exécutée lors du démarrage du conteneur.

Equivalent à :

```bash
node server.js
```

---


## Optimisation des layers

L'ordre des instructions est volontaire :

```dockerfile
COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY . .
```

Ainsi :

* une modification du code source ne reconstruit que le dernier layer ;
* les dépendances restent en cache ;
* les temps de build sont fortement réduits.

---

## Organisation des layers

```text
Layer 1 : FROM node:22-alpine
Layer 2 : WORKDIR /app
Layer 3 : COPY package.json + package-lock.json
Layer 4 : RUN npm ci --omit=dev
Layer 5 : COPY du code source
Layer 6 : EXPOSE 3000
Layer 7 : CMD ["node", "server.js"]
```

Cette organisation permet d'obtenir une image légère et d'optimiser les reconstructions successives grâce au mécanisme de cache de Docker.

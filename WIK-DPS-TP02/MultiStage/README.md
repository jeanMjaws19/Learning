# Conteneur Docker multiStage

## Objectif

L'objectif de cet exercice est de créer une image Docker **multistage** permettant d'exécuter une API Node.js tout en optimisant le temps de build grâce à une organisation efficace des layers.

L'image doit :

* séparer l'étape de build de l'étape d'exécution ;
* optimiser l'ordre des layers afin de limiter les temps de reconstruction ;
* réduire la taille de l'image finale ;
* ne conserver que les éléments nécessaires au fonctionnement de l'application.

---

## Structure du projet

```text
.
├── dockerfile.multistage
├── package.json
├── package-lock.json
├── srvweb.js
├── README.md
├── .env
└── node_modules/
```

---

## Dockerfile Multi-Stage

```dockerfile

# Stage 1 : Build

FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY srvweb.js ./

# Stage 2 : Runtime

FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev \
    && npm cache clean --force
COPY --from=builder /app/srvweb.js
EXPOSE 3030
CMD ["node", "dist/srvweb.js"]

```

## Utilisation du Dockerfile  

### 1. Build de l'image 
docker build -f dockerfile.multistage -t srvweb:multistage. 

### 2. Run de l'image 
docker run -p 3030:3030 srvweb:singlestage

### 3. Test de fonctionnement 
curl.exe http://localhost:3030/ping
Les headers sont bien retournés.


---

# Description des différentes étapes

## Stage 1 : Build

```dockerfile
FROM node:22-alpine AS builder
```

Ce premier stage prépare l'application.

Il contient :

* Node.js ;
* npm ;
* toutes les dépendances du projet ;
* le code source.

Structure obtenue :

```text
/app
├── package.json
├── package-lock.json
├── node_modules/
└── srvweb.js
```

Ce stage est temporaire et n'est pas conservé dans l'image finale.

---

## Stage 2 : Runtime

```dockerfile
FROM node:22-alpine
```

Le second stage correspond à l'image réellement utilisée pour exécuter l'API.

Il contient uniquement :

```text
/app
├── package.json
├── package-lock.json
├── node_modules/
└── srvweb.js
```

---

## Installation des dépendances

```dockerfile
RUN npm ci --omit=dev \
    && npm cache clean --force
```

### `npm ci`

Installe exactement les versions définies dans :

```text
package-lock.json
```


---

### `--omit=dev`

Empêche l'installation des dépendances de développement :

* nodemon ;
* jest ;
* eslint ;
* etc.

Cela permet de réduire la taille de l'image finale.

---

### `npm cache clean --force`

Supprime le cache npm afin de ne pas conserver de fichiers inutiles dans l'image.

Cette opération contribue à réduire la taille finale du conteneur.

---

## Optimisation des layers

L'ordre des instructions est particulièrement important :

```dockerfile
COPY package.json package-lock.json ./

RUN npm ci

COPY srvweb.js .
```

Cette organisation permet à Docker de réutiliser le cache.

Par conséquent :

* une modification du fichier `srvweb.js` ne provoque pas la réinstallation des dépendances ;
* seule la dernière couche est reconstruite ;
* le temps de build est considérablement réduit.

---

## Organisation des layers

### Stage Build

```text
Layer 1 : FROM node:22-alpine
Layer 2 : WORKDIR /app
Layer 3 : COPY package.json + package-lock.json
Layer 4 : RUN npm ci
Layer 5 : COPY srvweb.js
```

### Stage Runtime

```text
Layer 1 : FROM node:22-alpine
Layer 2 : WORKDIR /app
Layer 3 : COPY package.json + package-lock.json
Layer 4 : RUN npm ci --omit=dev
Layer 5 : COPY --from=builder /app/srvweb.js
Layer 6 : EXPOSE 3030
Layer 7 : CMD ["node", "srvweb.js"]
```

---

## Avantages du Multi-Stage Build

* séparation entre la phase de build et la phase d'exécution ;
* meilleure organisation du Dockerfile ;
* image finale plus légère ;
* installation des dépendances de production uniquement ;
* optimisation du cache Docker ;
* réduction des temps de reconstruction ;
* approche couramment utilisée pour les environnements de production.

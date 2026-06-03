TP DevOps 01 - serveur web en .JS

## Description

Ce projet vise à coder un serveur web en node.js avec une API HTTP simple. Le tout avec un minimum de dépendances.

L'API expose un endpoint :

* `GET /ping`

Cette route retourne au format JSON les headers de la requête reçue.

Toute autre requête retourne un code HTTP `404` avec une réponse vide.

---

## Prérequis

* Node.js
* npm

---

## Installation

Installer les dépendances :

```bash
npm install
```

---

## Configuration

Créer un fichier `.env` à la racine du projet :

```text
PING_LISTEN_PORT=3030
```

La variable `PING_LISTEN_PORT` permet de définir le port d'écoute du serveur.

Si cette variable n'est pas définie, le serveur utilisera le port `8080` par défaut.

---

## Lancement

Démarrer le serveur :

```bash
node srvweb.js
```

Le serveur est alors accessible sur :

```
http://localhost:3030
```

---

## Utilisation

### Requête valide

```bash
curl http://localhost:3030/ping
```

Exemple de réponse :

```json
{
	"host": "localhost:3030",
	"user-agent": "curl/8.5.0",
	"accept": "*/*"
}
```

### Requête invalide

```bash
curl http://localhost:3030/test
```

Réponse :

```
HTTP 404 Not Found
```

avec un corps de réponse vide.

---

## Arborescence du projet

```
.
├── .env
├── srvweb.js
└── README.md
```

---

## Dépendances

Le projet utilise :

* `dotenv` : chargement des variables d'environnement depuis le fichier `.env`.

Aucun framework web externe (Express, Fastify, etc.) n'est utilisé.

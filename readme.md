GSK
===============================================================================

> **ATTENTION:** _Cet outils est encore très jeune (alpha), n'hésitez pas à
  ouvrir une issue au moindre problème_

L'outils **GSK** est un outil de scafolding qui permet d'initialiser rapidement
un projet de site statique pour Clever Garden. Il automatise et simplifie
l'instalation du [Starter Kit de Clever garden](https://github.com/cleverage/garden-starter-kit).

Installation
-------------------------------------------------------------------------------

```bash
$ npm i cleverage/gsk-cli -g
```

Utilisation
-------------------------------------------------------------------------------

```bash
$ gsk init <dir>
```

Cette commande initialise un projet dans le dossier `<dir>`. Si `<dir>` n'est
pas spécifié, l'initialisation se fait dans le dossier courrant.

```bash
$ gsk conf <dir>
```

Cette commande lance l'interface de configuration du projet présent dans le
dossier `<dir>`. Si `<dir>` n'est pas spécifié, la cofiguration se lance pour
le projet du dossier courrant.

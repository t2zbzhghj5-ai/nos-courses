# Nos courses

Liste de courses partagée entre deux téléphones.

- **L'app** (ce dépôt) est publiée avec GitHub Pages.
- **La liste** est stockée dans Firebase Firestore (projet `nos-courses-80631`) et se synchronise en direct.
- **La connexion** se fait par e-mail et mot de passe (Firebase Authentication). Les comptes sont créés à la main dans la console Firebase.
- **L'accès** est réservé aux deux comptes de la maison par `firestore.rules`, à copier dans la console Firebase (Firestore › Règles).

La configuration Firebase présente dans `index.html` n'est pas secrète : la protection vient des règles Firestore.

## Rayons

Les articles sont rangés automatiquement par rayon grâce au catalogue de `rayons.js` : le premier mot reconnu du nom décide du rayon, au singulier ou au pluriel. Un article inconnu va dans « Autres ». Pour corriger un classement, il suffit d'ajouter le mot dans la liste du bon rayon.

## Données

| Collection | Contenu |
|---|---|
| `articles/{id}` | `nom`, `fait`, `par` (UID), `le` (horodatage), `faitLe`, `faitPar` |
| `membres/{uid}` | `prenom` affiché à l'autre personne |
| `meta/historique` | `noms` : articles déjà achetés, pour les rajouter en un geste |

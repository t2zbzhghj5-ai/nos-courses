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
| `articles/{id}` | `nom`, `quantite`, `contenant`, `poids`, `pour`, `lieu`, `precision`, `urgent`, `rayon` (choisi à la main, sinon déduit du nom), `fait`, `par` (UID), `le` (horodatage), `faitLe`, `faitPar` |
| `membres/{uid}` | `prenom` affiché à l'autre personne |
| `meta/historique` | `personnes` : prénoms déjà utilisés après « pour » ; `lieux` : lieux d'achat déjà utilisés |

## Saisie intelligente

`parse.js` lit ce qui est tapé dans la barre d'ajout : « 6 yaourts nature pour Nicolas ! » donne l'article « Yaourts nature », ×6, pour Nicolas, urgent. Il reconnaît les nombres (« 3 », « x3 », « deux », « une douzaine », « 2 paquets de »), les poids et volumes (« 500 g », « 1,5 kg », « 1 L », « 33 cl »), « pour Prénom » (avec une majuscule, ou un prénom déjà utilisé), le lieu d'achat (« chez Paul », « chez le boucher », « @Picard », ou « à Biocoop », « au marché » pour les lieux connus ou déjà utilisés), les précisions (« bio », « sans lactose », le texte après une virgule ou entre parenthèses) et l'urgence (« ! » ou « urgent »). Toucher un article remet son texte dans la barre pour le modifier.

## Publier une nouvelle version

À chaque modification, changer ensemble `APP_VERSION` dans `index.html` et `version` dans `version.json` (format `AAAA-MM-JJ-HHhMM`), et augmenter `CACHE` dans `sw.js`. L'app compare son numéro à celui de `version.json` à chaque retour au premier plan : si le site est plus récent, un bandeau « Mettre à jour » apparaît. En bas de l'app, « Rechercher une mise à jour » fait la même vérification à la demande.

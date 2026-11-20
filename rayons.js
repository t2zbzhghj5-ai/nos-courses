// Nos courses : le catalogue des rayons.
// Un article est rangé dans le rayon du premier mot reconnu de son nom
// (« jus d'orange » → Boissons, « pommes de terre » → Fruits et légumes).
// Pour ajouter un mot, il suffit de l'écrire au singulier dans la liste de son rayon.

export const RAYONS = [
  { id: "fruits", nom: "Fruits et légumes", ink: "#23663A", ring: "#2E9E4F", tint: "#E3F5E1" },
  { id: "boulangerie", nom: "Boulangerie", ink: "#9A2457", ring: "#D63B7A", tint: "#FDE7EF" },
  { id: "frais", nom: "Frais", ink: "#1E4F9A", ring: "#2F74E0", tint: "#E2EEFF" },
  { id: "surgeles", nom: "Surgelés", ink: "#0E5A73", ring: "#1A93B8", tint: "#DDF3FA" },
  { id: "epicerie", nom: "Épicerie", ink: "#8A4B00", ring: "#C27A00", tint: "#FFF0D9" },
  { id: "boissons", nom: "Boissons", ink: "#9A2E17", ring: "#E05A3A", tint: "#FFE6E0" },
  { id: "maison", nom: "Maison et hygiène", ink: "#5534A8", ring: "#7A56E8", tint: "#EEE8FF" },
  { id: "autres", nom: "Autres", ink: "#4A4F5C", ring: "#7D8391", tint: "#EEF0F4" },
];

const CATALOGUE = {
  fruits: [
    "fruit", "legume", "pomme", "pomme de terre", "patate", "patate douce", "poire", "banane", "orange", "citron",
    "citron vert", "clementine", "mandarine", "pamplemousse", "kiwi", "raisin", "fraise", "framboise", "myrtille",
    "cerise", "peche", "nectarine", "abricot", "prune", "melon", "pasteque", "ananas", "mangue", "avocat", "grenade",
    "figue", "tomate", "salade", "laitue", "mache", "roquette", "epinard", "carotte", "courgette", "aubergine",
    "poivron", "concombre", "oignon", "echalote", "ail", "poireau", "chou", "chou fleur", "brocoli", "champignon",
    "haricot vert", "petit pois", "radis", "betterave", "celeri", "fenouil", "potiron", "courge", "butternut",
    "navet", "endive", "artichaut", "asperge", "persil", "basilic", "coriandre", "ciboulette", "menthe", "thym",
    "romarin", "gingembre", "herbe", "mais doux", "chataigne", "marron", "noix fraiche", "coing", "kaki", "physalis",
  ],
  boulangerie: [
    "pain", "baguette", "tradition", "ficelle", "brioche", "croissant", "pain au chocolat", "chocolatine",
    "pain de mie", "pain complet", "viennoiserie", "pain au lait", "tarte", "galette des rois",
  ],
  frais: [
    "lait", "yaourt", "yogourt", "skyr", "fromage", "fromage blanc", "petit suisse", "beurre", "creme",
    "creme fraiche", "oeuf", "emmental", "comte", "gruyere", "parmesan", "mozzarella", "chevre", "feta", "ricotta",
    "mascarpone", "raclette", "camembert", "brie", "roquefort", "reblochon", "jambon", "lardon", "saucisse",
    "saucisson", "chorizo", "charcuterie", "knacki", "poulet", "dinde", "boeuf", "veau", "porc", "agneau", "steak",
    "steak hache", "viande", "viande hachee", "escalope", "roti", "cote", "poisson", "saumon", "cabillaud", "colin",
    "crevette", "moule", "surimi", "tofu", "houmous", "pate brisee", "pate feuilletee", "pate sablee",
    "pate a pizza", "flan", "creme dessert", "dessert", "gnocchi", "ravioli", "quiche",
  ],
  surgeles: [
    "surgele", "glace", "glacon", "sorbet", "frites", "pizza", "poisson pane", "legumes surgeles",
    "epinards surgeles", "buche glacee", "nugget",
  ],
  epicerie: [
    "pates", "spaghetti", "tagliatelle", "penne", "coquillette", "macaroni", "lasagne", "riz", "semoule", "quinoa",
    "boulgour", "lentille", "pois chiche", "haricot rouge", "farine", "sucre", "sel", "poivre", "huile", "vinaigre",
    "moutarde", "mayonnaise", "ketchup", "sauce", "sauce tomate", "pesto", "conserve", "thon", "sardine", "mais",
    "cafe", "capsule", "dosette", "the", "tisane", "infusion", "chocolat", "cacao", "cereale", "muesli", "granola",
    "flocons d avoine", "biscuit", "gateau", "madeleine", "compote", "confiture", "miel", "pate a tartiner",
    "nutella", "chips", "cacahuete", "amande", "noix", "noisette", "pistache", "fruits secs", "olive", "cornichon",
    "bouillon", "epice", "curry", "paprika", "cannelle", "levure", "puree", "soupe", "biscotte", "chapelure",
    "lait de coco", "creme de coco", "aperitif", "bonbon", "chataigne cuite", "chataigne sous vide",
    "creme de marron", "marron glace", "puree de marron",
  ],
  boissons: [
    "eau", "eau gazeuse", "eau petillante", "jus", "jus d orange", "soda", "coca", "limonade", "sirop", "biere",
    "vin", "vin rouge", "vin blanc", "rose", "champagne", "cremant", "cidre", "boisson", "lait vegetal", "boisson vegetale", "lait d amande",
    "lait d avoine", "lait de soja", "ice tea", "the glace",
  ],
  maison: [
    "lessive", "adoucissant", "liquide vaisselle", "produit vaisselle", "tablette lave vaisselle",
    "pastille lave vaisselle", "sel lave vaisselle", "liquide de rincage", "eponge", "essuie tout", "sopalin",
    "papier toilette", "pq", "mouchoir", "sac poubelle", "javel", "nettoyant", "detergent", "vinaigre blanc",
    "savon", "gel douche", "shampoing", "shampooing", "apres shampoing", "dentifrice", "brosse a dent",
    "deodorant", "coton", "coton tige", "rasoir", "mousse a raser", "creme hydratante", "creme solaire",
    "serviette hygienique", "tampon", "protege slip", "couche", "lingette", "papier alu", "aluminium",
    "film alimentaire", "sac congelation", "ampoule", "pile", "allumette", "bougie", "croquette", "litiere",
  ],
};

export function norm(s) {
  return String(s)
    .toLowerCase()
    .replace(/œ/g, "oe").replace(/æ/g, "ae")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const esc = (w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const ENTREES = [];
for (const [rayon, mots] of Object.entries(CATALOGUE)) {
  for (const mot of mots) {
    const n = norm(mot);
    if (!n) continue;
    // Chaque mot accepte son pluriel en -s ou -x (« choux », « pommes de terre »).
    const motif = n.split(" ").map((w) => esc(w) + "(?:s|x)?").join(" ");
    ENTREES.push({ rayon, longueur: n.length, re: new RegExp("(?:^| )(" + motif + ")(?= |$)") });
  }
}

export function rayonDe(nom) {
  const n = norm(nom);
  let meilleur = null;
  for (const e of ENTREES) {
    const m = e.re.exec(n);
    if (!m) continue;
    const debut = m.index + (m[0].length - m[1].length);
    if (!meilleur || debut < meilleur.debut || (debut === meilleur.debut && e.longueur > meilleur.longueur)) {
      meilleur = { debut, longueur: e.longueur, rayon: e.rayon };
    }
  }
  return meilleur ? meilleur.rayon : "autres";
}

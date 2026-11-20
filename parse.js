// Nos courses : la saisie intelligente.
// « 6 yaourts nature pour Nicolas chez Biocoop ! » → nom « Yaourts nature », ×6, pour Nicolas, chez Biocoop, urgent.
// Chaque élément reconnu garde la place qu'il occupe dans le texte tapé,
// pour qu'on puisse le retirer en touchant son étiquette.

import { norm } from "./rayons.js";

const NOMBRES = { un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7, huit: 8, neuf: 9, dix: 10, douze: 12 };
const UNITES = { g: "g", gr: "g", gramme: "g", grammes: "g", kg: "kg", kilo: "kg", kilos: "kg", l: "L", litre: "L", litres: "L", cl: "cl", ml: "ml" };
const CONTENANTS = {
  paquet: "paquet", boite: "boîte", bouteille: "bouteille", pack: "pack", pot: "pot", sachet: "sachet",
  brique: "brique", tranche: "tranche", barquette: "barquette", sac: "sac", filet: "filet", botte: "botte",
  rouleau: "rouleau", tablette: "tablette", canette: "canette", bocal: "bocal", boule: "boule", part: "part",
};
const ETIQUETTES = ["bio", "sans lactose", "sans gluten", "sans sucre", "vegan", "végan", "végétarien", "allégé", "allégée", "light"];

// Lieux d'achat reconnus après « à », « au », « à la »… (après « chez » ou « @ », tout mot est accepté).
const LIEUX_CONNUS = [
  "marché", "marché bio", "supermarché", "hypermarché", "boulangerie", "boucherie", "charcuterie", "poissonnerie",
  "fromagerie", "pharmacie", "parapharmacie", "primeur", "caviste", "drive", "épicerie", "épicerie fine", "traiteur",
  "Carrefour", "Carrefour City", "Carrefour Market", "Leclerc", "Monoprix", "Monop", "Franprix", "Lidl", "Aldi",
  "Intermarché", "Auchan", "Picard", "Biocoop", "Naturalia", "La Vie Claire", "Grand Frais", "Casino", "Super U",
  "Hyper U", "Système U", "G20", "Leader Price", "Ikea", "Action", "Décathlon", "Grande Épicerie", "Cora", "Netto",
  "Thiriet", "Metro", "Bio c' Bon", "Marks & Spencer",
];
const ACCENTS = { a: "[aàâä]", e: "[eéèêë]", i: "[iîï]", o: "[oôö]", u: "[uùûü]", c: "[cç]", y: "[yÿ]" };
// Motif tolérant aux accents et aux majuscules : « grand frais » trouve « Grand Frais ».
function motifSouple(texte) {
  return [...norm(texte)].map((ch) => (ch === " " ? "[\\s'’&.-]*" : ACCENTS[ch] || ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))).join("");
}

const LETTRE = /[A-Za-zÀ-ÖØ-öø-ÿŒœ]/;
const estLettre = (c) => !!c && LETTRE.test(c);

export function pluriel(mot, n) {
  if (n <= 1 || /[sx]$/.test(mot)) return mot;
  if (mot.endsWith("al")) return mot.slice(0, -2) + "aux";
  if (mot.endsWith("eau")) return mot + "x";
  return mot + "s";
}

export function libelleQuantite(quantite, contenant) {
  if (!quantite) return "";
  return contenant ? quantite + " " + pluriel(contenant, quantite) : "×" + quantite;
}

export function parse(saisie, personnesConnues, lieuxConnus) {
  const src = String(saisie || "");
  const connues = new Set((personnesConnues || []).map((p) => norm(p)));
  const lieux = [...new Map([...LIEUX_CONNUS, ...(lieuxConnus || [])].filter(Boolean).map((l) => [norm(l), l])).values()]
    .sort((a, b) => norm(b).length - norm(a).length);
  const motifLieux = lieux.map(motifSouple).join("|");
  const nomDuLieu = (texte) => {
    const n = norm(texte);
    const connu = lieux.find((l) => norm(l) === n);
    const t = (connu || texte).replace(/\s+/g, " ").trim();
    return t.charAt(0).toUpperCase() + t.slice(1);
  };
  const pris = [];
  const jetons = [];
  const res = { nom: "", quantite: null, contenant: null, poids: null, pour: null, lieu: null, precision: null, urgent: false, jetons };

  const libre = (s, e) => !pris.some(([a, b]) => s < b && e > a);
  const prendre = (plages) => { for (const p of plages) pris.push(p); };
  // Morceaux encore libres d'un intervalle (pour ne pas avaler un « ! » déjà reconnu).
  const morceauxLibres = (s, e) => {
    const out = [];
    let debut = s;
    for (let i = s; i <= e; i++) {
      const occupe = i < e && !libre(i, i + 1);
      if (i === e || occupe) {
        if (i > debut) out.push([debut, i]);
        debut = i + 1;
      }
    }
    return out;
  };
  // Cherche un motif sur des mots entiers, hors des zones déjà reconnues.
  function chercher(re, accepter) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(src))) {
      const s = m.index, e = m.index + m[0].length;
      if (m[0].length === 0) { re.lastIndex++; continue; }
      // Mots entiers seulement : pas de lettre collée avant ou après la partie reconnue.
      if ((estLettre(src[s - 1]) && estLettre(src[s])) || (estLettre(src[e]) && estLettre(src[e - 1]))) continue;
      if (!libre(s, e)) continue;
      if (accepter(m, s, e) !== false) return true;
    }
    return false;
  }

  // 1. Urgent : « ! » ou le mot « urgent ».
  const plagesUrgent = [];
  let m;
  const reBang = /!+/g;
  while ((m = reBang.exec(src))) plagesUrgent.push([m.index, m.index + m[0].length]);
  chercher(/urgent/gi, (mm, s, e) => { plagesUrgent.push([s, e]); return false; });
  if (plagesUrgent.length) {
    res.urgent = true;
    prendre(plagesUrgent);
    jetons.push({ type: "urgent", libelle: "Urgent", plages: plagesUrgent });
  }

  // 2. Précision : entre parenthèses, puis tout ce qui suit la première virgule.
  const precisions = [];
  const plagesPrecision = [];
  const reParen = /\(([^)]*)\)?/g;
  while ((m = reParen.exec(src))) {
    const s = m.index, e = m.index + m[0].length;
    if (!libre(s, e)) continue;
    const t = m[1].trim();
    if (t) precisions.push(t);
    plagesPrecision.push([s, e]);
    pris.push([s, e]);
  }
  // Première virgule qui n'est pas celle d'un nombre décimal (« 1,5 kg »).
  let virgule = -1;
  for (let i = 0; i < src.length; i++) {
    if ((src[i] === "," && !(/\d/.test(src[i - 1] || "") && /\d/.test(src[i + 1] || ""))) || src[i] === ";") { virgule = i; break; }
  }
  if (virgule >= 0 && libre(virgule, virgule + 1)) {
    const morceaux = morceauxLibres(virgule, src.length);
    const t = morceaux.map(([a, b]) => src.slice(a, b)).join(" ").replace(/^[\s,;]+/, "").replace(/\s+/g, " ").trim();
    if (t) precisions.push(t);
    for (const p of morceaux) { plagesPrecision.push(p); pris.push(p); }
  }

  // 3. Poids ou volume : « 500 g », « 1,5 kg », « 1 L », « 33 cl ».
  chercher(/(\d+(?:[.,]\d+)?)\s*(kg|kilos?|grammes?|gr|g|cl|ml|litres?|l)/gi, (mm, s, e) => {
    const unite = UNITES[mm[2].toLowerCase()];
    res.poids = mm[1].replace(".", ",") + " " + unite;
    pris.push([s, e]);
    jetons.push({ type: "poids", libelle: res.poids, plages: [[s, e]] });
  });

  // 4. Quantité avec contenant : « 2 paquets de », « une douzaine d' », « demi-douzaine de ».
  const motsNombres = Object.keys(NOMBRES).join("|");
  const trouveDouzaine = chercher(new RegExp("(?:(une|1)\\s+)?(demi-)?douzaines?\\s*(?:de\\s+|d['’]\\s*)?", "gi"), (mm, s, e) => {
    res.quantite = mm[2] ? 6 : 12;
    pris.push([s, e]);
    jetons.push({ type: "quantite", libelle: libelleQuantite(res.quantite), plages: [[s, e]] });
  });
  if (!trouveDouzaine) {
    const reContenant = new RegExp("(\\d+|" + motsNombres + ")\\s+(" + Object.keys(CONTENANTS).join("|") + "|boîte)s?\\s*(?:de\\s+|d['’]\\s*)?", "gi");
    chercher(reContenant, (mm, s, e) => {
      const n = /^\d+$/.test(mm[1]) ? parseInt(mm[1], 10) : NOMBRES[mm[1].toLowerCase()];
      if (!n) return false;
      const cle = norm(mm[2]);
      res.quantite = n;
      res.contenant = CONTENANTS[cle] || cle;
      pris.push([s, e]);
      jetons.push({ type: "quantite", libelle: libelleQuantite(n, res.contenant), plages: [[s, e]] });
    });
  }

  // 5. Quantité simple : « x3 », « 3x », « ×3 », « 3 », « trois » en début de saisie.
  if (!res.quantite) {
    chercher(/[x×]\s*(\d+)|(\d+)\s*[x×]|(\d+)/gi, (mm, s, e) => {
      const n = parseInt(mm[1] || mm[2] || mm[3], 10);
      if (!n || n > 999) return false;
      res.quantite = n;
      pris.push([s, e]);
      jetons.push({ type: "quantite", libelle: libelleQuantite(n), plages: [[s, e]] });
    });
  }
  if (!res.quantite) {
    const debut = src.match(new RegExp("^\\s*(" + motsNombres + ")\\s+", "i"));
    if (debut) {
      const n = NOMBRES[debut[1].toLowerCase()];
      const s = src.indexOf(debut[1]), e = s + debut[1].length;
      if (n > 1 && libre(s, e)) {
        res.quantite = n;
        pris.push([s, e]);
        jetons.push({ type: "quantite", libelle: libelleQuantite(n), plages: [[s, e]] });
      }
    }
  }

  // 6. Pour qui : « pour Nicolas ». Un prénom commence par une majuscule, ou a déjà servi.
  chercher(/pour\s+([A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ'’-]*)/gi, (mm, s, e) => {
    const mot = mm[1];
    const majuscule = mot[0] !== mot[0].toLowerCase();
    if (!majuscule && !connues.has(norm(mot))) return false;
    res.pour = mot.charAt(0).toUpperCase() + mot.slice(1);
    pris.push([s, e]);
    jetons.push({ type: "pour", libelle: "Pour " + res.pour, plages: [[s, e]] });
  });

  // 7. Lieu d'achat : « chez Paul », « chez le boucher », « @Picard », « à Biocoop », « au marché ».
  const poserLieu = (texte, s, e) => {
    res.lieu = nomDuLieu(texte).slice(0, 40);
    pris.push([s, e]);
    jetons.push({ type: "lieu", libelle: res.lieu, plages: [[s, e]] });
  };
  const MOT = "[A-Za-zÀ-ÖØ-öø-ÿ0-9][A-Za-zÀ-ÖØ-öø-ÿ0-9'’.&-]*";
  let lieuTrouve = false;
  if (motifLieux) {
    lieuTrouve = chercher(new RegExp("(?:@\\s*|chez\\s+)(" + motifLieux + ")", "gi"), (mm, s, e) => poserLieu(mm[1], s, e));
  }
  if (!lieuTrouve) {
    lieuTrouve = chercher(new RegExp("@\\s*(" + MOT + ")|chez\\s+((?:le|la|les)\\s+" + MOT + "|l['’]\\s*" + MOT + "|" + MOT + ")", "gi"),
      (mm, s, e) => poserLieu(mm[1] || mm[2], s, e));
  }
  if (!lieuTrouve && motifLieux) {
    chercher(new RegExp("(?:[àa]\\s+la\\s+|[àa]\\s+l['’]\\s*|aux?\\s+|[àa]\\s+)(" + motifLieux + ")", "gi"),
      (mm, s, e) => poserLieu(mm[1], s, e));
  }

  // 8. Étiquettes courantes : « bio », « sans lactose »…
  for (const etiquette of ETIQUETTES) {
    const re = new RegExp(etiquette.replace(/ /g, "\\s+"), "gi");
    chercher(re, (mm, s, e) => {
      if (!precisions.some((p) => norm(p) === norm(etiquette))) precisions.unshift(etiquette.toLowerCase());
      plagesPrecision.push([s, e]);
      pris.push([s, e]);
    });
  }
  if (precisions.length) {
    res.precision = precisions.join(", ").slice(0, 80);
    jetons.push({ type: "precision", libelle: res.precision, plages: plagesPrecision });
  }

  // 9. Le nom : tout ce qui reste.
  let nom = "";
  for (let i = 0; i < src.length; i++) nom += libre(i, i + 1) ? src[i] : " ";
  nom = nom
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^(?:(?:de|des|du)\s+|d['’]\s*)/i, "")
    .replace(/\s+(?:de|des|du|d['’]|et|pour)$/i, "")
    .replace(/[\s,;:.-]+$/, "")
    .trim()
    .slice(0, 80);
  res.nom = nom ? nom.charAt(0).toUpperCase() + nom.slice(1) : "";

  const ordre = { quantite: 1, poids: 2, pour: 3, lieu: 4, precision: 5, urgent: 6 };
  jetons.sort((a, b) => ordre[a.type] - ordre[b.type]);
  return res;
}

// Retire du texte tapé les morceaux d'une étiquette.
export function retirer(saisie, plages) {
  let t = String(saisie);
  for (const [s, e] of [...plages].sort((a, b) => b[0] - a[0])) t = t.slice(0, s) + " " + t.slice(e);
  return t.replace(/\s+/g, " ").replace(/\s+([,;])/g, "$1").replace(/^[\s,;]+|[\s,;]+$/g, "").trim();
}

// L'inverse : réécrit un article en texte, pour le modifier dans la même barre de saisie.
export function enTexte(article) {
  const morceaux = [];
  if (article.quantite && article.contenant) morceaux.push(article.quantite + " " + pluriel(article.contenant, article.quantite) + " de");
  else if (article.quantite) morceaux.push(String(article.quantite));
  morceaux.push(article.nom);
  if (article.poids) morceaux.push(article.poids);
  if (article.pour) morceaux.push("pour " + article.pour);
  if (article.lieu) morceaux.push("chez " + article.lieu.replace(/^(Le|La|Les|L['’])(?=\s|['’])/, (m) => m.toLowerCase()));
  let t = morceaux.join(" ");
  if (article.precision) t += ", " + article.precision;
  if (article.urgent) t += " !";
  return t;
}

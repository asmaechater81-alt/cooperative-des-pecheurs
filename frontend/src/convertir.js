// "membre_id" -> "membreId"
const enCamel = (cle) => cle.replace(/_([a-z])/g, (_, lettre) => lettre.toUpperCase());

// "membreId" -> "membre_id"
const enSnake = (cle) => cle.replace(/[A-Z]/g, (lettre) => "_" + lettre.toLowerCase());

// Parcourt un objet ou un tableau et convertit toutes les clés
function convertir(valeur, fonctionCle) {
  if (Array.isArray(valeur)) {
    return valeur.map((v) => convertir(v, fonctionCle));
  }
  if (valeur !== null && typeof valeur === "object") {
    return Object.fromEntries(
      Object.entries(valeur).map(([cle, v]) => [fonctionCle(cle), convertir(v, fonctionCle)])
    );
  }
  return valeur;
}

export const versCamel = (valeur) => convertir(valeur, enCamel); // réponse de l'API -> React
export const versSnake = (valeur) => convertir(valeur, enSnake); // React -> requête vers l'API
import axios from "axios";

// Toutes les requêtes passent par cette instance : l'adresse de l'API n'est écrite qu'ici
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: { Accept: "application/json" },
});

// Extrait un message lisible d'une erreur renvoyée par Laravel
export function messageErreur(erreur) {
  // Le serveur est éteint ou injoignable (pas de réponse du tout)
  if (!erreur.response) {
    return "Impossible de joindre le serveur. Vérifiez que le backend est lancé (php artisan serve).";
  }

  const donnees = erreur.response.data;

  // 422 : erreurs de validation, un tableau de messages par champ
  if (donnees && donnees.errors) {
    return Object.values(donnees.errors).flat().join(" ");
  }

  // 409, 404... : message écrit dans nos contrôleurs
  if (donnees && donnees.message) {
    return donnees.message;
  }

  return "Une erreur est survenue (code " + erreur.response.status + ").";
}

export default api;
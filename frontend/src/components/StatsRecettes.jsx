// 1. On importe les données et la fonction de calcul depuis donnees.js
import { captures, montantCapture, TAUX_FRAIS } from "../data/donnees";

export default function StatsRecettes() {
  // 2. filter : on garde seulement les captures validées (6 sur 8)
  const validees = captures.filter((c) => c.statut === "VALIDEE");

  // 3. reduce : on additionne quantiteKg x prixUnitaire de chaque capture validée
  const montantBrut = validees.reduce((somme, c) => somme + montantCapture(c), 0);

  // 4. frais = brut x taux ; net = brut - frais
  const fraisRetenus = montantBrut * TAUX_FRAIS;
  const montantNet = montantBrut - fraisRetenus;

  // 5. filter + length : nombre de captures en attente (équivalent des « commandes annulées »)
  const enAttente = captures.filter((c) => c.statut === "EN_ATTENTE").length;

  // 6. montant moyen (on évite la division par zéro)
  const moyenne = validees.length > 0 ? montantBrut / validees.length : 0;

  // 7. affichage : {} sert à insérer une variable JavaScript dans le JSX
  return (
    <section>
      <h2>Recettes de la coopérative</h2>
      <ul>
        <li>Recettes brutes : <b>{montantBrut} MAD</b></li>
        <li>Frais retenus ({TAUX_FRAIS * 100} %) : <b>{fraisRetenus} MAD</b></li>
        <li>Montant net à distribuer : <b>{montantNet} MAD</b></li>
        <li>Captures en attente : <b>{enAttente}</b></li>
        <li>Montant moyen par capture : <b>{moyenne.toFixed(2)} MAD</b></li>
      </ul>
    </section>
  );
}
export default function StatsRecettes({ stats, tauxFrais }) {
  return (
    <section className="bande-sombre">
      <h2>Recettes de la coopérative</h2>
      <ul>
        <li>Recettes brutes : <b>{stats.montantBrut} MAD</b></li>
        <li>Frais retenus ({tauxFrais * 100} %) : <b>{stats.fraisRetenus} MAD</b></li>
        <li>Montant net à distribuer : <b>{stats.montantNet} MAD</b></li>
        <li>Captures en attente : <b>{stats.enAttente}</b></li>
        <li>Montant moyen par capture : <b>{stats.moyenne.toFixed(2)} MAD</b></li>
      </ul>
    </section>
  );
}
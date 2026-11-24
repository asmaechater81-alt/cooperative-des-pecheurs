import { useState } from "react";

export default function Repartitions({
  repartitions, nomMembre, message, onGenerer, onValider, onPayer, onSupprimer,
}) {
  // Par défaut : du 1er du mois jusqu'à aujourd'hui
  const auj = new Date().toISOString().slice(0, 10);
  const [debut, setDebut] = useState(auj.slice(0, 8) + "01");
  const [fin, setFin] = useState(auj);

  const somme = (cle) =>
    Math.round(repartitions.reduce((s, r) => s + r[cle], 0) * 100) / 100;

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerer(debut, fin);
  };

  return (
    <section>
      <h2>Répartition des recettes</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="debut">Début de la période</label>
            <input id="debut" type="date" value={debut} onChange={(e) => setDebut(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="fin">Fin de la période</label>
            <input id="fin" type="date" value={fin} onChange={(e) => setFin(e.target.value)} required />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit">Calculer la répartition</button>
        </div>
      </form>

      {message && (
        <p className={message.type === "erreur" ? "erreur" : "info"}>{message.texte}</p>
      )}

      {repartitions.length === 0 ? (
        <p>Aucune répartition. Choisissez une période puis cliquez sur « Calculer la répartition ».</p>
      ) : (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Membre</th>
                  <th>Période</th>
                  <th>Kg</th>
                  <th>Brut</th>
                  <th>Frais</th>
                  <th>Net</th>
                  <th>Statut</th>
                  <th>Paiement</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {repartitions.map((r) => (
                  <tr key={r.id}>
                    <td>{nomMembre(r.membreId)}</td>
                    <td>{r.periodeDebut} au {r.periodeFin}</td>
                    <td>{r.quantiteTotaleKg}</td>
                    <td>{r.montantBrut} MAD</td>
                    <td>{r.fraisRetenus} MAD</td>
                    <td><b>{r.montantNet} MAD</b></td>
                    <td>
                      <span className={r.statut === "VALIDEE" ? "badge badge-ok" : "badge badge-attente"}>
                        {r.statut}
                      </span>
                    </td>
                    <td>
                      <span className={r.statutPaiement === "PAYE" ? "badge badge-ok" : "badge badge-attente"}>
                        {r.statutPaiement}
                      </span>
                      {r.datePaiement && <span> {r.datePaiement}</span>}
                    </td>
                    <td>
                      <div className="actions">
                        {r.statut === "CALCULEE" && (
                          <>
                            <button onClick={() => onValider(r.id)}>Valider</button>
                            <button className="btn-supprimer" onClick={() => onSupprimer(r.id)}>
                              Supprimer
                            </button>
                          </>
                        )}
                        {r.statut === "VALIDEE" && r.statutPaiement === "NON_PAYE" && (
                          <button onClick={() => onPayer(r.id)}>Marquer payé</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="total-ligne">
            Total brut : <b>{somme("montantBrut")} MAD</b> · Total frais : <b>{somme("fraisRetenus")} MAD</b> ·
            Montant à distribuer : <b>{somme("montantNet")} MAD</b>
          </p>
        </>
      )}
    </section>
  );
}
import { useState } from "react";

export default function ListeMembres({ membres, onAjouter, onEditer, onSupprimer }) {
  const [recherche, setRecherche] = useState("");
  const q = recherche.toLowerCase();

  const resultats = membres.filter((m) =>
    [m.nom, m.prenom, m.cin].some((champ) => champ.toLowerCase().includes(q))
  );

  return (
    <section>
      <div className="entete-section">
        <h2>Membres ({membres.length})</h2>
        <button onClick={onAjouter}>Ajouter un membre</button>
      </div>
      <input
        type="search"
        placeholder="Rechercher par nom, prénom ou CIN"
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
      />
      <ul>
        {resultats.map((m) => (
          <li key={m.id} className="membre-ligne">
            <span>
              {m.prenom} {m.nom} ({m.cin}){" "}
              <span className={m.statut === "ACTIF" ? "badge badge-ok" : "badge badge-attente"}>
                {m.statut}
              </span>
            </span>
            <div className="actions">
              <button onClick={() => onEditer(m)}>Modifier</button>
              <button className="btn-supprimer" onClick={() => onSupprimer(m.id)}>
                Supprimer
              </button>
            </div>
          </li>
        ))}
        {resultats.length === 0 && <li>Aucun membre trouvé.</li>}
      </ul>
    </section>
  );
}
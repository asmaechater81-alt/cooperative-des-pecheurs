import { useState } from "react";
import { membres } from "../data/donnees";

export default function ListeMembres() {
  const [recherche, setRecherche] = useState("");
  const q = recherche.toLowerCase();

  const resultats = membres.filter((m) =>[m.nom, m.prenom, m.cin].some((champ) => champ.toLowerCase().includes(q))
  );

  return (
    <section>
      <h2>Membres</h2>
      <input
        type="search"
        placeholder="Rechercher par nom, prénom ou CIN"
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
      />
      <ul>
        {resultats.map((m) => (
          <li key={m.id}>
            {m.prenom} {m.nom} ({m.cin}) : {m.statut}
          </li>
        ))}
        {resultats.length === 0 && <li>Aucun membre trouvé.</li>}
      </ul>
    </section>
  );
}
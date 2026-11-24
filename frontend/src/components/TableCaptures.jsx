import { useState } from "react";

const PAR_PAGE = 5;

export default function TableCaptures({ captures, nomMembre }) {
  const [tri, setTri] = useState({ cle: "date", sens: 1 });
  const [page, setPage] = useState(1);

  const valeur = (c, cle) => (cle === "membre" ? nomMembre(c.membreId) : c[cle]);

  const tries = [...captures].sort((a, b) => {
    const x = valeur(a, tri.cle);
    const y = valeur(b, tri.cle);
    return (x > y ? 1 : x < y ? -1 : 0) * tri.sens;
  });

  const nbPages = Math.max(1, Math.ceil(tries.length / PAR_PAGE));
  const pageCourante = Math.min(page, nbPages);
  const visibles = tries.slice((pageCourante - 1) * PAR_PAGE, pageCourante * PAR_PAGE);

  const trier = (cle) => {
    setTri((t) => ({ cle, sens: t.cle === cle ? -t.sens : 1 }));
    setPage(1);
  };

  return (
    <section>
      <h2>Toutes les captures</h2>
      <table>
        <thead>
          <tr>
            <th><button onClick={() => trier("membre")}>Membre</button></th>
            <th><button onClick={() => trier("date")}>Date</button></th>
            <th>Espèce</th>
            <th>Kg</th>
            <th>Montant</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {visibles.map((c) => (
            <tr key={c.id}>
              <td>{nomMembre(c.membreId)}</td>
              <td>{c.date}</td>
              <td>{c.espece}</td>
              <td>{c.quantiteKg}</td>
              <td>{c.calculerMontant()} MAD</td>
              <td>
                <span className={c.statut === "VALIDEE" ? "badge badge-ok" : "badge badge-attente"}>
                  {c.statut}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button disabled={pageCourante === 1} onClick={() => setPage(pageCourante - 1)}>
          Précédent
        </button>
        <span> Page {pageCourante} / {nbPages} </span>
        <button disabled={pageCourante === nbPages} onClick={() => setPage(pageCourante + 1)}>
          Suivant
        </button>
      </div>
    </section>
  );
}
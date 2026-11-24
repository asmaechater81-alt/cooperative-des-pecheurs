import { useState } from "react";

const ESPECES = ["Sardine", "Pageot", "Sole", "Poulpe", "Thon", "Merlu"];

export default function FormulaireCapture({ capture, membres, onAjouter, onModifier, onAnnuler }) {
  // Si "capture" existe, on est en modification : on pré-remplit le formulaire
  const [form, setForm] = useState({
    membreId: capture ? capture.membreId : "",
    date: capture ? capture.date : new Date().toISOString().slice(0, 10),
    espece: capture ? capture.espece : "",
    quantiteKg: capture ? capture.quantiteKg : "",
    prixUnitaire: capture ? capture.prixUnitaire : "",
  });

  // Un seul gestionnaire pour tous les champs : name = clé de l'état
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Montant affiché en direct (règle du diagramme de classes)
  const montant = (Number(form.quantiteKg) || 0) * (Number(form.prixUnitaire) || 0);

  const handleSubmit = (e) => {
    e.preventDefault(); // empêche le rechargement de la page
    const donnees = {
      membreId: Number(form.membreId),
      date: form.date,
      espece: form.espece,
      quantiteKg: Number(form.quantiteKg),
      prixUnitaire: Number(form.prixUnitaire),
    };
    if (capture) {
      onModifier(capture.id, donnees);
    } else {
      onAjouter(donnees);
    }
  };

  return (
    <section>
      <h2>{capture ? "Modifier la capture" : "Nouvelle capture"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="membreId">Membre</label>
          <select id="membreId" name="membreId" value={form.membreId} onChange={handleChange} required>
            <option value="">Sélectionnez un membre</option>
            {membres.map((m) => (
              <option key={m.id} value={m.id}>{m.prenom} {m.nom}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input id="date" type="date" name="date" value={form.date} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="espece">Espèce</label>
            <select id="espece" name="espece" value={form.espece} onChange={handleChange} required>
              <option value="">Sélectionnez une espèce</option>
              {ESPECES.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="quantiteKg">Quantité (kg)</label>
            <input id="quantiteKg" type="number" name="quantiteKg" min="1" step="any"
              value={form.quantiteKg} onChange={handleChange} placeholder="ex : 120" required />
          </div>
          <div className="form-group">
            <label htmlFor="prixUnitaire">Prix unitaire (MAD/kg)</label>
            <input id="prixUnitaire" type="number" name="prixUnitaire" min="0.01" step="any"
              value={form.prixUnitaire} onChange={handleChange} placeholder="ex : 6" required />
          </div>
        </div>

        <p className="montant-direct">Montant de la capture : <b>{montant} MAD</b></p>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {capture ? "Enregistrer les modifications" : "Ajouter la capture"}
          </button>
          <button type="button" onClick={onAnnuler}>Annuler</button>
        </div>
      </form>
    </section>
  );
}
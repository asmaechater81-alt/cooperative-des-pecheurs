import { useState } from "react";

export default function FormulaireMembre({ membre, erreur, onAjouter, onModifier, onAnnuler }) {
  // Si "membre" existe, on est en modification : on pré-remplit
  const [form, setForm] = useState({
    nom: membre ? membre.nom : "",
    prenom: membre ? membre.prenom : "",
    cin: membre ? membre.cin : "",
    statut: membre ? membre.statut : "ACTIF",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Nettoyage : espaces retirés, CIN en majuscules
    const donnees = {
      nom: form.nom.trim(),
      prenom: form.prenom.trim(),
      cin: form.cin.trim().toUpperCase(),
      statut: form.statut,
    };
    if (membre) {
      onModifier(membre.id, donnees);
    } else {
      onAjouter(donnees);
    }
  };

  return (
    <section>
      <h2>{membre ? "Modifier le membre" : "Nouveau membre"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="prenom">Prénom</label>
            <input id="prenom" name="prenom" value={form.prenom} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="nom">Nom</label>
            <input id="nom" name="nom" value={form.nom} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="cin">CIN</label>
          <input id="cin" name="cin" value={form.cin} onChange={handleChange}
            placeholder="ex : JA12345" required />
        </div>

        {/* Le statut n'apparaît qu'en modification (comme dans le TP02) */}
        {membre && (
          <div className="form-group">
            <label htmlFor="statut">Statut</label>
            <select id="statut" name="statut" value={form.statut} onChange={handleChange}>
              <option value="ACTIF">ACTIF</option>
              <option value="INACTIF">INACTIF</option>
            </select>
          </div>
        )}

        {erreur && <p className="erreur">{erreur}</p>}

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {membre ? "Enregistrer les modifications" : "Ajouter le membre"}
          </button>
          <button type="button" onClick={onAnnuler}>Annuler</button>
        </div>
      </form>
    </section>
  );
}
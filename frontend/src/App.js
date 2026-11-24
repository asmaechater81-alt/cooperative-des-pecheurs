import { useState } from "react";
import GestionCooperativeService from "./services/GestionCooperativeService";
import StatsRecettes from "./components/StatsRecettes";
import ListeMembres from "./components/ListeMembres";
import TableCaptures from "./components/TableCaptures";
import FormulaireCapture from "./components/FormulaireCapture";
import "./App.css";

export default function App() {
  const [service] = useState(() => new GestionCooperativeService());
  const [captures, setCaptures] = useState(() => service.getToutesCaptures());
  const [membres, setMembres] = useState(() => service.getTousMembres());

  // Formulaire : affiché ou non, et capture en cours de modification (null = ajout)
  const [showForm, setShowForm] = useState(false);
  const [captureEdit, setCaptureEdit] = useState(null);

  const recharger = () => {
    setCaptures(service.getToutesCaptures());
    setMembres(service.getTousMembres());
  };

  // CREATE
  const ajouterCapture = (donnees) => {
    service.ajouterCapture(donnees);
    recharger();
    setShowForm(false);
  };

  // UPDATE
  const modifierCapture = (id, donnees) => {
    service.modifierCapture(id, donnees);
    recharger();
    setCaptureEdit(null);
    setShowForm(false);
  };

  const editerCapture = (capture) => {
    setCaptureEdit(capture);
    setShowForm(true);
  };

  const annulerFormulaire = () => {
    setCaptureEdit(null);
    setShowForm(false);
  };

  // Valider / supprimer
  const validerCapture = (id) => {
    service.validerCapture(id);
    recharger();
  };

  const supprimerCapture = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette capture ?")) {
      service.supprimerCapture(id);
      recharger();
    }
  };

  return (
    <main>
      <h1>Coopérative de pêcheurs</h1>
      <StatsRecettes stats={service.getStatistiques()} tauxFrais={service.tauxFrais} />

      {!showForm && (
        <section>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            Ajouter une capture
          </button>
        </section>
      )}

      {showForm && (
        <FormulaireCapture
          key={captureEdit ? captureEdit.id : "nouvelle"}
          capture={captureEdit}
          membres={membres}
          onAjouter={ajouterCapture}
          onModifier={modifierCapture}
          onAnnuler={annulerFormulaire}
        />
      )}

      <ListeMembres membres={membres} />
      <TableCaptures
        captures={captures}
        nomMembre={(id) => service.getNomMembre(id)}
        onEditer={editerCapture}
        onValider={validerCapture}
        onSupprimer={supprimerCapture}
      />
    </main>
  );
}
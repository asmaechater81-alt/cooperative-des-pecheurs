import { useState } from "react";
import GestionCooperativeService from "./services/GestionCooperativeService";
import StatsRecettes from "./components/StatsRecettes";
import ListeMembres from "./components/ListeMembres";
import TableCaptures from "./components/TableCaptures";
import FormulaireCapture from "./components/FormulaireCapture";
import FormulaireMembre from "./components/FormulaireMembre";
import "./App.css";

export default function App() {
  const [service] = useState(() => new GestionCooperativeService());
  const [captures, setCaptures] = useState(() => service.getToutesCaptures());
  const [membres, setMembres] = useState(() => service.getTousMembres());

  // null = aucun formulaire ; sinon { type: "capture" | "membre", element: objet ou null }
  const [formulaire, setFormulaire] = useState(null);
  const [erreur, setErreur] = useState("");

  const recharger = () => {
    setCaptures(service.getToutesCaptures());
    setMembres(service.getTousMembres());
  };

  const ouvrir = (type, element = null) => {
    setErreur("");
    setFormulaire({ type, element });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fermer = () => {
    setErreur("");
    setFormulaire(null);
  };

  // ---------- CAPTURES ----------
  const ajouterCapture = (donnees) => {
    service.ajouterCapture(donnees);
    recharger();
    fermer();
  };

  const modifierCapture = (id, donnees) => {
    service.modifierCapture(id, donnees);
    recharger();
    fermer();
  };

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

  // ---------- MEMBRES ----------
  const ajouterMembre = (donnees) => {
    if (service.cinExiste(donnees.cin)) {
      setErreur("Ce CIN est déjà utilisé par un autre membre.");
      return;
    }
    service.ajouterMembre(donnees);
    recharger();
    fermer();
  };

  const modifierMembre = (id, donnees) => {
    if (service.cinExiste(donnees.cin, id)) {
      setErreur("Ce CIN est déjà utilisé par un autre membre.");
      return;
    }
    service.modifierMembre(id, donnees);
    recharger();
    fermer();
  };

  const supprimerMembre = (id) => {
    if (service.membreACaptures(id)) {
      window.alert(
        "Impossible de supprimer ce membre : il a des captures enregistrées. " +
          "Passez plutôt son statut à INACTIF."
      );
      return;
    }
    if (window.confirm("Voulez-vous vraiment supprimer ce membre ?")) {
      service.supprimerMembre(id);
      recharger();
    }
  };

  return (
    <main>
      <h1>Coopérative de pêcheurs</h1>
      <StatsRecettes stats={service.getStatistiques()} tauxFrais={service.tauxFrais} />

      {!formulaire && (
        <section>
          <button className="btn-primary" onClick={() => ouvrir("capture")}>
            Ajouter une capture
          </button>
        </section>
      )}

      {formulaire && formulaire.type === "capture" && (
        <FormulaireCapture
          key={"capture-" + (formulaire.element ? formulaire.element.id : "nouvelle")}
          capture={formulaire.element}
          membres={membres}
          onAjouter={ajouterCapture}
          onModifier={modifierCapture}
          onAnnuler={fermer}
        />
      )}

      {formulaire && formulaire.type === "membre" && (
        <FormulaireMembre
          key={"membre-" + (formulaire.element ? formulaire.element.id : "nouveau")}
          membre={formulaire.element}
          erreur={erreur}
          onAjouter={ajouterMembre}
          onModifier={modifierMembre}
          onAnnuler={fermer}
        />
      )}

      <ListeMembres
        membres={membres}
        onAjouter={() => ouvrir("membre")}
        onEditer={(m) => ouvrir("membre", m)}
        onSupprimer={supprimerMembre}
      />

      <TableCaptures
        captures={captures}
        nomMembre={(id) => service.getNomMembre(id)}
        onEditer={(c) => ouvrir("capture", c)}
        onValider={validerCapture}
        onSupprimer={supprimerCapture}
      />
    </main>
  );
}
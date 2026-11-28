import { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation } from "react-router-dom";
import api, { messageErreur } from "./api";
import { versCamel, versSnake } from "./convertir";
import StatsRecettes from "./components/StatsRecettes";
import ListeMembres from "./components/ListeMembres";
import TableCaptures from "./components/TableCaptures";
import Repartitions from "./components/Repartitions";
import FormulaireCapture from "./components/FormulaireCapture";
import FormulaireMembre from "./components/FormulaireMembre";
import "./App.css";

function Cooperative() {
  const [membres, setMembres] = useState([]);
  const [captures, setCaptures] = useState([]);
  const [repartitions, setRepartitions] = useState([]);
  const [stats, setStats] = useState(null);

  const [chargement, setChargement] = useState(true);
  const [erreurChargement, setErreurChargement] = useState("");

  // null = aucun formulaire ; sinon { type: "capture" | "membre", element: objet ou null }
  const [formulaire, setFormulaire] = useState(null);
  const [erreur, setErreur] = useState("");
  const [messageRep, setMessageRep] = useState(null);

  const location = useLocation();

  // Quand on change de page, on ferme le formulaire ouvert et on efface les messages
  useEffect(() => {
    setFormulaire(null);
    setErreur("");
    setMessageRep(null);
  }, [location.pathname]);

  // Recharge TOUT depuis la base : les 4 requêtes partent en parallèle
  const recharger = useCallback(async () => {
    try {
      const [m, c, r, s] = await Promise.all([
        api.get("/membres"),
        api.get("/captures"),
        api.get("/repartitions"),
        api.get("/statistiques"),
      ]);
      setMembres(versCamel(m.data));
      setCaptures(versCamel(c.data));
      setRepartitions(versCamel(r.data));
      setStats(versCamel(s.data));
      setErreurChargement("");
    } catch (e) {
      setErreurChargement(messageErreur(e));
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    recharger();
  }, [recharger]);

  const nomMembre = (id) => {
    const m = membres.find((x) => x.id === id);
    return m ? `${m.prenom} ${m.nom}` : "?";
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
  const ajouterCapture = async (donnees) => {
    try {
      await api.post("/captures", versSnake(donnees));
      await recharger();
      fermer();
    } catch (e) {
      setErreur(messageErreur(e));
    }
  };

  const modifierCapture = async (id, donnees) => {
    try {
      await api.put(`/captures/${id}`, versSnake(donnees));
      await recharger();
      fermer();
    } catch (e) {
      setErreur(messageErreur(e));
    }
  };

  const validerCapture = async (id) => {
    try {
      await api.post(`/captures/${id}/valider`);
      await recharger();
    } catch (e) {
      window.alert(messageErreur(e));
    }
  };

  const supprimerCapture = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette capture ?")) return;
    try {
      await api.delete(`/captures/${id}`);
      await recharger();
    } catch (e) {
      window.alert(messageErreur(e));
    }
  };

  // ---------- MEMBRES ----------
  const ajouterMembre = async (donnees) => {
    try {
      await api.post("/membres", versSnake(donnees));
      await recharger();
      fermer();
    } catch (e) {
      setErreur(messageErreur(e));
    }
  };

  const modifierMembre = async (id, donnees) => {
    try {
      await api.put(`/membres/${id}`, versSnake(donnees));
      await recharger();
      fermer();
    } catch (e) {
      setErreur(messageErreur(e));
    }
  };

  const supprimerMembre = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce membre ?")) return;
    try {
      await api.delete(`/membres/${id}`);
      await recharger();
    } catch (e) {
      window.alert(messageErreur(e));
    }
  };

  // ---------- RÉPARTITIONS ----------
  const genererRepartitions = async (debut, fin) => {
    try {
      const res = await api.post("/repartitions/generer", { debut, fin });
      await recharger();
      setMessageRep({
        type: "info",
        texte:
          res.data.nombre === 0
            ? "Aucune capture validée sur cette période."
            : `${res.data.nombre} répartition(s) calculée(s).`,
      });
    } catch (e) {
      setMessageRep({ type: "erreur", texte: messageErreur(e) });
    }
  };

  const validerRepartition = async (id) => {
    try {
      await api.post(`/repartitions/${id}/valider`);
      await recharger();
      setMessageRep(null);
    } catch (e) {
      window.alert(messageErreur(e));
    }
  };

  const payerRepartition = async (id) => {
    if (!window.confirm("Confirmer le paiement de ce membre ?")) return;
    try {
      await api.post(`/repartitions/${id}/payer`);
      await recharger();
      setMessageRep(null);
    } catch (e) {
      window.alert(messageErreur(e));
    }
  };

  const supprimerRepartition = async (id) => {
    try {
      await api.delete(`/repartitions/${id}`);
      await recharger();
      setMessageRep(null);
    } catch (e) {
      window.alert(messageErreur(e));
    }
  };

  // ---------- AFFICHAGE ----------
  return (
    <main>
      <h1>Coopérative de pêcheurs</h1>

      <nav className="menu">
        <NavLink to="/" end>Tableau de bord</NavLink>
        <NavLink to="/membres">Membres</NavLink>
        <NavLink to="/captures">Captures</NavLink>
        <NavLink to="/repartitions">Répartitions</NavLink>
      </nav>

      {chargement || erreurChargement ? (
        <section>
          {chargement ? (
            <p>Chargement des données...</p>
          ) : (
            <>
              <p>{erreurChargement}</p>
              <button onClick={recharger}>Réessayer</button>
            </>
          )}
        </section>
      ) : (
        <Routes>
          {/* Page 1 : tableau de bord */}
          <Route
            path="/"
            element={<StatsRecettes stats={stats} tauxFrais={stats.tauxFrais} />}
          />

          {/* Page 2 : membres */}
          <Route
            path="/membres"
            element={
              <>
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
              </>
            }
          />

          {/* Page 3 : captures */}
          <Route
            path="/captures"
            element={
              <>
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
                    erreur={erreur}
                    onAjouter={ajouterCapture}
                    onModifier={modifierCapture}
                    onAnnuler={fermer}
                  />
                )}
                <TableCaptures
                  captures={captures}
                  nomMembre={nomMembre}
                  onEditer={(c) => ouvrir("capture", c)}
                  onValider={validerCapture}
                  onSupprimer={supprimerCapture}
                />
              </>
            }
          />

          {/* Page 4 : répartitions */}
          <Route
            path="/repartitions"
            element={
              <Repartitions
                repartitions={repartitions}
                nomMembre={nomMembre}
                message={messageRep}
                onGenerer={genererRepartitions}
                onValider={validerRepartition}
                onPayer={payerRepartition}
                onSupprimer={supprimerRepartition}
              />
            }
          />

          {/* Toute autre adresse renvoie au tableau de bord */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Cooperative />
    </BrowserRouter>
  );
}
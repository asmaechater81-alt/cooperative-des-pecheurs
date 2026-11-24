import Membre from "../models/Membre";
import Capture from "../models/Capture";
import { membres as membresInit, captures as capturesInit, TAUX_FRAIS } from "../data/donnees";

class GestionCooperativeService {
  constructor() {
    this.tauxFrais = TAUX_FRAIS;
    this.membres = membresInit.map(
      (m) => new Membre(m.id, m.nom, m.prenom, m.cin, m.statut)
    );
    this.captures = capturesInit.map(
      (c) => new Capture(c.id, c.membreId, c.date, c.espece, c.quantiteKg, c.prixUnitaire, c.statut)
    );
    this.nextMembreId = this.membres.length + 1;
    this.nextCaptureId = this.captures.length + 1;
  }

  //CAPTURES : CRUD
  getToutesCaptures() { return [...this.captures]; }

  ajouterCapture(d) {
    const c = new Capture(this.nextCaptureId++, d.membreId, d.date, d.espece, d.quantiteKg, d.prixUnitaire);
    this.captures.push(c);
    return c;
  }

  modifierCapture(id, donnees) {
    const c = this.captures.find((x) => x.id === id);
    if (!c) return null;
    Object.assign(c, donnees); // garde la classe et ses méthodes
    return c;
  }

  supprimerCapture(id) {
    this.captures = this.captures.filter((c) => c.id !== id);
  }

  validerCapture(id) {
    const c = this.captures.find((x) => x.id === id);
    if (c) c.valider();
    return c;
  }

  //MEMBRES : CRUD 
  getTousMembres() { return [...this.membres]; }

  ajouterMembre(d) {
    const m = new Membre(this.nextMembreId++, d.nom, d.prenom, d.cin, d.statut || "ACTIF");
    this.membres.push(m);
    return m;
  }

  modifierMembre(id, donnees) {
    const m = this.membres.find((x) => x.id === id);
    if (!m) return null;
    Object.assign(m, donnees);
    return m;
  }

  supprimerMembre(id) {
    this.membres = this.membres.filter((m) => m.id !== id);
  }

  getNomMembre(id) {
    const m = this.membres.find((x) => x.id === id);
    return m ? `${m.prenom} ${m.nom}` : "?";
  }

  //STATISTIQUES
  getStatistiques() {
    const validees = this.captures.filter((c) => c.statut === "VALIDEE");
    const montantBrut = validees.reduce((s, c) => s + c.calculerMontant(), 0);
    const fraisRetenus = montantBrut * this.tauxFrais;
    return {
      montantBrut,
      fraisRetenus,
      montantNet: montantBrut - fraisRetenus,
      enAttente: this.captures.filter((c) => c.statut === "EN_ATTENTE").length,
      moyenne: validees.length ? montantBrut / validees.length : 0,
    };
  }
}

export default GestionCooperativeService;
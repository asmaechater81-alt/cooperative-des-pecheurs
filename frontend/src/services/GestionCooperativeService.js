import Membre from "../models/Membre";
import Capture from "../models/Capture";
import Repartition from "../models/Repartition";
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
    this.repartitions = [];
    this.nextMembreId = this.membres.length + 1;
    this.nextCaptureId = this.captures.length + 1;
    this.nextRepartitionId = 1;
  }

  // ---------- CAPTURES : CRUD ----------
  getToutesCaptures() { return [...this.captures]; }

  ajouterCapture(d) {
    const c = new Capture(this.nextCaptureId++, d.membreId, d.date, d.espece, d.quantiteKg, d.prixUnitaire);
    this.captures.push(c);
    return c;
  }

  modifierCapture(id, donnees) {
    const c = this.captures.find((x) => x.id === id);
    if (!c) return null;
    Object.assign(c, donnees);
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

  // Une capture validée comprise dans une répartition validée est verrouillée
  captureVerrouillee(id) {
    const c = this.captures.find((x) => x.id === id);
    if (!c || c.statut !== "VALIDEE") return false;
    return this.repartitions.some(
      (r) =>
        r.statut === "VALIDEE" &&
        r.membreId === c.membreId &&
        c.date >= r.periodeDebut &&
        c.date <= r.periodeFin
    );
  }

  // ---------- MEMBRES : CRUD ----------
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

  cinExiste(cin, ignoreId = null) {
    return this.membres.some(
      (m) => m.cin.toLowerCase() === cin.toLowerCase() && m.id !== ignoreId
    );
  }

  membreACaptures(id) {
    return this.captures.some((c) => c.membreId === id);
  }

  // ---------- RÉPARTITIONS ----------
  getToutesRepartitions() { return [...this.repartitions]; }

  // Calcule une répartition par membre ayant des captures validées sur la période
  genererRepartitions(debut, fin) {
    if (!debut || !fin || debut > fin) {
      return { erreur: "Période invalide : la date de début doit précéder la date de fin." };
    }

    const chevauche = (r) => r.periodeDebut <= fin && r.periodeFin >= debut;

    if (this.repartitions.some((r) => chevauche(r) && r.statut === "VALIDEE")) {
      return { erreur: "Une répartition déjà validée chevauche cette période." };
    }

    // Les répartitions seulement CALCULEE de cette période sont remplacées (pas de doublon)
    this.repartitions = this.repartitions.filter((r) => !chevauche(r));

    let nombre = 0;
    this.membres.forEach((m) => {
      const caps = this.captures.filter(
        (c) => c.membreId === m.id && c.statut === "VALIDEE" && c.date >= debut && c.date <= fin
      );
      if (caps.length === 0) return;

      const brut = caps.reduce((s, c) => s + c.calculerMontant(), 0);
      const kg = caps.reduce((s, c) => s + c.quantiteKg, 0);
      this.repartitions.push(
        new Repartition(this.nextRepartitionId++, m.id, debut, fin, kg, brut, this.tauxFrais)
      );
      nombre++;
    });

    return { nombre };
  }

  validerRepartition(id) {
    const r = this.repartitions.find((x) => x.id === id);
    if (r && r.statut === "CALCULEE") r.valider();
    return r;
  }

  marquerPaye(id, date) {
    const r = this.repartitions.find((x) => x.id === id);
    if (r && r.statut === "VALIDEE" && r.statutPaiement === "NON_PAYE") r.marquerPaye(date);
    return r;
  }

  supprimerRepartition(id) {
    const r = this.repartitions.find((x) => x.id === id);
    if (r && r.statut === "CALCULEE") {
      this.repartitions = this.repartitions.filter((x) => x.id !== id);
    }
  }

  // ---------- STATISTIQUES ----------
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
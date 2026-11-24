class Capture {
  constructor(id, membreId, date, espece, quantiteKg, prixUnitaire, statut = "EN_ATTENTE") {
    this.id = id;
    this.membreId = membreId;
    this.date = date;
    this.espece = espece;
    this.quantiteKg = quantiteKg;
    this.prixUnitaire = prixUnitaire;
    this.statut = statut;
  }
  // règle du diagramme de classes : montantTotal = quantiteKg x prixUnitaire
  calculerMontant() { return this.quantiteKg * this.prixUnitaire; }
  valider() { this.statut = "VALIDEE"; }
}
export default Capture;
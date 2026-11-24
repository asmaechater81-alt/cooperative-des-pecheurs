const arrondir = (x) => Math.round(x * 100) / 100;

class Repartition {
  constructor(id, membreId, periodeDebut, periodeFin, quantiteTotaleKg, montantBrut, tauxFrais) {
    this.id = id;
    this.membreId = membreId;
    this.periodeDebut = periodeDebut;
    this.periodeFin = periodeFin;
    this.quantiteTotaleKg = quantiteTotaleKg;
    this.montantBrut = arrondir(montantBrut);
    this.tauxFrais = tauxFrais; // gardé tel quel : si le taux change plus tard, cette répartition reste juste
    this.fraisRetenus = arrondir(montantBrut * tauxFrais);
    this.montantNet = arrondir(montantBrut - this.fraisRetenus);
    this.statut = "CALCULEE";
    this.statutPaiement = "NON_PAYE";
    this.datePaiement = null;
  }

  valider() {
    this.statut = "VALIDEE";
  }

  marquerPaye(date) {
    this.statutPaiement = "PAYE";
    this.datePaiement = date;
  }
}

export default Repartition;
class Membre {
  constructor(id, nom, prenom, cin, statut = "ACTIF") {
    this.id = id;
    this.nom = nom;
    this.prenom = prenom;
    this.cin = cin;
    this.statut = statut;
  }
}
export default Membre;
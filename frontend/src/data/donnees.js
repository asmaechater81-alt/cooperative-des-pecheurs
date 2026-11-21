
export const TAUX_FRAIS = 0.1; // 10 %

export const membres = [
  { id: 1, nom: "Alaoui", prenom: "Hassan", cin: "JA12345", statut: "ACTIF" },
  { id: 2, nom: "Bennani", prenom: "Said", cin: "JB67890", statut: "ACTIF" },
  { id: 3, nom: "Idrissi", prenom: "Omar", cin: "JC11223", statut: "INACTIF" },
];

export const captures = [
  { id: 1, membreId: 1, date: "2026-11-02", espece: "Sardine", quantiteKg: 120, prixUnitaire: 6, statut: "VALIDEE" },
  { id: 2, membreId: 1, date: "2026-11-05", espece: "Pageot", quantiteKg: 30, prixUnitaire: 45, statut: "VALIDEE" },
  { id: 3, membreId: 2, date: "2026-11-06", espece: "Sardine", quantiteKg: 200, prixUnitaire: 5, statut: "VALIDEE" },
  { id: 4, membreId: 2, date: "2026-11-08", espece: "Sole", quantiteKg: 15, prixUnitaire: 80, statut: "EN_ATTENTE" },
  { id: 5, membreId: 3, date: "2026-11-09", espece: "Poulpe", quantiteKg: 25, prixUnitaire: 60, statut: "VALIDEE" },
  { id: 6, membreId: 1, date: "2026-11-12", espece: "Sole", quantiteKg: 10, prixUnitaire: 85, statut: "EN_ATTENTE" },
  { id: 7, membreId: 3, date: "2026-11-14", espece: "Sardine", quantiteKg: 150, prixUnitaire: 6, statut: "VALIDEE" },
  { id: 8, membreId: 2, date: "2026-11-15", espece: "Pageot", quantiteKg: 20, prixUnitaire: 48, statut: "VALIDEE" },
];

export const montantCapture = (c) => c.quantiteKg * c.prixUnitaire;

export const nomMembre = (id) => {
  const m = membres.find((x) => x.id === id);
  return m ? `${m.prenom} ${m.nom}` : "?";
};
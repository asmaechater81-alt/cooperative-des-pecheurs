<?php

namespace Database\Seeders;

use App\Models\Capture;
use App\Models\Membre;
use Illuminate\Database\Seeder;

class CooperativeSeeder extends Seeder

{
    public function run(): void
    {
        // Les 3 membres de départ
        $membres = [
            ['Alaoui', 'Hassan', 'JA12345', 'ACTIF'],
            ['Bennani', 'Said', 'JB67890', 'ACTIF'],
            ['Idrissi', 'Omar', 'JC11223', 'INACTIF'],
        ];
        foreach ($membres as [$nom, $prenom, $cin, $statut]) {
            Membre::create(compact('nom', 'prenom', 'cin', 'statut'));
        }

        // Les 8 captures de départ : membre_id, date, espèce, kg, prix, statut
        $captures = [
            [1, '2026-11-02', 'Sardine', 120, 6, 'VALIDEE'],
            [1, '2026-11-05', 'Pageot', 30, 45, 'VALIDEE'],
            [2, '2026-11-06', 'Sardine', 200, 5, 'VALIDEE'],
            [2, '2026-11-08', 'Sole', 15, 80, 'EN_ATTENTE'],
            [3, '2026-11-09', 'Poulpe', 25, 60, 'VALIDEE'],
            [1, '2026-11-12', 'Sole', 10, 85, 'EN_ATTENTE'],
            [3, '2026-11-14', 'Sardine', 150, 6, 'VALIDEE'],
            [2, '2026-11-15', 'Pageot', 20, 48, 'VALIDEE'],
        ];
        foreach ($captures as [$membre_id, $date, $espece, $quantite_kg, $prix_unitaire, $statut]) {
            $capture = Capture::create(compact(
                'membre_id', 'date', 'espece', 'quantite_kg', 'prix_unitaire'
            ));
            // Le statut n'est pas dans $fillable : on passe par la méthode du modèle
            if ($statut === 'VALIDEE') {
                $capture->valider();
            }
        }
    }
}
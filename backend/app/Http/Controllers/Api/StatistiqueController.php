<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Capture;

class StatistiqueController extends Controller
{
    // GET /api/statistiques
    public function __invoke()
    {
        $taux = config('cooperative.taux_frais');
        $validees = Capture::where('statut', 'VALIDEE')->get();

        $brut = round($validees->sum('montant_total'), 2);
        $frais = round($brut * $taux, 2);

        // Mêmes noms que ceux déjà utilisés par ton composant StatsRecettes
        return [
            'montantBrut' => $brut,
            'fraisRetenus' => $frais,
            'montantNet' => round($brut - $frais, 2),
            'enAttente' => Capture::where('statut', 'EN_ATTENTE')->count(),
            'moyenne' => $validees->count() ? round($brut / $validees->count(), 2) : 0,
            'tauxFrais' => $taux,
        ];
    }
}
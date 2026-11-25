<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Membre;
use App\Models\Repartition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RepartitionController extends Controller
{
    // GET /api/repartitions
    public function index()
    {
        return Repartition::orderByDesc('periode_debut')->orderBy('membre_id')->get();
    }

    // POST /api/repartitions/generer  { "debut": "2026-11-01", "fin": "2026-11-30" }
    public function generer(Request $request)
    {
        $v = $request->validate([
            'debut' => 'required|date',
            'fin' => 'required|date|after_or_equal:debut',
        ]);
        $debut = $v['debut'];
        $fin = $v['fin'];

        // Interdit de recalculer une période déjà validée (pas de double paiement)
        if (Repartition::chevauche($debut, $fin)->where('statut', 'VALIDEE')->exists()) {
            return response()->json([
                'message' => 'Une répartition déjà validée chevauche cette période.',
            ], 422);
        }

        $taux = config('cooperative.taux_frais');

        // La transaction annule tout si une étape échoue : jamais de calcul à moitié enregistré
        $creees = DB::transaction(function () use ($debut, $fin, $taux) {
            // Il ne reste ici que des répartitions CALCULEE : on les remplace (pas de doublon)
            Repartition::chevauche($debut, $fin)->delete();

            $creees = [];
            foreach (Membre::all() as $membre) {
                $captures = $membre->captures()
                    ->where('statut', 'VALIDEE')
                    ->whereBetween('date', [$debut, $fin])
                    ->get();

                if ($captures->isEmpty()) {
                    continue;
                }

                // montantBrut = somme des captures VALIDEES ; frais = brut x taux ; net = brut - frais
                $brut = round($captures->sum('montant_total'), 2);
                $frais = round($brut * $taux, 2);

                $creees[] = Repartition::create([
                    'membre_id' => $membre->id,
                    'periode_debut' => $debut,
                    'periode_fin' => $fin,
                    'quantite_totale_kg' => $captures->sum('quantite_kg'),
                    'montant_brut' => $brut,
                    'taux_frais' => $taux,
                    'frais_retenus' => $frais,
                    'montant_net' => round($brut - $frais, 2),
                ])->fresh();
            }

            return $creees;
        });

        return response()->json(['nombre' => count($creees), 'repartitions' => $creees], 201);
    }

    // POST /api/repartitions/{repartition}/valider
    public function valider(Repartition $repartition)
    {
        if ($repartition->statut !== 'CALCULEE') {
            return response()->json(['message' => 'Cette répartition est déjà validée.'], 409);
        }

        $repartition->valider();

        return $repartition;
    }

    // POST /api/repartitions/{repartition}/payer
    public function payer(Repartition $repartition)
    {
        if ($repartition->statut !== 'VALIDEE') {
            return response()->json(['message' => 'Validez la répartition avant le paiement.'], 409);
        }
        if ($repartition->statut_paiement === 'PAYE') {
            return response()->json(['message' => 'Cette répartition est déjà payée.'], 409);
        }

        $repartition->marquerPaye(now()->toDateString());

        return $repartition;
    }

    // DELETE /api/repartitions/{repartition}
    public function destroy(Repartition $repartition)
    {
        if ($repartition->statut !== 'CALCULEE') {
            return response()->json([
                'message' => 'Seule une répartition non validée peut être supprimée.',
            ], 409);
        }

        $repartition->delete();

        return response()->noContent();
    }
}
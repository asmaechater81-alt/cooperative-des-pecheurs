<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Membre;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MembreController extends Controller
{
    private function regles(?Membre $membre = null): array
    {
        return [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'cin' => ['required', 'string', 'max:20',
                      Rule::unique('membres', 'cin')->ignore($membre?->id)],
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string|max:255',
            'date_adhesion' => 'nullable|date',
            'statut' => ['sometimes', Rule::in(['ACTIF', 'INACTIF'])],
        ];
    }

    // CIN nettoyé avant la validation : espaces retirés, majuscules
    private function nettoyerCin(Request $request): void
    {
        $request->merge(['cin' => strtoupper(trim((string) $request->input('cin')))]);
    }

    // GET /api/membres
    public function index()
    {
        return Membre::orderBy('nom')->get();
    }

    // POST /api/membres
    public function store(Request $request)
    {
        $this->nettoyerCin($request);
        $validated = $request->validate($this->regles());

        // fresh() recharge la ligne pour inclure le statut mis par défaut par MySQL
        return response()->json(Membre::create($validated)->fresh(), 201);
    }

    // GET /api/membres/{membre}
    public function show(Membre $membre)
    {
        return $membre;
    }

    // PUT /api/membres/{membre}
    public function update(Request $request, Membre $membre)
    {
        $this->nettoyerCin($request);
        $validated = $request->validate($this->regles($membre));
        $membre->update($validated);

        return $membre;
    }

    // DELETE /api/membres/{membre}
    public function destroy(Membre $membre)
    {
        if ($membre->captures()->exists() || $membre->repartitions()->exists()) {
            return response()->json([
                'message' => 'Impossible de supprimer ce membre : il a des captures enregistrées. '
                           . 'Passez plutôt son statut à INACTIF.',
            ], 409);
        }

        $membre->delete();

        return response()->noContent();
    }
}
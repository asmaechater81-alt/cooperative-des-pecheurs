<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Capture;
use Illuminate\Http\Request;

class CaptureController extends Controller
{
    private function regles(): array
    {
        return [
            'membre_id' => 'required|exists:membres,id',
            'date' => 'required|date',
            'espece' => 'required|string|max:100',
            'quantite_kg' => 'required|numeric|min:0.01',
            'prix_unitaire' => 'required|numeric|min:0.01',
        ];
    }

    // GET /api/captures
    public function index()
    {
        return Capture::orderByDesc('date')->orderByDesc('id')->get();
    }

    // POST /api/captures
    public function store(Request $request)
    {
        $validated = $request->validate($this->regles());

        return response()->json(Capture::create($validated), 201);
    }

    // GET /api/captures/{capture}
    public function show(Capture $capture)
    {
        return $capture;
    }

    // PUT /api/captures/{capture}
    public function update(Request $request, Capture $capture)
    {
        if ($capture->statut !== 'EN_ATTENTE') {
            return response()->json([
                'message' => 'Une capture validée ne peut plus être modifiée.',
            ], 409);
        }

        $capture->update($request->validate($this->regles()));

        return $capture;
    }

    // DELETE /api/captures/{capture}
    public function destroy(Capture $capture)
    {
        if ($capture->estVerrouillee()) {
            return response()->json([
                'message' => "Impossible de supprimer cette capture : elle fait partie d'une répartition déjà validée.",
            ], 409);
        }

        $capture->delete();

        return response()->noContent();
    }

    // POST /api/captures/{capture}/valider
    public function valider(Capture $capture)
    {
        if ($capture->statut !== 'EN_ATTENTE') {
            return response()->json(['message' => 'Cette capture est déjà validée.'], 409);
        }

        $capture->valider();

        return $capture;
    }
}
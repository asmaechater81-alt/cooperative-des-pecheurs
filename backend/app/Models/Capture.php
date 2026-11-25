<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Capture extends Model
{
    protected $fillable = ['membre_id', 'date', 'espece', 'quantite_kg', 'prix_unitaire'];

    protected $attributes = ['statut' => 'EN_ATTENTE'];

    protected $casts = [
        'date' => 'date:Y-m-d',
        'quantite_kg' => 'float',
        'prix_unitaire' => 'float',
    ];

    // Ajouté automatiquement à chaque réponse JSON
    protected $appends = ['montant_total'];

    public function membre()
    {
        return $this->belongsTo(Membre::class);
    }

    // montantTotal = quantiteKg x prixUnitaire (règle du diagramme de classes)
    public function getMontantTotalAttribute(): float
    {
        return round($this->quantite_kg * $this->prix_unitaire, 2);
    }

    public function valider(): void
    {
        $this->statut = 'VALIDEE';
        $this->save();
    }

    // Capture validée comprise dans une répartition validée : plus modifiable
    public function estVerrouillee(): bool
    {
        if ($this->statut !== 'VALIDEE') {
            return false;
        }

        $jour = $this->date->toDateString();

        return Repartition::where('membre_id', $this->membre_id)
            ->where('statut', 'VALIDEE')
            ->where('periode_debut', '<=', $jour)
            ->where('periode_fin', '>=', $jour)
            ->exists();
    }
}
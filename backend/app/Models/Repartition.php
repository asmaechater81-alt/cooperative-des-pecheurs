<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Repartition extends Model
{
    protected $fillable = [
        'membre_id', 'periode_debut', 'periode_fin', 'quantite_totale_kg',
        'montant_brut', 'taux_frais', 'frais_retenus', 'montant_net',
    ];

    protected $attributes = [
        'statut' => 'CALCULEE',
        'statut_paiement' => 'NON_PAYE',
    ];

    protected $casts = [
        'periode_debut' => 'date:Y-m-d',
        'periode_fin' => 'date:Y-m-d',
        'date_paiement' => 'date:Y-m-d',
        'quantite_totale_kg' => 'float',
        'montant_brut' => 'float',
        'taux_frais' => 'float',
        'frais_retenus' => 'float',
        'montant_net' => 'float',
    ];

    public function membre()
    {
        return $this->belongsTo(Membre::class);
    }

    // Répartitions dont la période chevauche [debut, fin]
    public function scopeChevauche($query, $debut, $fin)
    {
        return $query->where('periode_debut', '<=', $fin)
                     ->where('periode_fin', '>=', $debut);
    }

    public function valider(): void
    {
        $this->statut = 'VALIDEE';
        $this->save();
    }

    public function marquerPaye(string $date): void
    {
        $this->statut_paiement = 'PAYE';
        $this->date_paiement = $date;
        $this->save();
    }
}
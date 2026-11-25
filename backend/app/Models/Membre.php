<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Membre extends Model
{
    protected $fillable = [
        'nom', 'prenom', 'cin', 'telephone', 'adresse', 'date_adhesion', 'statut',
    ];

    protected $casts = ['date_adhesion' => 'date:Y-m-d'];

    public function captures()
    {
        return $this->hasMany(Capture::class);
    }

    public function repartitions()
    {
        return $this->hasMany(Repartition::class);
    }
}
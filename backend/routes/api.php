<?php

use App\Http\Controllers\Api\CaptureController;
use App\Http\Controllers\Api\MembreController;
use App\Http\Controllers\Api\RepartitionController;
use App\Http\Controllers\Api\StatistiqueController;
use Illuminate\Support\Facades\Route;

// Membres : CRUD complet (liste, création, lecture, modification, suppression)
Route::apiResource('membres', MembreController::class);

// Captures : CRUD complet + validation
Route::apiResource('captures', CaptureController::class);
Route::post('captures/{capture}/valider', [CaptureController::class, 'valider']);

// Répartitions
Route::get('repartitions', [RepartitionController::class, 'index']);
Route::post('repartitions/generer', [RepartitionController::class, 'generer']);
Route::post('repartitions/{repartition}/valider', [RepartitionController::class, 'valider']);
Route::post('repartitions/{repartition}/payer', [RepartitionController::class, 'payer']);
Route::delete('repartitions/{repartition}', [RepartitionController::class, 'destroy']);

// Statistiques (bande « Recettes »)
Route::get('statistiques', StatistiqueController::class);
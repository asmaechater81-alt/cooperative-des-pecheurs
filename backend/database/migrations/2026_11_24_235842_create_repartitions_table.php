<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('repartitions', function (Blueprint $table) {
        $table->id();
        $table->foreignId('membre_id')->constrained('membres');
        $table->date('periode_debut');
        $table->date('periode_fin');
        $table->decimal('quantite_totale_kg', 12, 2);
        $table->decimal('montant_brut', 12, 2);
        $table->decimal('taux_frais', 5, 4);
        $table->decimal('frais_retenus', 12, 2);
        $table->decimal('montant_net', 12, 2);
        $table->enum('statut', ['CALCULEE', 'VALIDEE'])->default('CALCULEE');
        $table->enum('statut_paiement', ['NON_PAYE', 'PAYE'])->default('NON_PAYE');
        $table->date('date_paiement')->nullable();
        $table->timestamps();
     });
 }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('repartitions');
    }
};

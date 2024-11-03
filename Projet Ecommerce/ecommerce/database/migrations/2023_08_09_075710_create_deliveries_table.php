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
        Schema::create('deliveries', function (Blueprint $table) {
            $table->id();
            $table->string('phone');
            $table->string('address');
            $table->string('name');
            $table->string('email');
            $table->string('zipcode');
            $table->string('city');
            $table->string('country');
            $table->decimal('shipping_rate', 8, 2);
            $table->decimal('tax_free', 8, 2);
            $table->decimal('total_price', 10, 2);
            $table->unsignedBigInteger('numero');
            $table->enum('status', ['completed', 'in-progress', 'pending', 'finished']);
            $table->unsignedBigInteger('id_card');
            $table->timestamps();
            $table->foreign('id_card')->references('id')->on('cards')->onDelete('cascade');
        });

        Schema::create('delivery_content', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('delivery_id');
            $table->unsignedBigInteger('item_id');
            $table->timestamps();
            $table->foreign('delivery_id')->references('id')->on('deliveries')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deliveries');
    }
};

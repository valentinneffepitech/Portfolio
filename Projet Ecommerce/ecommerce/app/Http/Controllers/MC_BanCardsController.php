<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BanCards;

class MC_BanCardsController extends Controller
{
    public function checkCard($numero)
    {
        $firstFourDigits = substr($numero, 0, 4);

        $bannedCardsCount = BanCards::where('code_country', $firstFourDigits)->count();

        return response()->json(['banned' => $bannedCardsCount > 0]);
    }

    public function addCard($numero){
        try {
            if (strlen($numero) !== 4) {
                return response()->json(['message' => '4 chiffres sont attendus.']);
            }

            $bannedCardsCount = BanCards::where('code_country', $numero)->count();

            if ($bannedCardsCount > 0) {
                return response()->json(['message' => 'Ce pays est déjà interdit.']);
            }

            $banCard = new BanCards();
            $banCard->code_country = $numero;
            $banCard->save();

            return response()->json(['message' => 'Pays ajouté avec succès.']);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Une erreur est survenue lors de l\'ajout du pays.'], 500);
        }
    }
}

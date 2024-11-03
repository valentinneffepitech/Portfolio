<?php

namespace App\Http\Controllers;

use App\Models\Cards;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * Class MC_CardsController
 *
 * This controller handles payment cards
 */
class MC_CardsController extends Controller
{
    /**
     * Get all payment cards for a user.
     *
     * @param int $id User's id.
     * @return \Illuminate\Http\JsonResponse
     *
     * @SWG\Get(
     *     path="/cards/{id}",
     *     summary="Get all payment cards for a user",
     *     tags={"Cards"},
     *     @SWG\Parameter(
     *         name="id",
     *         in="path",
     *         type="integer",
     *         required=true,
     *         description="User's id"
     *     ),
     *     @SWG\Response(
     *         response=200,
     *         description="List of payment cards for the user",
     *         @SWG\Schema(
     *             type="array",
     *             @SWG\Items(ref="#/definitions/Card")
     *         ),
     *     ),
     *     @SWG\Response(
     *         response=404,
     *         description="User not found"
     *     )
     * )
     */
    public function getAllCards($id)
    {
        $listcards = Cards::select('*')
            ->where('user_id', $id)
            ->get();

        return response()->json($listcards);
    }
}

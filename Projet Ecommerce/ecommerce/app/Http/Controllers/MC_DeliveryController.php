<?php

namespace App\Http\Controllers;

use App\Models\Delivery;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * Class MC_DeliveryController
 *
 * This controller handles deliveries
 */
class MC_DeliveryController extends Controller
{
    /**
     * Get delivery status from the database for a given delivery number.
     *
     * @param int $numero Delivery number.
     * @return \Illuminate\Http\JsonResponse
     *
     * @SWG\Get(
     *     path="/deliveries/{numero}",
     *     summary="Get delivery status for a given delivery number",
     *     tags={"Deliveries"},
     *     @SWG\Parameter(
     *         name="numero",
     *         in="path",
     *         type="integer",
     *         required=true,
     *         description="Delivery number"
     *     ),
     *     @SWG\Response(
     *         response=200,
     *         description="List of delivery statuses",
     *         @SWG\Schema(
     *             type="array",
     *             @SWG\Items(ref="#/definitions/Delivery")
     *         ),
     *     ),
     *     @SWG\Response(
     *         response=404,
     *         description="No deliveries found for the given number"
     *     )
     * )
     */
    public function showStep($numero)
    {
        $deliveries = Delivery::select('*')
            ->where('status', '!=', 'finished')
            ->where('numero', $numero)
            ->get();

        return response()->json($deliveries);
    }
}

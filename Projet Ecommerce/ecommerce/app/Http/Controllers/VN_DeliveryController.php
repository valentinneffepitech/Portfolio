<?php

namespace App\Http\Controllers;

use App\Models\Cards;
use App\Models\Deliveries;
use App\Models\DeliveryContent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\TemplatedEmail;
use App\Models\Delivery;
use App\Models\Items;
use Barryvdh\DomPDF\Facade\Pdf;
use Barryvdh\DomPDF\PDF as DomPDFPDF;

/**
 * Class VN_DeliveryController
 *
 * This controller handles deliveries
 */
class VN_DeliveryController extends Controller
{
    /**
     * Create a new delivery.
     *
     * @param \Illuminate\Http\Request $request The HTTP request object.
     * @return \Illuminate\Http\JsonResponse
     *
     * @SWG\Post(
     *     path="/deliveries",
     *     summary="Create a new delivery",
     *     tags={"Deliveries"},
     *     @SWG\Parameter(
     *         name="delivery",
     *         in="formData",
     *         type="object",
     *         required=true,
     *         description="Delivery data",
     *         @SWG\Property(property="phone", type="string"),
     *         @SWG\Property(property="address", type="string"),
     *         @SWG\Property(property="city", type="string"),
     *         @SWG\Property(property="country", type="string"),
     *         @SWG\Property(property="zipcode", type="string"),
     *         @SWG\Property(property="email", type="string"),
     *         @SWG\Property(property="name", type="string"),
     *     ),
     *     @SWG\Parameter(
     *         name="panier",
     *         in="formData",
     *         type="array",
     *         required=true,
     *         description="Cart items",
     *         @SWG\Items(
     *             type="object",
     *             @SWG\Property(property="item_id", type="integer"),
     *             @SWG\Property(property="quantity", type="integer"),
     *         )
     *     ),
     *     @SWG\Parameter(
     *         name="prices",
     *         in="formData",
     *         type="object",
     *         required=true,
     *         description="Price data",
     *         @SWG\Property(property="shippingRate", type="number"),
     *         @SWG\Property(property="solo", type="number"),
     *         @SWG\Property(property="totalPrice", type="number"),
     *     ),
     *     @SWG\Response(
     *         response=201,
     *         description="Delivery created successfully"
     *     ),
     *     @SWG\Response(
     *         response=400,
     *         description="Bad request"
     *     ),
     * )
     */
    public function create(Request $request)
    {
        $panier = $request->input('panier');
        $apagnier = [];
        foreach ($panier as $value) {
            $apagnier[$value['item_id']][] = $value;
        }
        foreach ($apagnier as $key => $value) {
            $item = Items::find($key);
            $stocks = $item->stocks;
            if ($stocks < count($value)) {
                return response([
                    'item' => $item->name,
                    'error_stocks' => $stocks
                ], 400);
            }
            $newStocks = count($value);
            $item->stocks = $stocks - $newStocks;
            $item->save();
        }
        $delivery = $request->input('delivery');
        $prices = $request->input('prices');
        $name = $request->input('name');
        $number = intval($request->input('number'));
        $month = intval($request->input('month'));
        $year = intval($request->input('year'));
        $userId = intval($request->input('id_user')) > 0 ? intval($request->input('id_user')) : null;
        $test = Cards::where('number', '=', $number)->get();
        if (count($test) == 0) {
            $card = new Cards();
            $card->owner = $name;
            $card->number = $number;
            $card->expiration_month = $month;
            $card->expiration_year = $year;
            $card->user_id = $userId;
            $card->save();
        } else {
            $card = $test[0];
        }
        $id = $card->id;
        $livraison = new Deliveries();
        $livraison->phone = $delivery['phone'];
        $livraison->address = $delivery['address'];
        $livraison->city = $delivery['city'];
        $livraison->country = $delivery['country'];
        $livraison->zipcode = $delivery['zipcode'];
        $livraison->email = $delivery['email'];
        $livraison->name = $delivery['name'];
        $livraison->shipping_rate = floatval($prices['shippingRate']);
        $livraison->tax_free = floatval($prices['solo']);
        $livraison->total_price = $prices['totalPrice'];
        $livraison->numero = time() . $livraison->id;
        $livraison->id_card = $id;
        $livraison->save();
        foreach ($panier as $item) {
            $content = new DeliveryContent();
            $content->item_id = $item['item_id'];
            $content->delivery_id = $livraison->id;
            $content->save();
        }
        $messageData = [
            'numero' => $livraison->numero,
            'user' => $delivery['name'],
            'address' => $delivery['address'],
            'city' => $delivery['zipcode'] . ' ' . $delivery['city'],
            'country' => $delivery['country'],
            'panier' => $panier,
            'prices' => $prices
        ];
        Mail::to($delivery['email'])->send(new TemplatedEmail($messageData));
        $pdf = Pdf::loadView('pdf', $messageData);
        $pdf->save('factures/' . $livraison->numero . '.pdf');
        return response([$livraison], 201);
    }

    /**
     * Get the details of a command.
     *
     * @param int $id Delivery ID.
     * @return \Illuminate\Http\JsonResponse
     *
     * @SWG\Get(
     *     path="/deliveries/{id}",
     *     summary="Get the details of a command",
     *     tags={"Deliveries"},
     *     @SWG\Parameter(
     *         name="id",
     *         in="path",
     *         type="integer",
     *         required=true,
     *         description="Delivery ID"
     *     ),
     *     @SWG\Response(
     *         response=200,
     *         description="Command details",
     *         @SWG\Schema(
     *             @SWG\Property(property="items", type="array", @SWG\Items(ref="#/definitions/DeliveryContent")),
     *             @SWG\Property(property="price", ref="#/definitions/Delivery")
     *         )
     *     ),
     *     @SWG\Response(
     *         response=404,
     *         description="Delivery not found"
     *     )
     * )
     */
    public function getCommand($id)
    {
        $delivery = DeliveryContent::join("items", "items.id", "=", "delivery_content.item_id")->join('items_photos', 'items.id', '=', 'items_photos.item_id')->where("delivery_content.delivery_id", "=", $id)->get();
        $price = Delivery::where('id', "=", $id)->first();
        return Response()->json(
            [
                'items' => $delivery,
                "price" => $price
            ],
            200
        );
    }

    public function getFacture($numero){
        
    }
}

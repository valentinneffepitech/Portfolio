<?php

namespace App\Http\Controllers;

use App\Models\HasBeenVisited;
use App\Models\Items;
use App\Models\items_photos;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Class VN_ItemsController
 *
 * This controller handles items
 */
class VN_ItemsController extends Controller
{
    /**
     * List all items.
     *
     * @return \Illuminate\Http\JsonResponse
     *
     * @SWG\Get(
     *     path="/items",
     *     summary="List all items",
     *     tags={"Items"},
     *     @SWG\Response(
     *         response=200,
     *         description="List of all items",
     *         @SWG\Schema(
     *             type="array",
     *             @SWG\Items(ref="#/definitions/Item")
     *         )
     *     )
     * )
     */
    public function liste()
    {
        $liste = Items::join('items_photos', 'items.id', '=', 'items_photos.item_id')
            ->get();
        return $liste;
    }

    /**
     * Add a new item.
     *
     * @param \Illuminate\Http\Request $req The HTTP request object.
     * @return \Illuminate\Http\JsonResponse
     *
     * @SWG\Post(
     *     path="/items",
     *     summary="Add a new item",
     *     tags={"Items"},
     *     @SWG\Parameter(
     *         name="userId",
     *         in="formData",
     *         type="integer",
     *         required=true,
     *         description="User ID"
     *     ),
     *     @SWG\Parameter(
     *         name="name",
     *         in="formData",
     *         type="string",
     *         required=true,
     *         description="Item name"
     *     ),
     *     @SWG\Parameter(
     *         name="price",
     *         in="formData",
     *         type="number",
     *         required=true,
     *         description="Item price"
     *     ),
     *     @SWG\Parameter(
     *         name="description",
     *         in="formData",
     *         type="string",
     *         required=true,
     *         description="Item description"
     *     ),
     *     @SWG\Parameter(
     *         name="category_id",
     *         in="formData",
     *         type="integer",
     *         required=true,
     *         description="Category ID"
     *     ),
     *     @SWG\Parameter(
     *         name="reduction",
     *         in="formData",
     *         type="integer",
     *         required=true,
     *         description="Item reduction"
     *     ),
     *     @SWG\Parameter(
     *         name="stocks",
     *         in="formData",
     *         type="integer",
     *         required=true,
     *         description="Item stocks"
     *     ),
     *     @SWG\Parameter(
     *         name="weight",
     *         in="formData",
     *         type="integer",
     *         required=true,
     *         description="Item weight"
     *     ),
     *     @SWG\Response(
     *         response=200,
     *         description="Item added successfully"
     *     ),
     *     @SWG\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function add_item(Request $req)
    {
        $id = $req->userId;
        $user = User::find($id);
        if (!$user->isAdmin || !$user) {
            return response()->json(['state' => 'hacking is illegal'], 401);
        }
        $item = new Items();
        $item->name = $req->name;
        $item->price = floatval($req->price);
        $item->description = $req->description;
        $item->category_id = $req->category_id;
        $item->reduction = intval($req->reduction);
        $item->stocks = intval($req->stocks);
        $item->weight = intval($req->weight);
        $item->save();
        $image = $req->file('image');
        $filename = time() . '.' . $image->getClientOriginalExtension();
        $image->move(public_path('uploads'), $filename);
        $itemphoto = new items_photos();
        $itemId = Items::latest('id')->first()->id;
        $itemphoto->item_id = $itemId;
        $itemphoto->photo_source = 'uploads/' . $filename;
        $itemphoto->save();
        $hasSeen = new HasBeenVisited();
        $hasSeen->item_id = $itemId;
        $hasSeen->hasBeenSeen = 0;
        $hasSeen->save();
        return response()->json(['data' => 'OK'], 200);
    }

    /**
     * @SWG\Get(
     *   path="/items/{id}",
     *   summary="Get details of a specific item",
     *   tags={"Items"},
     *   @SWG\Parameter(
     *     name="id",
     *     in="path",
     *     type="integer",
     *     required=true,
     *     description="Item ID"
     *   ),
     *   @SWG\Response(response=200, description="Item details"),
     *   @SWG\Response(response=401, description="Item not found"),
     * )
     */
    public function customArticle($id)
    {
        $item = Items::join('items_photos', 'items.id', '=', 'items_photos.item_id')
            ->where('items.id', '=', $id)
            ->get();
        if ($item->isNotEmpty()) {
            $seen = HasBeenVisited::where('item_id', "=", $id)->get();
            $seen = $seen[0];
            $count = $seen->hasBeenSeen;
            $count += 1;
            $seen->update([
                "hasBeenSeen" => $count
            ]);
            return response()->json([
                'item' => $item[0],
                'seen' => $seen
            ], 200);
        } else {
            return response()->json([
                'error' => 'aucun article ne correspond'
            ], 401);
        }
    }

    /**
     * @SWG\Put(
     *   path="/items/{id}",
     *   summary="Update an item's details",
     *   tags={"Items"},
     *   @SWG\Parameter(
     *     name="id",
     *     in="path",
     *     type="integer",
     *     required=true,
     *     description="Item ID"
     *   ),
     *   @SWG\Parameter(
     *     name="name",
     *     in="formData",
     *     type="string",
     *     description="Item name"
     *   ),
     *   @SWG\Parameter(
     *     name="desc",
     *     in="formData",
     *     type="string",
     *     description="Item description"
     *   ),
     *   @SWG\Parameter(
     *     name="price",
     *     in="formData",
     *     type="number",
     *     description="Item price"
     *   ),
     *   @SWG\Parameter(
     *     name="stocks",
     *     in="formData",
     *     type="integer",
     *     description="Item stocks"
     *   ),
     *   @SWG\Parameter(
     *     name="reduction",
     *     in="formData",
     *     type="integer",
     *     description="Item reduction"
     *   ),
     *   @SWG\Parameter(
     *     name="weight",
     *     in="formData",
     *     type="integer",
     *     description="Item weight"
     *   ),
     *   @SWG\Response(response=200, description="Item updated successfully"),
     * )
     */
    public function updateArticle(Request $req, $id)
    {
        $item = Items::find($id);
        $request = [
            'name' => $req->name,
            'description' => $req->desc,
            'price' => floatval($req->price),
            'stocks' => intval($req->stocks),
            'reduction' => intval($req->reduction),
            'weight' => intval($req->weight)
        ];
        foreach ($request as $key => $value) {
            if ($value !== "") {
                $item->update([$key => $value]);
            }
        }
        $item->update([
            'updated_at' => now()
        ]);
        return response('Ok', 200);
    }

    /**
     * @SWG\Delete(
     *   path="/items/{id}",
     *   summary="Delete an item",
     *   tags={"Items"},
     *   @SWG\Parameter(
     *     name="id",
     *     in="path",
     *     type="integer",
     *     required=true,
     *     description="Item ID"
     *   ),
     *   @SWG\Response(response=200, description="Item deleted successfully"),
     * )
     */
    public function deleteArticle($id)
    {
        $item = Items::find($id);
        $item->delete();
        return response('Ok', 200);
    }

    /**
     * @SWG\Get(
     *   path="/bestsellers",
     *   summary="Get the best-selling items",
     *   tags={"Items"},
     *   @SWG\Response(response=200, description="List of best-selling items"),
     * )
     */
    public function bestSellers()
    {
        $array = DB::table("has_been_visiteds")
            ->join("items", function ($join) {
                $join->on("has_been_visiteds.item_id", "=", "items.id");
            })
            ->join("items_photos", function ($join) {
                $join->on("items_photos.item_id", "=", "items.id");
            })
            ->limit(4)
            ->orderBy("has_been_visiteds.hasbeenseen", "desc")
            ->get();

        return response()->json($array, 200);
    }
}

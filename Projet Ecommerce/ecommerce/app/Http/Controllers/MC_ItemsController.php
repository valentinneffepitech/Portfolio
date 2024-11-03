<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\Items;
use App\Models\items_photos;
use Illuminate\Http\Request;

/**
 * Class MC_ItemsController
 *
 * This controller handles items
 */
class MC_ItemsController extends Controller
{
    /**
     * Search for items in the database using a search term.
     *
     * @param \Illuminate\Http\Request $req The HTTP request object.
     * @return \Illuminate\Http\JsonResponse
     *
     * @SWG\Post(
     *     path="/items/search",
     *     summary="Search for items by name",
     *     tags={"Items"},
     *     @SWG\Parameter(
     *         name="searchbar",
     *         in="formData",
     *         type="string",
     *         required=true,
     *         description="Search term"
     *     ),
     *     @SWG\Response(
     *         response=200,
     *         description="List of items matching the search term",
     *         @SWG\Schema(
     *             type="array",
     *             @SWG\Items(ref="#/definitions/Item")
     *         ),
     *     ),
     *     @SWG\Response(
     *         response=400,
     *         description="Bad request"
     *     ),
     * )
     */
    public function searchbar(Request $req)
    {
        $searchTerm = $req->input('searchbar');
        $items = Items::select('items.id', 'name', 'price', 'photo_source')
            ->where('name', 'LIKE', '%' . $searchTerm . '%')
            ->join('items_photos', 'items.id', '=', 'items_photos.item_id')
            ->limit(4)
            ->get();
        return response()->json($items);
    }

    /**
     * List all items with prices and photos.
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
     *         ),
     *     ),
     * )
     */
    public function listArticles()
    {
        $items = Items::select('items.id', 'name', 'price', 'photo_source', DB::raw('price - (price * reduction)/100 AS price_reduct'))
            ->join('items_photos', 'items.id', '=', 'items_photos.item_id')
            ->get();
        return response()->json($items);
    }
}

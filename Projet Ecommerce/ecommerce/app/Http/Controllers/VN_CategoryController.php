<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

/**
 * Class VN_CategoryController
 *
 * This controller handles categories
 */
class VN_CategoryController extends Controller
{
    /**
     * List all categories.
     *
     * @return \Illuminate\Http\JsonResponse
     *
     * @SWG\Get(
     *     path="/categories",
     *     summary="List all categories",
     *     tags={"Categories"},
     *     @SWG\Response(
     *         response=200,
     *         description="List of all categories",
     *         @SWG\Schema(
     *             type="array",
     *             @SWG\Items(ref="#/definitions/Category")
     *         )
     *     )
     * )
     */
    public function liste()
    {
        $liste = category::all();
        return response()->json(['data' => $liste], 200);
    }

    /**
     * Create a new category.
     *
     * @param \Illuminate\Http\Request $req The HTTP request object.
     * @return \Illuminate\Http\Response
     *
     * @SWG\Post(
     *     path="/categories",
     *     summary="Create a new category",
     *     tags={"Categories"},
     *     @SWG\Parameter(
     *         name="name",
     *         in="formData",
     *         type="string",
     *         required=true,
     *         description="Category name"
     *     ),
     *     @SWG\Response(
     *         response=200,
     *         description="Category created successfully"
     *     ),
     *     @SWG\Response(
     *         response=401,
     *         description="Category already exists"
     *     )
     * )
     */
    public function create(Request $req)
    {
        $name = ucfirst($req->name);
        $exist = category::where('name', "=", $name)->get();
        if ($exist->isNotEmpty()) {
            return response('Cette catégorie existe déjà !', 401);
        } else {
            $category = new category();
            $category->name = $name;
            $category->save();
            return response($name, 200);
        }
    }
}

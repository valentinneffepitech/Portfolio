<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

/**
 * @SWG\Post(
 *   path="/updateuser/{id}",
 *   summary="Update user's data",
 *   tags={"User"},
 *   @SWG\Parameter(
 *     name="id",
 *     in="path",
 *     description="User ID",
 *     required=true,
 *     type="integer"
 *   ),
 *   @SWG\Parameter(
 *     name="request",
 *     in="body",
 *     description="Request body containing user data to update",
 *     required=true,
 *     @SWG\Schema(ref="#/definitions/UserUpdateRequest")
 *   ),
 *   @SWG\Response(response=200, description="User updated successfully"),
 *   @SWG\Response(response=404, description="User not found")
 * ),
 *   @SWG\Definition(
 *   definition="UserUpdateRequest",
 *   required={"name", "courriel", "password", "zipcode", "phone"},
 *   @SWG\Property(property="name", type="string"),
 *   @SWG\Property(property="courriel", type="string"),
 *   @SWG\Property(property="password", type="string"),
 *   @SWG\Property(property="zipcode", type="string"),
 *   @SWG\Property(property="phone", type="string")
 * )
 */
Route::post('/updateuser/{id}', [App\Http\Controllers\MC_UserController::class, 'update']);

/**
 * @SWG\Post(
 *   path="/searchbar",
 *   summary="Search items by name",
 *   tags={"Items"},
 *   @SWG\Parameter(
 *     name="request",
 *     in="body",
 *     description="Request body containing search term",
 *     required=true,
 *     @SWG\Schema(ref="#/definitions/SearchRequest")
 *   ),
 *   @SWG\Response(response=200, description="Items found successfully"),
 *   @SWG\Response(response=404, description="No items found")
 * ),
 *  * @SWG\Definition(
 *   definition="SearchRequest",
 *   required={"searchbar"},
 *   @SWG\Property(property="searchbar", type="string")
 * )
 */
Route::post('/searchbar', [App\Http\Controllers\MC_ItemsController::class, 'searchbar']);

/**
 * @SWG\Get(
 *   path="/users/{id}",
 *   summary="Get user details by ID",
 *   tags={"Users"},
 *   @SWG\Parameter(
 *     name="id",
 *     in="path",
 *     description="User ID",
 *     required=true,
 *     type="integer"
 *   ),
 *   @SWG\Response(response=200, description="User details retrieved successfully"),
 *   @SWG\Response(response=404, description="User not found")
 * )
 */
Route::get('/users/{id}', [App\Http\Controllers\MC_UserController::class, 'show']);

/**
 * @SWG\Get(
 *   path="/liste",
 *   summary="List all items",
 *   tags={"Items"},
 *   @SWG\Response(response=200, description="List of all items"),
 * )
 */
Route::get('/liste', [App\Http\Controllers\VN_ItemsController::class, 'liste']);

/**
 * @SWG\Post(
 *   path="/register",
 *   summary="Register a new user",
 *   tags={"Users"},
 *   @SWG\Parameter(
 *     name="email",
 *     in="formData",
 *     type="string",
 *     required=true,
 *     description="User email"
 *   ),
 *   @SWG\Parameter(
 *     name="name",
 *     in="formData",
 *     type="string",
 *     required=true,
 *     description="User name"
 *   ),
 *   @SWG\Parameter(
 *     name="password",
 *     in="formData",
 *     type="string",
 *     required=true,
 *     description="User password"
 *   ),
 *   @SWG\Parameter(
 *     name="country",
 *     in="formData",
 *     type="string",
 *     required=true,
 *     description="User country"
 *   ),
 *   @SWG\Parameter(
 *     name="city",
 *     in="formData",
 *     type="string",
 *     required=true,
 *     description="User city"
 *   ),
 *   @SWG\Parameter(
 *     name="adress",
 *     in="formData",
 *     type="string",
 *     required=true,
 *     description="User address"
 *   ),
 *   @SWG\Parameter(
 *     name="zipcode",
 *     in="formData",
 *     type="string",
 *     required=true,
 *     description="User ZIP code"
 *   ),
 *   @SWG\Parameter(
 *     name="phone",
 *     in="formData",
 *     type="string",
 *     required=true,
 *     description="User phone"
 *   ),
 *   @SWG\Response(response=200, description="User registered successfully"),
 *   @SWG\Response(response=401, description="User already exists"),
 * )
 */
Route::post('/register', [App\Http\Controllers\VN_UserController::class, 'register']);

/**
 * @SWG\Post(
 *   path="/login",
 *   summary="User login",
 *   tags={"Users"},
 *   @SWG\Parameter(
 *     name="login_user",
 *     in="formData",
 *     type="string",
 *     required=true,
 *     description="User login (email or username)"
 *   ),
 *   @SWG\Parameter(
 *     name="user_password",
 *     in="formData",
 *     type="string",
 *     required=true,
 *     description="User password"
 *   ),
 *   @SWG\Response(response=200, description="Login successful"),
 *   @SWG\Response(response=401, description="Login failed"),
 * )
 */
Route::post('/login', [App\Http\Controllers\VN_UserController::class, 'login']);

/**
 * @SWG\Post(
 *   path="/add_item",
 *   summary="Add a new item",
 *   tags={"Items"},
 *   @SWG\Parameter(name="userId", in="formData", type="integer", required=true, description="User ID"),
 *   @SWG\Parameter(name="name", in="formData", type="string", required=true, description="Item name"),
 *   @SWG\Parameter(name="price", in="formData", type="number", required=true, description="Item price"),
 *   @SWG\Parameter(name="description", in="formData", type="string", required=true, description="Item description"),
 *   @SWG\Parameter(name="category_id", in="formData", type="integer", required=true, description="Category ID"),
 *   @SWG\Parameter(name="reduction", in="formData", type="integer", required=true, description="Item reduction"),
 *   @SWG\Parameter(name="stocks", in="formData", type="integer", required=true, description="Item stocks"),
 *   @SWG\Parameter(name="weight", in="formData", type="integer", required=true, description="Item weight"),
 *   @SWG\Response(response=200, description="Item added successfully"),
 *   @SWG\Response(response=401, description="Unauthorized"),
 * )
 */
Route::post('/add_item', [App\Http\Controllers\VN_ItemsController::class, 'add_item']);

/**
 * @SWG\Get(
 *   path="/categories",
 *   summary="List all categories",
 *   tags={"Categories"},
 *   @SWG\Response(
 *     response=200,
 *     description="List of all categories",
 *     @SWG\Schema(
 *       type="array",
 *       @SWG\Items(ref="#/definitions/Category")
 *     )
 *   )
 * )
 */
Route::get('/categories', [App\Http\Controllers\VN_CategoryController::class, 'liste']);

/**
 * @SWG\Get(
 *   path="/article/{id}",
 *   summary="Get details of a specific item",
 *   tags={"Items"},
 *   @SWG\Parameter(name="id", in="path", type="integer", required=true, description="Item ID"),
 *   @SWG\Response(response=200, description="Item details"),
 *   @SWG\Response(response=401, description="Item not found"),
 * )
 */
Route::get('/article/{id}', [App\Http\Controllers\VN_ItemsController::class, 'customArticle']);

/**
 * @SWG\Get(
 *   path="/produits",
 *   summary="List all items with prices and photos",
 *   tags={"Items"},
 *   @SWG\Response(response=200, description="List of all items with prices and photos"),
 * )
 */
Route::get('/produits', [App\Http\Controllers\MC_ItemsController::class, 'listArticles']);

/**
 * @SWG\Post(
 *   path="/categories",
 *   summary="Create a new category",
 *   tags={"Categories"},
 *   @SWG\Parameter(
 *     name="name",
 *     in="formData",
 *     type="string",
 *     required=true,
 *     description="Category name"
 *   ),
 *   @SWG\Response(response=200, description="Category created successfully"),
 *   @SWG\Response(response=401, description="Category already exists")
 * )
 */

 Route::post('/categorie', [App\Http\Controllers\VN_CategoryController::class, 'create']);
/**
 * @SWG\Post(
 *   path="/update_article/{id}",
 *   summary="Update an item's details",
 *   tags={"Items"},
 *   @SWG\Parameter(name="id", in="path", type="integer", required=true, description="Item ID"),
 *   @SWG\Parameter(name="name", in="formData", type="string", description="Item name"),
 *   @SWG\Parameter(name="desc", in="formData", type="string", description="Item description"),
 *   @SWG\Parameter(name="price", in="formData", type="number", description="Item price"),
 *   @SWG\Parameter(name="stocks", in="formData", type="integer", description="Item stocks"),
 *   @SWG\Parameter(name="reduction", in="formData", type="integer", description="Item reduction"),
 *   @SWG\Parameter(name="weight", in="formData", type="integer", description="Item weight"),
 *   @SWG\Response(response=200, description="Item updated successfully"),
 * )
 */
Route::post('/update_article/{id}', [App\Http\Controllers\VN_ItemsController::class, 'updateArticle']);

/**
 * @SWG\Delete(
 *   path="/deleteArticle/{id}",
 *   summary="Delete an item",
 *   tags={"Items"},
 *   @SWG\Parameter(name="id", in="path", type="integer", required=true, description="Item ID"),
 *   @SWG\Response(response=200, description="Item deleted successfully"),
 * )
 */
Route::delete('/deleteArticle/{id}', [App\Http\Controllers\VN_ItemsController::class, 'deleteArticle']);

/**
 * @SWG\Get(
 *   path="/bestsellers",
 *   summary="Get the best-selling items",
 *   tags={"Items"},
 *   @SWG\Response(response=200, description="List of best-selling items"),
 * )
 */
Route::get('/bestsellers', [App\Http\Controllers\VN_ItemsController::class, 'bestSellers']);

/**
 * @SWG\Delete(
 *   path="/users/{id}",
 *   summary="Delete user by ID",
 *   tags={"Users"},
 *   @SWG\Parameter(
 *     name="id",
 *     in="path",
 *     type="integer",
 *     required=true,
 *     description="User's ID"
 *   ),
 *   @SWG\Response(response=200, description="User deleted successfully"),
 *   @SWG\Response(response=404, description="User not found"),
 * )
 */
Route::delete('/users/{id}', [App\Http\Controllers\MC_UserController::class, 'delete']);

/**
 * @SWG\Post(
 *   path="/admindashboard",
 *   summary="Admin dashboard",
 *   tags={"Users"},
 *   @SWG\Parameter(
 *     name="id",
 *     in="formData",
 *     type="integer",
 *     required=true,
 *     description="Admin user ID"
 *   ),
 *   @SWG\Response(response=200, description="Admin dashboard data"),
 *   @SWG\Response(response=400, description="You're not allowed"),
 * )
 */
Route::post('/admindashboard', [App\Http\Controllers\VN_UserController::class, 'AdminDashboard']);

/**
 * @SWG\Post(
 *   path="/adminchange",
 *   summary="Change user role",
 *   tags={"Users"},
 *   @SWG\Parameter(
 *     name="id",
 *     in="formData",
 *     type="integer",
 *     required=true,
 *     description="Admin user ID"
 *   ),
 *   @SWG\Parameter(
 *     name="granted",
 *     in="formData",
 *     type="integer",
 *     required=true,
 *     description="User ID to change role"
 *   ),
 *   @SWG\Response(response=200, description="User role changed successfully"),
 *   @SWG\Response(response=400, description="You're not allowed"),
 * )
 */
Route::post('/adminchange', [App\Http\Controllers\VN_UserController::class, 'changeRole']);

/**
 * @SWG\Get(
 *   path="/deliverytracker/{numero}",
 *   summary="Get delivery tracking information",
 *   tags={"Deliveries"},
 *   @SWG\Parameter(
 *     name="numero",
 *     in="path",
 *     description="Delivery number",
 *     required=true,
 *     type="string"
 *   ),
 *   @SWG\Response(response=200, description="Delivery tracking information retrieved successfully"),
 *   @SWG\Response(response=404, description="Delivery not found")
 * )
 */
Route::get('/deliverytracker/{numero}', [App\Http\Controllers\MC_DeliveryController::class, 'showStep']);

/**
 * @SWG\Post(
 *   path="/deliveries",
 *   summary="Create a new delivery",
 *   tags={"Deliveries"},
 *   @SWG\Parameter(
 *     name="delivery",
 *     in="formData",
 *     type="object",
 *     required=true,
 *     description="Delivery data",
 *     @SWG\Property(property="phone", type="string"),
 *     @SWG\Property(property="address", type="string"),
 *     @SWG\Property(property="city", type="string"),
 *     @SWG\Property(property="country", type="string"),
 *     @SWG\Property(property="zipcode", type="string"),
 *     @SWG\Property(property="email", type="string"),
 *     @SWG\Property(property="name", type="string"),
 *   ),
 *   @SWG\Parameter(
 *     name="panier",
 *     in="formData",
 *     type="array",
 *     required=true,
 *     description="Cart items",
 *     @SWG\Items(
 *       type="object",
 *       @SWG\Property(property="item_id", type="integer"),
 *       @SWG\Property(property="quantity", type="integer"),
 *     )
 *   ),
 *   @SWG\Parameter(
 *     name="prices",
 *     in="formData",
 *     type="object",
 *     required=true,
 *     description="Price data",
 *     @SWG\Property(property="shippingRate", type="number"),
 *     @SWG\Property(property="solo", type="number"),
 *     @SWG\Property(property="totalPrice", type="number"),
 *   ),
 *   @SWG\Response(response=201, description="Delivery created successfully"),
 *   @SWG\Response(response=400, description="Bad request"),
 * )
 */
Route::post('/createDelivery', [App\Http\Controllers\VN_DeliveryController::class, 'create']);

/**
 * @SWG\Post(
 *   path="/downloadTable/{table}",
 *   summary="Download database table as CSV",
 *   tags={"Download"},
 *   @SWG\Parameter(
 *     name="table",
 *     in="path",
 *     type="string",
 *     required=true,
 *     description="Table name"
 *   ),
 *   @SWG\Response(response=200, description="CSV file download"),
 *   @SWG\Response(response=404, description="Table not found"),
 * )
 */
Route::post('/downloadTable/{table}', [App\Http\Controllers\MC_DownloadController::class, 'downloadTable']);

Route::get('/oldaddresses/{email}', [App\Http\Controllers\MC_OldAddressesController::class, 'getOldAd']);

/**
 * @SWG\Post(
 *   path="/deliveryupdate",
 *   summary="Update delivery status",
 *   tags={"Users"},
 *   @SWG\Parameter(
 *     name="id",
 *     in="formData",
 *     type="integer",
 *     required=true,
 *     description="Delivery ID"
 *   ),
 *   @SWG\Parameter(
 *     name="status",
 *     in="formData",
 *     type="string",
 *     required=true,
 *     description="New delivery status"
 *   ),
 *   @SWG\Response(response=200, description="Delivery status updated successfully"),
 * )
 */
Route::post('/deliveryupdate', [App\Http\Controllers\VN_UserController::class, 'UpdateDelivery']);

/**
 * @SWG\Get(
 *   path="/listcards/{id}",
 *   summary="Get all payment cards for a user",
 *   tags={"Cards"},
 *   @SWG\Parameter(
 *     name="id",
 *     in="path",
 *     type="integer",
 *     required=true,
 *     description="User's id"
 *   ),
 *   @SWG\Response(response=200, description="List of payment cards for the user"),
 *   @SWG\Response(response=404, description="User not found"),
 * )
 */
Route::get('/listcards/{id}', [App\Http\Controllers\MC_CardsController::class, 'getAllCards']);

/**
 * @SWG\Post(
 *   path="/commandesList",
 *   summary="Get user's commandes",
 *   tags={"Users"},
 *   @SWG\Parameter(
 *     name="email",
 *     in="formData",
 *     type="string",
 *     required=true,
 *     description="User's email"
 *   ),
 *   @SWG\Response(response=203, description="User's commandes"),
 * )
 */
Route::post('/commandesList', [App\Http\Controllers\VN_UserController::class, 'getCommandes']);

/**
 * @SWG\Get(
 *   path="/deliveries/{id}",
 *   summary="Get the details of a command",
 *   tags={"Deliveries"},
 *   @SWG\Parameter(
 *     name="id",
 *     in="path",
 *     type="integer",
 *     required=true,
 *     description="Delivery ID"
 *   ),
 *   @SWG\Response(
 *     response=200,
 *     description="Command details",
 *     @SWG\Schema(
 *       @SWG\Property(property="items", type="array", @SWG\Items(ref="#/definitions/DeliveryContent")),
 *       @SWG\Property(property="price", ref="#/definitions/Delivery")
 *     )
 *   ),
 *   @SWG\Response(response=404, description="Delivery not found"),
 * )
 */
Route::get('/commande/{id}', [App\Http\Controllers\VN_DeliveryController::class, 'getCommand']);
Route::post('/carte/{number}', [App\Http\Controllers\MC_BanCardsController::class, 'checkCard']);
Route::post('/addbancard/{number}', [App\Http\Controllers\MC_BanCardsController::class, 'addCard']);

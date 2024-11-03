<?php

namespace App\Http\Controllers;

use App\Models\Deliveries;
use App\Models\Items;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

/**
 * Class VN_UserController
 *
 * This controller handles users
 */
class VN_UserController extends Controller
{
    /**
     * Register a new user.
     *
     * @param \Illuminate\Http\Request $req The HTTP request object.
     * @return \Illuminate\Http\JsonResponse
     *
     * @SWG\Post(
     *     path="/register",
     *     summary="Register a new user",
     *     tags={"Users"},
     *     @SWG\Parameter(
     *         name="email",
     *         in="formData",
     *         type="string",
     *         required=true,
     *         description="User email"
     *     ),
     *     @SWG\Parameter(
     *         name="name",
     *         in="formData",
     *         type="string",
     *         required=true,
     *         description="User name"
     *     ),
     *     @SWG\Parameter(
     *         name="password",
     *         in="formData",
     *         type="string",
     *         required=true,
     *         description="User password"
     *     ),
     *     @SWG\Parameter(
     *         name="country",
     *         in="formData",
     *         type="string",
     *         required=true,
     *         description="User country"
     *     ),
     *     @SWG\Parameter(
     *         name="city",
     *         in="formData",
     *         type="string",
     *         required=true,
     *         description="User city"
     *     ),
     *     @SWG\Parameter(
     *         name="adress",
     *         in="formData",
     *         type="string",
     *         required=true,
     *         description="User address"
     *     ),
     *     @SWG\Parameter(
     *         name="zipcode",
     *         in="formData",
     *         type="string",
     *         required=true,
     *         description="User ZIP code"
     *     ),
     *     @SWG\Parameter(
     *         name="phone",
     *         in="formData",
     *         type="string",
     *         required=true,
     *         description="User phone"
     *     ),
     *     @SWG\Response(
     *         response=200,
     *         description="User registered successfully"
     *     ),
     *     @SWG\Response(
     *         response=401,
     *         description="User already exists"
     *     )
     * )
     */
    public function register(Request $req)
    {
        $email = $req->input('email');
        $name = $req->input('name');
        $result = User::where('email', '=', $email)
            ->orWhere('name', '=', $name)->get();
        if ($result->isNotEmpty()) {
            if ($result[0]['email'] === $email) {
                return response()->json(['error_mail' => 'Cette adresse mail est déjà utilisée !'], 401);
            } else {
                return response()->json(['error_name' => 'Ce nom est déjà utilisé'], 401);
            }
        }
        $user = new User();
        $password = $req->input('password');
        $user->name = $req->input('name');
        $user->email = $req->input('email');
        $user->country = $req->input('country');
        $user->city = $req->input('city');
        $user->adress = $req->input('adress');
        $user->password = Hash::make($password);
        $user->zipcode = $req->input('zipcode');
        $user->phone = $req->input('phone');
        $user->isAdmin = true;
        $user->save();
        $user = User::latest('id')->first();
        return response()->json(['success' => $user], 200);
    }

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
     *     description="User name or email"
     *   ),
     *   @SWG\Parameter(
     *     name="user_password",
     *     in="formData",
     *     type="string",
     *     required=true,
     *     description="User password"
     *   ),
     *   @SWG\Response(response=200, description="User successfully logged in"),
     *   @SWG\Response(response=401, description="Invalid credentials"),
     * )
     */
    public function login(Request $req)
    {
        $login = $req->input('login_user');
        $password = $req->input('user_password');
        $user = User::where('name', "=", $login)->orWhere('email', '=', $login)->get();
        if ($user->isNotEmpty()) {
            if (Hash::check($password, $user[0]->password)) {
                return response()->json(['success' => $user], 200);
            } else {
                return response()->json(['error' => 'Le mot de passe ne correspond pas'], 401);
            }
        } else {
            return response()->json(['error' => "Aucun compte n'est associé"], 401);
        }
    }

    /**
     * @SWG\Post(
     *   path="/admin/dashboard",
     *   summary="Admin dashboard",
     *   tags={"Users"},
     *   @SWG\Parameter(
     *     name="id",
     *     in="formData",
     *     type="integer",
     *     required=true,
     *     description="Admin user's ID"
     *   ),
     *   @SWG\Response(response=200, description="Admin dashboard data"),
     *   @SWG\Response(response=400, description="You're not allowed"),
     * )
     */
    public function AdminDashboard(Request $req)
    {
        $auth = User::find($req->id);
        if (!$auth->isAdmin) {
            return response("You're not allowed", 400);
        }
        $users = User::all();
        $items = Items::join('items_photos', 'items.id', '=', 'items_photos.item_id')->where('items.stocks', '=', 0)->get();
        $deliveries = Deliveries::orderBy('id', 'desc')->get();
        $results = ['users' => $users, 'items' => $items, 'deliveries' => $deliveries];
        return response()->json($results, 200);
    }

    /**
     * @SWG\Post(
     *   path="/change-role",
     *   summary="Change user's role",
     *   tags={"Users"},
     *   @SWG\Parameter(
     *     name="id",
     *     in="formData",
     *     type="integer",
     *     required=true,
     *     description="Admin user's ID"
     *   ),
     *   @SWG\Parameter(
     *     name="granted",
     *     in="formData",
     *     type="integer",
     *     required=true,
     *     description="User ID to change the role for"
     *   ),
     *   @SWG\Response(response=200, description="User's role changed successfully"),
     *   @SWG\Response(response=400, description="You're not allowed"),
     * )
     */
    public function changeRole(Request $req)
    {
        $auth = User::find($req->id);
        if (!$auth->isAdmin) {
            return response("You're not allowed", 400);
        }
        $admin = User::find($req->granted);
        if (!$admin->isAdmin) {
            $admin->isAdmin = true;
        } else {
            $admin->isAdmin = false;
        }
        $admin->save();
        $users = User::all();
        return response()->json(['users' => $users], 200);
    }

    /**
     * @SWG\Post(
     *   path="/update-delivery",
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
    public function UpdateDelivery(Request $req)
    {
        $delivery = Deliveries::find($req->id);
        $delivery->status = $req->status;
        $delivery->save();
        $deliveries = Deliveries::orderBy('id', 'desc')->get();
        return response($deliveries);
    }

    /**
     * @SWG\Post(
     *   path="/get-commandes",
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
    public function getCommandes(Request $request)
    {
        $commandes = Deliveries::where('deliveries.email', '=', $request->input('email'))->get();
        return response($commandes, 203);
    }
}

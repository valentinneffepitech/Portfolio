<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

/**
 * Class MC_UserController
 *
 * This controller handles user management
 */
class MC_UserController extends Controller
{
    /**
     * Update user's data.
     *
     * @param \Illuminate\Http\Request $request The HTTP request object.
     * @param int $id User's ID.
     * @return \Illuminate\Http\JsonResponse
     *
     * @SWG\Put(
     *     path="/users/{id}",
     *     summary="Update user's data",
     *     tags={"Users"},
     *     @SWG\Parameter(
     *         name="id",
     *         in="path",
     *         type="integer",
     *         required=true,
     *         description="User's ID"
     *     ),
     *     @SWG\Parameter(
     *         name="name",
     *         in="formData",
     *         type="string",
     *         description="User's name"
     *     ),
     *     @SWG\Parameter(
     *         name="courriel",
     *         in="formData",
     *         type="string",
     *         description="User's email"
     *     ),
     *     @SWG\Parameter(
     *         name="password",
     *         in="formData",
     *         type="string",
     *         description="User's password"
     *     ),
     *     @SWG\Parameter(
     *         name="zipcode",
     *         in="formData",
     *         type="string",
     *         description="User's zipcode"
     *     ),
     *     @SWG\Parameter(
     *         name="phone",
     *         in="formData",
     *         type="string",
     *         description="User's phone number"
     *     ),
     *     @SWG\Response(
     *         response=200,
     *         description="User's data updated successfully",
     *         @SWG\Schema(ref="#/definitions/User")
     *     ),
     *     @SWG\Response(
     *         response=400,
     *         description="Bad request"
     *     ),
     *     @SWG\Response(
     *         response=404,
     *         description="User not found"
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        $request->validate([
            'name' => 'nullable|string|max:255|unique:users,name,' . $id,
            'courriel' => 'nullable|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:8',
            'zipcode' => 'nullable|string|min:5|max:5',
            'phone' => 'nullable|min:10|max:10'
        ]);

        if ($request->filled('name')) {
            $user->name = $request->input('name');
        }

        if ($request->filled('courriel')) {
            $user->email = $request->input('courriel');
        }

        if ($request->filled('password')) {
            $user->password = $request->input('password');
        }

        if ($request->filled('adress')) {
            $user->adress = $request->input('adress');
        }

        if ($request->filled('city')) {
            $user->city = $request->input('city');
        }

        if ($request->filled('zipcode')) {
            $user->zipcode = $request->input('zipcode');
        }

        if ($request->filled('country')) {
            $user->country = $request->input('country');
        }

        if ($request->filled('phone')) {
            $user->phone = $request->input('phone');
        }

        try {
            $user->save();
        } catch (\Throwable $th) {
            return response('pb save', 401);
        }

        return response()->json(['message' => 'Mise à jour réussie', 'user' => $user], 200);
    }

    /**
     * Get user's data by ID.
     *
     * @param int $id User's ID.
     * @return \Illuminate\Http\JsonResponse
     *
     * @SWG\Get(
     *     path="/users/{id}",
     *     summary="Get user's data by ID",
     *     tags={"Users"},
     *     @SWG\Parameter(
     *         name="id",
     *         in="path",
     *         type="integer",
     *         required=true,
     *         description="User's ID"
     *     ),
     *     @SWG\Response(
     *         response=200,
     *         description="User's data",
     *         @SWG\Schema(ref="#/definitions/User")
     *     ),
     *     @SWG\Response(
     *         response=404,
     *         description="User not found"
     *     )
     * )
     */
    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        return response()->json(['user' => $user], 200);
    }

    /**
     * Delete user by ID.
     *
     * @param \Illuminate\Http\Request $request The HTTP request object.
     * @param int $id User's ID.
     * @return \Illuminate\Http\JsonResponse
     *
     * @SWG\Delete(
     *     path="/users/{id}",
     *     summary="Delete user by ID",
     *     tags={"Users"},
     *     @SWG\Parameter(
     *         name="id",
     *         in="path",
     *         type="integer",
     *         required=true,
     *         description="User's ID"
     *     ),
     *     @SWG\Response(
     *         response=200,
     *         description="User deleted successfully"
     *     ),
     *     @SWG\Response(
     *         response=404,
     *         description="User not found"
     *     )
     * )
     */
    public function delete(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        try {
            $user->delete();
            return response()->json(['message' => 'Utilisateur supprimé avec succès'], 200);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Erreur lors de la suppression de l\'utilisateur'], 401);
        }
    }
}

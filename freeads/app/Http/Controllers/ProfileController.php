<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Image;
use App\Models\Annonce;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function index(){
        $user = Auth::user();
        $annonces = Annonce::where('id_user', '=', $user->id)->get();
        $images = [];
        foreach($annonces as $annonce){
            $preimages = Image::where('id_annonce', '=', $annonce->id)->get();
            foreach($preimages as $preimage){
                $images[$annonce->id][] = $preimage->lien;
            }
        }
        return view('profile', [
            'annonces'=> $annonces,
            'images'=> $images
        ]);
    }

    public function update(Request $request){
        $user = Auth::user();
        $request = [
            'email'=>$request->mail,
            'name'=>$request->name,
            'password'=>Hash::make($request->password)
        ];
        foreach($request as $key=>$req){
            if($req !== '' && $req !== NULL){
                $user->update([
                    $key=>$req
                ]);
            }
        }
        $user->update([

            'updated_at'=>now()
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Image;
use App\Models\Annonce;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AnnoncesController extends Controller
{
    public function index(){
        return view('addannonce');
    }

    public function add(Request $request){
        $user = Auth::user()->id;
        $files = $request->annonce_pics;
        $annonce = new Annonce();
        $annonce->titre = $request->input('annonce_name');
        $annonce->prix = $request->input('annonce_price');
        $annonce->description = $request->input('annonce_desc');
        $annonce->id_user = $user;
        $annonce->save();
        $lastannonce = Annonce::latest('id')->first();
        $lastannonce = $lastannonce->id;
        if($files !== []){
            foreach ($files as $file) {
                $image = new Image();
                $path = $file->store('public/storage');
                $image->lien = $path;
                $image->id_annonce = $lastannonce;
                $image->save();
            }
        }
        return redirect('/profile');
    }

    public function delete($id){
        $annonce = Annonce::find($id);
        $annonce->delete();

        return redirect('/profile');
    }


    public function update(Request $request, $id){
        echo $id;
        $annonce = Annonce::find($id);
        $sub = [
            'titre' => $request->modify_title,
            'description' => $request->modify_desc,
            'prix' => $request->modify_price
        ];
        $annonce->update($sub);
        $annonce = Annonce::find($id);
        
        return redirect('/profile');
    }
}

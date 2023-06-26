<?php

namespace App\Http\Controllers;

use App\Models\Image;
use App\Models\Annonce;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $user = Auth::user();
        $annonces = Annonce::latest('id')->get();
        $images = [];
        foreach($annonces as $annonce){
            $preimages = Image::where('id_annonce', '=', $annonce->id)->get();
            foreach($preimages as $preimage){
                $images[$annonce->id][] = $preimage->lien;
            }
        }
        return view('home', [
            'annonces'=> $annonces,
            'images'=> $images
        ]);
    }

    public function search(Request $search){
        $searchTerm = $search->search;
        $annonces = DB::table('annonces')->where(function($query) use ($searchTerm){
            $query->where('titre', 'like', '%'.$searchTerm.'%')->orWhere('description', 'like', '%'.$searchTerm.'%');
        })->get();
        $images = [];
        foreach($annonces as $annonce){
            $preimages = Image::where('id_annonce', '=', $annonce->id)->get();
            foreach($preimages as $preimage){
                $images[$annonce->id][] = $preimage->lien;
            }
        }
        echo json_encode($annonces);
    }

    public function getImages($id){
        $searchTerm = $id;
        $images = DB::table('images')->where('id_annonce', '=', $searchTerm)->get();
        echo json_encode($images);
    }
}

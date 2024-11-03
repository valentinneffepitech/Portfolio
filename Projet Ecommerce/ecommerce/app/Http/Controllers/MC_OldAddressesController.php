<?php

namespace App\Http\Controllers;

use App\Models\Addresses;
use App\Models\Deliveries;
use Illuminate\Http\Request;

class MC_OldAddressesController extends Controller
{
    public function getOldAd($id)
    {
        $oldaddr = Deliveries::select('address', 'city', 'zipcode', 'country', 'phone')
            ->where('email', $id)
            ->groupBy('address')
            ->get();
        return response()->json($oldaddr);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function index(){
        $user = Auth::id();
        $messages = Message::join('users', 'users.id', "=", 'messages.id_user_from')
        ->select('messages.*', 'users.name')
        ->where('id_user_to', '=', $user)
        ->orderBy('id', 'desc')
        ->get();
        return view('message', [
            'messages' => $messages
        ]);
    }

    public function send($id){
        $user = Auth::id();
        if(intval($id) !== $user){
            $user_to = User::find($id);
            return view('discussion', [
                'destinataire'=>$user_to,
            ]);
        } else {
            return redirect('/message');
        }
    }

    public function get($id){
        $user = Auth::id();
        $messages = Message::where(function ($query) use ($user, $id) {
            $query->where('id_user_from', '=', $user)
                  ->where('id_user_to', '=', $id);
        })
        ->orWhere(function ($query)  use ($user, $id){
            $query->where('id_user_from', '=', $id)
                  ->where('id_user_to', '=', $user);
        })
        ->get();

        echo json_encode($messages);
    }

    public function postMessage(Request $request){
        $user = Auth::id();
        $message = new Message();
        $message->id_user_from = $user;
        $message->id_user_to = $request->id_user_to;
        $message->content = $request->content;
        $message->created_at = now();
        $message->save();
    }
}

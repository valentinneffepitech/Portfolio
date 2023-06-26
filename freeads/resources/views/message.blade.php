@extends('layouts.app')

@section('content')

<h1>Votre Messagerie</h1>
<h3>Vos messages reçus</h3>
<div id="messagerie" class="container">
    @foreach($messages as $message)
    <a href="/message/{{$message->id_user_from}}" title="Accéder aux messages">
        <div class="message_entry">
            <h5>
                {{$message->name}}
            </h5>
            <p>
                {{$message->content}}
            </p>
        </div>
    </a>
    @endforeach
</div>

@endsection
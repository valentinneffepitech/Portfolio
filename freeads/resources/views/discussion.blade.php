@extends('layouts.app')

@section('content')

<div class="container">
    <h4>Vos échanges avec {{$destinataire->name}}</h4>
    <div id="message_recus">

    </div>
    <form id="zone_text" class="flex-row" action="/message/post/">
    {{ csrf_field() }}
        <textarea id="content" name="content" placeholder="Rédigez votre message pour {{$destinataire->name}}"></textarea>
        <button id="send_message" class="btn btn-primary">Envoyer</button>
    </form>
</div>

@vite(['resources/js/messagerie.js'])

@endsection
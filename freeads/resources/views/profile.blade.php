@extends('layouts.app')

@section('content')
<div id="Overlay">
    <form id="annonce_modifier" action="annonce/modify/">
        <input id="modify_title" name="modify_title" type="text">
        <textarea id="modify_desc" name="modify_desc" id=""></textarea>
        <input id="modify_price" name="modify_price" type="number">
        <button id="modify_annonce" class="btn btn-success">Modifier l'annonce</button>
    </form>
    <form action="annonce/delete/" id="annonce_delete">
        <button id="delete_annonce" class="btn btn-danger">Supprimer l'annonce</button>
    </form>
</div>

<h1 id="name">{{Auth::user()->name}}</h1>
<h4 id="mail">{{Auth::user()->email}}</h4>
<form action="/profile/update" method="POST" id="form_profil" class="flex">
    {{ csrf_field() }}
    <h6>Modifier vos informations:</h6>
    <input id="update_mail" name="email" type="text" placeholder="Modifier votre E-mail">
    <input id="update_name" name="name" type="text" placeholder="Modifier votre nom">
    <input id="update_password" name="password" type="password" placeholder="Modifier votre mot de passe">
    <button id="submit_profil" class="btn">Enregistrer les modifications</button>
</form>
<h4>Vos annonces</h4>
<div class="annonces">
    @foreach ($annonces as $annonce)
    <div class="annonce perso_annonce" data-annonce='{{$annonce->id}}'>
        <h2>{{ $annonce->titre }}</h2>
        <h6>{{$annonce->prix}} €</h6>
        <p>{{$annonce->description}}</p>
        <div class="images_annonce">
            @if (isset($images[$annonce->id]))
            @foreach ($images[$annonce->id] as $image)
            @php
            $image = str_replace("public", "storage", $image);
            @endphp
            <img src="{{$image}}">
            @endforeach
            @endif
        </div>
    </div>
    @endforeach
</div>
@vite(['resources/js/test.js'])
@endsection
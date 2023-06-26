@extends('layouts.app')

@section('content')
<form action="/home/search" method='POST' id="searchzone">
    {{ csrf_field() }}
    <input type="text" id="searchbar" name="searchbar" placeholder="Rechercher">
</form>
<input type="number" id="prix_min" name="prix_min" min="0" placeholder="Prix minimum">
<input type="number" id="prix_max" name="prix_max" placeholder="Prix maximum">
<div class="annonces_home">
    @foreach ($annonces as $annonce)
    @php
        $date = strtotime($annonce->created_at);
        $date = date('d/m/Y à H:i', $date)
    @endphp
    <div class="annonce" data-annonce='{{$annonce->id}}'>
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
        <a href="/message/{{ $annonce->id_user }}"><button class="btn" data-vendeur="{{ $annonce->id_user }}">Contacter le vendeur</button></a>
        <div class="date">Postée le {{$date}}</div>
    </div>
    @endforeach
</div>
@vite(['resources/js/home.js'])
@endsection
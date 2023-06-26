@extends('layouts.app')

@section('content')
<h1 id="name">Votre nouvelle annonce</h1>
<form action="/annonce/add/active" method="POST" id="form_annonce_add" class="flex" enctype="multipart/form-data">
    {{ csrf_field() }}
    <input type="text" name="annonce_name" id="annonce_name" placeholder="Le titre de votre annonce">
    <textarea type="text" name="annonce_desc" placeholder="La description de votre annonce" id="annonce_desc"></textarea>
    <input type="file" id="annonce_pics" name="annonce_pics[]" accept="image/*" multiple>
    <div id="form_sub">
        <label for="annonce_pics">Add Pics</label>
        <input id="annonce_price" name="annonce_price" type="number" placeholder="prix" min="0">
    </div>

    <button id="submit_annonce" class="btn">Poster mon annonce</button>
    <div id="annonce_preview"></div>
</form>
@vite(['resources/js/addannonce.js'])
@endsection
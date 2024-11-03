<?php include("../VIEW/header.html"); ?>

<link href="../view/searchBar.css" rel="stylesheet">
<script type="text/javascript" src="../controller/seachbarFunctions.js"></script>
<script type="text/javascript" src="../controller/jquery-3.6.4.min.js"></script>

<div class="row">
    <div class="col-3">
    </div>
    <div class="col-6">
        <div class="d-flex justify-content-center">
            <img src="../ASSET/spotifylogo.png">
        </div>
        <div class="mainSearchBarContainer"><input placeholder="Start looking for your new favorite song!" type="text" class="form-control mainSearchBar" id="searchBar" oninput="dynamicSearch()"></div>
        <ul class="nav nav-tabs" id="categorySelector">
        <li class="nav-item">
            <a class="nav-link active" id="album" href="#">Album</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" id="genre" href="#">Genre</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" id="artiste" href="#">Artiste</a>
        </li>
        </ul>
        <table id="resultsTable" class="table table-striped">
        </table>
            
        <div class="d-flex justify-content-center">
            <nav aria-label="..."><ul class="pagination d-flex flex-wrap" id="pageBar"></ul></nav>
        </div>
    </div>
    <div class="col-3">
    </div>
    </div>

<?php include("../VIEW/footer.html"); ?>
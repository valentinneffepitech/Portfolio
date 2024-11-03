<!DOCTYPE html>
<html  lang="fr" >
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
    <link rel="stylesheet" href="./style.css">
    <script src="https://kit.fontawesome.com/85b29ddbe0.js" crossorigin="anonymous"></script>
    
    <title>Spotify</title>
</head>
<body>
    <!-- Nav Bar -->
    <nav class="navbar">
  <div class="container-fluid">   
      <a class="navbar-brand">
      <a class="navbar-brand" href="accueil.php"><img src="../ASSET/spotifylogo.png" width="20%" alt="Spotify"></a>
    <form class="d-flex" role="search">
      <a href="./searchBar.php">
        <i id="search" class="fa-solid fa-magnifying-glass"></i></a>
    </form>
  </div>
</nav>
    <main class="d-flex">
    <aside>
    <div class="d-flex flex-column">
    <div class="card text-center mb-3" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">Les Albums</h5>
        <p class="card-text">Envie de découvrir des nouveaux albums ?</p>
        <a href="./list_album.php?page=1&limit=10" class="btn ">Je découvre</a>
      </div>
    </div>
    <div class="card text-center mb-3" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">Les genres</h5>
        <p class="card-text">Envie de découvrir des nouveaux genre ?</p>
        <a href="./list_genres.php?page=1&limit=10" class="btn">Je suis curieux</a>
      </div>
    </div>
    <div class="card text-center mb-3" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">Les artistes</h5>
        <p class="card-text">Envie de découvrir des nouveaux artistes ?</p>
        <a href="./list_artist.php?page=1&limit=10" class="btn">Oui s'il vous plait</a>
      </div>
    </div>
    </div>
    </aside>

    <!-- Section Right -->
    <section class="album">
            <div id="a"></div>
        </section>
    </main>
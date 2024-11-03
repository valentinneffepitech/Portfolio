<?php
$_GET['id'] = isset($_GET['id']) ? $_GET['id'] : 1;
?>

<!DOCTYPE html>
<html data-bs-theme="dark" lang="fr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
    <link rel="stylesheet" href="style.css">
    <script src="https://kit.fontawesome.com/85b29ddbe0.js" crossorigin="anonymous"></script>
    
    <title>Spotify</title>
</head>
<style>
    ::-webkit-scrollbar{
        display: none;
    }

    #preview{
        display: flex;
        align-items: center;
        justify-content: space-around;
    }

    ul{
        padding-left:0;
    }

    li[data-song]{
        cursor:pointer;
    }
    
    #player{
        margin: 10px 37.5%;
        width: 25%;
    }

    #album_artist{
        font-size: 1rem;
        text-decoration: underline;
        line-height: 1.2rem;
        margin-bottom: 5px;
    }
    
    #album_popularity{
        margin-top: 10px;
         margin-left : 10%;
    }

    [data-artist]{
        cursor: pointer;
    }

    #album_desc{
        width: 80%;
        margin: 10px auto;
    }

    #album_cover{
        border-radius: 5px;
        margin: 20px 0;
    }

    .album{
        max-height: 650px;
        overflow:scroll;
    }

    .navbar-brand{
      margin-left: 35%;
    }
</style>
<body>
    <!-- Nav Bar -->
    <nav class="navbar bg-body-tertiary">
  <div class="container-fluid">   
      <a class="navbar-brand" href="accueil.php"><img src="../ASSET/spotifylogo.png" width="20%" alt="Spotify"></a>
    <form class="d-flex" role="search">
      <a href="searchBar.php"><i id="search" class="fa-solid fa-magnifying-glass"></i></a>
    </form>
  </div>
</nav>
    <!-- Main --> 
    <!-- Aside / Section avec renvoi -->
    <main class="d-flex">
    <aside>
    <div class="d-flex flex-column">
    <div class="card text-center mb-3" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">Les Albums</h5>
        <p class="card-text">Envie de découvrir des nouveaux albums ?</p>
        <a href="list_album.php?page=1&limit=10" class="btn ">Je découvre</a>
      </div>
    </div>
    <div class="card text-center mb-3" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">Les genres</h5>
        <p class="card-text">Envie de découvrir des nouveaux genre ?</p>
        <a href="list_genres.php?page=1&limit=10" class="btn ">Je suis curieux</a>
      </div>
    </div>
    <div class="card text-center mb-3" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">Les artistes</h5>
        <p class="card-text">Envie de découvrir des nouveaux artistes ?</p>
        <a href="list_artist.php?page=1&limit=10" class="btn ">Oui s'il vous plait</a>
      </div>
    </div>
    </div>
    </aside>
    <!-- Section Right -->
    <section class="album">
        <div id="preview">
            <img src="" alt="cover de l'album" id="album_cover">
            <div id="list_song">

            </div>
        </div>
        <div id="album_artist"></div>
        <div id="album_desc"></div>
        <div id="album_popularity"></div>
    
        <audio src="" id="player" controls autoplay></audio>
    </section>
    </main>
    <!-- Footer -->
      <!-- Site footer -->
      <footer class="site-footer">
        <div class="container">
          <div class="row">
            <div class="col-sm-12 col-md-6">
              <h6>A propos</h6>
              <p class="text-justify">Projet Rush réalisé dans le cadre de la Web@académie. En groupe de 3.
  
              </p>
            </div>
  
            <div class="col-xs-6 col-md-3">
              <h6> Les Categories</h6>
              <ul class="footer-links">
                <li><a href="list_album.php?page=1&limit=10">Les albums</a></li>
                <li><a href="searchBar.php">La recherche</a></li>
                <li><a href="list_artist.php?page=1&limit=10">Les artistes</a></li>
                <li><a href="list_genres.php?page=1&limit=10">Les genres</a></li>
              </ul>
            </div>
  
            <div class="col-xs-6 col-md-3">
              <h6>Lien rapide</h6>
              <ul class="footer-links">
              <li><a href="#">Notre github</a></li>
                <li><a href="#">Notre école</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <hr>
        </div>
        <div class="container">
          <div class="row">
            <div class="col-md-8 col-sm-6 col-xs-12">
              <p class="copyright-text">Copyright &copy; 2023 All Rights Reserved by Valentin, Adrian, Nahéma.
              </p>
            </div>
        </div>
  </footer>
  <script type="module">
        import album from './../controller/app_album.js';

        let item = new album(<?= $_GET['id']; ?>);
    </script>
</body>
</html>
<?php include("./header.php"); ?>
    <script>
fetch("http://localhost:8000/genres").then(
    response => {
        if(response.ok === true ) return response.json();
        else return Promise.reject(`Erreur HTTP =>${response.status}`);
        }
    )
    .then(data =>{
        document.getElementById("a").innerHTML = "<ol class='list-group list-group-flush'>"
        console.log(data)
        data.forEach(e => {
            $d = e.name;   
            document.getElementById("a").innerHTML += `<li class='list-group-item'><a href="genre.php?id=${e.id}">` + $d + "</a></li>";
            console.log(e.name);
        })
        document.getElementById("a").innerHTML += `</ol>`;
    })
    .catch(err => console.log(err))
     
</script>
<?php include("./footer.php"); ?>


<?php include("header.php"); ?>
<script>
    let random = document.querySelector('#random');
    var arr = [];
    while (arr.length < 20) {
        var r = Math.floor(Math.random() * 1625) + 1;    
        if (arr.indexOf(r) === -1) arr.push(r);
    }
    arr.forEach(element=>{
        fetch("http://localhost:8000/albums/" + element).then(response=>response.json().then(data=>{
            document.querySelector('#a').innerHTML += (`<div><a href="album.php?id=${data.album.id}"><img src="${data.album.cover_small}"></a></div>`);
        }))
    })

</script>
<style>
    #a{
        width: 70vw;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }
    #a img{
        width: 13vw;
        margin: 1vh 1vw;
    }
</style>
<?php include("footer.php"); ?>
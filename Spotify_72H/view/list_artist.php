    <?php include("./header.php") ?>
    <script>
        const page = <?= $_GET['page'] ?>;
        const limit = <?= $_GET['limit'] ?>;
        const url = `http://localhost:8000/artists/?page=${page}&limit=${limit}`;
        fetch(url).then(
                response => {
                    if (response.ok === true) return response.json();
                    else return Promise.reject(`Erreur HTTP =>${response.status}`);
                }
            )
            .then(data => {
                document.getElementById("a").innerHTML = "<ol class='list-group list-group-flush'>"
                data.forEach(e => {
                    $d = e.name;
                    document.getElementById("a").innerHTML += `<li class='list-group-item'><a href="artiste.php?id=${e.id}">` + $d + "</a></li>";
                    console.log(e.name);
                })
                document.getElementById("a").innerHTML += `<li class='list-group-item' id="footer_list"><button id="previous" class="btn">Previous</button><button id="next" class="btn">Next</button></li></ol>`;
                previous();
                next();
            })
            .catch(err => console.log(err))

        function previous() {
            let previous = document.querySelector('#previous');
            let list = document.querySelector('#footer_list');
            if (window.location.href.includes('?page=1&')) {
                previous.style.display = 'none';
                list.style.display = 'flex';
                list.style.setProperty('justify-content', 'flex-end');
            }
            previous.onclick = () => {
                window.location.href = "list_artist.php?page=" + <?= $_GET['page'] - 1 ?> + "&limit=10";
            }
        }

        function next() {
            let next = document.querySelector('#next');
            if (window.location.href.includes('?page=163&')) {
                next.style.display = 'none';
            }
            next.onclick = () => {
                window.location.href = "list_artist.php?page=" + <?= $_GET['page'] + 1 ?> + "&limit=10";
            }
        }
    </script>
    <?php include("./footer.php"); ?>
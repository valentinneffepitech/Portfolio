export default class artist {
    constructor(id) {
        this.id = id;
        this.getArtist();
        this.getAlbums();
    }

    getAlbums() {
        let url = 'http://localhost:8000/albums/artist/' + this.id;
        fetch(url).then(response => response.json().then((data) => {
            this.liste = '<ul>';
            data.forEach(element => {
                this.liste += '<li data-album="' + element.id + '"><img src="' + element.cover_small + '" data-album="' + element.id + '"><p>' + element.name + '</p></li>'
            });
            this.liste += '</ul>';
            document.querySelector('#albums').innerHTML = this.liste;
            this.redirect();
        }))
    }

    getArtist() {
        let url = 'http://localhost:8000/artists/' + this.id;
        fetch(url).then(response => response.json().then((data) => {
            document.querySelector('#artist_name').innerHTML = '<h4>' + data.name + '</h4>';
            document.querySelector('#artist_desc').textContent = '"' + data.description + '"'
            document.querySelector('#artist_bio').textContent = data.bio
            document.querySelector('#profil_picture').setAttribute('src', data.photo)     
        }))
    }

    redirect(){
        document.onclick = (e)=>{
            if (e.target.getAttribute('data-album')){
                window.location.href = 'album.php?id=' + e.target.getAttribute('data-album');
            }
        }
    }
}
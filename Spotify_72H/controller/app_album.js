export default class album {

    constructor(id) {
        this.baseUrl = 'http://localhost:8000/albums';
        this.id = id;
        this.fetchAlbum(this.id);
    }

    infoAlbum(id) {
        fetch(this.baseUrl).then(response => response.json().then((data) => {
            data.forEach(album => {
                if (album.id == id) {
                    this.name = album.name;
                    this.description = album.description;
                    this.cover = album.cover;
                    this.artistid = album.artist_id;
                    this.popularity = album.popularity;
                    fetch('http://localhost:8000/artists').then(response => response.json().then((artists) => {
                        artists.forEach(artist => {
                            if (artist.id == this.artistid) {
                                this.artist = artist.name;
                                document.querySelector('#album_artist').innerHTML = '<span data-artist = "' + this.artistid + '">By ' + this.artist + '</span>'
                                document.querySelector('#album_desc').innerHTML = this.description
                                document.querySelector('#album_cover').setAttribute('src', this.cover)
                                document.querySelector('#album_popularity').innerHTML = 'N°' + this.popularity + ' au box-office';
                                document.querySelector('title').textContent = this.name;
                                this.redirect();
                            }
                        })
                    }))
                }
            })
        }))
    }

    fetchAlbum(id) {
        fetch(this.baseUrl).then(response => response.json().then((data) => {
            data.forEach(element => {
                if (element.id == id) {
                    this.album = element.name;
                    fetch(this.baseUrl + '/' + id).then(response => response.json().then((names) => {
                        this.string = '<ol>';
                        (names.tracks).forEach(track => {
                            this.string += '<li data-song="' + track.mp3 + '">' + track.name + '</li>'
                        });
                        this.string += '</ol>';
                        document.querySelector('#list_song').innerHTML = '<h4>' + this.album + '</h4><br>' + this.string;
                        this.playsong();
                        this.infoAlbum(this.id);
                    }))
                }
            });
        }));
    }

    playsong() {
        let songs = document.querySelectorAll('li[data-song]');
        let audio = document.querySelector('#player');
        songs.forEach(song => {
            song.onclick = (e) => {
                let link = e.target.getAttribute('data-song');
                audio.setAttribute('src', link);
                audio.play();
            }
        })
    }

    redirect(){
        document.onclick = (e)=>{
            console.log(e.target);
            if (e.target.getAttribute('data-artist')){
                window.location.href = 'artiste.php?id=' + e.target.getAttribute('data-artist');
            }
        }
    }
}



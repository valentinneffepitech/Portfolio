export default class genre {

    constructor(id) {
        this.baseUrl = 'http://localhost:8000/genres';
        this.id = id;
        this.completeList = [];
        this.fetchGenre(this.id);
    }
    
    fetchGenre(id) {
        fetch(this.baseUrl + '/' + id).then(response => response.json().then((data) => {
            this.genre = data.genre.name;
            document.querySelector('title').textContent = this.genre;
            this.liste = [];
            (data.albums).forEach(element => {
                this.liste.push(element);
            });
            this.liste.forEach(list=>{
                fetch('http://localhost:8000/albums/' + list).then(response=>response.json().then((datas)=>{
                    let options = {
                        cover: datas.album.cover_small,
                        name: datas.album.name,
                        id: datas.album.id
                    }
                    this.completeList.push(options);
                    this.listing();
                    this.redirect();
                }))
            })
        }));
    }

    listing(){
        let listing = '<ul>';
        this.completeList.forEach(liste=>{
            console.log(liste);
            listing += '<li data-album="' + liste.id + '"><img data-album="' + liste.id + '" src="' + liste.cover + '">' + liste.name + '<li>'
        })
        listing +='</ul>';
        document.querySelector('#albums').innerHTML = listing;
    }


    redirect(){
        let albums = document.querySelectorAll('li[data-album]');
        albums.forEach(element => {
            if (!element.getAttribute('data-album')) {
                element.remove();
            }            
        });
        albums.forEach(album=>{
            album.onclick = (e)=>{
                let url = e.target.getAttribute('data-album');
                if (url !== null){
                    window.location.href = 'album.php?id=' + url;
                }
            }
        })
    }
}
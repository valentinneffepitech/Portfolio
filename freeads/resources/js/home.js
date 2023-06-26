function AnnonceHomeManager() {
    let searchbar = document.querySelector('#searchbar');
    let display = document.querySelector('.annonces_home');
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/home/search/');
    xhr.setRequestHeader('X-CSRF-TOKEN', document.querySelector('meta[name="csrf-token"]').getAttribute('content'));
    let form = new FormData();
    form.append('search', searchbar.value);
    xhr.onload = () => {
        let reponse = xhr.responseText;
        reponse = JSON.parse(reponse);
        let html = '';
        reponse.forEach(element => {
            let xml = new XMLHttpRequest();
            xml.open('GET', "home/images/" + element.id);
            xml.setRequestHeader('X-CSRF-TOKEN', document.querySelector('meta[name="csrf-token"]').getAttribute('content'));
            xml.onload = () => {
                let img = '<div class="images_annonce">'
                if (xml.responseText !== '') {
                    JSON.parse(xml.responseText).forEach(elem => {
                        let src = elem.lien.replace('public', 'storage');
                        img += "<img src='" + src + "'>";
                    })
                    console.log(img)
                }
                img += "</div>";
                html += '<div class="annonce" data-annonce="' + element.id + '"><h2>' + element.titre + '</h2><h6>' + element.prix + ' €</h6><p>' + element.description + '</p>' + img + '<a href="/message/' + element.id_user + '"><button class="btn">Contacter le vendeur</button></a></div>';
                display.innerHTML = html;
                priceFilter();
            }
            xml.send();
        });
    }
    xhr.send(form);
}

document.querySelector('#searchbar').oninput = () => {
    AnnonceHomeManager();
}

function priceFilter() {
    let display = document.querySelector('.annonces_home');
    let min = document.querySelector('#prix_min');
    let max = document.querySelector('#prix_max');
    let annonces = document.querySelectorAll('.annonce');
    let prix;

    annonces.forEach(element => {
        element.style.display = "block";
        if (max.value !== '') {
            if (parseInt(element.querySelector('h6').textContent) < min.value || parseInt(element.querySelector('h6').textContent) > max.value) {
                element.style.display = 'none';
            }
        } else {
            if (parseInt(element.querySelector('h6').textContent) < min.value){
                element.style.display = 'none';
            }
        }
    })

}

document.querySelector('#prix_min').onchange = () => {
    console.log(document.querySelector('#prix_min').value)
    priceFilter();
}

document.querySelector('#prix_max').onchange = () => {
    console.log(document.querySelector('#prix_max').value)
    priceFilter();
}
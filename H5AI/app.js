let pathbind, sorttype, display = document.querySelector('#preview');

function adapt(element, sorting = 'name') {

    if (element == pathbind) {
        let xhrp = new XMLHttpRequest();
        xhrp.open('GET', 'history.php?path=' + pathbind);
        xhrp.onload = () => {
            let reponse = JSON.parse(xhrp.response);
            switch (sorting) {
                case 'name':
                    reponse = reponse.sort((a, b) => {
                        if (a.name < b.name) {
                            return -1;
                        }
                    });
                    break;
                case 'lastmodified':
                    reponse = reponse.sort((a, b) => {
                        if (a.lastmodified < b.lastmodified) {
                            return -1;
                        }
                    });
                    break;
                case 'size': {
                    reponse = reponse.sort((a, b) => {
                        if (a.size < b.size) {
                            return -1;
                        }
                    });
                    break;
                }
            }
            let result = document.querySelector('#results');
            let header = '<table><thead><tr><th id="title_name" class="title">Nom du fichier</th><th id="title_date" class="title">Dernière modification:</th><th id="title_size" class="title">Taille</th></tr></thead><tbody>'
            result.innerHTML = '';
            reponse.forEach(element => {
                if (element.isdir === 'true') {
                    let div = '<tr class="result"><td class="name"><span data-fold="' + element.path + element.name + '"><img src="' + element.img + '">' + element.name + '</span></td><td class="date">' + element.lastmodified + '</td><td class="size">' + element.size + '</td></tr>';
                    header += div;
                } else {
                    let div = '<tr class="result"><td class="name"><span data-extend="' + element.extension + '" data-link="' + element.path + element.name + '">' + element.icon + element.name + '</span></td><td class="date">' + element.lastmodified + '</td><td class="size">' + element.size + '</td></tr>';
                    header += div;
                }
            })

            header += '</tbody></table>'
            result.innerHTML = header;
            convert();
            sort();
        }
        xhrp.send();
    }

    else if (element.getAttribute('data-fold')) {
        let data = element.getAttribute('data-fold');
        pathbind = data;
        let xhrp = new XMLHttpRequest();
        xhrp.open('GET', 'history.php?path=' + data);
        xhrp.onload = () => {
            console.log(xhrp.responseText);
            let reponse = JSON.parse(xhrp.response);
            switch (sorting) {
                case 'name':
                    reponse = reponse.sort((a, b) => {
                        if (a.name < b.name) {
                            return -1;
                        }
                    });
                    break;
                case 'lastmodified':
                    reponse = reponse.sort((a, b) => {
                        if (a.lastmodified < b.lastmodified) {
                            return -1;
                        }
                    });
                    break;
                case 'size': {
                    reponse = reponse.sort((a, b) => {
                        if (a.size < b.size) {
                            return -1;
                        }
                    });
                    break;
                }
            }
            let result = document.querySelector('#results');
            let header = '<table><thead><tr><th id="title_name" class="title">Nom du fichier</th><th id="title_date" class="title">Dernière modification:</th><th id="title_size" class="title">Taille</th></tr></thead><tbody>'
            result.innerHTML = '';
            reponse.forEach(element => {
                if (element.isdir === 'true') {
                    let div = '<tr class="result"><td class="name"><span data-fold="' + element.path + element.name + '"><img src="' + element.img + '">' + element.name + '</span></td><td class="date">' + element.lastmodified + '</td><td class="size">' + element.size + '</td></tr>';
                    header += div;
                } else {
                    let div = '<tr class="result"><td class="name"><span data-extend="' + element.extension + '" data-link="' + element.path + element.name + '">' + element.icon + element.name + '</span></td><td class="date">' + element.lastmodified + '</td><td class="size">' + element.size + '</td></tr>';
                    header += div;
                }
            })

            header += '</tbody></table>'
            result.innerHTML = header;
            convert();
            sort();
            datecover();
        }
        xhrp.send();
    }
}

document.onclick = (e) => {
    if (e.target.getAttribute('data-fold')) {
        adapt(e.target);
    } else if (e.target.getAttribute('data-link')){
        preview(e.target.getAttribute('data-link'), e.target.getAttribute('data-extend'));
    } else if (e.target.id !== 'preview') {
        display.style.display= 'none';
    }
}

function auto() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'bootstrap.php?folder=.');
    xhr.onload = () => {
        document.querySelector('#navigator').innerHTML = xhr.responseText;
    }
    xhr.send();
    let xhrp = new XMLHttpRequest();
    pathbind = '.';
    xhrp.open('GET', 'history.php?path=.');
    xhrp.onload = () => {
        let reponse = JSON.parse(xhrp.responseText);
        reponse = reponse.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
        });
        let result = document.querySelector('#results');
        let header = '<table><thead><tr><th id="title_name" class="title">Nom du fichier</th><th id="title_date" class="title">Dernière modification:</th><th id="title_size" class="title">Taille</th></tr></thead><tbody>'
        result.innerHTML = '';
        reponse.forEach(element => {
            if (element.isdir === 'true') {
                let div = '<tr class="result"><td class="name"><img src="' + element.img + '"><span data-fold="' + element.path + element.name + '">' + element.name + '</span></td><td class="date">' + element.lastmodified + '</td><td class="size">' + element.size + '</td></tr>';
                header += div;
            } else {
                let div = '<tr class="result"><td class="name"><span data-extend="' + element.extension + '" data-link="' + element.path + element.name + '">' + element.icon + element.name + '</span></td><td class="date">' + element.lastmodified + '</td><td class="size">' + element.size + '</td></tr>';
                header += div;
            }
        })

        header += '</tbody></table>'
        result.innerHTML = header;
        convert();
        sort();
        datecover();
    }
    xhrp.send();
}

function preview(data, extension){
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'reader.php?link=' + data);
    xhr.onload = ()=>{
        if(extension == 'jpg' 
        || extension == 'jpeg'
        || extension == 'png'
        || extension == 'gif'){
            let img = document.createElement('img');
            display.innerHTML = '';
            img.setAttribute('src', data);
            img.setAttribute('width', '100%');
            display.appendChild(img);
            display.style.display = 'block';
        }
        else{
            display.textContent = '';
            display.style.display = 'block';
            display.textContent = xhr.responseText;
        }
    }
    xhr.send();
}

auto();

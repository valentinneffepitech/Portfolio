function addAnnonce() {
    let input_file = document.querySelector('input[type = file]');
    let display = document.querySelector('#annonce_preview');
    let img, listfiles;
    input_file.onchange = (e) => {
        listfiles = e.target.files;
        Array.from(listfiles).forEach(element => {
            img = document.createElement('img');
            img.src = URL.createObjectURL(element);
            display.appendChild(img);
        });
    }  
}

addAnnonce();
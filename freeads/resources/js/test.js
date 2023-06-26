function update(){
    let mail = document.querySelector('#update_mail');
    let name = document.querySelector('#update_name');
    let password = document.querySelector('#update_password');
    let newmail = document.querySelector('#mail');
    let newname = document.querySelector('#name');
    let basename = newname.textContent;
    let basemail = newmail.textContent;
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/profile/update');
    xhr.setRequestHeader('X-CSRF-TOKEN', document.querySelector('meta[name="csrf-token"]').getAttribute('content'));
    let form = new FormData();
    form.append('mail', mail.value);
    form.append('name', name.value);
    form.append('password', password.value);
    xhr.onload = ()=>{
        newmail.textContent = (mail.value === "") ?  basemail : mail.value;
        newname.textContent = (name.value === "") ?  basename : name.value;
        password.value = "";
        name.value = "";
        mail.value = "";
    }
    xhr.send(form);
}

let modifyProfile = document.querySelector('#submit_profil');

modifyProfile.onclick = (e)=>{
    e.preventDefault();
    update();
};

function updateAnnonces(){
    let annonces = document.querySelectorAll('.annonce');
    let overlay = document.querySelector('#Overlay');
    let input_title = document.querySelector('#modify_title');
    let input_desc = document.querySelector('#modify_desc');
    let input_prix = document.querySelector('#modify_price');
    let deleter = document.querySelector('#delete_annonce');
    let modifier = document.querySelector('#modify_annonce');
    let form_delete = document.querySelector('#annonce_delete');
    let form_modify = document.querySelector('#annonce_modifier');
    let idAnnonce;
    annonces.forEach(element=>{
        element.onclick = (e)=>{
            let description = element.querySelector('p').textContent;
            let titre = element.querySelector('h2').textContent;
            let price = element.querySelector('h6').textContent;
            price = parseInt(price);
            overlay.style.display = "flex";
            overlay.style.position = 'fixed';
            idAnnonce = element.getAttribute('data-annonce')
            input_title.value = titre;
            input_desc.value = description;
            input_prix.value = price;
        }
    })

    
    deleter.onclick = (e)=>{
        e.preventDefault();
        let action = form_delete.getAttribute('action') + idAnnonce;
        form_delete.setAttribute('action', action);
        let confirmate = confirm('Voulez-vous vraiment la supprimer?')
        if(confirmate){
            form_delete.submit();
        };
    }

    modifier.onclick = (e)=>{
        e.preventDefault();
        let action = form_modify.getAttribute('action') + idAnnonce;
        form_modify.setAttribute('action', action);
        if(input_title.value === '' || input_desc.value === '' || input_prix.value === ''){
            alert('Des champs sont manquants');
        } else {
            form_modify.submit();
        }
    }

    document.onclick = (e)=>{
        if(e.target.id === 'Overlay'){
            overlay.style.display = "none";
        }
    }
}

updateAnnonces();

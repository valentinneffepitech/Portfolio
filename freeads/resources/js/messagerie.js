function getMessage(){
    let url =  window.location.href;
    let xhr = new XMLHttpRequest();
    let split = url.split('/');
    let id= split[split.length-1];
    let display = document.querySelector('#message_recus');
    xhr.open('GET', '/message/get/'+id);
    xhr.onload = ()=>{
        let reponse = JSON.parse(xhr.responseText);
        console.log(reponse);
        let html = '';
        reponse.forEach(element => {
            if(element.id_user_from === parseInt(id)){
                html += '<div class="foreign_message" data-id="' + element.id_user_from + '"><p>' + element.content + '</p></div>';
            } else {
                html += '<div class="message" data-id="' + element.id_user_from + '"><p>' + element.content + '</p></div>';
            }
        });
        display.innerHTML = html;
        display.scrollTop = display.scrollHeight;
    }
    xhr.send();
}

function envoiMessage(){
    let url =  window.location.href;
    let xhr = new XMLHttpRequest();
    let form = new FormData();
    let split = url.split('/');
    let content = document.querySelector('#content');
    let id= split[split.length-1];
    form.append('content', content.value);
    form.append('id_user_to', id);
    xhr.open('POST', '/message/post/');
    xhr.setRequestHeader('X-CSRF-TOKEN', document.querySelector('meta[name="csrf-token"]').getAttribute('content'));
    xhr.onload = ()=>{
        content.value="";
        content.focus();
        getMessage();
    }
    if(content.value !== ''){
        xhr.send(form);
    }
}

document.querySelector('#send_message').onclick = (e)=>{
    e.preventDefault();
    envoiMessage();
}

document.querySelector('#content').focus();
getMessage();
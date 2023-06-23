function carousel(){
    let images = [
        "assets/6.jpg", 
        "assets/7.jpg", 
        "assets/8.jpg", 
        "assets/9.jpg", 
        "assets/10.jpg", 
        "assets/11.jpg"];
    let numero = 0;
    let next = document.getElementById("next");
    let previous = document.getElementById("forward");
    function defile(pom) {
        numero = numero + pom;
        if (numero < 0)
            numero = images.length - 1;
        else if (numero > images.length - 1)
            numero = 0;
        document.getElementById("defile").src = images[numero];
    }

    next.onclick = function(){defile(1)};
    previous.onclick = function(){defile(-1)};
}

function basic(){
    let show1 = document.getElementById('hide_book');
    let show2 = document.getElementById('hide__destination');
    show1.style.display = "none";
    show2.style.display = "none";
}

function deroule1(){
    let liste = document.getElementById('book');
    let show = document.getElementById('hide_book');
    liste.onmouseenter = function(){
        show.style.display = "block";
        liste.onmouseleave = function(){
            show.style.display = "none";
        }
    }
}

function deroule2(){
    let liste = document.getElementById('destination');
    let show = document.getElementById('hide__destination');
    liste.onmouseenter = function(){
        show.style.display = "block";
        liste.onmouseleave = function(){
            show.style.display = "none";
        }
    }
}

window.onload = function(){
    carousel();
    deroule1();
    deroule2();
    basic();
};
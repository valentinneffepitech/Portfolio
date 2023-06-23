let btnOpen = document.getElementById("btnmodal");
let depop = document.querySelectorAll(".popin-dismiss");
let Buttons = document.querySelectorAll("button[data-target]");
let tablist = document.querySelector('.tab-list');
let Onglets = document.querySelectorAll('li[data-target]');
let bulles = document.querySelectorAll('.tooltip');
let bgbtn = document.querySelectorAll('button');
let place = document.querySelectorAll('[data-placement]');
let all = document.querySelectorAll('*');

bgbtn.forEach(function (btn) {
    btn.onclick = (e) => {
        bgbtn.forEach(function (button) {
            button.removeAttribute('active');
            button.style.backgroundColor = "inherit";
        })
        e.target.setAttribute('active', "");
        e.target.style.backgroundColor = "#ccc";
    }
})

Buttons.forEach(function (button) {
    button.addEventListener("click", function (e) {

        Buttons.forEach(function (e) {
            e.style.backgroundColor = "inherit";
        })

        button.style.backgroundColor = "#ccc";

        let target = button.getAttribute("data-target");

        let modal = document.querySelector(target);

        let divs = modal.querySelectorAll("*");

        divs.forEach(function (div) {
            div.classList.add('modal');
        })

        modal.style.display = "flex";

        depop.forEach(function (button) {
            button.addEventListener("click", function () {
                modal.style.display = 'none';
            })
        })
    });
});

Onglets.forEach(function (onglet) {
    onglet.addEventListener('click', function (e) {
        
        Onglets.forEach(function (og) {
            og.style.backgroundColor = "inherit";
        })
        let target = onglet.getAttribute('data-target');

        let para = document.querySelector(target);

        if (target =="#hide") {
            onglet.style.backgroundColor = 'inherit';
        }
        else {
            onglet.style.backgroundColor = "#ccc";
        }
        
        all.forEach(function (elem) {
            elem.classList.remove('active');
        })

        if (target == "#hide") {
            para.classList.add('active');
        }
        else { 
            para.parentElement.classList.add('active');
            para.classList.add('active');
        }
    })
})

document.addEventListener("keydown", function (event) {
    modal.forEach(function (modal) {
        if (event.key == "Escape") {
            modal.style.display = "none";
            Buttons.forEach(function (but) {
                but.style.backgroundColor = 'inherit';
            })
        }
    });
})

let modal = document.querySelectorAll(".modal");

modal.forEach(function (modal) {
    window.onclick = (event) => {
        let targ = event.target.className;

        if (targ.includes("btn-modal")) {
            let target = event.target.getAttribute("data-target");

            let modal = document.querySelector(target);

            modal.style.display = "flex";
        }
        else if (!targ.includes("modal")) {
            Buttons.forEach(function (button) {
                button.style.backgroundColor = "inherit";
            })
            modal.style.display = 'none';
        }
    }
})

modal.forEach(function (modal) {
    window.onload = (e) => {
        modal.style.display = 'none';
    }
})

$(document).ready(function () {
    if ($(window).width() <= 767) {
        $('.nav-item').hide();
    }
    else {
        $('.nav-item').show();
    }
    let x = 1;
    $.fn.modal = function (e) {
        if (e == "show") {
            this.show();
        }
        else if (e == "hide") {
            this.hide();
        }
    }
    $(window).resize(function () {
        if ($(window).width() > 767) {
            $('.nav-item').show()
            x = 0;
            $('.toggler').html('Hide Menu');
        }
        else {
            $('.nav-item').hide()
            x = 1
            $('.toggler').html('Menu');
        }
    })
    $('.toggler').click(function () {
        if (x == 1) {
            $('.nav-item').slideDown();
            x = 0;
            $('.toggler').html('Hide Menu');
        }
        else if (x == 0) {
            $('.nav-item').slideUp();
            x = 1;
            $('.toggler').html('Menu');
        }
    })
})


const socket = io();
let users = [];
let board = document.getElementById('plateau');
let playerTurn;
let lock = false;
function InitPlateau(array) {
    board.innerHTML = "";
    let compteur = 0;
    for (let i = 0; i < 7; i++) {
        let ligne = document.createElement('div');
        for (let j = 0; j < 7; j++) {
            let colonne = document.createElement('div');
            colonne.classList.add('case');
            colonne.setAttribute('data-ligne', i);
            colonne.setAttribute('data-colonne', j);
            colonne.id = `col-${i}-${j}`;
            if ((i === 0 && j === 3) || (i === 6 && j === 3)) {
                let Pion = document.createElement('div');
                Pion.id = 'Pawn' + array[compteur].id;
                Pion.classList.add('Pion' + compteur)
                colonne.appendChild(Pion);
                compteur++;
            }
            ligne.appendChild(colonne)
        }
        board.appendChild(ligne);
    }
}

socket.on('game_start', data => {
    users = data.users;
    InitPlateau(data.users);
    playerTurn = data.turn;
    userHelp();
    colorizePlayableCell();
    ManageClick();
})

function userHelp() {
    if (playerTurn === socket.id) {
        document.querySelector(`#Pawn${socket.id}`).style.backgroundColor = '#f6f6f6';
        document.getElementById('turn').textContent = "C'est votre tour !";
    }
    else {
        document.querySelector(`#Pawn${socket.id}`).style.backgroundColor = '';
        document.getElementById('turn').textContent = "Au tour de votre adversaire !";
    }
}

function unColorize(){
    let colore = document.querySelectorAll('.isPlayable');
    if (colore) {
        colore.forEach(cell => {
            cell.classList.remove('isPlayable');
        })
    }
}

function colorizePlayableCell() {
    let cible = document.querySelector(`#Pawn${playerTurn}`).parentElement;
    let ligne = parseInt(cible.getAttribute('data-ligne'));
    let colonne = parseInt(cible.getAttribute('data-colonne'));
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            let testLigne = i + ligne;
            let testColonne = j + colonne;
            let targetCell = document.querySelector(`#col-${testLigne}-${testColonne}`);
            console.log(targetCell, testLigne, testColonne);
            if (targetCell) {
                if (!targetCell.classList.contains('used') && !targetCell.querySelector(`#Pawn${users[0].id}`) && !targetCell.querySelector(`#Pawn${users[1].id}`)) {
                    targetCell.classList.add('isPlayable');
                }
            }
        }
    }
}

socket.on('pionMoved', data => {
    manageMove(data.id, data.ligne, data.colonne);
    unColorize()
})

socket.on('caseBlocked', data => {
    manageBlock(data.ligne, data.colonne);
    playerTurn = data.turn;
    let activePlayer = document.querySelector(`#Pawn${playerTurn}`);
    let letHasWin = self.checkWin(parseInt(activePlayer.parentElement.getAttribute('data-ligne')), parseInt(activePlayer.parentElement.getAttribute('data-colonne')));
    if (letHasWin) {
        if (playerTurn === socket.id) {
            socket.emit('gameOver', {
                id: playerTurn
            })
            document.getElementById('turn').textContent = "Vous avez perdu !";
        } else {
            let loser = playerTurn === users[1].id ? users[1].id : users[0].id
            socket.emit('gameOver', {
                id: loser
            })
            document.getElementById('turn').textContent = "Vous avez gagné !";
        }
        return;
    }
    userHelp();
    colorizePlayableCell()
})

socket.on('GameIsOver', data => {
    alert(data.message)
})

function ManageClick() {
    let cases = document.querySelectorAll('.case');
    console.log(playerTurn, socket.id, users)
    cases.forEach(div => {
        div.onclick = () => {
            if (playerTurn !== socket.id) {
                return;
            }
            if (div.classList.contains('used') || div.querySelector(`#Pawn${users[0].id}`) || div.querySelector(`#Pawn${users[1].id}`)) {
                alert('Déjà prise !');
                return;
            }
            if (lock) {
                div.classList.add(`Pawn${playerTurn}`, 'used');
                socket.emit('block', {
                    id: playerTurn,
                    ligne: div.getAttribute('data-ligne'),
                    colonne: div.getAttribute('data-colonne')
                })
                lock = !lock;
            } else {
                if (self.checkCasa(parseInt(div.getAttribute('data-ligne')), parseInt(div.getAttribute('data-colonne')))) {
                    let pion = document.querySelector(`#Pawn${playerTurn}`);
                    let clone = pion.cloneNode(true);
                    pion.remove();
                    div.appendChild(clone);
                    socket.emit('move', {
                        id: playerTurn,
                        ligne: div.getAttribute('data-ligne'),
                        colonne: div.getAttribute('data-colonne')
                    })
                    lock = !lock;
                }
            }
        }
    })
}

function manageMove(id, ligne, colonne) {
    let pion = document.querySelector(`#Pawn${id}`);
    let clone = pion.cloneNode(true);
    pion.remove();
    document.querySelector('.case[data-ligne="' + ligne + '"][data-colonne="' + colonne + '"]').appendChild(clone);
}

function manageBlock(ligne, colonne) {
    document.querySelector('.case[data-ligne="' + ligne + '"][data-colonne="' + colonne + '"]').classList.add('used');
}

function checkCasa(ligne, colonne) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {

            if (i === 0 && j === 0) {
                continue;
            }

            const newLigne = ligne + i;
            const newColonne = colonne + j;

            if (newLigne >= 0 && newLigne < 7 && newColonne >= 0 && newColonne < 7) {
                const targetCell = document.querySelector(`.case[data-ligne="${newLigne}"][data-colonne="${newColonne}"]`);
                if (targetCell && targetCell.querySelector(`#Pawn${playerTurn}`)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function checkWin(ligne, colonne) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) {
                continue;
            }
            const newLigne = ligne + i;
            const newColonne = colonne + j;

            if (newLigne >= 0 && newLigne < 7 && newColonne >= 0 && newColonne < 7) {
                const targetCell = document.querySelector(`.case[data-ligne="${newLigne}"][data-colonne="${newColonne}"]`);
                if (targetCell && !targetCell.classList.contains('used')) {
                    return false;
                }
            }
        }
    }
    return true;
}
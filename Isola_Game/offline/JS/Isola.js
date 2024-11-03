export class Isola {

    constructor(data) {
        this.player1 = {};
        this.player2 = {};
        this.board = document.querySelector('#plateau');
        if (!data.Player1 || !data.Player2) {
            alert('Données invalides : Set par défaut');
            data.Player1 = "Error";
            data.Player2 = "Error";
        }
        this.player1.name = data.Player1.name ? data.Player1.name : "Player1";
        this.player2.name = data.Player2.name ? data.Player2.name : "Player2";
        this.InitPlateau();
        this.setMouseAction(1);
        this.turn = 1;
        this.lock = false;
        this.colors = {
            0: "#143642",
            1: "#0F8B8D"
        }
    }

    InitPlateau() {
        let self = this;
        let compteur = 1;
        for (let i = 0; i < 7; i++) {
            let ligne = document.createElement('div');
            ligne.classList.add('ligne');
            for (let j = 0; j < 7; j++) {
                let Case = document.createElement('button');
                Case.classList.add('case');
                Case.setAttribute(`data-ligne`, i);
                Case.setAttribute(`data-colonne`, j);
                if ((i === 0 && j === 3) || (i === 6 && j === 3)) {
                    let Pion = document.createElement('div');
                    Pion.id = 'Pawn' + compteur;
                    Pion.textContent = compteur === 1 ? self.player1.name : self.player2.name;
                    Case.appendChild(Pion);
                    compteur++;
                }
                ligne.appendChild(Case);
            }
            self.board.appendChild(ligne);
        }
    }

    setMouseAction(turn) {
        let cases = document.querySelectorAll('.case');
        let self = this;
        cases.forEach(div => {
            div.addEventListener("click", function () {
                if (div.classList.contains('Pawn1') || div.classList.contains('Pawn2') || div.querySelector("#Pawn1") || div.querySelector("#Pawn2")) {
                    alert('Case déjà prise !');
                    return;
                }
                if (self.lock) {
                    div.classList.add(`Pawn${self.turn}`, 'used', 'occupied');
                    self.turn = self.turn === 1 ? 2 : 1;
                    document.body.style.backgroundColor = self.turn === 1 ? self.colors[0] : self.colors[1]
                    let activePlayer = document.querySelector(`#Pawn${self.turn}`);
                    let letHasWin = self.checkWin(parseInt(activePlayer.parentElement.getAttribute('data-ligne')), parseInt(activePlayer.parentElement.getAttribute('data-colonne')));
                    if (letHasWin) {
                        if (self.turn === 1) {
                            setTimeout(() => alert(`${self.player2.name} à gagné !`), 1);
                        } else {
                            setTimeout(() => alert(`${self.player1.name} a gagné !`), 1);
                        }
                    }
                    self.lock = !self.lock;
                } else {
                    if (self.checkCasa(parseInt(div.getAttribute('data-ligne')), parseInt(div.getAttribute('data-colonne')))) {
                        let pion = document.querySelector(`#Pawn${self.turn}`);
                        let clone = pion.cloneNode(true);
                        pion.remove();
                        div.appendChild(clone);
                        self.lock = !self.lock;
                    }
                }
            })
        });
    }

    checkCasa(ligne, colonne) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) {
                    continue;
                }

                const newLigne = ligne + i;
                const newColonne = colonne + j;

                if (newLigne >= 0 && newLigne < 7 && newColonne >= 0 && newColonne < 7) {
                    const targetCell = document.querySelector(`.case[data-ligne="${newLigne}"][data-colonne="${newColonne}"]`);
                    if (targetCell && targetCell.querySelector(`#Pawn${this.turn}`)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    checkWin(ligne, colonne) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) {
                    continue;
                }
                const newLigne = ligne + i;
                const newColonne = colonne + j;

                if (newLigne >= 0 && newLigne < 7 && newColonne >= 0 && newColonne < 7) {
                    const targetCell = document.querySelector(`.case[data-ligne="${newLigne}"][data-colonne="${newColonne}"]`);
                    if (targetCell && !(targetCell.classList.contains('Pawn1') || targetCell.classList.contains('Pawn2'))) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}
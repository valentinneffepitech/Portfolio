export default class Morpion {
    constructor(object) {
        this.color1 = object.color1
        this.color2 = object.color2;
        this.activeplayer = 1;
        this.activeColor = this.color1;
        this.turn = 0;
        this.drawBoard();
        this.winner;
    }

    drawBoard() {
        let board = document.querySelector('#board');
        for (let i = 0; i < 3; ++i) {
            let ligne = document.createElement('div');
            ligne.classList.add('row');
            for (let j = 0; j < 3; j++) {
                let cell = document.createElement('div');
                cell.classList.add('cell');
                cell.setAttribute('data-ligne', i);
                cell.setAttribute('data-colonne', j);
                cell.style.backgroundColor = 'lightgray';
                ligne.appendChild(cell);
            }
            board.appendChild(ligne);
        }
        this.play();
    }

    play() {
        let self = this;
        let board = document.querySelector('#board');
        let cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.onclick = (e) => {
                board.style.setProperty('pointer-events', 'none')
                if (!e.target.classList.contains('active')) {
                    e.target.style.backgroundColor = this.activeColor;
                    this.activeColor = (this.activeColor === this.color1) ? this.color2 : this.color1;
                    if (self.checkWin()) {
                        setTimeout(() => {
                            let replay = confirm("Joueur " + this.winner + " a  gagné!");
                            if (replay) {
                                window.location.reload();
                            }
                        }, 500);
                        return;
                    }
                    this.turn++;
                    if (this.turn === 9) {
                        setTimeout(() => {
                            let replay = confirm("Match Nul!");
                            if (replay) {
                                window.location.reload();
                            }
                        }, 501)
                    }
                    this.activeplayer = (this.activeplayer === 1) ? 2 : 1;
                    e.target.classList.add('active');
                }
                board.style.setProperty('pointer-events', 'auto');
            }
        })
    }

    checkWin() {
        let cells = document.querySelectorAll('.cell');
        let result = false;
        cells.forEach(cell => {
            let ligne = parseInt(cell.getAttribute('data-ligne'));
            let colonne = parseInt(cell.getAttribute('data-colonne'));
            let color = cell.style.backgroundColor;
            let c1 = document.querySelector(`[data-ligne="${ligne + 1}"][data-colonne="${colonne}"]`) ? document.querySelector(`[data-ligne="${ligne + 1}"][data-colonne="${colonne}"]`).style.backgroundColor : 'error'
            let c2 = document.querySelector(`[data-ligne="${ligne + 2}"][data-colonne="${colonne}"]`) ? document.querySelector(`[data-ligne="${ligne + 2}"][data-colonne="${colonne}"]`).style.backgroundColor : 'error'
            let l1 = document.querySelector(`[data-ligne="${ligne}"][data-colonne="${colonne + 1}"]`) ? document.querySelector(`[data-ligne="${ligne}"][data-colonne="${colonne + 1}"]`).style.backgroundColor : 'error'
            let l2 = document.querySelector(`[data-ligne="${ligne}"][data-colonne="${colonne + 2}"]`) ? document.querySelector(`[data-ligne="${ligne}"][data-colonne="${colonne + 2}"]`).style.backgroundColor : 'error'
            let d1 = document.querySelector(`[data-ligne="${ligne + 1}"][data-colonne="${colonne + 1}"]`) ? document.querySelector(`[data-ligne="${ligne + 1}"][data-colonne="${colonne + 1}"]`).style.backgroundColor : 'error'
            let d2 = document.querySelector(`[data-ligne="${ligne + 2}"][data-colonne="${colonne + 2}"]`) ? document.querySelector(`[data-ligne="${ligne + 2}"][data-colonne="${colonne + 2}"]`).style.backgroundColor : 'error'
            let u1 = document.querySelector(`[data-ligne="${ligne - 1}"][data-colonne="${colonne + 1}"]`) ? document.querySelector(`[data-ligne="${ligne - 1}"][data-colonne="${colonne + 1}"]`).style.backgroundColor : 'error'
            let u2 = document.querySelector(`[data-ligne="${ligne - 2}"][data-colonne="${colonne + 2}"]`) ? document.querySelector(`[data-ligne="${ligne - 2}"][data-colonne="${colonne + 2}"]`).style.backgroundColor : 'error'
            if (color === c1 && color === c2 && color !== 'lightgray') {
                result = true;
                this.winner = this.activeplayer;
            }
            if (color === l1 && color === l2 && color !== 'lightgray') {
                result = true;
                this.winner = this.activeplayer;
            }
            if (color === d1 && color === d2 && color !== 'lightgray') {
                result = true;
                this.winner = this.activeplayer;
            }
            if (color === u1 && color === u2 && color !== 'lightgray') {
                result = true;
                this.winner = this.activeplayer;
            }
        })
        return result;
    }
}

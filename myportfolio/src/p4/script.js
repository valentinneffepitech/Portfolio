export default class p4 {

  static score1 = 0;
  static score2 = 0;

  constructor(selector = 'body', options = 1) {
    if (options.x!==undefined || options !== 1) {
      this.col = options.x;
    } else {
      this.col = 7;
    }
    if (options.y!==undefined || options !== 1) {
      this.row = options.y;
    } else {
      this.row = 6;
    }
    if (options.p1!==undefined || options !== 1) {
      this.p1 = options.p1;
    } else {
      this.p1 = "Player 1";
    }
    if (options.p2!==undefined || options !== 1) {
      this.p2 = options.p2;
    } else {
      this.p2 = "Player 2";
    }
    if (options.c1!==undefined || options !== 1) {
      this.c1 = options.c1;
    } else {
      this.c1 = "yellow";
    }
    if (options.c2!==undefined || options !== 1) {
      if (options.c1!==options.c2) {
        this.c2 = options.c2;
      }
      else if (options.c1==='red') {
        this.c2 = 'yellow';

      } else {
        this.c2 = "red";
      }
    }
    console.log('ready')
    this.selector = selector;
    this.jeu = document.querySelector(this.selector);
    this.compt = 0;
    this.nbturn = 1;
    this.turn = 0;
    this.gameover = 0;
    this.options = options;
    this.coups = [];
    this.drawGame();
    this.ecoute();
  }



  drawGame() {
    const jeu = document.querySelector(this.selector);
    let bouton = document.createElement('button');
    let cancel = document.createElement('button');
    bouton.classList.add('btn');
    bouton.classList.add('btn-secondary');
    cancel.classList.add('btn');
    cancel.classList.add('btn-secondary');
    let tour = document.createElement('div');
    jeu.style.setProperty('margin', '10px auto')
    tour.setAttribute('id', 'turn');
    tour.style.textAlign = 'center';
    tour.style.setProperty('margin', '10px 0')
    tour.style.fontSize = '1.5rem'
    tour.style.color = 'white';
    tour.textContent = `C'est au tour de ${this.p1}, tour: ${this.nbturn}`
    bouton.setAttribute('id', 'restart');
    bouton.textContent = 'Click to restart';
    cancel.setAttribute('id', 'cancel');
    cancel.style.setProperty('width', '20%');
    cancel.style.setProperty('margin', '10px 40%');
    cancel.textContent = 'Annuler le dernier coup';
    cancel.style.visibility = 'hidden'
    jeu.style.setProperty('background-color', 'blue');
    jeu.style.setProperty('border', 'navy 5px solid');
    jeu.style.setProperty('box-shadow', '2px 2px 2px black');
    jeu.style.width = '40%';
    jeu.appendChild(tour);
    let width = 90 / this.col;
    for (let lgn = 0; lgn < this.row; lgn++) {
      const ligne = document.createElement("div");
      ligne.classList.add("ligne");
      ligne.style.display = 'flex';
      ligne.style.setProperty('flex-wrap', 'wrap');
      for (let col = 0; col < this.col; col++) {
        const colonne = document.createElement("div");
        colonne.classList.add("tile", "empty");
        colonne.style.setProperty('border-radius', '50%');
        colonne.style.setProperty('border', '1px black solid')
        colonne.style.setProperty('margin', '5px auto');
        colonne.style.setProperty('box-shadow', 'inset 2px 2px black')
        colonne.style.setProperty('cursor', 'pointer')
        colonne.setAttribute("data-col", col);
        colonne.setAttribute("data-ligne", lgn);
        colonne.style.setProperty('aspect-ratio', '1/1');
        colonne.style.backgroundColor = 'white';
        colonne.style.width = width.toString() + "%";
        ligne.appendChild(colonne);
      }
      jeu.appendChild(ligne);
    }
    jeu.appendChild(bouton);
    jeu.appendChild(cancel);
    this.cancel = document.querySelector('#cancel');
    this.reset = document.querySelector("#restart");
    this.reset.style.display = 'none';
  }

  ecoute() {

    function lastcase(col) {
      const cells = document.querySelectorAll(`[data-col="${col}"]`);
      for (let i = cells.length - 1; i >= 0; i--) {
        const cell = cells[i];
        if (cell.classList.contains('empty')) {
          return cell;
        }
      }
    }

    const self = this;

    this.jeu.onclick = (e) => {
      if (!e.target.classList.contains('tile')) {
        return false;
      }
      if (this.gameover===1) {
        return false;
      }
      let col = e.target.getAttribute('data-col');
      let rangee = e.target.getAttribute('data-ligne');
      let test = document.querySelector('[data-col="' + col + '"][data-ligne="0"]');
      let tour = document.querySelector('#turn');
      this.tour = tour;
      if (!test.classList.contains("empty")) {
        return;
      }
      let last = lastcase(col);
      let lastligne = parseInt(last.getAttribute('data-ligne'));
      let lastcol = parseInt(last.getAttribute('data-col'));
      let souscoup = [lastligne, lastcol];
      this.coups = [souscoup];
      let lastclass = last.getAttribute('class');
      if (!lastclass.includes('empty') || lastclass===undefined) {
        return null;
      } else if (rangee===0 && e.target.style.background!=="") {
        return false;
      } else {
        if (last!==null) {
          if (this.compt===0) {
            if (lastligne > 0) {
              let prelast = document.querySelector(`[data-col='${col}'][data-ligne='${parseInt(last.getAttribute('data-ligne')) - 1}']`);
              let preligne = parseInt(prelast.getAttribute('data-ligne'));
              let tokens = document.querySelectorAll('.tile');
              tokens.forEach(function (element) {
                element.style.setProperty('pointer-events', "none");
              })
              for (let c = 0; c <= preligne; c++) {
                let timer = (c + 1) * 100;
                let pretime = (timer >= 100) ? (timer - 100) : timer;
                let element = document.querySelector(`[data-col='${col}'][data-ligne='${c}']`);
                setTimeout(() => {
                  element.classList.remove('empty');
                  element.style.backgroundColor = this.c1;
                  element.classList.add('p1');
                }, pretime);

                setTimeout(() => {
                  element.classList.add('empty');
                  element.style.backgroundColor = "white";
                  element.classList.remove('p1');
                }, timer)
              }
            }
            let prelast = ((parseInt(last.getAttribute('data-ligne')) - 1) >= 0) ? document.querySelector(`[data-col='${col}'][data-ligne='${parseInt(last.getAttribute('data-ligne')) - 1}']`) : document.querySelector(`[data-col='${col}'][data-ligne='0']`);
            let preligne = parseInt(prelast.getAttribute('data-ligne'));
            let fulltime = (lastligne > 0) ? (preligne + 1) * 100 : lastligne;
            let tokens = document.querySelectorAll('.tile');
            setTimeout(() => {
              last.classList.remove('empty');
              last.style.backgroundColor = this.c1;
              last.classList.add('p1');
              this.compt = 1;
              this.turn++;

              checkcolonne(last);
              checkrow(last);
              checkdiag();
              this.nbturn++;
              checknul();
              tokens.forEach(element => {
                element.style.setProperty('pointer-events', 'auto');
              })
              if (this.gameover===0) {
                tour.textContent = `C'est au tour de ${this.p2}, tour: ${this.nbturn}`;
              } else {
                tour.textContent = `${this.p1} a gagné !`
              }
            }, fulltime)


          } else {
            if (lastligne > 0) {
              let prelast = document.querySelector(`[data-col='${col}'][data-ligne='${parseInt(last.getAttribute('data-ligne')) - 1}']`);
              let preligne = parseInt(prelast.getAttribute('data-ligne'));
              let tokens = document.querySelectorAll('.tile');
              tokens.forEach(function (element) {
                element.style.setProperty('pointer-events', "none");
              })
              for (let c = 0; c <= preligne; c++) {
                let timer = (c + 1) * 100;
                let pretime = (timer >= 100) ? (timer - 100) : timer;
                let element = document.querySelector(`[data-col='${col}'][data-ligne='${c}']`);
                setTimeout(() => {
                  element.classList.remove('empty');
                  element.style.backgroundColor = this.c2;
                  element.classList.add('p2');
                }, pretime);

                setTimeout(() => {
                  element.classList.add('empty');
                  element.style.backgroundColor = "white";
                  element.classList.remove('p2');
                }, timer)
              }
            }
            let prelast = ((parseInt(last.getAttribute('data-ligne')) - 1) >= 0) ? document.querySelector(`[data-col='${col}'][data-ligne='${parseInt(last.getAttribute('data-ligne')) - 1}']`) : document.querySelector(`[data-col='${col}'][data-ligne='0']`);
            let preligne = parseInt(prelast.getAttribute('data-ligne'));
            let fulltime = (preligne + 1) * 100;
            let tokens = document.querySelectorAll('.tile');
            setTimeout(() => {
              last.classList.remove('empty');
              last.style.backgroundColor = this.c2;
              last.classList.add('p2');
              this.compt = 0;
              this.turn++;
              checkrow();
              checkcolonne(last);
              checkdiag();
              this.nbturn++;
              checknul();

              tokens.forEach(element => {
                element.style.setProperty('pointer-events', 'auto');
              })
              if (this.gameover===0) {
                tour.textContent = `C'est au tour de ${this.p1}, tour: ${this.nbturn}`;
              } else {
                tour.textContent = `${this.p2} a gagné !`
              }
            }, fulltime)
          }
        }
      }
    }

    function checknul() {
      if (self.gameover===0 && self.nbturn > self.row * self.col) {
        setTimeout(() => { alert('Match nul') }, 500);
        self.reset.style.display = 'flex';
        self.reset.style.setProperty('margin', '20px auto');
      }
    }

    function checkrow() {
      let tokens = document.querySelectorAll('.p1, .p2');
      tokens.forEach(element => {
        let l = parseInt(element.getAttribute('data-ligne'));
        let c = parseInt(element.getAttribute('data-col'));
        let d1 = document.querySelector(`[data-col="${c + 1}"][data-ligne="${l}"]`);
        let d2 = document.querySelector(`[data-col="${c + 2}"][data-ligne="${l}"]`);
        let d3 = document.querySelector(`[data-col="${c + 3}"][data-ligne="${l}"]`);
        if (d1 === null || d2 === null || d3 === null) {

        }
        else if (element.classList.contains('p1') && d1.classList.contains('p1') && d2.classList.contains('p1') && d3.classList.contains('p1')) {
          p4.score1++;
          setTimeout(() => { alert(self.p1 + ' a gagné') }, 100); self.gameover = 1; self.reset.style.display = 'flex';
          self.reset.style.setProperty('margin', '20px auto');
          return;
        }
        else if (element.classList.contains('p2') && d1.classList.contains('p2') && d2.classList.contains('p2') && d3.classList.contains('p2')) {
          p4.score2++;
          setTimeout(() => { alert(self.p2 + ' a gagné') }, 100); self.gameover = 1; self.reset.style.display = 'flex';
          self.reset.style.setProperty('margin', '20px auto');
          return;
        };
      })
    }
    function checkcolonne(element) {
      let l = element.getAttribute('data-ligne');
      let c = parseInt(element.getAttribute('data-col'));
      l = parseInt(l);
      if (l < (self.row - 3)) {
        if (document.querySelector(`.tile[data-col="${parseInt(c)}"][data-ligne="${parseInt(l) + 1}"]`).style.backgroundColor===element.style.backgroundColor
          && document.querySelector(`.tile[data-col="${parseInt(c)}"][data-ligne="${parseInt(l) + 2}"]`).style.backgroundColor===element.style.backgroundColor
          && document.querySelector(`.tile[data-col="${parseInt(c)}"][data-ligne="${parseInt(l) + 3}"]`).style.backgroundColor===element.style.backgroundColor) {
          if (self.compt===1) {
            p4.score1++;
            setTimeout(() => { alert(self.p1 + ' a gagné') }, 100); self.gameover = 1; self.reset.style.display = 'flex';
            self.reset.style.setProperty('margin', '20px auto');
          } else {
            p4.score2++;
            setTimeout(() => { alert(self.p2 + ' a gagné') }, 100); self.gameover = 1; self.reset.style.display = 'flex';
            self.reset.style.setProperty('margin', '20px auto');

          }
        }
      }
    }

    function checkdiag() {

      let tokens = document.querySelectorAll('.p1, .p2');
      tokens.forEach(element => {
        let l = parseInt(element.getAttribute('data-ligne'));
        let c = parseInt(element.getAttribute('data-col'));
        let d1 = document.querySelector(`[data-col="${c + 1}"][data-ligne="${l + 1}"]`);
        let d2 = document.querySelector(`[data-col="${c + 2}"][data-ligne="${l + 2}"]`);
        let d3 = document.querySelector(`[data-col="${c + 3}"][data-ligne="${l + 3}"]`);
        let d4 = document.querySelector(`[data-col="${c + 1}"][data-ligne="${l - 1}"]`);
        let d5 = document.querySelector(`[data-col="${c + 2}"][data-ligne="${l - 2}"]`);
        let d6 = document.querySelector(`[data-col="${c + 3}"][data-ligne="${l - 3}"]`);

        if (d1 === null || d2 === null || d3 === null) {

        }
        else if (element.classList.contains('p1') && d1.classList.contains('p1') && d2.classList.contains('p1') && d3.classList.contains('p1')) {
          p4.score1++;
          setTimeout(() => { alert(self.p1 + ' a gagné') }, 100); self.gameover = 1; self.reset.style.display = 'flex';
          self.reset.style.setProperty('margin', '20px auto');
          return;
        }
        else if (element.classList.contains('p2') && d1.classList.contains('p2') && d2.classList.contains('p2') && d3.classList.contains('p2')) {
          p4.score2++;
          setTimeout(() => { alert(self.p2 + ' a gagné') }, 100); self.gameover = 1; self.reset.style.display = 'flex';
          self.reset.style.setProperty('margin', '20px auto');
          return;
        };

        if (d4 === null || d5 === null || d6 === null) {

        }
        else if (element.classList.contains('p1') && d4.classList.contains('p1') && d5.classList.contains('p1') && d6.classList.contains('p1')) {
          p4.score1++;
          setTimeout(() => { alert(self.p1 + ' a gagné') }, 100); self.gameover = 1; self.reset.style.display = 'flex';
          self.reset.style.setProperty('margin', '20px auto');
          return;
        }
        else if (element.classList.contains('p2') && d4.classList.contains('p2') && d5.classList.contains('p2') && d6.classList.contains('p2')) {
          p4.score2++;
          setTimeout(() => { alert(self.p2 + ' a gagné') }, 100); self.gameover = 1; self.reset.style.display = 'flex';
          self.reset.style.setProperty('margin', '20px auto');
          return;
        };

      })
    }

    this.reset.onclick = () => {
      let restart = document.querySelectorAll('.p1, .p2')
      let time = restart.length * 100;
      for (let t = 0; t < restart.length; t++) {
        setTimeout(() => {
          restart[t].style.backgroundColor = "white";
        }, t * 100);

      }
      setTimeout(() => {
        Array.from(this.jeu.children).forEach(jeton => {
          jeton.remove();
        })
        self.compt = 0;
        let p4 = new self.constructor(self.selector, self.options);
        return p4;
      }, time)
    }

    this.cancel.onclick = () => {
      if (this.coups.length===0) {
        return null;
      } else if (this.gameover===1) {
        return false;
      } else {
        let lastshot = this.coups[this.coups.length - 1];
        this.reset.style.display = 'none';
        let affect = document.querySelector(`[data-ligne='${lastshot[0]}'][data-col='${lastshot[1]}']`);
        affect.classList.remove('p1');
        affect.classList.remove('p2');
        affect.classList.add('empty');
        affect.style.backgroundColor = "white";
        this.coups.pop();
        this.nbturn--;
        if (this.compt===0) {
          this.tour.textContent = `C'est au tour de ${this.p2}, tour: ${this.nbturn}`;
          this.compt = 1;
        } else {
          this.tour.textContent = `C'est au tour de ${this.p1}, tour: ${this.nbturn}`;
          this.compt = 0;
        }
        this.gameover = 0;
      }
    }

  }
}


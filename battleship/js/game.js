/*jslint browser this */
/*global _, player, computer, utils */
/*global Audio */

(function () {
    "use strict";
    var game = {
        IA_difficulty: false,
        PHASE_GAME_OVER: "PHASE_GAME_OVER",
        PHASE_INIT_OPPONENT: "PHASE_INIT_OPPONENT",
        PHASE_INIT_PLAYER: "PHASE_INIT_PLAYER",
        PHASE_PLAY_OPPONENT: "PHASE_PLAY_OPPONENT",
        PHASE_PLAY_PLAYER: "PHASE_PLAY_PLAYER",
        PHASE_WAITING: "waiting",

        addListeners: function () {
            // on ajoute des acouteur uniquement
            // sur la grid (délégation d'événement)
            this.grid.addEventListener("mousemove",
                _.bind(this.handleMouseMove, this));
            this.grid.addEventListener("click",
                _.bind(this.handleClick, this));
            this.grid.addEventListener("contextmenu",
                _.bind(this.handlerightclick, this));
        },

        currentPhase: "",
        fire: function (from, col, line, callback) {
            var self = this;
            var url = "./assets/mixkit-fast-rocket-whoosh-1714.wav";
            var msg = "";
            var target;
            var audio = new Audio(url);
            this.wait();
            audio.play();

            // determine qui est l'attaquant
            // et qui est attaqué
            target = (
                this.players.indexOf(from) === 0 ?
                    this.players[1] : this.players[0]
            );

            if (this.currentPhase === this.PHASE_PLAY_OPPONENT) {
                msg += "Votre adversaire vous a... ";
            }

            if (target.grid[line][col] === true||
                target.grid[line][col] === false) {
                msg += "Overkill !";

                utils.info(msg);

                setTimeout(function () {
                    self.stopWaiting();
                    self.goNextPhase();
                }, 1000);
            } else {
                target.receiveAttack(col, line, function (hasSucceed) {
                    if (hasSucceed === true) {
                        target.grid[line][col] = true;
                        msg += "Touché !";
                    } else {
                        target.grid[line][col] = false;
                        msg += "Manqué...";
                    }

                    utils.info(msg);

                    // on invoque la fonction callback
                    // (4e paramètre passé à la méthode fire)
                    // pour transmettre à l'attaquant
                    // le résultat de l'attaque
                    callback(hasSucceed);

                    // on fait une petite pause avant de continuer...
                    // histoire de laisser le temps
                    // au joueur de lire les message affiché
                    setTimeout(function () {
                        self.stopWaiting();
                        self.goNextPhase();
                    }, 1000);
                });
            }
            // on demande à l'attaqué si
            // il a un bateaux à la position visée
            // le résultat devra être passé en
            // paramètre à la fonction de callback (3e paramètre)
        },

        gameIsOver: function (sunk) {
            if (sunk !== null) {
                window.alert("Game Over");
                window.location.reload();
            }
            else {
                return false;
            }
        },

        getPhase: function () {
            if (this.waiting) {
                return this.PHASE_WAITING;
            }
            return this.currentPhase;
        },

        goNextPhase: function () {
            // récupération du numéro d'index de la phase courante
            var ci = this.phaseOrder.indexOf(this.currentPhase);
            var self = this;

            if (ci !== this.phaseOrder.length - 1) {
                this.currentPhase = this.phaseOrder[ci + 1];
            } else {
                this.currentPhase = this.phaseOrder[2];
            }

            switch (this.currentPhase) {
                case this.PHASE_GAME_OVER:
                    // detection de la fin de partie
                    if (!this.gameIsOver(this.sunk)) {
                        //le jeu n'est pas terminé on recommence un tour de jeu
                        this.goNextPhase();
                    }
                    break;
                case this.PHASE_INIT_PLAYER:
                    utils.info("Placez vos bateaux");
                    break;
                case this.PHASE_INIT_OPPONENT:
                    this.wait();
                    utils.info("En attente de votre adversaire");
                    self.stopWaiting();
                    self.goNextPhase();
                    break;
                case this.PHASE_PLAY_PLAYER:
                    utils.info("A vous de jouer, choisissez une case !");
                    break;
                case this.PHASE_PLAY_OPPONENT:
                    utils.info("A votre adversaire de jouer...");
                    this.players[1].play();
                    break;
            }

        },

        // garde une référence vers les noeuds correspondant du dom
        grid: null,
        handleClick: function (e) {
            // self garde une référence vers "this"
            // en cas de changement de scope
            var self = this;

            // si on a cliqué sur une cellule (délégation d'événement)
            if (e.target.classList.contains("cell")) {
                // si on est dans la phase de placement des bateau
                if (this.getPhase() === this.PHASE_INIT_PLAYER) {
                    // on enregistre la position du bateau,
                    // si cela se passe bien
                    // (la fonction renvoie true) on continue
                    if (this.players[0].setActiveShipPosition(
                        utils.eq(e.target),
                        utils.eq(e.target.parentNode))) {
                        // et on passe au bateau suivant
                        // (si il n'y en plus la fonction retournera false)
                        if (!this.players[0].activateNextShip()) {
                            this.wait();
                            utils.confirm("Confirmez le placement ?",
                                function () {
                                    // si le placement est confirmé
                                    self.stopWaiting();
                                    self.renderMiniMap();
                                    self.players[0].clearPreview();
                                    self.goNextPhase();
                                }, function () {
                                    self.stopWaiting();
                                    // sinon, on efface les bateaux
                                    // (les positions enregistrées),
                                    // et on recommence
                                    self.players[0].resetShipPlacement();
                                });
                        }
                    }
                    // si on est dans la phase de jeu (du joueur humain)
                } else if (this.getPhase() === this.PHASE_PLAY_PLAYER) {
                    this.players[0].play(
                        utils.eq(e.target),
                        utils.eq(e.target.parentNode)
                    );
                }
            }
        },
        handleMouseMove: function (e) {
            // on est dans la phase de placement des bateau
            var ship = this.players[0].fleet[this.players[0].activeShip];
            if (this.getPhase() === this.PHASE_INIT_PLAYER
                && e.target.classList.contains("cell")) {

                // si on a pas encore affiché (ajouté aux DOM) ce bateau
                if (!ship.dom.parentNode) {
                    this.grid.appendChild(ship.dom);
                    // passage en arrière plan pour ne pas empêcher
                    // la capture des événements sur les cellules de la grille
                    ship.dom.style.zIndex = -1;
                }

                // décalage visuelle,
                //le point d'ancrage du curseur est au milieu du bateau
                if (ship.life % 2 === 0 && ship.orientation === 1) {
                    ship.dom.style.top = String("") +
                        (utils.eq(e.target.parentNode)) *
                        utils.CELL_SIZE -
                        (600 + this.players[0].activeShip * 60)
                        - utils.CELL_SIZE / 2 + "px";
                    ship.dom.style.left = String("") +
                        utils.eq(e.target) * utils.CELL_SIZE -
                        Math.floor(ship.getLife() / 2) *
                        utils.CELL_SIZE +
                        utils.CELL_SIZE / 2 + "px";
                } else {
                    ship.dom.style.top = String("") +
                        (utils.eq(e.target.parentNode)) *
                        utils.CELL_SIZE - (600 +
                            this.players[0].activeShip * 60)
                        + "px";
                    ship.dom.style.left = String("") +
                        utils.eq(e.target) * utils.CELL_SIZE
                        - Math.floor(ship.getLife() / 2)
                        * utils.CELL_SIZE + "px";
                }

            }
        },
        handlerightclick: function (e) {
            var ship = this.players[0].fleet[this.players[0].activeShip];
            e.preventDefault();
            if (ship.orientation === 0) {
                this.players[0].orientation = 1;
                ship.orientation = 1;
                ship.dom.style.transform = "rotate(90deg)";
            } else {
                this.players[0].orientation = 0;
                ship.orientation = 0;
                ship.dom.style.transform = "rotate(0deg)";
            }
            this.handleMouseMove(e);
        },
        // lancement du jeu
        init: function () {

            const self = this;
            // initialisation
            this.grid = document.querySelector(".board .main-grid");
            this.miniGrid = document.querySelector(".mini-grid");

            // défini l'ordre des phase de jeu
            function select_order(btn) {
                var btn_value;
                var opponent_first;
                var player_first;
                var random_order;

                opponent_first = [
                    self.PHASE_INIT_PLAYER,
                    self.PHASE_INIT_OPPONENT,
                    self.PHASE_PLAY_OPPONENT,
                    self.PHASE_PLAY_PLAYER,
                    self.PHASE_GAME_OVER
                ];

                player_first = [
                    self.PHASE_INIT_PLAYER,
                    self.PHASE_INIT_OPPONENT,
                    self.PHASE_PLAY_PLAYER,
                    self.PHASE_PLAY_OPPONENT,
                    self.PHASE_GAME_OVER
                ];
                self.wait();
                btn_value = btn.textContent;
                btn.parentNode.parentNode.style.display = "none";

                if (btn_value === "IA") {
                    self.phaseOrder = opponent_first;
                    self.stopWaiting();
                }

                else if (btn_value === "Vous") {
                    self.phaseOrder = player_first;
                    self.stopWaiting();
                }

                else {
                    random_order = (Math.floor(Math.random() * 2)) % 2;
                    if (random_order === 0) {
                        self.phaseOrder = opponent_first;
                    }

                    else {
                        self.phaseOrder = player_first;
                    }
                    self.stopWaiting();
                }

                self.playerTurnPhaseIndex = 0;

                // initialise les joueurs
                self.setupPlayers();

                // ajoute les écouteur d'événement sur la grille
                self.addListeners();
                // init()
                // c'est parti !
                self.goNextPhase();
                // this.players[1].setActiveShipPosition()
            }
            document.querySelectorAll(".ia_difficulty button").forEach(function(element) {
                element.addEventListener("click", function() {
                    if (this.innerHTML === "Facile") {
                        self.IA_difficulty = "Facile";
                    }
                    else {
                        self.IA_difficulty = "Difficile";
                    }
                    this.parentNode.parentNode.style.display = "none";
                });
            });
            document.querySelectorAll(".order_button > button").forEach(function(element) {
                element.addEventListener("click", function () {
                    select_order(this);
                });
            });
        },

        miniGrid: null,
        phaseOrder: [],

        // garde une référence vers l'indice du tableau phaseOrder
        // qui correspond à la phase de jeu pour le joueur humain
        playerTurnPhaseIndex: 2,


        // liste des joueurs
        players: [],
        // fonction utlisée par les objets représentant
        // les joueurs (ordinateur ou non)
        // pour placer un tir et obtenir de l'adversaire
        // l'information de réusssite ou non du tir
        renderMap: function () {
            this.players[0].renderTries(this.grid);
        },
        renderMiniMap: function () {
            var div;
            if (this.currentPhase === "PHASE_INIT_PLAYER") {
                this.miniGrid.style.width = "600px";
                this.miniGrid.style.height = "600px";
                this.players[0].fleet.forEach(function (element) {
                    element.dom.style.backgroundColor = element.color;
                    div = element.dom.cloneNode();
                    document.querySelector(".mini-grid").append(div);
                });
            }
            this.players[1].renderTries(this.miniGrid);
        },

        setupPlayers: function () {
            var randomA;
            var randomB;
            var randomC;
            var ship;
            // donne aux objets player et
            // computer une réference vers l'objet game
                        // implémenter le jeu en réseaux
            this.players = [player, computer];

            this.players[0].init();
            this.players[1].init();
            player.setGame(this);
            computer.setGame(this);
            while (this.ships < this.players[1].fleet.length) {
                randomA = Math.floor(Math.random() * 10);
                randomB = Math.floor(Math.random() * 10);
                randomC = Math.floor(Math.random() * 10) % 2;
                ship = this.players[1].fleet[this.players[1].activeShip];

                if (randomC === 1) {
                    if (ship.orientation === 0) {
                        this.players[1].orientation = 1;
                        ship.orientation = 1;
                    } else {
                        this.players[1].orientation = 0;
                        ship.orientation = 0;
                    }
                }
                if (this.players[1].setActiveShipPosition(randomA,
                    randomB) === true) {
                    this.players[1].activateNextShip();
                    this.ships += 1;
                }
            }
        },
        // nombre de bateaux
        ships: 0,

        stopWaiting: function () {
            this.waiting = false;
        },

        sunk: null,
        // met le jeu en mode "attente" (les actions joueurs ne
        // doivent pas être pris en compte
        // si le jeu est dans ce mode)
        // met fin au mode mode "attente"
        wait: function () {
            this.waiting = true;
        },

        // l'interface utilisateur doit-elle être bloquée ?
        waiting: false
    };

    // point d'entrée
    document.addEventListener("DOMContentLoaded", function () {
        game.init();
    });

}());
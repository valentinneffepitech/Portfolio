/*jslint browser this */
/*global _, shipFactory, player, utils */
/*global Audio */

(function (global) {
    "use strict";

    var player = {
        activateNextShip: function () {
            if (this.activeShip < this.fleet.length - 1) {
                this.activeShip += 1;
                return true;
            } else {
                return false;
            }
        },
        activeShip: 0,
        clearPreview: function () {
            this.fleet.forEach(function (ship) {
                if (ship.dom.parentNode) {
                    ship.dom.parentNode.removeChild(ship.dom);
                }
            });
            this.orientation = 0;
        },
        fleet: [],
        game: null,
        grid: [],
        init: function () {
            // créé la flotte
            this.fleet.push(shipFactory.build(shipFactory.TYPE_BATTLESHIP));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_DESTROYER));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_SUBMARINE));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_SMALL_SHIP));

            // créé les grilles
            this.grid = utils.createGrid(10, 10);
            this.tries = utils.createGrid(10, 10);

        },
        orientation: 0,
        play: function (col, line) {
            // appel la fonction fire du game,
            // et lui passe une calback pour récupérer le résultat du tir
            this.game.fire(this, col, line, _.bind(function (hasSucced) {
                this.tries[line][col] = hasSucced;
            }, this));
        },
        // quand il est attaqué le joueur doit dire si
        // il a un bateaux ou non à l'emplacement choisi par l'adversaire
        receiveAttack: function (col, line, callback) {
            var self = this;
            var shoot_value = self.grid[line][col];
            var succeed = false;
            var sunk = 0;
            var elem;
            var name;
            var url;
            var img;
            var audio;
            var me = (
                self.game.players.indexOf(this) === 0 ?
                this.game.players[1]:this.game.players[0]
                );
            var target = (
                self.game.players.indexOf(this) === 0 ?
                this.game.players[0] : this.game.players[1]
            );
            var length = me.fleet.length;

            if (this.grid[line][col] !== 0
                && this.grid[line][col] !== false
                && this.grid[line][col] !== true) {
                succeed = true;
            }

            if (succeed === true) {

                this.game.players[1].fleet.forEach(function(element) {

                    if (element.id === shoot_value) {
                        element.life -= 1;

                        if (element.life === 0) {
                            name = element.name;
                            name = name.toLowerCase();
                            elem = document.querySelector("."+name);
                            elem.classList.add("sunk");
                        }
                    }
                    if (element.life === 0) {
                        sunk += 1;
                    }
                });
                if (sunk === length) {
                    setTimeout(function(){
                        self.game.sunk = "game_over";
                        self.game.gameIsOver(self.game.sunk);
                    }, 1000);
                }

            } else {
                succeed = false;
            }
            url = (
                succeed ?
            "./assets/mixkit-arcade-game-explosion-1699.wav"
            : "./assets/mixkit-fish-flapping-2457.wav");
            img = (
                succeed ?
            "touche" : "flop"
            );
            if(target === this.game.players[1]){
                self.game.grid.querySelector(
                    `.row:nth-child(${line + 1}) .cell:nth-child(${col + 1})`
                    ).classList.add(img);
            }
            audio = new Audio(url);
            callback.call(undefined, succeed);
            setTimeout(function(){audio.play();}, 1500);
            self.game.renderMap();
        },
        renderTries: function (grid) {
            var self = this;
            var node;
            var ligne;
            var colonne;
            this.tries.forEach(function (row, rid) {
                row.forEach(function (val, col) {
                    ligne = `.row:nth-child(${(rid + 1)})`;
                    colonne = `.cell:nth-child(${(col + 1)})`;
                    node = grid.querySelector(
                        `${ligne} ${colonne}`
                        );
                    if (node.style.backgroundColor === "") {
                        if (val === true) {
                            node.style.backgroundColor = "#e60019";
                        } else if (val === false
                            &&
                            self.game.currentPhase === "PHASE_PLAY_PLAYER") {
                            node.style.backgroundColor = "#aeaeae";
                        }
                    }
                });
            });
        },
        resetShipPlacement: function () {
            this.clearPreview();
            this.activeShip = 0;
            this.grid = utils.createGrid(10, 10);
        },
        setActiveShipPosition: function (x, y) {
            var ship = this.fleet[this.activeShip];
            var size = ship.life;
            var limits = Math.floor(size / 2);
            var compteur = 0;
            var i;
            var j;
            if (this.orientation === 0){
                if (size%2 === 0) {
                    for (i = 0 - limits; i < limits; i += 1) {
                        if (this.grid[y][x + i] === 0) {
                            compteur += 1;
                        }
                    }
                } else {
                    for (i = 0 - limits; i <= limits; i += 1) {
                        if (this.grid[y][x + i] === 0) {
                            compteur += 1;
                        }
                    }
                }

                if (compteur === size) {
                    if (size % 2 === 0) {
                        for (j = 0 - limits; j < limits; j += 1) {
                            this.grid[y][x + j] = ship.getId();
                        }
                        this.orientation = 0;
                        return true;
                    } else {
                        for (j = 0 - limits; j <= limits; j += 1) {
                            this.grid[y][x + j] = ship.getId();
                        }
                        this.orientation = 0;
                        return true;
                    }

                }
            } else {
                if (size%2 === 0) {
                    for (i = 0 - limits; i < limits; i += 1) {
                        if(this.grid[y + i]){
                            if (this.grid[y + i][x] === 0) {
                                compteur += 1;
                            }
                        } else {
                            return false;
                        }
                    }
                } else {
                    for (i = 0 - limits; i <= limits; i += 1) {
                        if(this.grid[y + i]){
                            if (this.grid[y + i][x] === 0) {
                                compteur += 1;
                            }
                        } else {
                            return false;
                        }
                    }
                }

                if (compteur === size) {
                    if (size % 2 === 0) {
                        for (j = 0 - limits; j < limits; j += 1) {
                            this.grid[y + j][x] = ship.getId();
                        }
                        this.orientation = 0;
                        return true;
                    } else {
                        for (j = 0 - limits; j <= limits; j += 1) {
                            this.grid[y + j][x] = ship.getId();
                        }
                        this.orientation = 0;
                        return true;
                    }

                }
            }
        },
        setGame: function (parent) {
            this.game = parent;
        },
        tries: []
    };

    global.player = player;

}(this));
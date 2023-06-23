/*jslint browser this */
/*global _, player */

(function (global) {
    "use strict";
    var computer = _.assign({}, player, {
        IA_difficulty: false,
        boat_first_hit_x: 0,
        boat_first_hit_y: 0,
        fleet: [],
        game: null,
        grid: [],
        isShipOk: function () {
            return;
        },
        last_shot: false,
        last_shot_2: false,
        last_shot_x: 0,
        last_shot_y: 0,
        play: function () {
            var self = this;
            setTimeout(function () {
                var x = Math.floor(Math.random() * 10);
                var y = Math.floor(Math.random() * 10);
                if (self.IA_difficulty === "Difficile") {
                    if (self.last_shot === true) {
                        if (self.shot_direction === "right") {
                            x = self.last_shot_x;
                            y = self.last_shot_y + 1;
                        } else if (self.shot_direction === "left") {
                            x = self.last_shot_x;
                            y = self.last_shot_y - 1;
                        } else if (self.shot_direction === "down") {
                            x = self.last_shot_x + 1;
                            y = self.last_shot_y;
                        } else if (self.shot_direction === "up") {
                            x = self.last_shot_x - 1;
                            y = self.last_shot_y;
                        } else {
                            x = self.last_shot_x;
                            y = self.last_shot_y + 1;
                        }
                    } else if (self.last_shot === false && self.last_shot_2 === true && self.shot_direction === "right") {
                        x = self.boat_first_hit_x;
                        y = self.boat_first_hit_y - 1;
                        self.shot_direction = "left";
                    } else if (self.last_shot === false && self.shot_direction === "left") {
                        x = self.boat_first_hit_x + 1;
                        y = self.boat_first_hit_y;
                        self.shot_direction = "down";
                    } else if (self.last_shot === false && self.shot_direction === "down") {
                        x = self.boat_first_hit_x - 1;
                        y = self.boat_first_hit_y;
                        self.shot_direction = "up";
                    } else {
                        self.shot_direction = false;
                    }
                }
                if (x === -1) {
                    x = 0;
                } else if (y === -1) {
                    y = 0;
                } else if (x === 10) {
                    x = 9;
                } else if (y === 10){
                    y = 9;
                }
                self.game.fire(this, y, x, function (hasSucced) {
                    self.tries[x][y] = hasSucced;
                    self.last_shot_2 = self.last_shot;
                    self.last_shot_x = x;
                    self.last_shot_y = y;
                    if (hasSucced === true &&
                        self.last_shot === false &&
                        self.shot_direction === false) {
                        self.boat_first_hit_x = x;
                        self.boat_first_hit_y = y;
                        self.shot_direction = "right";
                    }
                    self.last_shot = hasSucced;
                    self.game.renderMiniMap();
                });
            }, 2000);
        },
        setGame: function (parent) {
            this.game = parent;
            this.IA_difficulty = parent.IA_difficulty;
        },
        shot_direction: false,
        tries: []
    });

    global.computer = computer;

}(this));
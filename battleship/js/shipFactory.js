/*jslint browser this */
/*global _, utils */

(function (global) {
    "use strict";

    var refType = {};
    var Ship;
    var shipFactory;

    var shipAI = 0;
    function getShipNewIndex() {
        shipAI = shipAI + 1;
        return shipAI;
    }

    Ship = {
        color: null,
        dom: null,
        getColor: function () {
            return this.color;
        },
        getId: function () {
            return this.id;
        },
        getLife: function () {
            return this.life;
        },
        getName: function () {
            return this.name;
        },
        id: null,
        init: function () {
            const size = utils.CELL_SIZE;
            this.id = getShipNewIndex();
            this.dom = document.createElement("div");
            this.dom.style.height = String("") + size + "px";
            this.dom.style.width = String("") + size * this.life + "px";
            this.dom.style.position = "relative";
            this.dom.style.opacity = "0.8";
            this.dom.style.backgroundColor = this.color;
        },
        life: null,
        name: null,
        orientation: 0,
        setColor: function (color) {
            this.color = color;
        },
        setLife: function (life) {
            this.life = parseInt(life, 10);
        },
        setName: function (name) {
            this.name = name;
        }
    };

    shipFactory = {
        TYPE_BATTLESHIP: "battleship",
        TYPE_DESTROYER: "destroyer",
        TYPE_SMALL_SHIP: "small-ship",
        TYPE_SUBMARINE: "submarine",

        build: function (type, name) {
            var newShip;

            if (!refType[type]) {
                return null;
            }

            newShip = _.assign({}, Ship, refType[type]);

            newShip.init();

            if (name !== undefined) {
                newShip.setName(name);
            }

            return newShip;
        }
    };

    refType[shipFactory.TYPE_BATTLESHIP] = {
        color: "#e60019",
        life: 5,
        name: "Battleship"
    };
    refType[shipFactory.TYPE_DESTROYER] = {
        color: "#577cc2",
        life: 5,
        name: "Destroyer"
    };
    refType[shipFactory.TYPE_SUBMARINE] = {
        color: "#56988c",
        life: 4,
        name: "Submarine"
    };
    refType[shipFactory.TYPE_SMALL_SHIP] = {
        color: "#A39E9E",
        life: 3,
        name: "small-ship"
    };


    // Expose l'objet à l'exterieur du scope de la fonction.
    // Depuis l'extérieur, vous pouvez l'utilisé ainsi :
    global.shipFactory = shipFactory;

}(this));

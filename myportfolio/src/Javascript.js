import React from 'react'
import p4 from './p4/script'
export default function Javascript() {
    function generateGame(event) {
        event.target.style.display = 'none';
        document.querySelector('#preview_p4').style.display = 'none'
        const options = {
            c1: 'yellow',
            c2: 'red',
            y: 6,
            x: 7,
            p1: 'Player 1',
            p2: 'Player 2'
        }
        let cross = new p4('#board', options);
        return cross
    }
    return (
        <div id="js_div">
            <h1 id="headtitle">Projets en JS Vanilla</h1>
            <div className="project container" id="puissance4">
                <h2 className="project_title">Puissance 4</h2>
                <div id="board">
                    <img src="./p4.png" className="preview" id="preview_p4" alt="puissance4" />
                </div>
                <p className="project_legend">Réaliser un puissance 4 en une semaine</p>
                <button className="btn" id="launcher" onClick={(event) => { generateGame(event) }}>Lancer un puissance 4</button>
            </div>
            <div className="project container" id="battleship">
                <h2 className="project_title">Battleship</h2>
                <img src="./battleship.png" className="preview" id="previewbtlship" alt="bataille navale"></img>
                <p className="project_legend">Exercice de débugage d'un battleship</p>
            </div>
        </div>
    )
}

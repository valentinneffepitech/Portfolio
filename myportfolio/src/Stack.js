import React from 'react'

export default function Stack() {
    return (
        <div id="Stack_div">
            <h1 id="headtitle">Mes Projets MERN</h1>
            <div className="card_item_php container-md">
                <div className="preview">
                    <a href="./assets_mern/node.png" title="Projet Node" target="_blank"><img className="projet_mern" src="./assets_mern/node.png" alt="Projet Node" /></a>
                </div>
                <div className="description">
                    <h2 className="description_title">Piscine NodeJS / Express</h2>
                    <p className="description_text">Initiation à NodeJS et à son système de routing et création d'API.</p>
                    <ul className="list-group"><span className="notions">Notions abordées:</span>
                        <li className="skills list-group-items">MERN</li>
                        <li className="skills list-group-items">API</li>
                        <li className="skills list-group-items">MongoDB</li>
                    </ul>
                </div>
            </div>

            <div className="card_item_php container-md">
                <div className="description">
                    <h2 className="description_title">My Skyblog</h2>
                    <p className="description_text">Projet en ReactJS, effectué en 2 jours.</p>
                    <ul className="list-group"><span className="notions">Notions abordées:</span>
                        <li className="skills list-group-items">React</li>
                        <li className="skills list-group-items">Routing React</li>
                        <li className="skills list-group-items">Fonctions asynchrones</li>
                    </ul>
                </div>
                <div className="preview">
                    <a href="./assets_mern/skyblog.png" title="Projet React" target="_blank"><img className="projet_mern" src="./assets_mern/skyblog.png" alt="Projet React" /></a>
                </div>
            </div>
        </div>
    )
}

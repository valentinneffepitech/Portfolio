import React from 'react'

export default function PHP() {
    return (
        <div id="PHP_DIV">
            <h1 id="headtitle">Mes Projets PHP</h1>
            <div className="container-fluid">
                <div className="card_item_php container">
                    <div className="preview">
                        <div id="separate_image">
                            <img className="preview_picture" src="./assets_PHP/fleche.png" alt='item1' />
                            <img className="preview_picture" src="./assets_PHP/soleil.png" alt='item2' />
                        </div>
                        <img id="preview_sprite" src="./assets_PHP/sprite.png" alt='sprite' className="sprite" />
                    </div>
                    <div className="description">
                        <h2 className="description_title">Le CSS-Generator</h2>
                        <p className="description_text">Le premier vrai projet réalisé pendant ma formation celui-ci avait pour but de rassembler plusieurs images au fichier png à l'intérieur d'un dossier et en faire un sprite ainsi que de générer le fichier css associé pour l'utiliser par après dans nos projets.</p>
                        <ul className="list-group"><span className="notions">Notions abordées:</span>
                            <li className="skills list-group-items">Gestion d'images</li>
                            <li className="skills list-group-items">Navigation dans les dossiers/sous-dossiers</li>
                            <li className="skills list-group-items">Utilisation du CLI / !#</li>
                        </ul>
                    </div>
                </div>
                <div className="card_item_php container">
                    <div className="description">
                        <h2 className="description_title">My Cinema</h2>
                        <p className="description_text">Ce projet était notre premier projet où il fallait faire appel à une base de donnée afin de simuler un gestionnaire pour un cinéma.</p>
                        <ul className="list-group"><span className="notions">Notions abordées:</span>
                            <li className="skills list-group-items">Requête à la base de donnée / MySQL</li>
                            <li className="skills list-group-items">CRUD pour les films / abonnements</li>
                            <li className="skills list-group-items">Utilisation des méthodes GET / POST</li>
                        </ul>
                    </div>
                    <div className="preview">
                        <a href="./assets_PHP/cinema.png" title="agrandir l'image"><img className="preview_projets_php" src="./assets_PHP/cinema.png" alt='MyCinema' /></a>
                    </div>
                </div>
                <div className="card_item_php container">
                    <div className="preview">
                        <a href="./assets_PHP/meetic.png" title="agrandir l'image"><img className="preview_projets_php" src="./assets_PHP/meetic.png" alt='MyMeetic' /></a>
                    </div>
                    <div className="description">
                        <h2 className="description_title">My Meetic</h2>
                        <p className="description_text">Trouver l'amour, facile à dire, à faire un peu moins...<br /> Mais pas avec ce projet qui avait besoin de créer un utilisateur en renseignant ses passions.</p>
                        <ul className="list-group"><span className="notions">Notions abordées:</span>
                            <li className="skills list-group-items">CRUD Utilisateur</li>
                            <li className="skills list-group-items">AJAX</li>
                            <li className="skills list-group-items">jQuery</li>
                        </ul>
                    </div>
                </div>
                <div className="card_item_php container">
                    <div className="description">
                        <h2 className="description_title">FreeAds</h2>
                        <p className="description_text">Projet réalisé en utilisant Laravel, l'objectif était de réaliser un site de petites annonces du même genre que Leboncoin</p>
                        <ul className="list-group"><span className="notions">Notions abordées:</span>
                            <li className="skills list-group-items">Framework Laravel</li>
                            <li className="skills list-group-items">ORM Eloquent</li>
                            <li className="skills list-group-items">Vérification d'E-Mail</li>
                        </ul>
                    </div>
                    <div className="preview">
                        <a href="./assets_PHP/laravel.png" title="agrandir l'image"><img className="preview_projets_php" src="./assets_PHP/laravel.png" alt='Laravel' /></a>
                    </div>
                </div>
                <div className="card_item_php container">
                    <div className="preview">
                        <a href="./assets_PHP/quizz.png" title="agrandir l'image"><img className="preview_projets_php" src="./assets_PHP/quizz.png" alt='MyMeetic' /></a>
                    </div>
                    <div className="description">
                        <h2 className="description_title">My Quizz</h2>
                        <p className="description_text">Comment tester ses connaissances de manière ludiques? <br /> Avec un quizz pardi! Et si en plus on peut apprendre à utiliser Symfony en cours de route...</p>
                        <ul className="list-group"><span className="notions">Notions abordées:</span>
                            <li className="skills list-group-items">Framework Symfony</li>
                            <li className="skills list-group-items">ORM Doctrine</li>
                            <li className="skills list-group-items">Gestion des rôles utilisateurs</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

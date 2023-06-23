import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

export default function Accueil() {
    return (
        <div id="Accueil">
            <img id="profilpic" src="carapuce.png" alt="profil" />
            <div id="Accueil_cards">
                <div className='card_container'>
                    <div className="card_item">
                        <h5 className="card_item_title">Ma situation</h5>
                        <p>
                            Actuellement en formation à la Webacadémie by Epitech, je recherche une entreprise et par conséquent un contrat d'alternance pour une durée de 14 mois à partir de Septembre 2023.
                        </p>
                        <h6><Link className="card_item_link" to="/profil" title="Accéder au profil">Accéder au profil</Link></h6>
                    </div>
                </div>
                <div className='card_container'>
                    <div className="card_item">
                        <h5 className="card_item_title">Ce que vous trouverez</h5>
                        <p>
                            D'un naturel calme et réfléchi, cette personne est sans-doute celle que vous recherchez pour développer des sites WEB au sein de votre entreprise.
                        </p>
                        <h6><Link className="card_item_link" to="/projects" title="Accéder aux projets">Accéder aux projets</Link></h6>
                    </div>
                </div>

                <div className='card_container'>
                    <div className="card_item">
                        <h5 className="card_item_title">Mes Soft Skills</h5>
                        <ul className="list-group">
                            <li className="accueil_skills list-group-items">Persévérant</li>
                            <li className="accueil_skills list-group-items">Flexible</li>
                            <li className="accueil_skills list-group-items">Pédagogue</li>
                            <li className="accueil_skills list-group-items">Autonome</li>
                            <li className="accueil_skills list-group-items">Créatif</li>
                            <li className="accueil_skills list-group-items">Esprit d'équipe</li>
                        </ul>
                    </div>
                </div>
                <div className='card_container'>
                    <div className="card_item">
                        <h5 className="card_item_title">Mes Hard Skills</h5>
                        <ul className="list-group">
                            <li className="accueil_skills list-group-items"><Link className="list-group-items-link" to="/maquette" title="Accéder aux maquettes">HTML / CSS</Link></li>
                            <li className="accueil_skills list-group-items"><Link className="list-group-items-link" to="/javascript" title="Accéder aux projets Javascript">Javascript</Link></li>
                            <li className="accueil_skills list-group-items"><Link className="list-group-items-link" to="/php" title="Accéder aux projets PHP">PHP / Laravel / Symfony / MYSQL</Link></li>
                            <li className="accueil_skills list-group-items"><Link className="list-group-items-link" to="/stack" title="Accéder aux projets Stacks Javascript">NodeJS / React / MongoDb</Link></li>
                            <li className="accueil_skills list-group-items">Github</li>
                            <li className="accueil_skills list-group-items" title="Utlisation de Ubuntu">Environnement Linux</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function Panier(props) {
    const navigation = useNavigate();
    const [total, setTotal] = useState(0);
    useEffect(() => {
        var calcul = 0;
        props.panier.forEach(element => {
            calcul += element.price - (element.price * (element.reduction / 100));
        })
        setTotal(calcul);
        props.TotalFacture(calcul);
    }, [props])
    const articles = props.panier.map((element, index) => {
        return (
            <tr key={index}>
                <td className='img-panier'><Link to={props.imageUrl + element.photo_source} target='_blank'><img src={props.imageUrl + element.photo_source} alt={element.name} class="photo_panier" /></Link></td>
                <td className='name-panier-article'>{element.name}</td>
                <td className='price-panier-article'>{parseFloat(element.price - (element.price * (element.reduction / 100))).toFixed(2)}€</td>
                <td className="deleteButton" onClick={() => props.removePanier(index)}><img src={process.env.PUBLIC_URL + '/assets/images/delete.png'} /></td>
            </tr>
        );
    })
    return (
        <div id="panier">
            {(props.panier.length === 0) ?
                <div id="empty_panier" className="mt-10">
                    <p className='text-2xl'>Aucun article dans votre panier...</p>
                    <img className="img-panier" src={process.env.PUBLIC_URL + '/assets/images/shopping.png'} alt="Shopping" />
                    <button className='btn' id="redirect_shop"><Link to="/produits" title="Voir nos produits">Accéder à la boutique !</Link></button>
                </div>
                :
                <div className='panier-all'>
                    <div>
                        <div id="manager_panier">
                            <p id='panier-title'>Montant total</p>
                            <p id='somme-panier'>{total.toFixed(2)}€</p>
                            <button id="validate" onClick={(e) => {
                                e.preventDefault()
                                navigation('/shipping')
                            }}>Passer commande</button>
                            <span id="delete_panier" onClick={(e) => {
                                props.emptyPanier()
                            }}>Vider le panier</span>
                        </div>
                    </div>
                    <table className='panier-manage'>
                        <thead id='panier-head'>
                            <tr>
                                <th>Aperçu de l'article</th>
                                <th>Nom de l'article</th>
                                <th>Prix de l'article</th>
                                <th id="title_trash"><img src={process.env.PUBLIC_URL + '/assets/images/trash.png'} alt={'poubelle'} /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles}
                        </tbody>
                    </table>
                </div>
            }
        </div>
    )
}

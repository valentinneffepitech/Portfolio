import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminDashboard(props) {
    const navigation = useNavigate();
    const [users, setUsers] = useState([])
    const [items, setItems] = useState([])
    const [deliveries, setDeliveries] = useState([])

    useEffect(() => {
        if (!props.auth.isAdmin) {
            navigation('/')
        }
        axios.post(props.url + 'admindashboard', { id: props.auth.id })
            .then((res) => {
                setUsers(res.data.users)
                setItems(res.data.items)
                setDeliveries(res.data.deliveries)
            })
            .catch((err) => console.log(err))
    }, [])

    function changeStatus(id) {
        const data = {
            id: props.auth.id,
            granted: id
        }
        axios.post(props.url + 'adminchange', data)
            .then((res) => {
                setUsers(res.data.users)
            })
            .catch((err) => console.log(err))
    }

    function deliveryStatus(id, status) {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('status', status);
        axios.post(props.url + 'deliveryupdate', formData).then(res => {
            setDeliveries(res.data)
        }).catch(err => console.log(err));
    }

    const userList = users.map((user) => (
        <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.phone.toString()}</td>
            <td>{user.adress}</td>
            <td>{user.city}</td>
            <td>{user.zipcode}</td>
            <td>{user.country}</td>
            <td className="adminDiv" onClick={() => {
                changeStatus(user.id)
            }}>{user.isAdmin ? 'Administrateur' : 'Visiteur'}</td>
        </tr>
    ))

    const articles = items.map((element, index) => {
        return (
            <tr key={index}>
                <td>{element.id}</td>
                <td onClick={() => {
                    navigation('/article/' + element.id);
                }} className={'produit_name'}>{element.name}</td>
                <td>{element.price - (element.price * (element.reduction / 100))}€</td>
                <td><img src={props.imageUrl + element.photo_source} alt={element.name} class="photo_panier" /></td>
                <td>{element.price}€</td>
                <td>{element.reduction}%</td>
                <td>{element.stocks}</td>
                <td className={'recommande'} onClick={() => {
                    alert('Commande Envoyée! ' + element.name + " arrivera bientôt !")
                }}><Link to={"https://www.amazon.fr/s?k=" + element.name.replace(' ', '+')} target='_blank'>Recommander {element.name}</Link></td>
            </tr>
        );
    })

    const livraisons = deliveries.map(ship => {
        if (!ship) {
            return (<div>
                Pas de livraisons en cours
            </div>);
        }
        return (
            <tr>
                <td>{ship.numero}</td>
                <td>
                    {ship.name}
                    <br />
                    {ship.address}
                    <br />
                    {ship.zipcode}, {ship.city} ({ship.country})
                </td>
                <td>
                    {ship.email}
                    <br />
                    {ship.phone}
                </td>
                <td>
                    {ship.total_price} €
                </td>
                <td>
                    <select
                        value={ship.status}
                        onChange={(e) => {
                            deliveryStatus(ship.id, e.target.value)
                        }}>
                        <option value="completed">Payée</option>
                        <option value="in-progress">En préparation</option>
                        <option value="pending">En livraison</option>
                        <option value="finished">Livrée</option>
                    </select>
                </td>
            </tr>
        )
    })

    function addBanCard(number) {
        const formData = new FormData();
        formData.append('numero', number);

        axios.post(props.url + 'addbancard/' + number, formData)
            .then((res) => {
                alert(res.data.message)
                document.querySelector('#card_banner').value = "";
            })
            .catch((err) => {
                alert(err.response.data.message);
            });
    }

    return (
        <div id="admin">
            <h1 className="title_dashboard main-title neon-violet" data-text={"Votre Espace Administrateur " + props.auth.name}>Votre Espace Administrateur {props.auth.name}</h1>
            <h3 className="sub_title_dashboard">Tous les utilisateurs</h3>
            <div id="floating_admin">
                <form id="ban_card" onSubmit={(e) => {
                    e.preventDefault();
                    const number = e.target.elements.number.value;
                    addBanCard(number);
                }}>
                    <p>Carte à bannir :</p>
                    <input type="number" name="number" id="card_banner" placeholder="Identifiant à bannir" maxLength={4} />
                    <button type='submit'>Ajoutez le banissement</button>
                </form>
                <Link id="export_db" title={"Télécharger les tables de la DB"} to={'/downloadTable'}>Exporter Excel</Link>
            </div>
            <table id="table_user">
                <thead className="head_dashboard">
                    <th>Numéro</th>
                    <th>Pseudo</th>
                    <th>Adresse E-mail</th>
                    <th>N° de Téléphone</th>
                    <th>Adresse</th>
                    <th>Ville</th>
                    <th>Code Postal</th>
                    <th>Pays</th>
                    <th>Status (Cliquez pour modifier)</th>
                </thead>
                <tbody className='body_dashboard'>
                    {userList}
                </tbody>
            </table>
            <h3 className="sub_title_dashboard">Suivre l'état des livraisons</h3>
            <table id="table_deliveries">
                <thead className='head_dashboard'>
                    <th>Numéro</th>
                    <th>Adresse de Livraison</th>
                    <th>Coordonnées</th>
                    <th>Prix</th>
                    <th>Etat de la commande</th>
                </thead>
                <tbody className='body_dashboard'>
                    {livraisons}
                </tbody>
            </table>
            {items.length > 0 &&
                <div>
                    <h3 className="sub_title_dashboard">Tous les articles non-disponibles</h3>
                    <table id="table_items_out">
                        <thead className="head_dashboard">
                            <th>Numéro</th>
                            <th>Nom</th>
                            <th>Prix Actuel</th>
                            <th>Photo de l'article</th>
                            <th>Prix de base</th>
                            <th>Réduction</th>
                            <th>Stocks</th>
                            <th>Cliquer pour passer commande</th>
                        </thead>
                        <tbody className='body_dashboard'>
                            {articles}
                        </tbody>
                    </table>
                </div>
            }
        </div >
    )
}
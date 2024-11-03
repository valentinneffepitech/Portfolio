import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Carte(props) {
    const navigation = useNavigate();
    const [cvv, setCvv] = useState(0);
    const [year, setYear] = useState(0);
    const [name, setName] = useState('');
    const [month, setMonth] = useState(0);
    const [cards, setCards] = useState([]);
    const [number, setNumber] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!props.delivery.panier) {
            navigation('/')
        }
        fetchCards();
    }, [props])

    const fetchCards = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/listcards/${props.auth.id}`);
            setCards(response.data);
        } catch (error) {
            console.error(error);
        }

    }

    const checkCard = async () => {
        try {
            const response = await axios.post(`http://localhost:8000/api/carte/${number}`);
            if (response.data.banned) {
                alert('Le pays d\'emission de votre carte a été banni, merci d\'emmigrer');
                return true;
            } else{
                return false;
            }
        } catch (error) {
            console.error(error);
        }
    };    

    function isValid() {
        var divs = document.querySelectorAll('.input_card');
        let effect = true;
        divs.forEach(element => {
            if (element.value === "") {
                effect = false;
            }
            if (!effect) {
                return effect;
            }
        })
        return effect;
    }

    function isSixteenDigits(number) {
        const regexSixteenDigits = /^\d{16}$/;
        return regexSixteenDigits.test(number);
    }

    function isThreeDigits(number) {
        const regexSixteenDigits = /^\d{3}$/;
        return regexSixteenDigits.test(number);
    }

    const prepareForExpe = async (price) => {
        const dateActuelle = new Date();
        const anneeActuelle = dateActuelle.getFullYear();
        const moisActuel = dateActuelle.getMonth() + 1;
        const cardIsBanned = await checkCard();

        if (!isValid()) {
            alert("Veuillez remplir tous les champs");
            setLoading(false);
            return
        }
        if (!isSixteenDigits(number)) {
            alert('Renseignez un numéro de carte valide !')
            setLoading(false);
            return
        }
        if (!isThreeDigits(cvv)) {
            alert("Renseignez votre CVV (le nombre à l'arrière de votre carte!")
            setLoading(false);
            return
        }
        if (!isNumeric(month) || !isNumeric(year)) {
            setLoading(false);
            alert('Stop troll');
            return;
        }
        
        if (cardIsBanned) {
            setLoading(false);
            return;
        }

        if (year <= anneeActuelle) {
            if (year < anneeActuelle || month < moisActuel) {
                setLoading(false);
                alert('Votre Carte est expirée')
                return;
            }
        }
        const user = props.auth.id ? props.auth.id : null;
        const data = {
            panier: props.delivery.panier,
            name: name,
            number: number,
            month: month,
            year: year,
            delivery: props.delivery.user,
            prices: price,
            id_user: user
        }
        axios.post(props.url + 'createDelivery', data).then(res => {
            setLoading(false);
            alert('Votre Colis est en route!');
            props.emptyPanier();
            props.resetDelivery();
            navigation('/');
        }).catch(err => {
            if (err.response.data.error_stocks && err.response.data.item) {
                alert('Nous ne pouvons effectuer la livraison il ne reste que ' + err.response.data.error_stocks + ' pièces de ' + err.response.data.item);
            } else {
                console.log(err.response)
            }
        })
    }

    function isNumeric(n) {
        return !isNaN(parseInt(n)) && isFinite(n);
    }

    return (
        <div className='flex justify-evenly align-middle'>
            {props.auth && (
                <div id="passed_cards" className='w-1/5 my-20 mx-20 bg-blue-950 p-4 text-white rounded-md'>
                    <h3 className='text-xl px-8'>Vos cartes</h3>
                    <div id="liste_cards">
                        {cards.map((card) => (
                            <ul key={card.number} className='mt-6 bg-blue-800 p-4 text-white rounded-lg'>
                                <li className="my-2">
                                    Numéro: {card.number.toString()}
                                </li>
                                <li>
                                    Expire fin : {card.expiration_month}/{card.expiration_year}
                                </li>
                                <li className='flex justify-center'>
                                    <button
                                        className="btn btn-adresses rounded-md"
                                        onClick={(e) => {
                                            document.querySelector('#card_number').value = card.number;
                                            setNumber(card.number);
                                            document.querySelector('#card_owner').value = card.owner;
                                            setName(card.owner);
                                            document.querySelector('#expiration_month').value = card.expiration_month;
                                            setMonth(parseInt(card.expiration_month));
                                            document.querySelector('#expiration_year').value = card.expiration_year;
                                            setYear(parseInt(card.expiration_year));
                                        }}
                                    >
                                        Utiliser cette carte
                                    </button>
                                </li>
                            </ul>
                        ))}
                    </div>
                </div>
            )}
            <div id="page_card">
                <form id="form_carte">
                    <label for="card_owner">Propriétaire de la carte :</label>
                    <input type="text" className="input_card" id="card_owner" name="card_owner" placeholder='Propriétaire de la carte' onChange={(e) => {
                        e.target.value = e.target.value.toUpperCase()
                        setName(e.target.value);
                    }} />
                    <label for="card_number">N° de la carte :</label>
                    <input type="text" id="card_number" className="input_card" name="card_number" placeholder="N° de la carte" onChange={(e) => {
                        if (isNaN(e.target.value)) {
                            e.target.value = "";
                            return;
                        }
                        if (e.target.value.length === 16) {
                            setNumber(e.target.value);
                        }
                    }} />
                    <div id="card_bottom">
                        <div id="expiracy">
                            <label><h6>Expire fin:</h6></label>
                            <input type='number' id="expiration_month" className="input_card" placeholder="MM" min="1" max="12" name="card_expiracy_month" onChange={(e) => {
                                setMonth(e.target.value)
                            }} />/
                            <input type='number' id="expiration_year" className="input_card" placeholder="YYYY" min="2023" name="card_expiracy_year" onChange={(e) => {
                                setYear(e.target.value)
                            }} />
                        </div>
                        <div id="secret_cvv">
                            <label for="CVV">CVV</label>
                            <input id="CVV" className="input_card" placeholder='CVV' min='0' type='number' onChange={(e) => {
                                if (e.target.value > 99 && e.target.value < 1000) {
                                    setCvv(parseInt(e.target.value));
                                }
                            }} />
                        </div>
                    </div>
                </form>
                {!loading ?
                    <button
                        id='submit_card_button'
                        onClick={(e) => {
                            setLoading(true)
                            prepareForExpe(props.delivery.prices)
                        }}> Expédier ma Commande </button>
                    :
                    <div className='loader'></div>
                }
            </div>
        </div >
    );
}

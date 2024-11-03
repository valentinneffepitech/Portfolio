import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Validator(props) {
    const navigation = useNavigate();
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [total, setTotal] = useState(0);
    const [phone, setPhone] = useState('');
    const [oldAddr, setOldAddr] = useState([]);
    const [listFedex, setFedex] = useState([]);
    const [adresse, setAdresse] = useState('');
    const [country, setCountry] = useState('');
    const [response, setResponse] = useState('');
    const [testZipCode, setZipcode] = useState('');
    const [firstname, setFirstName] = useState('');
    const [isloading, setLoading] = useState(false);
    const [sendMessage, setSendMessage] = useState('');
    const [shippingRate, setShippingRate] = useState(0);
    const [isDeliverable, setDelivery] = useState(false);

    const regexDigitsOnly = /^\d+$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    function isEmailValid(email) {
        return regexEmail.test(email);
    }

    function isZipCode(code) {
        return regexDigitsOnly.test(code);
    }

    useEffect(() => {
        if (props.panier.length === 0) {
            navigation('/')
        }
        let someRates = 0;
        props.panier.forEach(element => {
            someRates += element.weight
        });
        setTotal(someRates)
        fetchOldAddresses();
    }, [props])

    const fetchOldAddresses = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/oldaddresses/${props.auth.email}`);
            setOldAddr(response.data);
        } catch (error) {
            console.error(error);
        }
    };


    function exportNode(prices) {
        if (!isEmailValid(sendMessage)) {
            alert('Renseignez une adresse mail valide!')
            return;
        }
        if (!isZipCode(testZipCode)) {
            alert('Renseignez un code postal valide!')
            return;
        }
        if (!props.checkInput()) {
            alert('Veuillez renseigner tous les champs!')
            return
        }
        const data = {
            name: name + ' ' + firstname,
            email: sendMessage,
            zipcode: testZipCode,
            adress: adresse,
            phone: phone,
            country: country.toUpperCase(),
            city: city,
            poids: props.weightConverter(total)
        }
        setDelivery(false)
        axios.post(`http://localhost:3001/rate`, data).then((res) => {
            if (res.data.rates[0]) {
                setFedex(res.data.rates);
                setResponse(props.dollarConverter(res.data.rates[0].retail_rate).toFixed(2) + '€');
                setShippingRate(props.dollarConverter(res.data.rates[0].retail_rate).toFixed(2));
                props.Facturation((parseFloat(props.dollarConverter(res.data.rates[0].retail_rate).toFixed(2)) + prices).toFixed(2))
                setDelivery(true);
            } else {
                alert("Il semblerait que notre transporteur ne puisse pas livrer à cette adresse !");
            }
            setLoading(false);
        }).catch((err) => {
            console.log(err)
            setLoading(false);
            setDelivery(false);
            alert("Veuillez vérifier vos informations renseignées")
        })
    }

    return (
        <div id="validator" className='flex'>
            {props.auth.id &&
                <div className='my-14 w-1/5 justify-center'>
                    <div className='my-16 mx-3 p-4 bg-blue-950 text-white rounded-lg'>
                        <h3 className='text-xl mb-4'>Livrer à une adresse déjà utilisée</h3>
                        <div id="old_adresses">
                            {oldAddr.map((adresse, index) => (
                                <ul className='addresses_past bg-blue-800 text-white rounded-lg mb-3 p-4' key={index}>
                                    <li>Rue : {adresse.address}</li>
                                    <li>Code postal : {adresse.zipcode}</li>
                                    <li>Ville : {adresse.city} </li>
                                    <li>Pays : {adresse.country}</li>
                                    <li className="flex justify-around align-middle">
                                        <button className="btn p-2 m-1 rounded-md btn-adresses" onClick={(e) => {
                                            if (props.auth.email) {
                                                setSendMessage(props.auth.email)
                                            }
                                            document.querySelector('#ship_code').value = adresse.zipcode;
                                            setZipcode(adresse.zipcode)
                                            document.querySelector('#ship_adress').value = adresse.address;
                                            setAdresse(adresse.address)
                                            document.querySelector('#ship_phone').value = props.auth.phone;
                                            setPhone(props.auth.phone)
                                            document.querySelector('#ship_country').value = adresse.country.toUpperCase();
                                            setCountry(adresse.country)
                                            document.querySelector('#ship_city').value = adresse.city;
                                            setCity(adresse.city)
                                        }}>Utiliser cette adresse</button>
                                    </li>
                                </ul>
                            ))}
                        </div>

                    </div>
                </div>
            }
            <div className='flex items-center w-4/5 justify-evenly'>
                <div className='flex flex-col items-center'>
                    {props.auth.id ?
                        <button id="import_info_btn" onClick={(e) => {
                            setSendMessage(props.auth.email)
                            document.querySelector('#ship_code').value = props.auth.zipcode;
                            setZipcode(props.auth.zipcode)
                            document.querySelector('#ship_adress').value = props.auth.adress;
                            setAdresse(props.auth.adress)
                            document.querySelector('#ship_phone').value = props.auth.phone;
                            setPhone(props.auth.phone)
                            document.querySelector('#ship_country').value = props.auth.country.toUpperCase();
                            setCountry(props.auth.country)
                            document.querySelector('#ship_city').value = props.auth.city;
                            setCity(props.auth.city)
                        }}>Importer vos informations</button>
                        :
                        <div className='flex flex-col items-center'>
                            <p id='ship_email_invite'>Commander en tant qu'invité ?</p>
                            <input type="email" placeholder="Votre Adresse Mail..." id="invite_mail" onChange={(e) => {
                                setSendMessage(e.target.value)
                            }} />
                        </div>
                    }
                    <form id='form_shipping'>
                        <h1 id='ship_title'>Informations d'expéditions</h1>
                        <input onChange={(e) => {
                            setName(e.target.value)
                        }} id='ship_name' type="text" placeholder="Nom" class="validator-input" />
                        <input onChange={(e) => {
                            setFirstName(e.target.value)
                        }} id='ship_firstname' type="text" placeholder="Prenom" class="validator-input" />
                        <input onChange={(e) => {
                            setCity(e.target.value)
                        }} id='ship_city' type="text" placeholder="Ville" class="validator-input" />
                        <input onChange={(e) => {
                            setZipcode(e.target.value)
                        }} id='ship_code' type="text" placeholder="Code Postal" class="validator-input" />
                        <input onChange={(e) => {
                            setAdresse(e.target.value)
                        }} id='ship_adress' type="text" placeholder="Adresse" class="validator-input" />
                        <input onChange={(e) => {
                            e.target.value = e.target.value.toUpperCase()
                            setCountry(e.target.value)
                        }} id='ship_country' type="text" placeholder="Pays (en anglais)" class="validator-input" />
                        <input onChange={(e) => {
                            setPhone(e.target.value)
                        }} id='ship_phone' type="text" placeholder="N° de Téléphone" class="validator-input" />
                        {!isloading ?
                            <button id='ship_button' onClick={(e) => {
                                e.preventDefault()
                                setLoading(true)
                                exportNode(props.price)
                            }}>Voir les expéditeurs</button>
                            :
                            <div className="loader expeloader"></div>
                        }
                    </form>
                </div>
                {(listFedex.length !== 0) &&
                    <div className='flex flex-col items-center'>
                        {(listFedex.length !== 0) &&
                            <select id="shippingSelect" onChange={(e) => {
                                setResponse(parseFloat(e.target.value).toFixed(2) + "€")
                                setShippingRate(parseFloat(e.target.value).toFixed(2))
                                props.Facturation((parseFloat(e.target.value) + props.price).toFixed(2));
                                setDelivery(true)
                            }}>
                                {listFedex.map(expo => {
                                    return (<option value={props.dollarConverter(expo.retail_rate).toFixed(2)}>{expo.carrier + ': ' + props.dollarConverter(expo.retail_rate).toFixed(2)} €</option>)
                                })}
                            </select>
                        }
                        {response && (
                            <div id='resume-commande'>
                                <h3 id="title_resume">Coût des achats</h3>
                                <p id='resume_price'>{props.price} €</p>
                                <h3 id="title_resume">Frais de Port</h3>
                                {response}
                                <h3 id="title_resume">Prix Total</h3>
                                <p id='resume_price'>{props.total} €</p>
                            </div>
                        )}
                        {isDeliverable && (
                            <button id='card_button_redirect' onClick={(e) => {
                                props.dropShipping({
                                    user: {
                                        name: firstname + ' ' + name,
                                        email: sendMessage,
                                        phone: phone,
                                        address: adresse,
                                        city: city,
                                        zipcode: testZipCode,
                                        country: country
                                    },
                                    panier: props.panier,
                                    prices: {
                                        solo: props.price,
                                        shippingRate: shippingRate,
                                        totalPrice: props.total
                                    }
                                });
                                navigation('/card')
                            }}>Renseigner vos coordonnées bancaires</button>
                        )}
                    </div>}
            </div>
        </div>
    );
}

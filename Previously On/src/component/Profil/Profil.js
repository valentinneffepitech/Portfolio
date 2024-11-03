import React, { useEffect, useState } from 'react'
import './Profil.css'
import { useNavigate } from 'react-router-dom';

export default function Profil(props) {
    const navigation = useNavigate();
    const [mySeries, setMySeries] = useState([]);
    useEffect(() => {
        initProfile();
    }, [props.user])
    useEffect(() => console.log(mySeries), [mySeries])
    function initProfile() {
        if (!props.user.id) {
            return;
        }
        const options = {
            method: "GET",
            headers: {
                "content-type": "application/json"
            }
        }
        try {
            fetch(props.url + "profile?token=" + props.token, options).then(res => res.json()).then(data => {
                console.log(data);
                setMySeries(data);
            });
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div>
            <main>
                <div id="my_series" className='container'>
                    <h4 className='title'>Mes series</h4>
                    <div id='series'>
                        {mySeries.map(serie => (
                            <div className='serie_card'>
                                <img title={"Accéder la page de " + serie.title} src={serie.images.poster} alt={serie.title} onClick={() => {
                                    navigation('/serie/' + serie.id);
                                }} />
                            </div>
                        ))}
                    </div>
                </div>
                <div id="colonne_right">

                </div>
            </main>
        </div>
    )
}

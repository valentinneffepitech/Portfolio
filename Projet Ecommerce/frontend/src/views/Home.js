import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function Home(props) {
    const navigation = useNavigate();
    const [listeArticles, setListeArticles] = useState([]);
    useEffect(() => {
        axios.get(props.url + 'bestsellers').then((res) => setListeArticles(res.data)).catch((error) => console.log(error))
    }, [])
    const articles = listeArticles.map(element => {
        return (
            <article key={element.id} className="item" onClick={() => {
                navigation('/article/' + element.item_id)
            }}>
                <div className='item_front'>
                    <div className='item_body'>
                        <img className="item_img" src={props.imageUrl + element.photo_source} alt={element.name} />
                        <div className='item_title'>{element.name}</div>
                        <p className='item_price text-lg'>{(element.price - (element.price * (element.reduction / 100))).toFixed(2)}</p>
                    </div>
                </div>

            </article>);
    })

    return (
        <div>
            <div className='home-content'>
                <div className='carrousel'>
                </div>
            </div>
            <h3 className="text-4xl undertitle text-center font-montserrat font-semibold pb-5 border-b-4 border-gray-500 text-gray-600">Nos articles les plus consultés</h3>
            <main>
                {articles}
            </main>
        </div>
    )
}

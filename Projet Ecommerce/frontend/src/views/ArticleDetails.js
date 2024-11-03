import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';

export default function ArticleDetails(props) {
    const { id } = useParams();
    const navigation = useNavigate();
    const [item, setItem] = useState({});
    const [number, setNumber] = useState(0);
    const [stockStyle, setStockStyle] = useState('');
    const [stocksStatus, setStocksStatus] = useState('');

    useEffect(() => {
        axios.get(props.url + 'article/' + id).then(res => {
            setItem(res.data.item)
        }).catch(error => navigation('/error'));
    }, [id])

    useEffect(() => {
        if (item.stocks === 0) {
            setStocksStatus("Article momentanément indisponible !");
            setStockStyle('danger');
        } else if (item.stocks <= 25) {
            setStocksStatus(`Seulement ${item.stocks} encore en stock`);
            setStockStyle('warning');
        } else {
            setStocksStatus(`Cet article est disponible`);
            setStockStyle('success');
        }
    }, [item])

    function deleteArticle() {
        axios.delete(props.url + "deleteArticle/" + item.item_id).then(res => navigation('/')).catch(error => console.log(error));
    }
    function modify_article() {
        if (parseInt(item.stocks) === 0) {
            if (!window.confirm("Aucun article en stocks ?")) {
                return;
            }
        }
        if (parseInt(item.reduction) === 0) {
            if (!window.confirm("Aucune réduction ?")) {
                return;
            }
        }
        let formData = new FormData();
        formData.append('name', item.name);
        formData.append('desc', item.description);
        formData.append('price', item.price);
        formData.append('stocks', item.stocks);
        formData.append('reduction', item.reduction);
        formData.append('weight', item.weight);
        axios.post(props.url + "update_article/" + item.item_id, formData).then(res => navigation('/')).catch(error => console.log(error));
    }
    if (props.auth.isAdmin) {
        return (
            <main id="article">
                {/* VIEW ADMIN */}
                <div className='admin-view-article'>

                    <div className='image-div'>

                        <figure className='article-photo-container' id="photo_article">
                            <img src={props.imageUrl + item.photo_source} alt={item.name} className='photo-article' id="photo_article_content" />
                        </figure>
                    </div>
                    <div className='form-article-admin'>
                        <h1 className='article-title-title'>Information de l'article</h1>
                        <form id="modify_article">
                            <input className="article-input" defaultValue={item.name} type="text" id="article_title" placeholder="Nom de l'article" onChange={(e) => {
                                setItem(prev => ({ ...prev, name: e.target.value }));
                            }} />
                            {item.price &&
                                <input className="article-input" style={{ marginTop: '1vh' }} defaultValue={item.price} type="number" id="article_Price" step={0.01} min={0} placeholder="Prix de l'article" onChange={
                                    (e) => {
                                        setItem(prev => ({ ...prev, price: e.target.value }));
                                    }
                                } />
                            }
                            <input className="article-input" defaultValue={item.stocks} type="number" id="article_stocks" step={1} min={0} placeholder="Nombre de pièces de l'article" onChange={
                                (e) => {
                                    setItem(prev => ({...prev, stocks: e.target.value }));
                                }
                            } />
                            <input className="article-input" defaultValue={item.reduction} type="number" id="article_reduction" step={1} min={0} placeholder="Réduction sur l'article" onChange={
                                (e) => {
                                    setItem(prev => ({...prev, reduction: e.target.value }));
                                }
                            } />
                            <input className="article-input" defaultValue={item.weight} type="number" id="weight" step={1} min={0} placeholder="Poids de l'article (en kg)" onChange={(e) => {
                                setItem(prev => ({...prev, weight: e.target.value }));
                            }} />
                            <textarea className='input-article-area' defaultValue={item.description} rows={10} cols={50} id="modify_desc" placeholder="Description de l'article" onChange={(e) => {
                                setItem(prev => ({...prev, description: e.target.value }));
                            }}></textarea>
                            <button className="article-button" onClick={
                                (e) => {
                                    e.preventDefault();
                                    modify_article();
                                }
                            }>Modifier l'article</button>
                        </form>
                    </div>
                </div>
                <button id="delete_article" className='delete-button' onClick={() => {
                    deleteArticle();
                }}><img className="delete-button-image" src={process.env.PUBLIC_URL + '/assets/images/delete.png'} alt={"supprimer"} /><p>Supprimer l'article</p></button>

                {/* VIEW USER */}
                <div id="customer_preview">
                    <h1 className="text-4xl">Ce que les visiteurs voient</h1>
                    <div className='client-view-article'>
                        <main id="article-client">
                            <div className='photo-client-article'>
                                <figure className='article-photo-container' id="photo_article">
                                    <img className="photo-client" src={props.imageUrl + item.photo_source} alt={item.name} id="photo_article_content" />
                                </figure>
                            </div>
                            <div className='client-article-content'>
                                <section id="article_infos" className='article-info'>
                                    <div id="article_header">
                                        <h1 id="article-title">{item.name}</h1>
                                        <div>
                                            <h4 className="text-xl">Description de l'article:</h4>
                                            <p id="article-desc">{item.description}</p>
                                        </div>
                                    </div>
                                    <div id="article_footer" className='article-footer'>
                                        <div id="article_footer_title">
                                            <h1 className="text-2xl" id="article_price">{(item.price - (item.price * (item.reduction / 100))).toFixed(2)} €</h1>
                                            {item.reduction !== 0 ?
                                                <h3 className="text-1xl" id="old_price">{item.price}€</h3>
                                                :
                                                <div></div>
                                            }
                                            <p className={stockStyle} >{stocksStatus}</p>
                                        </div>
                                        <div className='article-footer-center'>
                                            <input type="number" className="article-input" placeholder="Nombre d'exemplaire" id="number_command" min={0} max={item.stocks} onChange={(e) => {
                                                setNumber(parseInt(e.target.value));
                                            }} />
                                            <button className="article-button" id="addToCart" onClick={(e) => {
                                                if (number > 0) {
                                                    let init = 0;
                                                    props.panier.forEach((element) => {
                                                        if (element.item_id === item.item_id) {
                                                            init++;
                                                        }
                                                    })
                                                    let diff = item.stocks - init;
                                                    if ((number + init) > item.stocks) {
                                                        alert('Pas assez de pièces en stock mais voici le maximum possible !');
                                                        document.querySelector('#number_command').value = diff;
                                                        setNumber(diff);
                                                        return;
                                                    }
                                                    if (number < 1) {
                                                        return;
                                                    }
                                                    let tableau = [];
                                                    for (let i = 0; i < number; i++) {
                                                        tableau.push(item);
                                                    }
                                                    props.addToCart(tableau);
                                                    document.querySelector('#number_command').value = 0;
                                                    setNumber(0)
                                                }
                                            }}>Ajouter au panier</button>
                                        </div>

                                    </div>
                                </section>
                            </div>
                        </main >
                    </div>
                </div>

            </main>)
    }
    return (
        <div className='client-view-article'>
            <main id="article-client">
                <div className='photo-client-article'>
                    <figure className='article-photo-container' id="photo_article">
                        <img className="photo-client" src={props.imageUrl + item.photo_source} alt={item.name} id="photo_article_content" />
                    </figure>
                </div>
                <div className='client-article-content'>
                    <section id="article_infos" className='article-info'>
                        <div id="article_header">
                            <h1 id="article-title">{item.name}</h1>
                            <div>
                                <h4 className="text-xl">Description de l'article:</h4>
                                <p id="article-desc">{item.description}</p>
                            </div>
                        </div>
                        <div id="article_footer" className='article-footer'>
                            <div id="article_footer_title">
                                <h1 className="text-2xl" id="article_price">{(item.price - (item.price * (item.reduction / 100))).toFixed(2)} €</h1>
                                {item.reduction !== 0 ?
                                    <h3 className="text-1xl" id="old_price">{item.price}€</h3>
                                    :
                                    <div></div>
                                }
                                <p className={stockStyle} >{stocksStatus}</p>
                            </div>
                            <div className='article-footer-center'>
                                <input type="number" className="article-input" placeholder="Nombre d'exemplaire" id="number_command" min={0} max={item.stocks} onChange={(e) => {
                                    setNumber(parseInt(e.target.value));
                                }} />
                                <button className="article-button" id="addToCart" onClick={(e) => {
                                    if (number > 0) {
                                        let init = 0;
                                        props.panier.forEach((element) => {
                                            if (element.item_id === item.item_id) {
                                                init++;
                                            }
                                        })
                                        let diff = item.stocks - init;
                                        if ((number + init) > item.stocks) {
                                            alert('Pas assez de pièces en stock mais voici le maximum possible !');
                                            document.querySelector('#number_command').value = diff;
                                            setNumber(diff);
                                            return;
                                        }
                                        if (number < 1) {
                                            return;
                                        }
                                        let tableau = [];
                                        for (let i = 0; i < number; i++) {
                                            tableau.push(item);
                                        }
                                        props.addToCart(tableau);
                                        document.querySelector('#number_command').value = 0;
                                        setNumber(0)
                                    }
                                }}>Ajouter au panier</button>
                            </div>

                        </div>
                    </section>
                </div>
            </main >
        </div>
    )
}
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


//Ajouter des articles dans la DB

export default function AddArticle(props) {
    const navigation = useNavigate();
    const [type, setType] = useState(1);
    const [image, setImage] = useState({});
    const [stocks, setStocks] = useState(0);
    const [weight, setWeight] = useState(0);
    const [reduction, setReduction] = useState(0);
    const [categories, setCategories] = useState([]);
    const [articleName, setArticleName] = useState('');
    const [articlePrice, setArticlePrice] = useState(0);
    const [articleDescription, setArticleDescription] = useState('');
    //Afficher la preview de la photo quand l'image dans l'input change
    useEffect(() => {
        if (image.name) {
            displayPic();
        }
    }, [image]);
    //Chercher la liste des catégories afin de les mettre dans le Select
    useEffect(() => {
        axios.get(props.url + 'categories').then(res => setCategories(res.data.data)).catch(error => console.log(error))
    }, [])
    //Fonction pour afficher l'image dans la preview
    function displayPic() {
        if (!image) {
            document.querySelector('#Preview').style.display = 'none';
        } else {
            document.querySelector('#Preview').style.display = 'block';
            document.querySelector('#Preview').src = URL.createObjectURL(image);
        }
    }
    //Checker si les champs sont remplis
    function prepareArticle() {
        if (!props.checkInput()) {
            return;
        }
        if (reduction > 100) {
            setReduction(100);
        }
        const formdata = new FormData();
        formdata.append('name', articleName);
        formdata.append('price', parseFloat(articlePrice))
        formdata.append('description', articleDescription)
        formdata.append('stocks', stocks)
        formdata.append('weight', weight);
        formdata.append('category_id', type);
        formdata.append('userId', props.auth.id);
        formdata.append('reduction', reduction)
        formdata.append('image', image)
        axios.post(props.url + 'add_item', formdata).then((res) => navigation('/')).catch(error => console.log(error));
    }
    //Map pour avoir toutes les catégories
    const list_categories = categories.map((element) => {
        return (<option key={element.id} value={element.id}>{element.name}</option>)
    })
    return (
        <main>
            <div className='home-content'>
                <div>
                    <h3 className="text-4xl title-article">Ajouter un article</h3>
                    <form id="add_article" className='article-form'>
                        <p className='input-article-name'>Nom de l'article :</p>
                        <input className="input-article" type="text" id="add_name" placeholder="Nom de l'article" onChange={(e) => {
                            setArticleName(e.target.value);
                        }} />
                        <p className='input-article-name'>Description :</p>
                        <textarea className="input-article-area" rows={10} cols={50} id="add_description" placeholder="Description de l'article" onChange={(e) => {
                            setArticleDescription(e.target.value);
                        }} ></textarea>
                        <p className='input-article-name'>Quantité :</p>
                        <input className="input-article" type="number" id="add_price" step={1} min={0} placeholder="Nombre de pièces de l'article" onChange={(e) => {
                            setStocks(e.target.value);
                        }} />
                        <p className='input-article-name'>Prix :</p>
                        <input className="input-article" type="number" id="add_price" step={0.01} min={0} placeholder="Prix de l'article" onChange={(e) => {
                            setArticlePrice(e.target.value);
                        }} />
                        <p className='input-article-name'>Reduction sur l'article :</p>
                        <input className="input-article" type="number" id="add_reduction" step={1} min={0} max={100} placeholder="Pourcentage de réduction" onChange={(e) => {
                            setReduction(e.target.value);
                        }} />
                        <p className='input-article-name'>Poids de l'article (en g):</p>
                        <input className="input-article" type="number" id="weight" step={1} min={0} placeholder="Poids de l'article" onChange={(e) => {
                            setWeight(e.target.value);
                        }} />
                        <p className='input-article-name'>Catégorie :</p>
                        <select className="article-select" id="select_category" name="select_category" onChange={(e) => {
                            setType(e.target.value);
                        }}>
                            {list_categories}
                        </select>
                        <label id="label_photo_article" htmlFor="add_picture_article">Ajouter une photo de l'article</label>
                        <input className="input-article" type="file" id="add_picture_article" accepts="png, jpg, jpeg" onChange={(e) => {
                            setImage(e.target.files[0]);
                        }} />
                        <figure id="preview_article">
                            <img src="" alt="Votre article s'affichera ici" id="Preview" />
                        </figure>
                        <button className="button-article" onClick={
                            (e) => {
                                e.preventDefault();
                                prepareArticle();
                            }
                        }>Enregistrer l'article</button>
                    </form>
                </div>
            </div>
        </main>
    )
}

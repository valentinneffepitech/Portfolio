import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

export default function AddCategories(props) {
    const [categorie, setCategorie] = useState('');
    function createCategory() {
        if (categorie === "") {
            return;
        }
        const formData = new FormData();
        formData.append('name', categorie);
        axios.post(props.url + 'categorie', formData).then(res => {
            document.querySelector('#category_name').value = "";
        }).catch(err => {
            alert(err.response.data);
            props.checkInput()
        });
    }
    return (
        <main id="ajout_categories">
            <div className='home-content'>
                <div>
                    <h1 className='title-category text-3xl'>Créer une nouvelle catégorie</h1>
                    <form className="form-category" id="form_categories">
                        <p className='input-name'>Catégorie :</p>
                        <input className="input-category" type="text" id="category_name" placeholder='Nouvelle Catégorie...' onChange={
                            (e) => {
                                setCategorie(e.target.value)
                            }
                        } />
                        <button className='button-category' id="add_categories" onClick={
                            (e) => {
                                e.preventDefault();
                                createCategory();
                            }
                        }>Ajoutez la catégorie</button>
                    </form>
                </div>
            </div>
        </main>
    )
}
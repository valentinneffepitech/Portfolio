import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Navbar(props) {
    const isConnected = props.isConnected;
    const handleLogout = () => {
        props.logout();
    };
    const navigation = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const handleFocus = () => {
        setIsSearchFocused(true);
    };

    const handleBlur = () => {
        setIsSearchFocused(false);
    };

    const handleSearch = async (event) => {
        const value = event.target.value;
        setSearchTerm(value);

        if (value.length > 0) {
            try {
                const response = await axios.post('http://localhost:8000/api/searchbar', { searchbar: value });
                setSearchResults(response.data);
            } catch (error) {
                console.error(error);
            }
        } else {
            setSearchResults([]);
        }
    };

    return (

        <div>
            <nav className='nav'>
                <Link to={'/'}><img className='logo' src={process.env.PUBLIC_URL + "/assets/images/pex_logo.png"} alt="Logo PEX" /></Link>
                <input
                    type='text'
                    placeholder="Search..."
                    className={`searchbar ${isSearchFocused ? 'focused' : ''}`}
                    value={searchTerm}
                    onChange={handleSearch}
                    onFocus={handleFocus}
                />

                {isConnected ?
                    <div id="navlinks">
                        {props.auth.isAdmin ?
                            <ul className="dropDown">
                                <Link to={'/admin/dashboard'} className='profil-text'><img className='profil' src={process.env.PUBLIC_URL + '/assets/images/parametre.png'} alt="admin" />Admin</Link>
                                <div className='ddparent administrator'>
                                    <li className='dropdownElement'><Link to={'/admin/dashboard'}>Votre espace administrateur</Link></li>
                                    <li className='dropdownElement'><Link to={'/admin/add_article'}>Nouvel article</Link></li>
                                    <li className='dropdownElement'><Link to={'/admin/add_category'}>Nouvelle categorie</Link></li>
                                </div>
                            </ul>
                            :
                            null
                        }
                        <ul className="dropDown">
                            <Link to={'/profil'} className='profil-text'><img className='profil' src={process.env.PUBLIC_URL + '/assets/images/profil.png'} alt="Profil" />{props.auth.name ? <span>{props.auth.name}</span> : <span>Mon Compte</span>}</Link>
                            <div className='ddparent profile'>
                                <li className='dropdownElement'><Link to={'/profil'}>Votre Profil</Link></li>
                                <li className='dropdownElement'><span id="logout_button" onClick={() => {
                                    props.logout();
                                    navigation('/');
                                }}>Se déconnecter</span></li>
                            </div>
                        </ul>
                        {(props.panier.length !== 0) ?
                            <div id="panier_div">
                                <Link to="/panier" className='panier-text'><img className='panier' src={process.env.PUBLIC_URL + '/assets/images/panierr.png'} alt="panier" />Panier</Link><div class="super_panier"><span id="panier_length">{props.panier.length}</span></div>
                            </div>
                            :
                            <Link className='panier-text' to='/panier'><img className='panier' src={process.env.PUBLIC_URL + '/assets/images/panierr.png'} alt="panier" />Panier</Link>

                        }
                    </div>
                    :
                    <div className='nav-content'>
                        <div id="connection">
                            <ul className="dropDown">
                                <Link to={'/login'} className='profil-text'><img className='profil' src={process.env.PUBLIC_URL + '/assets/images/profil.png'} alt="profil" />Mon Compte</Link>
                                <div className='ddparent'>
                                    <li className='dropdownElement'><Link to={'/login'}>Se connecter</Link></li>
                                    <li className='dropdownElement'><Link to={'/register'}>S'enregistrer</Link></li>
                                </div>
                            </ul>
                            {(props.panier.length !== 0) ?
                                <div id="panier_div">
                                    <Link to="/panier" className='panier-text'><img className='panier' src={process.env.PUBLIC_URL + '/assets/images/panierr.png'} alt="panier" />Panier</Link><div class="super_panier"><span id="panier_length">{props.panier.length}</span></div>
                                </div>
                                :
                                <Link className='panier-text' to='/panier'><img className='panier' src={process.env.PUBLIC_URL + '/assets/images/panierr.png'} alt="panier" />Panier</Link>

                            }
                        </div>
                    </div>
                }
            </nav>
            {(searchResults.length > 0 && isSearchFocused) && (
                <div className='search-results'>
                    <ul>
                        {searchResults.map((item) => (
                            <li key={item.id} onClick={() => {
                                navigation(`/article/${item.id}`);
                                handleBlur();
                            }}>
                                <Link to={`/article/${item.id}`}>
                                    <img src={props.imageUrl + item.photo_source} alt={item.name} className="item-image" />
                                    <p>{item.name} - {item.price}€</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div className='second-nav'>
                <Link title={"Découvrez nos articles"} to={'/produits'} className='sencond-nav-text'>NOS PRODUITS</Link>
                <Link title={"Simulation de setups"} to={'/JN_ShowCase'} className='sencond-nav-text'>NOS SETUPS</Link>
                <Link title={"Retrouvez votre commande"} to={'/deliverytracker'} className='sencond-nav-text'>SUIVRE UNE COMMANDE</Link>
                <Link title={"Un soucis?"} to={'/contact'} className='sencond-nav-text'>NOUS CONTACTER</Link>
            </div>
        </div>
    );
}

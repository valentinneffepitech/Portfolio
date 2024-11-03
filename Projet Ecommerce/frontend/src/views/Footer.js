import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';


export default function Footer() {
    const navigation = useNavigate();
    return (
        <footer>
            <div className='footer-content'>

                <div className='help-footer'>
                    <div className='footer-title'>
                        <h1>BESOIN D'AIDE</h1>
                    </div>
                    <p onClick={()=>navigation('/contact')}>Service Client</p>
                    <p onClick={()=>navigation('/deliverytracker')}>Voir ou Suivre une commande</p>
                </div>
                <div className='follow-footer'>
                    <div className='footer-title'>
                        <h1>NOUS SUIVRE</h1>
                    </div>
                    <div className='icon-group'>
                        <Link id="instagram" to={'https://www.instagram.com/'} target='_blank' alt="Lien vers Instagram" title="Lien vers Instagram"><img className='icon-footer' src={process.env.PUBLIC_URL + "/assets/images/instagram.png"} alt="Logo Insta" /></Link>
                        <Link id="x" to={'https://twitter.com'} target='_blank' alt="Lien vers Twitter/X" title="Lien vers X"><img className='icon-footer' src={process.env.PUBLIC_URL + "/assets/images/twitter.png"} alt="Logo Twitter" /></Link>
                        <Link id="facebook" to={'https://fr-fr.facebook.com/'} target='_blank' alt="Lien vers Facebook" title="Lien vers Facebook"><img className='icon-footer' src={process.env.PUBLIC_URL + "/assets/images/facebook.png"} alt="Logo FB" /></Link>
                    </div>
                </div>
                <div className='contact-footer'>
                    <div className='footer-title'>
                        <h1>NOUS CONTACTER</h1>
                        <div className='number-container'>
                            <span className='number' onClick={(e) => {
                                window.navigator.clipboard.writeText(e.target.textContent);
                            }} title='Cliquez pour copier le numéro'>06 XX XX XX XX</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='bottom-line'></div>
            <div className='bottom-footer'>
                <Link to={'/'}>&copy;2023 PEX</Link>
                <Link to={'/'}>Mentions légales</Link>
                <Link to={'/'}>Avis</Link>
                <Link to={'/'}>Cookies</Link>
                <Link to={'/'}>Données Personnelles</Link>
            </div>
        </footer>
    )
}
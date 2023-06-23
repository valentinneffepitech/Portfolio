import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className='navbar navbar-dark bg-dark'>
            <ul>
                <li><Link className="navlink" to='/'>Home</Link></li>
                <li><Link className="navlink" to='/profil'>A propos de moi</Link></li>
                <li><Link className="navlink" to='/projects'>Projets</Link></li>
            </ul>
        </nav>
    )
}

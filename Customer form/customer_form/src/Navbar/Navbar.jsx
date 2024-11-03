import React, { useContext } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthContext';

const Navbar = () => {
    const nav = useNavigate();
    const { user, logout } = useContext(AuthContext);
    return (
        <nav>
            {
                !user ?
                    <ul>
                        <li>
                            <Link to="/">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/login">
                                Accès Administrateur
                            </Link>
                        </li>
                    </ul>
                    :
                    <ul>
                        <li>
                            <Link to="/users">
                                Tous les utilisateurs
                            </Link>
                        </li>
                        <li>
                            <Link to="/update">
                                Modifier le questionnaire
                            </Link>
                        </li>
                        <li onClick={() => {
                            logout();
                            nav('/')
                        }}>
                            Déconnexion
                        </li>
                    </ul>
            }

        </nav>
    )
}

export default Navbar

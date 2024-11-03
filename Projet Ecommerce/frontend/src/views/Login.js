import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login(props) {
    const navigation = useNavigate();
    const [login_user, setLogger] = useState('');
    const [user_password, setUserPassword] = useState('');
    function testLogin() {
        const data = {
            login_user: login_user,
            user_password: user_password
        }
        axios.post(props.url + 'login', data).then(res => {
            props.onLogin(res.data.success[0]);
            navigation('/');
        }).catch(err => {
            document.querySelector('#error').textContent = err.response.data.error;
        });
    }
    return (
        <div className='home-content'>
            <div>
                <h1 className='title-login text-4xl'>Connectez-vous</h1>
                <Link to={'/register'} className='subtitle-register'>Vous souhaitez créer un compte ?</Link>
                <form method="POST" className='form'>
                    <p id="error"></p><br />
                    <p className='input-name'>Adresse Email :</p>
                    <input type="text" id="login_user" className="input-login" placeholder='Exemple@exemple.com' name="login_user" onChange={
                        (e) => {
                            setLogger(e.target.value);
                        }
                    } />
                    <p className='input-name'>Mot de passe :</p>
                    <input type="password" className="input-login" id="user_password" name="userpassword" onChange={
                        (e) => {
                            setUserPassword(e.target.value);
                        }
                    } />
                    <button className='input-button' onClick={
                        (e) => {
                            e.preventDefault();
                            testLogin();
                        }
                    }>Se connecter</button>
                </form>
            </div>
        </div>
    )
}
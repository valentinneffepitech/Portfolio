import React, { useState } from 'react'
import './Login.css';
import { useNavigate } from 'react-router-dom';

export default function Login(props) {
    const navigation = useNavigate();
    const [data, setData] = useState({});
    const handleSubmit = () => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        fetch(props.url + 'auth', options).then(res => res.json()).then(data => {
            props.onLogin(data.user);
            sessionStorage.setItem('userTechFlix', JSON.stringify(data.user));
            sessionStorage.setItem('TechFlixToken', JSON.stringify({ token: data.token, hash: data.hash }))
            props.setAccess({
                token: data.token,
                hash: data.hash
            })
            navigation('/')
        }).catch(err => console.log(err));
    }
    return (
        <div className='container'>
            <h3 className='text-6xl my-4 main-title'>Connectez-vous avec BetaSeries</h3>
            <form id="form-login" onSubmit={(ev) => {
                ev.preventDefault();
                handleSubmit();
            }}>
                <input className='form-control my-10 input-login' required name="login" placeholder="Votre Login..." type="text" onChange={(e) => {
                    setData(prev => {
                        return (
                            {
                                ...prev,
                                [e.target.name]: e.target.value
                            }
                        )
                    })
                }} />
                <input className='form-control my-10 input-login' required name="password" placeholder="Votre Mot de Passe" type="password" onChange={(e) => {
                    setData(prev => {
                        return (
                            {
                                ...prev,
                                [e.target.name]: e.target.value
                            }
                        )
                    })
                }} />
                <button className='btn btn-login'>Se connecter</button>
            </form>
        </div>
    )
}

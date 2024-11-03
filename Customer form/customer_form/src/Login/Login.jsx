import { useContext, useState } from 'react'
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const nav = useNavigate();
    const { login } = useContext(AuthContext);
    const [form, setForm] = useState({});
    const handleLogin = (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('login', form.login);
        formData.append('password', form.password);
        formData.append('action', 'login');
        fetch('http://localhost:3001', {
            method: 'POST',
            body: formData
        }).then(res => res.json()).then(data => {
            if (data.error) {
                alert(data.error);
            } else if (data.success) {
                login();
                nav("/users")
            }
        });
    }
    return (
        <form id="loginForm" onSubmit={(e) => handleLogin(e)}>
            <input className='form-control' placeholder='Login' required name="login" type="email" onChange={(e) => setForm(prev => ({
                ...prev,
                [e.target.name]: e.target.value
            }))} />
            <input className='form-control' placeholder="Password" required name="password" type="password" onChange={(e) => setForm(prev => ({
                ...prev,
                [e.target.name]: e.target.value
            }))} />
            <button className='btn btn-secondary'>Se connecter</button>
        </form>
    )
}

export default Login

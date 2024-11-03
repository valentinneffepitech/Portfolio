import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register(props) {
  
  const navigation = useNavigate();
  const [city, setCity] = useState('');
  const [name, setName] = useState('');
  const [email, setMail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPass] = useState('');
  const [adress, setAdress] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [country, setCountry] = useState('');

  function register() {
    document.querySelector('#error_register_email').textContent = " ";
    document.querySelector('#error_register_name').textContent = " ";
    document.querySelector('#error_register_password').textContent = " ";
    if (!props.checkInput()) {
      alert('Veuillez compléter tous les champs !');
      return;
    }
    if (password.length < 8) {
      document.querySelector('#error_register_password').textContent = "Au moins 8 caractères !";
      return;
    }
    if (phone.toString().length < 10) {
      document.querySelector('#error_register_password').textContent = "Téléphone invalide !";
      return;
    }
    const data = {
      name: name,
      email: email,
      password: password,
      phone: phone,
      adress: adress,
      zipcode: zipcode,
      city: city,
      country: country,
    }
    axios.post(props.url + 'register', data).then(res => {
      props.onRegister(res.data.success);
      navigation('/');
    }).catch(error => {
      if (error.response.data.error_mail) {
        document.querySelector('#error_register_email').textContent = error.response.data.error_mail;
        document.querySelector('#email').style.setProperty('border', "2px solid red");
      } else if (error.response.data.error_name) {
        document.querySelector('#error_register_name').textContent = error.response.data.error_name;
        document.querySelector('#name').style.setProperty('border', "2px solid red");
      } else {
        console.log(error.response.data)
      }
    });
  }

  return (
    <main id="register">

      <div className='home-content'>

        <div className='loginpage'>

          <h1 className='title-register text-4xl'>Enregistrez vous</h1>
          <Link to={'/login'} className='subtitle-register'>Déjà client ?</Link>

          <form id="form-register">
            <div className='form-register'>

              <div className='register1'>

                <p className='input-name'>Pseudo :</p>
                <p className="error" id="error_register_name"></p>
                <input className="input-register" type="text" id="name" placeholder='Votre nom' name="name" onChange={(e) => {
                  setName(e.target.value);
                }} />

                <p className='input-name'>Adresse Email :</p>
                <p className="error" id="error_register_email"></p>
                <input className="input-register" type="text" id="email" placeholder='Votre adresse mail' name="email" onChange={(e) => {
                  setMail(e.target.value);
                }} />

                <p className='input-name'>Mot de passe :</p>
                <p className="error" id="error_register_password"></p>
                <input className="input-register" type="password" placeholder='Votre mot de passe' name="password" onChange={(e) => {
                  setPass(e.target.value);
                }} />

                <p className='input-name'>Téléphone :</p>
                <input className="input-register" type="number" placeholder='Téléphone' name="phone" onChange={(e) => {
                  setPhone(e.target.value);
                }} />
              </div>

              <div className='register2'>

                <p className='input-name'>Adresse :</p>
                <input className="input-register" type="text" placeholder='Adresse' name="adress" onChange={(e) => {
                  setAdress(e.target.value);
                }} />

                <p className='input-name'>Code postal :</p>
                <input className="input-register" type="text" placeholder='Code postal' name="zipcode" onChange={(e) => {
                  setZipcode(e.target.value);
                }} />

                <p className='input-name'>Ville :</p>
                <input className="input-register" type="text" placeholder='Ville' name="city" onChange={(e) => {
                  setCity(e.target.value);
                }} />

                <p className='input-name'>Pays :</p>
                <input className="input-register" type="text" placeholder='Pays' name="adress" onChange={(e) => {
                  setCountry(e.target.value);
                }} />
              </div>
            </div>
            <button className="button-register" id="submit_register" onClick={
              (e) => {
                e.preventDefault();
                register();
              }
            }>Enregistrer</button>
          </form>

        </div>
      </div>
    </main>
  )
}

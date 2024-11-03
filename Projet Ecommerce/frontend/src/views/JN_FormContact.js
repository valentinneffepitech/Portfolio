import React, { useRef, useState } from 'react';
import 'animate.css/animate.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Contact = () => {
    const buttonRef = useRef(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const buttonAnimation = () => {
        buttonRef.current.classList.add("animate__fadeOut");
        setTimeout(() => {
            buttonRef.current.classList.remove("animate__fadeOut");
        }, 1500);
    };
    return (
        <div className="flex justify-center items-center bg-indigo-200 text-xl">
            <form
                method="POST"
                className="bg-navy-darker my-14 p-16 rounded-lg border-4 border-amber-600 bg-indigo-950 "
                onSubmit={(e) => {
                    e.preventDefault();
                    axios.defaults.headers.post['Content-Type'] = 'application/json';
                    axios.post('https://formsubmit.co/ajax/neffvalentin@gmail.com', {
                        name: name,
                        email: email,
                        message: message
                    })
                        .then(response => console.log(response))
                        .catch(error => console.log(error));
                    e.target.querySelectorAll('.toReset').forEach(input => {
                        input.value = "";
                    })
                }}
            >
                <input type="hidden" name="_next" value="http://www.google.com"></input>
                <h3 className="text-white text-4xl mb-8 animate__animated animate__backInRight ">
                    Vous avez des
                    <span className="text-yellow-400 font-bold"> questions </span> ou
                    <span className="text-green-400 font-bold"> envie</span> ?
                </h3>
                <label htmlFor="name" className="text-orange-400 font-black block mb-2">
                    Nom :
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder='Votre nom ?'
                    required
                    className="toReset border border-emerald-700 px-2 py-1 mb-4 bg-navy-darkest text-indigo-800"
                    onChange={(e) => setName(e.target.value)}
                />
                <br />
                <label htmlFor="email" className="text-orange-400 font-black block mb-2">
                    E-mail :
                </label>
                <input
                    placeholder="Qu'on vous retrouve !"
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="toReset border border-emerald-700 px-2 py-1 mb-4 bg-navy-darkest text-indigo-800"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br />
                <label htmlFor="message" className="text-orange-400 font-black block mb-2">
                    Message :
                </label>
                <textarea
                    id="message"
                    name="message"
                    required
                    className="toReset border border-emerald-700 px-2 py-2 mb-4 bg-navy-darkest text-indigo-800 w-full resize-y"
                    placeholder="Vos demandes ? Notre alternant répondra avant les RH"
                    onChange={(e) => { setMessage(e.target.value) }}
                ></textarea>
                <br />
                <input
                    type="submit"
                    value="Envoyer"
                    onClick={buttonAnimation}
                    ref={buttonRef}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer animate__animated"
                />
            </form>
        </div>
    );
};

export default Contact;
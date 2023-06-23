import React, { useRef } from 'react'
import emailjs from '@emailjs/browser';

export default function Profil() {
  const form = useRef();
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_vra8hju', 'template_vn7n5bo', form.current, 'eCFuRbCM3D2lS-S-A')
      .then((result) => {
        console.log(result.text);
        if (result.text === 'OK') {
          document.querySelector('#input_email').value = "";
          document.querySelector('#input_name').value = "";
          document.querySelector('#input_message').value = "";
        } else {
          alert('Une erreur est survenue, pas de problème vous pouvez toujours m\'envoyer un mail!')
        }
      }, (error) => {
        console.log(error.text);
      });
  };
  return (
    <div id="Profil_Div">
      <div className="container-fluid d-flex" id="Profil_page">
        <a id="lien_cv" href="./CV_NEFF_VALENTIN.pdf" download title="Cliquez pour télécharger mon CV!">
          <img src="./carapuce.png" id="profil_picture" alt="profil" />
        </a>
        <div id="profil_content">
          <h1 id="profil_title">Qui suis-je?</h1>
          <p id="profil_desc">Geek dans l'âme depuis toujours,j'aime toucher à l'informatique et je suis aujourd'hui en reconversion professionnelle après plusieurs années en tant que Barman/Barista. J'ai découvert le développement Web et poursuit ma formation au sein d'EPITECH Strasbourg. Là-bas j'y apprends les différents langages tels que le JavaScript, le PHP ...<br />
            <br />Seul petit bémol aujourd'hui, je recherche une entreprise pour y effectuer mon apprentissage et ainsi valider mon diplôme qui me permettrait de pleinement pouvoir exercer ce métier. Vous trouverez mon CV juste ici si ce dernier peut vous intéresser, il vous suffira de cliquer sur ma photo de profil.</p>
          <div id="infos_utiles">
            <ul className="list-group">
              <span className="list_header">Diplômes :</span>
              <li className="list-group-items">RNCP Développeur Intégrateur Web (en cours)</li>
              <li className="list-group-items">Baccalauréat S (2013)</li>
            </ul>
            <ul className="list-group">
              <span className="list_header">Informations pratiques :</span>
              <li className="list-group-items">Permis B + véhicule</li>
              <li className="list-group-items">Anglais bilingue</li>
              <li className="list-group-items">Allemand bilingue</li>
            </ul>
          </div>
          <h3 id="hobbie_title">Mes Passions :</h3>
          <div id="hobbies">
            <img title="passion crier sur mon pc" alt="passion crier sur mon pc" src="./assets_profile/cat.gif" className="gif_hobby" />
            <img title="passion jeux vidéos" alt="passion jeux vidéos" src="./assets_profile/lofi.gif" className="gif_hobby" />
            <img title="passion pokemon et slack btw" alt="passion pokemon et slack btw" src="./assets_profile/snorlax.gif" className="gif_hobby" />
            <img title="passion animé" alt="passion animé" src="./assets_profile/tanjiro.gif" className="gif_hobby" />
          </div>
          <div id="contact">
            <h3 id="contact_title">Comment me contacter?</h3>
            <div className="info">Mail: <u><a href="mailto:neffvalentin67@gmail.com">neffvalentin67@gmail.com</a></u></div>
            <div className="info">Téléphone: 06.24.95.04.94</div>
            <form ref={form} onSubmit={sendEmail}>
              <input id="input_name" className="input form-control" type="text" placeholder="Votre Nom" name="name" required />
              <input id="input_email" className="input form-control" type="email" placeholder="Votre Email" name="email" required />
              <textarea id="input_message" className="input form-control" rows={8} cols={50} placeholder="Votre message..." name="message" required></textarea>
              <button id="submit_contact" className='btn input'>Envoyer!</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

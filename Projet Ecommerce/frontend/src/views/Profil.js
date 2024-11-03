import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Profile = (props) => {
  const navigation = useNavigate();
  const [price, setPrice] = useState('');
  const [facture, setFacture] = useState('');
  const [listeCommandes, setListe] = useState([]);
  const [commande, setCommande] = useState(false);
  const [customCommande, setCustom] = useState({});
  const [livraison, setLivraison] = useState(false);
  const [updatedPassword, setUpdatedPassword] = useState('');
  const [updatedName, setUpdatedName] = useState(props.auth.name);
  const [updatedCity, setUpdatedCity] = useState(props.auth.city);
  const [updatedEmail, setUpdatedEmail] = useState(props.auth.email);
  const [updatedPhone, setUpdatedPhone] = useState(props.auth.phone);
  const [updatedAdress, setUpdatedAdress] = useState(props.auth.adress);
  const [updatedZipcode, setUpdatedZipcode] = useState(props.auth.zipcode);
  const [updatedCountry, setUpdatedCountry] = useState(props.auth.country);
  useEffect(() => {
    if (!props.auth.id) {
      navigation('/not_connected');
    }
    axios.post(props.url + 'commandesList', {
      email: props.auth.email
    }).then(res => {
      setListe(res.data.reverse())
    })
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('name', updatedName);
    formData.append('courriel', updatedEmail);
    formData.append('password', updatedPassword);
    formData.append('adress', updatedAdress);
    formData.append('city', updatedCity);
    formData.append('zipcode', updatedZipcode);
    formData.append('country', updatedCountry);
    formData.append('phone', updatedPhone);

    axios.post(`http://localhost:8000/api/updateuser/${props.auth.id}`, formData)
      .then(response => {
        props.setUser(response.data.user);
        navigation('/');
      })
      .catch(error => {
        let cause = error.response.data.errors;
        if (cause.name) {
          alert('Ce nom est déjà utilisé!');
        } else if (cause.courriel) {
          alert('Cet Email est déjà utilisé!')
        }
      });
  };

  // const handleDelete = () => {
  //   axios.delete(`http://localhost:8000/api/users/${props.auth.id}`)
  //     .then(response => {
  //       props.setUser(null);
  //       navigation('/deleted_account');
  //     })
  //     .catch(error => {
  //       console.error('Erreur lors de la suppression de l\'utilisateur:', error);
  //     });
  // };

  const getCommandData = (id) => {
    axios.get(props.url + 'commande/' + id).then(res => {
      setPrice(res.data.price.total_price.toString() + ' €')
      setCustom(res.data.items)
    })
  }

  if (!props.auth) {
    return <div>Chargement en cours...</div>;
  }
  if (commande) {
    return (
      <div id="profil">

        {/* menu de navigation profil */}

        <div className='profil-nav'>
          <p className='user-name-profil'>Bonjour {props.auth.name}</p>
          <Link className='profil-category' onClick={() => {
            setLivraison(false);
            setCommande(false)
          }}>Mes informations</Link>
          <Link className='profil-category' onClick={() => setCommande(true)}>Mes commandes</Link>
          <Link className='profil-category' onClick={() => {
            setLivraison(true);
            setCommande(false)
          }}>Mes informations de livraison</Link>
        </div>

        {/* INFORMATION Commandes et cards */}

        <div id="commande">
          <h2 id="commande_title">Historique de vos commandes</h2>
          <div id="commande_content">
            <div id="commande_liste">
              {listeCommandes.length === 0 ?
                <h3>Il semblerait que vous n'ayez passé aucune commande pour le moment</h3>
                :
                <div id="listeContainer">
                  <div id="listeHeader">
                    <div>Numéro de commande</div>
                  </div>
                  <div id="listeBody">
                    {listeCommandes.map(delivery => {
                      const isoDate = delivery.created_at;

                      const date = new Date(isoDate);

                      const year = date.getFullYear();
                      const month = (date.getMonth() + 1).toString().padStart(2, '0');
                      const day = date.getDate().toString().padStart(2, '0');
                      const hours = date.getHours().toString().padStart(2, '0');
                      const minutes = date.getMinutes().toString().padStart(2, '0');

                      const formatted = `Commandée le ${day}/${month}/${year} à ${hours}:${minutes}`;

                      return (<div className="delivery_element" onClick={(e) => {
                        document.querySelectorAll('.delivery_element').forEach(element => {
                          element.classList.remove("selected");
                        })
                        e.target.classList.add('selected');
                        setFacture(delivery.numero);
                        getCommandData(delivery.id);
                      }}><p className="delivery_numero">{delivery.numero}</p><p className='delivery_date'>{formatted}</p></div>)
                    })}
                  </div>
                </div>}
            </div>
            <div id="commande_details">
              {customCommande.length > 0 ? <div id="details_commande">
                <div className="element_commande_title"><Link to={props.imageUrl + 'factures/' + facture + '.pdf'} target='_blank'>Cliquez pour afficher la facture</Link></div>
                {customCommande.map(deli => {
                  return (
                    <div className="element_commande" onClick={(e) => {
                      navigation('/article/' + deli.item_id)
                    }}>
                      <img src={props.imageUrl + deli.photo_source} alt={deli.name} className="commande_picture" />
                      <div className="delivery_article_infos">
                        <p>{deli.name}</p>
                        <i>{deli.price} €</i>
                      </div>
                    </div>)
                })}
              </div> : <div >Cliquez sur une commande pour afficher son contenu</div>}
            </div>
          </div>
          {price.length > 0 && <h3 id="commande_price">
            Prix de la commande : {price}
          </h3>
          }
        </div>
      </div>
    )
  }

  if (livraison) {
    return (
      <div id="profil">

        {/* menu de navigation profil */}

        <div className='profil-nav'>
          <p className='user-name-profil'>Bonjour {props.auth.name}</p>
          <Link className='profil-category' onClick={() => {
            setLivraison(false);
            setCommande(false)
          }}>Mes informations</Link>
          <Link className='profil-category' onClick={() => setCommande(true)}>Mes commandes</Link>
          <Link className='profil-category' onClick={() => {
            setLivraison(true);
            setCommande(false)
          }}>Mes informations de livraison</Link>
        </div>

        {/* INFORMATION LIVRAISON */}

        <div>
          <div className='form-delivery'>
            <form onSubmit={handleSubmit}>
              <p className='profil-title-title'>Vos informations de livraison :</p>
              <input
                className='profil-input-delivery'
                type='text'
                name="adress"
                placeholder='Votre nouvelle adresse'
                defaultValue={updatedAdress}
                onChange={(e) => setUpdatedAdress(e.target.value)}
              /><br />
              <input
                className='profil-input-delivery'
                type='text'
                name="city"
                placeholder='Votre nouvelle ville :'
                defaultValue={updatedCity}
                onChange={(e) => setUpdatedCity(e.target.value)}
              /><br />
              <input
                className='profil-input-delivery'
                placeholder='code postal'
                name='zipcode'
                type='text'
                defaultValue={updatedZipcode}
                onChange={(e) => setUpdatedZipcode(e.target.value)}
              /><br />
              <input
                className='profil-input-delivery'
                placeholder='pays'
                name='country'
                type='text'
                defaultValue={updatedCountry}
                onChange={(e) => setUpdatedCountry(e.target.value)}
              /><br />
              <input
                className='profil-input-delivery'
                placeholder='Téléphone'
                name='phone'
                type='int'
                defaultValue={updatedPhone}
                onChange={(e) => setUpdatedPhone(e.target.value)}
              /><br />
              <div className='btn-div'>
                <button className='profil-button' type="submit">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div id="profil">

      {/* menu de navigation profil */}

      <div className='profil-nav'>
        <p className='user-name-profil'>Bonjour {props.auth.name}</p>
        <Link className='profil-category' onClick={() => {
          setLivraison(false);
          setCommande(false)
        }}>Mes informations</Link>
        <Link className='profil-category' onClick={() => setCommande(true)}>Mes commandes</Link>
        <Link className='profil-category' onClick={() => {
          setLivraison(true);
          setCommande(false)
        }}>Mes informations de livraison</Link>
      </div>

      {/* MES INFORMATIONS */}

      <div className='form-profil'>
        <form onSubmit={handleSubmit}>
          <p className='profil-title-title'>Vos informations personnelles :</p>
          <input
            className="profil-input"
            type='text'
            name="name"
            placeholder='Votre nouveau nom'
            defaultValue={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
          /><br />
          <input
            className='profil-input'
            type='mail'
            name="courriel"
            placeholder='Votre nouvelle email'
            defaultValue={updatedEmail}
            onChange={(e) => setUpdatedEmail(e.target.value)}
          /><br />

          <p className='profil-title'>Nouveau mot de passe</p>
          <input
            className='profil-input'
            placeholder='Nouveau MDP'
            name='password'
            type='password'
            defaultValue={updatedPassword}
            onChange={(e) => setUpdatedPassword(e.target.value)}
          />
          <div className='btn-div'>
            <button type="submit" className='profil-button'>Enregistrer</button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Profile;

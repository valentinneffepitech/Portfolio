import './App.css';
import Error from './views/404';
import Home from './views/Home';
import Login from './views/Login';
import Carte from './views/Carte';
import Footer from './views/Footer';
import Navbar from './views/Navbar';
import Panier from './views/Panier';
import Profile from './views/Profil';
import Register from './views/Register';
import Validator from './views/Validator';
import { useEffect, useState } from 'react';
import ProductList from './views/ProductList';
import JN_ShowCase from './views/JN_ShowCase';
import { Routes, Route } from 'react-router-dom';
import AddArticle from './views/admin_article_add';
import ArticleDetails from './views/ArticleDetails';
import AdminDashboard from './views/admin_dashboard';
import DeliveryStep from './views/deliveryTracker';
import AddCategories from './views/admin_add_categories';
import DownloadTable from './views/downloadTable';
import JN_FormContact from './views/JN_FormContact';


function App() {
  const [user, setUser] = useState({});
  const url = 'http://localhost:8000/api/';
  const imageUrl = 'http://localhost:8000/';
  const [isConnected, setConnected] = useState(false);
  const [panier, setPanier] = useState([]);
  const [delivery, setDelivery] = useState({});
  const [interPrice, setInterprice] = useState(0);
  const [facture, setFacture] = useState(0);

  function checkInput() {
    const inputs = document.querySelectorAll('.input-name');
    var isValid = true;
    inputs.forEach(champ => {
      champ.style.setProperty('border', 'none')
      if (champ.value === "" || champ.value === 0) {
        champ.style.borderColor = 'red';
        isValid = false;
        return;
      }
    })
    return isValid;
  }

  function weightConverter(poids) {
    return poids / 453.592;
  }

  function dollarConverter(taille) {
    return taille * 0.913915;
  }

  function TotalFacture(somme) {
    setInterprice(somme);
  }

  function Facturation(somme) {
    setFacture(somme);
  }

  function dropShipping(object) {
    setDelivery(object);
  }

  function resetDelivery() {
    setDelivery({});
  }

  function addPanier(array) {
    setPanier(panier => [...panier, ...array]);
  }

  function removePanier(index) {
    setPanier(panier => {
      panier.splice(index, 1);
      return [...panier];
    });
  }

  function emptyPanier() {
    setPanier([]);
  }

  function connect(object) {
    setUser(object);
    setConnected(true);
  }

  function logout() {
    setUser({});
    setConnected(false);
  }

  return (
    <div className="App">
      <Navbar
        isConnected={isConnected}
        setConnected={setConnected}
        logout={logout}
        auth={user}
        imageUrl={imageUrl}
        panier={panier}
      />
      <Routes>
        <Route path="/profil" element={<Profile auth={user} setUser={setUser} url={url} imageUrl={imageUrl}/>} />
        <Route path="/" element={<Home imageUrl={imageUrl} auth={user} url={url} />} />
        <Route path="/login" element={<Login auth={user} url={url} checkInput={checkInput} onLogin={connect} />} />
        <Route path="/register" element={<Register auth={user} url={url} checkInput={checkInput} onRegister={connect} />} />
        {user.isAdmin ?
          <Route path="/admin/add_article" element={<AddArticle auth={user} checkInput={checkInput} url={url} />} />
          :
          <Route path="/admin/*" element={<Error auth={user} error={"You don't have the rights"} />} />
        }
        {user.isAdmin ?
          <Route path="/admin/add_category" element={<AddCategories checkInput={checkInput} auth={user} url={url} />} />
          :
          <Route path="/admin/*" element={<Error auth={user} error={"You don't have the rights"} />} />
        }
        {user.isAdmin ?
          <Route path="/admin/dashboard" element={<AdminDashboard imageUrl={imageUrl} auth={user} url={url} />} />
          :
          <Route path="/admin/*" element={<Error auth={user} error={"You don't have the rights"} />} />
        }
        <Route path="/panier" element={<Panier emptyPanier={emptyPanier} TotalFacture={TotalFacture} imageUrl={imageUrl} url={url} auth={user} panier={panier} removePanier={removePanier} />} />
        <Route path="/article/:id" element={<ArticleDetails checkInput={checkInput} imageUrl={imageUrl} url={url} auth={user} addToCart={addPanier} panier={panier} />} />
        <Route path="/produits" element={<ProductList imageUrl={imageUrl} url={url} auth={user} addToCart={addPanier} />} />
        <Route path="/*" element={<Error error={"Votre requête n'a pas pu aboutir !"} />} />
        <Route path="/shipping" element={<Validator checkInput={checkInput} price={interPrice} total={facture} Facturation={Facturation} dropShipping={dropShipping} imageUrl={imageUrl} url={url} auth={user} dollarConverter={dollarConverter} weightConverter={weightConverter} panier={panier} />} />
        <Route path='/JN_ShowCase' element={<JN_ShowCase />} />
        <Route path='/downloadTable' element={<DownloadTable auth={user}/>}  />
        <Route path='/deliverytracker' element={<DeliveryStep auth={user} Facturation={Facturation} />} />
        <Route path='/contact' element={<JN_FormContact />} />
        <Route path="/card" element={<Carte resetDelivery={resetDelivery} checkInput={checkInput} auth={user} delivery={delivery} imageUrl={imageUrl} url={url} emptyPanier={emptyPanier} />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
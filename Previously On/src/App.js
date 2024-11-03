import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './component/Home';
import { useEffect, useState } from 'react';
import Header from './Header';
import Login from './component/login/Login';
import Serie from './component/serie/Serie';
import Profil from './component/Profil/Profil';
import Episode from './component/episode/Episode';

function App() {
  const [user, setUser] = useState({});
  const [access, setAccess] = useState({});
  const url = 'http://localhost:3001/';
  const defaultImage = process.env.PUBLIC_URL + "notfound.jpg";
  useEffect(() => console.log(user, access), [user, access])
  useEffect(() => {
    if (sessionStorage.getItem('userTechFlix') && sessionStorage.getItem('TechFlixToken')) {
      setUser(JSON.parse(sessionStorage.getItem('userTechFlix')));
      setAccess(JSON.parse(sessionStorage.getItem('TechFlixToken')));
    }
  }, []);
  return (
    <div>
      <Header user={user} onLogout={setUser} />
      <Routes>
        <Route path='/' element={<Home url={url} defaultImage={defaultImage} token={access.token} user={user} />} />
        <Route path='/login' element={<Login onLogin={setUser} url={url} setAccess={setAccess} />} />
        <Route path='/serie/:id' element={<Serie defaultImage={defaultImage} user={user} url={url} token={access.token} />} />
        <Route path="/episode/:id" element={<Episode url={url} token={access.token} user={user} defaultImage={defaultImage} />} />
        <Route path="/profile" element={<Profil user={user} url={url} token={access.token} />} />
      </Routes>
    </div>
  );
}

export default App;
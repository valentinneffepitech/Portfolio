import logo from './logo.svg';
import './App.css';
import { Routes, Route } from "react-router-dom";
import Accueil from './Accueil';
import Navbar from './Navbar';
import Profil from './Profil';
import Projets from './Projets';
import Maquette from './Maquette';
import { Link } from 'react-router-dom';
import Javascript from './Javascript';
import Error from './Error';
import PHP from './PHP';
import Stack from './Stack';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Navbar />
        <div>
          <h2 className="header_title">What if I'd be your next talent ?</h2>
          <cite>Développeur Full-stack</cite>
        </div>
        <div className="header_display">
          <img src={logo} className="App-logo" alt="logo" />
          <h3>Valentin Neff</h3>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<Accueil />}></Route>
        <Route path="/profil" element={<Profil />}></Route>
        <Route path="/projects" element={<Projets />}></Route>
        <Route path="/maquette" element={<Maquette />}></Route>
        <Route path="/javascript" element={<Javascript />}></Route>
        <Route path="/php" element={<PHP />}></Route>
        <Route path="/stack" element={<Stack/>}></Route>
        <Route path="/*" element={<Error />}></Route>
      </Routes>
      <footer className="footer">
        <div id="copyright">
          &copy;2023
        </div>
        <div id="icone">
          <i>Mes réseaux :</i>
          <Link target="_blank" to="https://github.com/valentinneff"><img src="logo_git.png" alt="github" /></Link>
          <Link target="_blank" to="https://fr.linkedin.com/in/valentin-neff-10878a1a2"><img src="linkedin.png" alt="Linkedin" /></Link>
        </div>
      </footer>
    </div >
  );
}

export default App;

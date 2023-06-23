import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Projets() {
    const navigate = useNavigate()
    function raccourci(string) {
        navigate(string);
    }
    return (
        <div id="Projets_Div">
            <div className="categorie maquette" onClick={() => { raccourci('/maquette') }} id="Front"><h5>Les Maquettes</h5></div>
            <div className="categorie php" onClick={() => { raccourci('/php') }} id="PHP"><h5>Projets PHP</h5></div>
            <div className="categorie js" onClick={() => { raccourci('/javascript') }} id="JS"><h5>Projets JavaScript</h5></div>
            <div className="categorie stack" onClick={() => { raccourci('/stack') }} id="stack"><h5>Stack JavaScript</h5></div>
        </div>
    )
}

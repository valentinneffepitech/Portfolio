import React, { useState } from 'react'

export default function Maquette() {
    const [isresize, setIsResize] = useState(false)
    function resize() {
        console.log(document.querySelector('#maquette_responsive').width)
        if (!isresize) {
            document.querySelector('#maquette_responsive').style.width = '20vw';
            document.querySelector('#maquette_responsive').style.setProperty('aspect-ratio', '2/5')
            setIsResize(true)
        } else {
            document.querySelector('#maquette_responsive').style.width = '65vw';
            document.querySelector('#maquette_responsive').style.setProperty('aspect-ratio', '16/9')
            setIsResize(false)
        }
    }
    return (
        <div id="page_maquette">
            <div>
                <div className="container card-item">
                    <h3>Le but de ce projet était de reproduire une maquette avec HTML et CSS. A savoir les différentes balises et pratiquer le display:flex.</h3>
                    <iframe src="intro/index.html" title="Maquette statique" id="maquette_intro"></iframe>
                </div>
                <div className="container card-item">
                    <h3>L'objectif de ce projet était de reproduire une maquette responsive en utilisant les balises médias</h3>
                    <button className="btn" onClick={resize}>Cliquez pour redimensionner l'image</button>
                    <iframe src="responsive/index.html" title="Maquette responsive" id="maquette_responsive"></iframe>
                </div>
            </div>
        </div>
    )
}

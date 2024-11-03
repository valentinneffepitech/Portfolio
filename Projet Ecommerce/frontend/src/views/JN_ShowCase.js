import React, { useEffect, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import { Stage } from '@react-three/drei';
import { PresentationControls } from '@react-three/drei';
import { PerspectiveCamera } from 'three';

function Model({ url }) {
  const gltf = useLoader(GLTFLoader, url);
  return <primitive object={gltf.scene} dispose={null} />;
}

function JN_ShowCase() {
  const models = [
    { url: '/assets/models/computer5.glb', zoom: 0.5, position: [0, 0, 100] },
    { url: '/assets/models/computer1.glb', zoom: 0.5, position: [0, 0, 100] },
    { url: '/assets/models/computer3.glb', zoom: 0.5, position: [0, 0, 100] },
    { url: '/assets/models/computer4.glb', zoom: 0.6, position: [0, 0, 100] }
  ].map(model => ({ ...model, url: (process.env.PUBLIC_URL ?? '') + model.url }));

  const [currentModelIndex, setCurrentModelIndex] = useState(0);

  const nextModel = () => setCurrentModelIndex((currentModelIndex + 1) % models.length);
  const prevModel = () => setCurrentModelIndex((currentModelIndex - 1 + models.length) % models.length);

  const camera = useMemo(() => {
    const newCamera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    newCamera.position.set(...models[currentModelIndex].position);
    newCamera.zoom = models[currentModelIndex].zoom;
    newCamera.updateProjectionMatrix();
    return newCamera;
  }, [currentModelIndex, models]);

  useEffect(() => {
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [camera]);

  return (
    <div id="projets_jerome">
      <div id="trois_Controls">
        <button onClick={prevModel} id="btn_prev"><img id="fleche_prev" src={process.env.PUBLIC_URL + '/assets/images/fleche.png'} alt="Modèle suivant" /></button>
        <button onClick={nextModel} id="btn_next"><img id="fleche_next" src={process.env.PUBLIC_URL + '/assets/images/fleche.png'} alt="Modèle suivant" /></button>
      </div>
      <Canvas camera={camera} dpr={[1, 2]} shadows style={{ position: 'absolute', height: '70vh', marginTop: "1px" }}>
        <color attach="background" args={['rgb(32, 38, 57)']} />
        <ambientLight position={[0, 10, 0]} intensity={3} />
        <PresentationControls speed={1.5} global zoom={models[currentModelIndex].zoom} polar={[-0.1, Math.PI / 2]}>
          <Stage environment={null}>
            <Model url={models[currentModelIndex].url} scale={0.001} />
          </Stage>
        </PresentationControls>
      </Canvas>
    </div>
  );
}

export default JN_ShowCase;
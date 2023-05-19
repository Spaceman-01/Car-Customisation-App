import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import Header from './header';
import '../public/styles.css';

function App() {
  const canvasRef = useRef(null);
  const controlsRef = useRef(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  let areDoorsOpen = false;
  useEffect(() => {
    const canvas = canvasRef.current;


    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      35,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.set(10, 7, 15);
    camera.lookAt(new THREE.Vector3(0, 5, 0));

    // Controls
    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;
    controlsRef.current = controls;

    // GLTF Loader
    const loader = new GLTFLoader();
    let mixer;
    let clip;
    let action;

    loader.load(
      './src/assets/models/gmcblend.glb',
      function (gltf) {
        const root = gltf.scene;
        root.position.set(5, -0.5, 0);
        scene.add(root);

        // Animation Mixer
        mixer = new THREE.AnimationMixer(root);
        clip = gltf.animations[0];
        action = mixer.clipAction(clip);
        action.setLoop(THREE.LoopOnce);
        action.play();
        action.paused = true;

        // Animation Update
        function animate() {
          requestAnimationFrame(animate);
          const delta = clock.getDelta();

          mixer.update(delta);

          controlsRef.current.update();
          renderer.render(scene, camera);
        }

        const clock = new THREE.Clock();
        animate();
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      function (error) {
        console.log('An error happened');
      }
    );

    scene.background = new THREE.Color(0x9b9a9a);

    // Set the scene, camera, and renderer states
    setScene(scene);
    setCamera(camera);
    setRenderer(renderer);

    // RGBE Loader
    const textureLoader = new THREE.TextureLoader();
    new RGBELoader().load(
      './src/assets/textures/paul_lobe_haus_2k.hdr',
      function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
      }
    );

    // Lights
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.4);
    scene.add(directionalLight);
    directionalLight.position.set(1, 1, 1);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5);
    scene.add(hemisphereLight);

    canvasRef.current.addEventListener('dblclick', () => {
      if (areDoorsOpen) {
        action.timeScale = -1;
        action.paused = false;
        areDoorsOpen = false;
      } else {
        action.timeScale = 1;
        action.paused = false;
        action.clampWhenFinished = true;
        areDoorsOpen = true;
      }
    });

  }, []);

  const changeColour = (colour) => {
    const mesh = scene.getObjectByName('polySurface3178_Mesh164');
    mesh.material.color = new THREE.Color(colour);
  };

  return (
    <div className="main-container">
      <Header selectedColour={changeColour} />
      <p className="instructions">Double Click to open or close the doors.</p>
      <canvas ref={canvasRef} className="canvas" />
    </div>
  );
}

export default App;

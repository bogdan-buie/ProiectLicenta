import React from 'react';
import { Editor } from '@monaco-editor/react';

const CodeEditor = (props) => {
    // Funcția care se va apela la modificarea conținutului editorului
    const handleChange = (newValue) => {
        //console.log(newValue);
        props.manageCode(newValue);
    };


    return (
        <Editor
            height="95vh"
            width="800px"

            theme='vs-dark'
            defaultLanguage='javascript'
            onChange={handleChange}
            value={`
// Creează o nouă scenă, cameră și renderer
let scene, camera, cube;
let renderer, controls;
function init() {
    scene = new THREE.Scene();
    let height = 500, width=700;
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    
    console.log(5);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    controls = new OrbitControls(camera, renderer.domElement);
    sceneRef.current.appendChild(renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 0;
    controls.maxDistance = 100;
}
function sceneBuilding(){
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe:true });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const points = [];
    points.push(new THREE.Vector3(2,0,0));
    points.push(new THREE.Vector3(0,2,0));
    points.push(new THREE.Vector3(0,0,-2));

    const geometry2 = new THREE.BufferGeometry().setFromPoints(points);
    const line  = new THREE.Line(geometry2, material);
    scene.add(line);
    
    camera.position.z = 5;
}
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

init();
sceneBuilding();

// Pornim animația
animate();
            `}
        />
    );
};

export default CodeEditor;

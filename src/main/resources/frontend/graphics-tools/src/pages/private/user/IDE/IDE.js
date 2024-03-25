import React, { useEffect, useState, useRef } from 'react';
import CodeEditor from '../../../../components/CodeEditor/CodeEditor'
import ThreeScene from '../../../../components/ThreeScene/ThreeScene';
import Console from '../../../../components/Console/Console';
import "./IDE.css";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { request, request2 } from '../../../../utils/axios_helper';
import { useScreenshot } from 'use-react-screenshot';
import { toast } from 'react-toastify';

const IDE = () => {
    const ref = useRef(null);
    const [image, takeScreenshot] = useScreenshot();
    const [editorData, setEditorData] = useState('');
    const [codeForRun, setCodeForRun] = useState('');
    const [project, setProject] = useState('');
    const [consoleMessages, setConsoleMessages] = useState([]);
    const templateCode = `
// Template
// Creează o nouă scenă, cameră și renderer
let scene, camera, cube;
let renderer, controls;
function init() {
    scene = new THREE.Scene();
    let height = window.innerHeight*0.6, width=window.innerWidth*0.50; 
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
function render() {
    renderer.render(scene, camera)
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth*0.6, window.innerHeight*0.5);
    render();
}
    
window.addEventListener('resize', onWindowResize, false);
    
    
init();
sceneBuilding();
    
// Pornim animația
animate();
`;


    const { id } = useParams();
    useEffect(() => {
        loadProject();

    }, []);

    useEffect(() => {
        if (project) {
            getCode();
        }
    }, [project]);

    const handleCodeRun = () => {
        setCodeForRun(editorData);
    }

    const handleConsoleMessagesUpdate = (messages) => {
        console.log(messages);
        setConsoleMessages(messages);
    }
    const loadProject = async () => {
        request(
            "GET",
            `/project/get/${id}`,
            {}
        ).then(
            (response) => {
                setProject(response.data);
                console.log(response.data);


            }).catch(
                (error) => {
                    console.log(error);
                }
            );
    }


    const getCode = async () => {
        if (project) {
            axios({
                method: "GET",
                url: project.link,
                headers: {},
                data: null
            }).then(
                (response) => {
                    console.log(response.data);
                    setEditorData(response.data);
                }).catch(
                    (error) => {
                        console.log(error)
                    }
                );
        } else {
            console.log("No Project Loaded");
        }

    }

    // salvare in memoria interna
    const saveCodeToFile = () => {
        const element = document.createElement("a");
        const file = new Blob([editorData], { type: 'text/javascript' });
        element.href = URL.createObjectURL(file);
        element.download = `${project.name}`;
        document.body.appendChild(element);
        element.click();
    }

    const updateCode = async () => {

        const formData = new FormData();
        const fileBlob = new Blob([editorData], { type: 'text/javascript' });
        formData.append('file', fileBlob, 'project_code.js');

        request2(
            "PUT",
            `/code/update/idProject=${project.id}`,
            'multipart/form-data',
            formData,
        ).then(
            (response) => {
                console.log(response.data);
                notify("Codul a fost salvat cu succes");
            }).catch(
                (error) => {
                    console.log(error);
                }
            );
    }


    const uploadImage = async () => {
        const formData = new FormData();
        // Decodează șirul base64 într-un array de bytes
        const imageData = atob(image.split(',')[1]);
        // Creează un array de bytes din șirul decodificat
        const bytes = new Uint8Array(imageData.length);
        for (let i = 0; i < imageData.length; i++) {
            bytes[i] = imageData.charCodeAt(i);
        }
        // Creează obiectul Blob din array-ul de bytes
        const fileBlob = new Blob([bytes], { type: 'image/png' });
        formData.append('file', fileBlob, 'poza.png');

        request2(
            "POST",
            `/image/upload/idProject=${project.id}`,
            'multipart/form-data',
            formData,
        ).then(
            (response) => {
                notify("Captura salvata cu succes");
                console.log(response.data);
            }).catch(
                (error) => {
                    console.log(error);
                }
            );
    }

    const captureScreenshot = async () => {
        takeScreenshot(ref.current);
    };
    // Folosim useEffect pentru a asculta schimbările în variabila image
    useEffect(() => {
        if (image) {
            uploadImage();
            handleDownload(); // Descărcăm imaginea
        }
    }, [image]); // Va fi apelat doar când se schimbă variabila image

    const handleDownload = () => {
        if (image) {
            const link = document.createElement('a');
            link.href = image;
            link.download = 'screenshot.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            //setCapturedImage(null); // Resetăm starea capturedImage pentru a pregăti următoarea captură
        } else
            console.log("No capture Image");
    }

    const notify = (message) => {
        // Calling toast method by passing string
        toast(message);
    };
    return (
        <div className='IDE'>
            <div className='mainContainer'>
                <div className='column1'>
                    <div className='projectDetailsBar'>
                        <button onClick={captureScreenshot} title="Take screenshot of ThreeJS window">Take Screenshot</button>
                        <button onClick={saveCodeToFile} title="Download file">Download</button>
                        <button onClick={updateCode} title="Save the code of this project">Save</button>
                        <button onClick={handleCodeRun}>Run</button>

                    </div>
                    <CodeEditor manageCode={setEditorData} initialCode={editorData} />

                </div>

                <div className='column2'>
                    <div className='threeContainer'>
                        <div ref={ref}>
                            <ThreeScene
                                code={codeForRun}
                                updateConsoleMessages={handleConsoleMessagesUpdate}
                            />
                        </div>

                    </div>
                    <Console consoleMessages={consoleMessages} />
                </div>
            </div>
        </div>
    );
}

export default IDE;

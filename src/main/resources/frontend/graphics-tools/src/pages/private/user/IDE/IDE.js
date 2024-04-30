import React, { useEffect, useState, useRef } from 'react';
import CodeEditor from '../../../../components/CodeEditor/CodeEditor'
import ThreeScene from '../../../../components/ThreeScene/ThreeScene';
import Console from '../../../../components/Console/Console';
import "./IDE.css";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { request, request2, getToken, getUserId } from '../../../../utils/axios_helper';
import { useScreenshot } from 'use-react-screenshot';
import { toast } from 'react-toastify';
import Unauthorized from '../../../public/Unauthorized/Unauthorized';
import {
    Panel,
    PanelGroup,
    PanelResizeHandle
} from "react-resizable-panels";

import runIcon from '../../../../../src/assets/image/run.png';
import saveIcon from '../../../../../src/assets/image/save.png';
import ssIcon from '../../../../../src/assets/image/screenshot.png';
import downloadIcon from '../../../../../src/assets/image/download.png';
import uploadIcon from '../../../../../src/assets/image/upload.png';
import { div } from 'three/examples/jsm/nodes/Nodes.js';

const IDE = () => {
    const ref = useRef(null); // pt screenshot
    const codePanelRef = useRef(null);
    const scenePanelRef = useRef(null);
    const [image, takeScreenshot] = useScreenshot();
    const [editorData, setEditorData] = useState('');
    const [codeForRun, setCodeForRun] = useState('');
    const [project, setProject] = useState('');
    const [consoleMessages, setConsoleMessages] = useState([]);
    const [parentDimensions, setParentDimensions] = useState();
    const [showThreeScene, setShowThreeScene] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editorCollapsed, setEditorCollapsed] = useState(false); // Starea de collapsed a panoului cu editorul de cod
    const [authorizedToView, setAuthorizedToView] = useState(false);
    const [authorizedToEdit, setAuthorizedToEdit] = useState(false);
    const [connectedUserID, setConnectedUserID] = useState();// id-ul utilizatorului conectat

    const { id } = useParams();
    useEffect(() => {
        loadProject();
        setConnectedUserID(getUserId());
        setParentDimensions({ width: window.innerWidth * 0.5, height: window.innerHeight * 0.8 });
        console.log(parentDimensions);
    }, []);
    useEffect(() => {
        setTimeout(updateParentDimensions, 10);
    }, [loading])

    useEffect(() => {
        if (connectedUserID && id)
            checkIfUserIsAuthorized();
    }, [connectedUserID]);

    useEffect(() => {
        if (project) {
            getCode();
        }
    }, [project]);

    const updateParentDimensions = () => {
        const parentElement = document.getElementById("parinte");
        let rect;
        if (parentElement) {
            rect = parentElement.getBoundingClientRect();
            setParentDimensions({ width: rect.width, height: rect.height });
            console.log(parentDimensions);
        }

        setShowThreeScene(false);
    };

    window.addEventListener('resize', updateParentDimensions, false);

    const handleCollapseCode = () => {
        const codePanel = codePanelRef.current;
        if (codePanel) {
            if (codePanel.isCollapsed()) {
                codePanel.expand();
            } else {
                codePanel.collapse();
            }
        }
        setTimeout(updateParentDimensions, 10);

    }
    const handleCollapseScene = () => {
        const scenePanel = scenePanelRef.current;
        if (scenePanel) {
            if (scenePanel.isCollapsed()) {
                scenePanel.expand();

            } else {
                scenePanel.collapse();
            }

        }
        setTimeout(updateParentDimensions, 10);
    }
    const checkIfUserIsAuthorized = () => {
        console.log(connectedUserID + " " + project.id)

        request(
            "POST",
            `/project/checkProject`,
            { "idUser": `${connectedUserID}`, "idProject": `${id}` }
        ).then(
            (response) => {

                console.log(response.data);
                setAuthorizedToView(response.data.authToView);
                setAuthorizedToEdit(response.data.authToEdit);
                setLoading(false);

            }).catch(
                (error) => {
                    console.log(error);
                }
            );

    }



    const handleCodeRun = () => {
        setCodeForRun(editorData);
        setShowThreeScene(true);
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
        if (project.link) {
            axios({
                method: "GET",
                url: project.link,
                headers: {},
                data: null
            }).then(
                (response) => {
                    //console.log(response.data);
                    setEditorData(response.data);
                }).catch(
                    (error) => {
                        console.log(error)
                    }
                );
        } else {
            console.log("Project does not have a file");
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
        const token = getToken();
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        };
        request2(
            "PUT",
            `/code/update/idProject=${project.id}`,
            headers,
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
        const token = getToken();
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        };
        request2(
            "POST",
            `/image/upload/idProject=${project.id}`,
            headers,
            formData
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
    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        readFileContent(file);
    };

    const readFileContent = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            setEditorData(content);
        };
        reader.readAsText(file);
    };

    const handleOpenFileDialog = () => {
        const inputElement = document.createElement('input');
        inputElement.type = 'file';
        inputElement.accept = '.js'; // acceptă doar fișiere JS
        inputElement.onchange = handleFileInputChange;
        inputElement.click();
    };


    const notify = (message) => {
        // Calling toast method by passing string
        toast(message);
    };
    return (
        <div>
            {loading ? (
                <div className='loadingMessage'>Loading...</div>
            ) : authorizedToEdit ? (
                <div className='IDE'>
                    <div className='projectDetailsBar'>
                        <div className='leftSection'>
                            <p className='projectName'>{project.name}</p>
                        </div>
                        <div className='rightSection'>
                            <button onClick={handleCollapseCode} title="Expand/Collapse">
                                {/* <img src={ssIcon} className='icon' /> */}
                                Collapse code
                            </button>
                            <button onClick={handleCollapseScene} title="Expand/Collapse">
                                {/* <img src={ssIcon} className='icon' /> */}
                                Collapse scene
                            </button>
                            <button onClick={captureScreenshot} title="Take screenshot of ThreeJS window">
                                <img src={ssIcon} className='icon' />
                            </button>
                            <button onClick={handleOpenFileDialog} title="Upload file">
                                <img src={uploadIcon} className='icon' />
                            </button>
                            <button onClick={saveCodeToFile} title="Download file">
                                <img src={downloadIcon} className='icon' />
                            </button>
                            <button onClick={updateCode} title="Save the code of this project">
                                <img src={saveIcon} className='icon' />
                            </button>
                            <button onClick={handleCodeRun} title="Run this project">
                                <img src={runIcon} className='icon' />
                            </button>
                        </div>
                    </div>
                    <div className='mainContainer'>
                        <PanelGroup direction="horizontal">
                            <Panel
                                collapsible={true}
                                ref={codePanelRef}
                            >
                                <div className='column1'>
                                    <CodeEditor manageCode={setEditorData} initialCode={editorData} />
                                </div>
                            </Panel>
                            <PanelResizeHandle style={{
                                backgroundColor: "#5b5b5b",
                                cursor: "ew-resize",
                                width: "4px",

                            }} />
                            <Panel onResize={updateParentDimensions}>
                                <PanelGroup direction="vertical" >
                                    <div className='column2'>
                                        <Panel
                                            onResize={updateParentDimensions}
                                            defaultSizePercentage={80}
                                            collapsible={true}
                                            ref={scenePanelRef}
                                        >
                                            <div className='threeContainer' id="parinte">
                                                {showThreeScene && (
                                                    <div ref={ref} className='ref'>
                                                        <ThreeScene
                                                            code={codeForRun}
                                                            dimension={parentDimensions}
                                                            updateConsoleMessages={handleConsoleMessagesUpdate}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </Panel>
                                        <PanelResizeHandle style={{
                                            backgroundColor: "#5b5b5b",
                                            cursor: "ns-resize",
                                            height: "4px",

                                        }} />
                                        <Panel defaultSizePercentage={20}>
                                            <Console consoleMessages={consoleMessages} />
                                        </Panel>
                                    </div>
                                </PanelGroup>
                            </Panel>
                        </PanelGroup>
                    </div>

                </div >) : (
                <Unauthorized />
            )}
        </div>
    );
}

export default IDE;

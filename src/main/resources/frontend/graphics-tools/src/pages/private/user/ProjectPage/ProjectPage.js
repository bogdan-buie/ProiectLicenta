import React, { useEffect, useState } from 'react';
import "./ProjectPage.css";
import { CopyBlock, dracula } from 'react-code-blocks';
import { useParams, Link, useNavigate } from 'react-router-dom';

import { request, request2, getUserId, getToken } from '../../../../utils/axios_helper';
import axios from 'axios';
import { Carousel } from 'react-carousel-minimal';
import { millisToDateTime } from '../../../../utils/Utilities';
import Unauthorized from '../../../public/Unauthorized/Unauthorized';
import ConfirmAlert from '../../../../components/ConfirmAlert/ConfirmAlert';
const ProjectPage = () => {
    let navigate = useNavigate();
    const [project, setProject] = useState('');
    const [code, setCode] = useState('');
    const [user, setUser] = useState('');// datele user-ului care a creat proiectul
    const [images_project, setImagesProjects] = useState([]);
    const [data, setData] = useState([]); // Array nou pentru imagini
    const [loading, setLoading] = useState(true);
    const [authorizedToView, setAuthorizedToView] = useState(false);
    const [authorizedToEdit, setAuthorizedToEdit] = useState(false);
    const [connectedUserID, setConnectedUserID] = useState();// id-ul utilizatorului conectat
    const [showConfirm, setShowConfirm] = useState(false);
    useEffect(() => {
        loadProject();
        //getImagesLink();
        loadUser();
        setConnectedUserID(getUserId());

    }, []);

    useEffect(() => {
        if (project) {
            getCode();
            getImagesLink();
            checkIfUserIsAuthorized();
        }
    }, [project]);
    useEffect(() => {
        if (user) {
            checkIfUserIsAuthorized();
        }
    }, [user]);

    const { id } = useParams();// project id
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
    const checkIfUserIsAuthorized = async () => {
        console.log(connectedUserID + " " + project.id)
        if (project) {
            request(
                "POST",
                `/project/checkProject`,
                { "idUser": `${connectedUserID}`, "idProject": `${project.id}` }
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
        } else {
            console.log("No Project Loaded");
        }
    }
    const loadUser = async () => {
        request(
            "GET",
            `/project/get/userId/idProject=${id}`,
            {}
        ).then(
            (response) => {
                setUser(response.data);
                console.log(response.data);

            }).catch(
                (error) => {
                    console.log(error);
                }
            );
    }
    const incrementImportsNr = async () => {
        request(
            "GET",
            `/project/incrementImports/${id}`,
            {}
        ).then(
            (response) => {
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
                    setCode(response.data);
                }).catch(
                    (error) => {
                        console.log(error)
                    }
                );
        } else {
            console.log("No Project Loaded");
        }
    }

    const getImagesLink = async () => {
        request(
            "GET",
            `/project/get/images/${id}`,
            {}
        ).then(
            (response) => {
                setImagesProjects(response.data);
                console.log(response.data);
                // Verificăm dacă array-ul response.data este gol
                if (response.data && response.data.length > 0) {
                    // Creare array nou 'data' cu atributul 'image' în loc de 'link'
                    const newData = response.data.map(image => ({ image: image.link }));
                    setData(newData);
                    //console.log(newData);
                } else {
                    //console.log("Array-ul 'response.data' este gol.");
                }
            }).catch(
                (error) => {
                    console.log(error);
                }
            );
    }
    const captionStyle = {
        fontSize: '2em',
        fontWeight: 'bold',
    }
    const slideNumberStyle = {
        fontSize: '20px',
        fontWeight: 'bold',
    }
    const importProject = () => {
        console.log("Importing project...");
        createproject(project.name, project.description);
        incrementImportsNr();

    }
    const createproject = async (name, description) => {
        request(
            "POST",
            `project/create/user=${connectedUserID}`,
            {
                "id": "",
                "name": `${name}`,
                "grade": null,
                "status": "private",
                "lastModification": 0,//  se modifica pe backend cu dateTime-ul real
                "importsNr": 0,
                "description": `${description}`
            }).then(
                (response) => {

                    if (response.data) {
                        console.log(response.data);
                        updateCode(response.data, code);
                    }
                    console.log(response.data);
                }).catch(
                    (error) => {
                        console.log(error);
                    }
                );
    }
    const updateCode = async (id, code) => {
        const formData = new FormData();
        const fileBlob = new Blob([code], { type: 'text/javascript' });
        formData.append('file', fileBlob, 'project_code.js');
        const token = getToken();
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        };
        request2(
            "PUT",
            `/code/update/idProject=${id}`,
            headers,
            formData,
        ).then(
            (response) => {
                console.log(response.data);
                navigate('/mypage');

            }).catch(
                (error) => {
                    console.log(error);
                }
            );
    }

    const handleDeleteButtonClick = () => {
        setShowConfirm(true);
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
    };

    const handleConfirmDelete = async () => {
        request(
            "DELETE",
            `/project/delete/${project.id}`,
            {}
        ).then(
            (response) => {
                console.log(response.data);
                navigate('/mypage');
            }).catch(
                (error) => {
                    console.log(error);
                }
            );
    }
    return (
        <div className='projectPageContainer'>
            {loading ? (
                <div className='loadingMessage'>Loading...</div>
            ) : authorizedToView ? (
                <div className='projectPageInfo'>
                    <div className='btnContainer'>
                        {!authorizedToEdit && authorizedToView && (
                            <button onClick={importProject} >Import project</button>
                        )}
                        {authorizedToEdit && (
                            <>
                                <Link to={`/editProjectPage/${project.id}`}>
                                    <button>Edit project page</button>
                                </Link>
                                <button onClick={handleDeleteButtonClick}>Delete</button>
                            </>
                        )}


                    </div>
                    <div className='info'>
                        <h1>{project.name}</h1>
                        <i>Last modification: {millisToDateTime(project.lastModification)}</i>

                    </div>

                    {/* <div className='info'>
                        <label htmlFor="grade">Grade: {project.grade}</label>
                    </div> */}

                    <div className='info'>
                        <label htmlFor="status">Status: {project.status}</label>
                    </div>
                    <div className='info'>
                        <label htmlFor="status">Imports number: {project.importsNr}</label>
                    </div>


                    <div className='info'>
                        <label htmlFor="author">Author</label>
                        <div id='author'>{user.lastName} {user.name}</div>
                    </div>


                    <div className='info'>
                        <label htmlFor="description">Description</label>
                        <div className='description' id="description" >
                            <i>"{project.description}"</i>
                        </div>
                    </div>

                    {data.length > 0 && (
                        <div className='info'>
                            <label>Image gallery:</label>

                        </div>
                    )}
                    {data.length > 0 && (
                        <div className='carouselContainer'>


                            <Carousel
                                data={data}
                                time={7000}
                                width="850px"
                                height="500px"
                                captionStyle={captionStyle}
                                radius="10px"
                                slideNumber={true}
                                slideNumberStyle={slideNumberStyle}
                                captionPosition="bottom"
                                automatic={true}
                                dots={true}
                                pauseIconColor="white"
                                pauseIconSize="40px"
                                slideBackgroundColor="darkgrey"
                                slideImageFit="cover"
                                thumbnails={true}
                                thumbnailWidth="100px"
                                style={{
                                    textAlign: "center",
                                    maxWidth: "850px",
                                    maxHeight: "500px",
                                    margin: "40px auto",
                                }}
                            />

                        </div>
                    )}
                    <div className='info'>
                        <label htmlFor="description">Source code:</label>
                        <CopyBlock
                            options={{ showClipboard: true }}
                            text={code}
                            language='javascript'
                            showLineNumbers='true'
                            theme={dracula}
                            wrapLongLines
                        />
                    </div>

                </div>) : (
                <Unauthorized />
            )}
            {showConfirm && (
                <ConfirmAlert
                    message="Are you sure you want to delete?"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </div>
    )
}
export default ProjectPage;


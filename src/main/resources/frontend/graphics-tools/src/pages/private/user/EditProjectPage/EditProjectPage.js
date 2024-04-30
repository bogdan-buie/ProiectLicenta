import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { request, getUserId } from '../../../../utils/axios_helper';
import './EditProjectPage.css';
import { toast } from 'react-toastify';
import Unauthorized from '../../../public/Unauthorized/Unauthorized';
const EditProjectPage = () => {
    const { id } = useParams();
    // let navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [status, setStatus] = useState('private');

    const [loading, setLoading] = useState(true);
    const [authorizedToView, setAuthorizedToView] = useState(false);
    const [authorizedToEdit, setAuthorizedToEdit] = useState(false);
    const [connectedUserID, setConnectedUserID] = useState();// id-ul utilizatorului conectat

    useEffect(() => {
        loadProject();
        setConnectedUserID(getUserId());
    }, []);
    useEffect(() => {
        if (project) {
            getImagesLink();
            checkIfUserIsAuthorized();
        }
    }, [project]);

    const checkIfUserIsAuthorized = async () => {
        console.log(connectedUserID + " " + id)

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

    }
    const loadProject = async () => {
        request(
            "GET",
            `/project/get/${id}`,
            {}
        ).then(
            (response) => {
                setProject(response.data);
                setTitle(response.data.name);
                setDescription(response.data.description);
                setStatus(response.data.status);
                console.log(response.data);

            }).catch(
                (error) => {
                    console.log(error);
                }
            );
    }


    const handleDeleteImage = async (imagename) => {
        request(
            "DELETE",
            `/image/delete/image=${imagename}`,
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

    const handleUpdate = async (e) => {
        e.preventDefault();
        const updatedProject = {
            ...project,
            name: title,
            description: description,
            status: status
        };
        request(
            "PUT",
            `/project/update/${id}`,
            updatedProject
        ).then(
            (response) => {
                console.log(response.data);
                setProject(updatedProject);
                notify("Successfuly update");

            }).catch(
                (error) => {
                    notify("Unsuccessfuly update");
                    console.log(error);
                }
            );
    }
    const getImagesLink = async () => {
        request(
            "GET",
            `/project/get/images/${id}`,
            {}
        ).then(
            (response) => {
                setImages(response.data);
                console.log(response.data);
            }).catch(
                (error) => {
                    console.log(error);
                }
            );
    }
    const toggleStatus = () => {
        setStatus(prevStatus => prevStatus === 'public' ? 'private' : 'public'); // Inversează statusul între "private" și "public"
    }
    const notify = (message) => {
        // Calling toast method by passing string
        toast(message);
    };
    return (
        <div className="editProjectPageContainer">
            {loading ? (
                <div className='loadingMessage'>Loading...</div>
            ) : authorizedToEdit ? (
                <div>
                    <h1>Edit Project</h1>
                    <form>
                        <label>Title:</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                        <label>Description:</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        <div>
                            <label>Status: </label>
                            <button type="button" onClick={toggleStatus}>{status}</button>
                        </div>
                        <h2>Images:</h2>
                        <div className="imageList">
                            {images.length > 0 ? (images.map(image => (
                                <div key={image.id} className="imageItem">
                                    <img src={image.link} alt={image.alt} />
                                    <button onClick={() => handleDeleteImage(image.imageName)}>Delete</button>
                                </div>
                            ))) : (
                                <p>No images uploaded yet.</p>
                            )}
                        </div>
                        <button type="submit" onClick={handleUpdate}>Update</button>
                    </form>
                </div>
            ) : (
                <Unauthorized />
            )}
        </div>
    );
}

export default EditProjectPage;

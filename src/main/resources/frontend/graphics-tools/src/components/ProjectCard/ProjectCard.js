import React, { useEffect, useState } from 'react';
import "./ProjectCard.css";
import { request } from '../../utils/axios_helper';
import { Link } from 'react-router-dom';
import { millisToDateTime } from '../../utils/Utilities';
import ConfirmAlert from '../ConfirmAlert/ConfirmAlert';

export default function ProjectCard({ project, onProjectDeleted, status }) {
    const [images_project, setImagesProjects] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        getImagesLink();
    }, []);

    const getImagesLink = async () => {
        try {
            const response = await request("GET", `/project/get/images/${project.id}`, {});
            setImagesProjects(response.data);
        } catch (error) {
            console.log(error);
        }
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
                onProjectDeleted();
            }).catch(
                (error) => {
                    console.log(error);
                }
            );
    }

    const shortenedDescription = project.description.length > 130 ? `${project.description.substring(0, 130)}...` : project.description;

    return (
        <div className='projectCard'>
            <div className='column1'>
                {images_project.length > 0 ? (
                    <img src={images_project[0].link} alt="Project" />
                ) : (
                    <div className='blackDiv'></div>
                )}
            </div>
            <div className='column2'>
                <div className='titleBar'>
                    <Link to={`/projectPage/${project.id}`}>
                        <h1>{project.name}</h1>
                    </Link>
                    {status === 'private' && (
                        <div>
                            <button onClick={handleDeleteButtonClick}>Delete</button>
                            <Link to={`/editProject/${project.id}`}>
                                <button>Edit project code</button>
                            </Link>
                        </div>
                    )}

                </div>
                <p><b>Grade: {project.grade}</b></p>
                <p>{shortenedDescription}</p>
                <p>Last modification: {millisToDateTime(project.lastModification)}</p>
            </div>
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
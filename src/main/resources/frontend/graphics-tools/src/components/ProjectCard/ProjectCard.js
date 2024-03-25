import React, { useEffect, useState } from 'react';
import "./ProjectCard.css";
import { request } from '../../utils/axios_helper';
import { Link } from 'react-router-dom';
import { millisToDateTime } from '../../utils/Utilities';

export default function ProjectCard({ project, onProjectDeleted }) {
    const [images_project, setImagesProjects] = useState([]);
    useEffect(() => {
        getImagesLink();
    }, []);
    const getImagesLink = async () => {
        request(
            "GET",
            `/project/get/images/${project.id}`,
            {}
        ).then(
            (response) => {
                setImagesProjects(response.data);
                console.log(response.data);
            }).catch(
                (error) => {
                    console.log(error);
                }
            );
    }
    const deleteProject = async () => {
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

                    <button onClick={deleteProject} >Delete</button>
                    <Link to={`/editProject/${project.id}`}>
                        <button>Edit project code</button>
                    </Link>
                </div>

                <p><b>Grade: {project.grade}</b></p>
                <p>{project.description}</p>
                <p>Last modification: {millisToDateTime(project.lastModification)}</p>
            </div>
        </div>
    )
}

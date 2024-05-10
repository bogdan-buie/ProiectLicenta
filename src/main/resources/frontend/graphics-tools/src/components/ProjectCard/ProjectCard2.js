import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ProjectCard2.css';
import { request } from '../../utils/axios_helper';
import editCodeIcon from '../../../src/assets/image/edit2.png';
export default function ProjectCard2({ project, status }) {
    const [images_project, setImagesProjects] = useState([]);

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
    };

    return (
        <div className='projectCard2'>
            <div className='imageItem'>
                {images_project.length > 0 ? (
                    <div style={{ position: 'relative', height: '100%' }}>
                        <Link to={`/projectPage/${project.id}`} style={{ textDecoration: 'none' }}>
                            <img src={images_project[0].link} alt="Project" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Link>
                    </div>
                ) : (
                    <div className='blackDiv'></div>
                )}
                {status === 'private' && (
                    <Link to={`/editProject/${project.id}`} className="editButton" title='Edit project code'>
                        <img src={editCodeIcon} className='icon' />
                    </Link>
                )}
            </div>
            <div className="info">
                <Link to={`/projectPage/${project.id}`} style={{ textDecoration: 'none' }}>
                    <h3>{project.name}</h3>
                </Link>
            </div>
        </div>
    );
}

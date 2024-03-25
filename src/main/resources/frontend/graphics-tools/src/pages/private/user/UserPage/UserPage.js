import React, { useEffect, useState } from 'react';
import './UserPage.css';
import ProjectCard from '../../../../components/ProjectCard/ProjectCard';
import { request, getUserId } from '../../../../utils/axios_helper';
import { Link } from 'react-router-dom';

export default function UserPage() {
    const [keyword, setKeyword] = useState('');
    const [user, setUser] = useState('');
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]); // Starea pentru proiectele filtrate
    useEffect(() => {
        // Filtrare proiecte când se schimbă cuvântul cheie
        filterProjects();
    }, [keyword, projects]);

    useEffect(() => {
        loadUserDetails();
        loadProjects();
    }, []);
    const handleProjectDeleted = () => {
        loadProjects(); // Actualizarea listei de proiecte după ștergere
    }
    const loadUserDetails = async () => {
        request(
            "GET",
            `/user/get/${getUserId()}`,
            {}
        ).then(
            (response) => {
                setUser(response.data);
                //console.log(response.data);
            }).catch(
                (error) => {
                    console.log(error);
                }
            );
    }
    const loadProjects = async () => {
        request(
            "GET",
            `/project/get/user=${getUserId()}`,
            {}
        ).then(
            (response) => {
                // Sortează proiectele în funcție de lastModification
                const sortedProjects = response.data.sort((a, b) => {
                    return b.lastModification - a.lastModification; // Sortare descrescătoare
                });
                setProjects(sortedProjects);
            }).catch(
                (error) => {
                    console.log(error);
                }
            );
    }
    const filterProjects = () => {
        const filtered = projects.filter(project => {
            // Filtrare după nume și descriere
            return project.name.toLowerCase().includes(keyword.toLowerCase()) ||
                project.description.toLowerCase().includes(keyword.toLowerCase());
        });
        setFilteredProjects(filtered);
    }

    return (
        <div className='userPage'>
            <div className='userInfo'>
                <h1>{user.lastName} {user.name}</h1>
                <div className='levelContainer'>Level {user.level}</div>
            </div>

            <div className='searchBar'>
                <input
                    type="text"
                    id="keywordInput"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    required
                />
                <button >Search</button>
                <Link to={`/addProject/${user.uid}`}>
                    <button>Add project</button>
                </Link>
            </div>

            {filteredProjects.length > 0 ? (
                filteredProjects.map(project => (
                    <ProjectCard project={project} key={project.id} onProjectDeleted={handleProjectDeleted} />
                ))
            ) : (
                <p>No projects found.</p>
            )}

        </div>
    )
}

import React, { useEffect, useState } from 'react';
import './UserPage.css';
import ProjectCard2 from '../../../../components/ProjectCard/ProjectCard2';
import { request, getUserId } from '../../../../utils/axios_helper';
import { Link } from 'react-router-dom';

export default function UserPage() {
    const [keyword, setKeyword] = useState('');
    const [user, setUser] = useState('');
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]); // Starea pentru proiectele filtrate
    const [sortOrder, setSortOrder] = useState('newest'); // Starea pentru ordinea de sortare
    const [loading, setLoading] = useState(true);

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
        try {
            const response = await request("GET", `/user/get/${getUserId()}`, {});
            setUser(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const loadProjects = async () => {
        try {
            const response = await request("GET", `/project/get/user=${getUserId()}`, {});
            if (response.data) {
                const sortedProjects = response.data.sort((a, b) => b.lastModification - a.lastModification);
                setProjects(sortedProjects);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const filterProjects = () => {
        setLoading(true); // Setează loading la true când începe filtrarea
        const filtered = projects.filter(project => {
            return project.name.toLowerCase().includes(keyword.toLowerCase()) ||
                project.description.toLowerCase().includes(keyword.toLowerCase());
        });
        setFilteredProjects(filtered);
        setTimeout(() => setLoading(false), 20); // Setează loading la false după 20ms
    }

    const reorderProjects = () => {
        let sortedProjects;
        if (sortOrder === 'oldest') {
            sortedProjects = projects.sort((a, b) => b.lastModification - a.lastModification);
        } else {
            sortedProjects = projects.sort((a, b) => a.lastModification - b.lastModification);
        }
        setFilteredProjects(sortedProjects);
    }

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest');
        reorderProjects();
    }

    return (
        <div className='userPage'>
            <div className='userInfo'>
                <h1>{user.lastName} {user.name}</h1>
            </div>

            <div className='searchBar'>
                <input

                    type="text"
                    id="keywordInput"
                    value={keyword}
                    placeholder='Search in your projects'
                    onChange={(e) => setKeyword(e.target.value)}
                    required
                />

                <Link to={`/addProject/${user.uid}`}>
                    <button>Add project</button>
                </Link>
                <button onClick={toggleSortOrder}>
                    {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
                </button>
            </div>
            <div className='projectsList'>
                {loading ? (<p>Loading</p>) : (
                    filteredProjects.length > 0 ? (
                        <div className="projectGrid">
                            {filteredProjects.map(project => (
                                <ProjectCard2 project={project} key={project.id} onProjectDeleted={handleProjectDeleted} status="private" />
                            ))}
                        </div>
                    ) : (
                        <p>No projects found </p>
                    )
                )}

            </div>
        </div>
    )
}

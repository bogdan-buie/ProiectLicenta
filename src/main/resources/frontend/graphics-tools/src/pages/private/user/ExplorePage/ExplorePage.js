import React, { useEffect, useState } from 'react';
import './ExplorePage.css';
import ProjectCard from '../../../../components/ProjectCard/ProjectCard';
import { request, getUserId } from '../../../../utils/axios_helper';
export default function ExplorePage() {
    const [keyword, setKeyword] = useState('');
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]); // Starea pentru proiectele filtrate
    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        request(
            "GET",
            `/project/get/newestPublicProjects/10`,
            {}
        ).then(
            (response) => {
                if (response.data) {
                    console.log(response.data)
                    // Sortează proiectele în funcție de lastModification
                    const sortedProjects = response.data.sort((a, b) => {
                        return b.lastModification - a.lastModification; // Sortare descrescătoare
                    });
                    setProjects(sortedProjects);
                }

            }).catch(
                (error) => {
                    console.log(error);
                }
            );
    }
    const searchProjects = () => {
        request(
            "GET",
            `/project/get/key=${keyword}`,
            {}
        ).then(
            (response) => {
                if (response.data) {

                    console.log(response.data)
                    // Sortează proiectele în funcție de lastModification
                    const sortedProjects = response.data.sort((a, b) => {
                        return b.lastModification - a.lastModification; // Sortare descrescătoare
                    });
                    setProjects(sortedProjects);
                }

            }).catch(
                (error) => {
                    console.log(error);
                }
            );

    }

    return (
        <div className='explorePage'>
            <div className='info'>
                <h1>Explore projects</h1>

            </div>

            <div className='searchBar'>
                <input
                    type="text"
                    id="keywordInput"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    required
                />
                <button onClick={searchProjects}>Search</button>

            </div>

            {projects.length > 0 ? (
                projects.map(project => (
                    <ProjectCard project={project} key={project.id} status="public" />
                ))
            ) : (
                <p>No projects found.</p>
            )}

        </div>
    )
}

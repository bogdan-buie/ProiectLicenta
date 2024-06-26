import React, { useEffect, useState } from 'react';
import './ExplorePage.css';
import ProjectCard from '../../../../components/ProjectCard/ProjectCard';
import ProjectCard2 from '../../../../components/ProjectCard/ProjectCard2';
import { request, getUserId } from '../../../../utils/axios_helper';
import { Link } from 'react-router-dom';
export default function ExplorePage() {
    const [keyword, setKeyword] = useState('');
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]); // Starea pentru proiectele filtrate
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        setLoading(true);
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
                    setLoading(false);
                }

            }).catch(
                (error) => {
                    console.log(error);
                }
            );
    }
    const searchProjects = () => {
        setLoading(true);
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
                    setLoading(false);
                }

            }).catch(
                (error) => {
                    console.log(error);
                }
            );

    }

    return (
        <div className='explorePage'>
            <div className='card'>
                <div className='text-section'>
                    <h2>Explore projects of other users</h2>
                </div>

                <div className='searchBar-section'>
                    <input
                        type="text"
                        id="keywordInput"
                        value={keyword}
                        placeholder='Search projects'
                        onChange={(e) => setKeyword(e.target.value)}
                        required
                    />
                    <button onClick={searchProjects}>Search</button>
                    <Link to={`/top-projects`}>
                        <button >See top-projects</button>
                    </Link>


                </div>
            </div>


            <div className='projectsList'>
                {loading ? (<p>Loading</p>) : (
                    projects.length > 0 ? (
                        <div className="projectGrid">
                            {projects.map(project => (
                                <ProjectCard2 project={project} key={project.id} status="public" />
                            ))}
                        </div>
                    ) : (
                        <p> No projects found </p>
                    )
                )}

            </div>

        </div>
    )
}

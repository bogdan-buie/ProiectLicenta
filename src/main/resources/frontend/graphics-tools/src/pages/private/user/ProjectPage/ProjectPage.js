import React, { useEffect, useState } from 'react';
import "./ProjectPage.css";
import { CopyBlock, dracula } from 'react-code-blocks';
import { useParams } from 'react-router-dom';
import { request } from '../../../../utils/axios_helper';
import axios from 'axios';
import { Carousel } from 'react-carousel-minimal';
import { millisToDateTime } from '../../../../utils/Utilities';
const ProjectPage = () => {
    const [project, setProject] = useState('');
    const [code, setCode] = useState('');
    const [user, setUser] = useState('');
    const [images_project, setImagesProjects] = useState([]);
    const [data, setData] = useState([]); // Array nou pentru imagini
    useEffect(() => {
        loadProject();
        getImagesLink();
        loadUser();
    }, []);

    useEffect(() => {
        if (project) {
            getCode();
        }
    }, [project]);

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
                    console.log("Array-ul 'response.data' este gol.");
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

    return (
        <div className='projectPageContainer'>
            <div className='projectPageInfo'>
                <div className='info'>
                    <h1>{project.name}</h1>
                    <i>Last modification: {millisToDateTime(project.lastModification)}</i>
                </div>

                <div className='info'>
                    <label htmlFor="grade">Grade: {project.grade}</label>

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
                        <label>Image gallery</label>

                    </div>
                )}
                <div className='carouselContainer'>
                    {data.length > 0 && (

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
                    )}
                </div>
                <div className='info'>
                    <label htmlFor="description">Source code</label>
                    <CopyBlock
                        options={{ showClipboard: true }}
                        text={code}
                        language='javascript'
                        showLineNumbers='true'
                        theme={dracula}
                        wrapLongLines
                    />
                </div>

            </div>
        </div>
    )
}
export default ProjectPage;


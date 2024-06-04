import React, { useEffect, useState } from 'react';
import './Console2.css';
import broomIcon from '../../../src/assets/image/broom.png';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import FileCard from '../FileCard/FileCard';
import { request, request2, getToken } from '../../utils/axios_helper';

const Console2 = (props) => {
    const [consoleMessages, setConsoleMessages] = useState([]);
    const [modelProject, setModelProject] = useState([]);
    const [projectId, setProjectId] = useState();
    useEffect(() => {
        setProjectId(props.projectId);
        console.log(projectId);
    }, [props.projectId]);


    useEffect(() => {
        setModelProject(props.modelProject);
        console.log(modelProject)
    }, [props.modelProject]);

    useEffect(() => {
        setConsoleMessages(props.consoleMessages || []);
    }, [props.consoleMessages]);

    const handleClearConsole = () => {
        setConsoleMessages([]);
    };



    const handleOpenFileDialog = () => {
        const inputElement = document.createElement('input');
        inputElement.type = 'file';
        inputElement.accept = '.obj, .mtl';
        inputElement.onchange = handleFileInputChange;
        inputElement.click();
    };
    const handleFileInputChange = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        const token = getToken();
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        };

        try {
            const response = await request2("POST", `/models/upload`, headers, formData);
            console.log(response.data);
            console.log(file.name);
            handleCreateProjectModel(response.data.fileName, response.data.link, response.data.extension, file.name);

        } catch (error) {
            console.log(error);
        }
    };
    const handleCreateProjectModel = async (fileName, link, extension, alias) => {

        const newModelProject = {
            idProject: projectId,
            fileName: fileName,
            alias: alias,
            link: link,
            extension: extension
        };
        console.log(newModelProject);
        request(
            "POST",
            `/modelproject/create`,
            newModelProject
        ).then(
            (response) => {
                console.log(response.data);
                props.loadModelProject();



            }).catch(
                (error) => {

                    console.log(error);
                }
            );
    }

    return (
        <Tabs>
            <TabList className='consoleBar'>
                <Tab><h2>Console</h2></Tab>
                <Tab><h2>3D Objects</h2></Tab>

            </TabList>

            <TabPanel>

                <div className='console'>
                    <button className='clearConsoleButton' onClick={handleClearConsole}>
                        Clear console
                    </button>
                    {consoleMessages.map((messageObject, index) => (
                        <div key={index} className={messageObject.type === 'ERROR' ? 'consoleError' : ''}>
                            {messageObject.message}
                        </div>
                    ))}
                </div>
            </TabPanel>
            <TabPanel >
                <div className="objectViewer">
                    <div>
                        <button onClick={handleOpenFileDialog} className='addButton'> + Add 3D Model</button>
                    </div>
                    {modelProject.length > 0 ? (
                        modelProject.map(obj => (
                            <FileCard
                                obj={obj}
                                key={obj.id}
                                loadModelProject={props.loadModelProject} />
                        ))
                    ) : (<p>Does not exist any 3D model</p>)}
                </div>

            </TabPanel>
        </Tabs>
    );
};

export default Console2;

import React, { useState, useEffect } from 'react'
import './AddProject.css';
import { useNavigate, useParams } from 'react-router-dom';
import { defaultURL, request, request2, getToken } from '../../../../utils/axios_helper';
import cubeImage from '../../../../../src/assets/image/templateCube.png';
import axesImage from '../../../../../src/assets/image/templateAxes.png';
import axesGridImage from '../../../../../src/assets/image/templateGrid&Axes.png';
import imgtemplate4 from '../../../../../src/assets/image/template4.png';
import imgtemplate5 from '../../../../../src/assets/image/template5.png';
import { getTemplate } from '../../../../utils/Utilities';
export default function AddProject() {
    const { userId } = useParams();
    let navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [projectId, setProjectId] = useState();
    const [description_template, setDescriptionTemplate] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [templateImage, setTemplateImage] = useState(null);
    useEffect(() => {
        if (cubeImage) {
            setTemplateImage(cubeImage);
            setDescriptionTemplate(descriptions_template[0]);
        }
    }, [cubeImage]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        request(
            "POST",
            `project/create/user=${userId}`,
            {
                "id": "",
                "name": `${name}`,
                "grade": null,
                "status": "private",
                "lastModification": 0,//  se modifica pe backend cu dateTime-ul real
                "importsNr": 0,
                "description": `${description}`
            }).then(
                (response) => {

                    if (response.data) {
                        console.log(response.data);
                        setProjectId(response.data);
                        updateCode(response.data, selectedTemplate);
                    }
                    console.log(response.data);
                }).catch(
                    (error) => {
                        console.log(error);
                    }
                );

    };
    const descriptions_template = [
        "Yellow illuminated cube, with a side length of one unit",
        "XYZ coordinate system",
        "XYZ coordinate system together with a grid with a side length of 20 units",
        "Add an object from an OBJ file",
        "Add an object from an OBJ file that also has an associated MTL file"
    ];


    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        // Setează imaginea și textul corespunzător pentru fiecare template
        switch (template) {
            case 'template1':
                setTemplateImage(cubeImage);
                setDescriptionTemplate(descriptions_template[0]);
                break;

            case 'template2':
                setTemplateImage(axesImage);
                setDescriptionTemplate(descriptions_template[1]);
                break;

            case 'template3':
                setTemplateImage(axesGridImage);
                setDescriptionTemplate(descriptions_template[2]);
                break;

            case 'template4':
                setTemplateImage(imgtemplate4);
                setDescriptionTemplate(descriptions_template[3]);
                break;

            case 'template5':
                setTemplateImage(imgtemplate5);
                setDescriptionTemplate(descriptions_template[4]);
                break;
            default:
                setTemplateImage(null);

        }
    };
    const addFILE2 = async (link, fileName, id) => {
        try {
            // Fetch the file from the provided link
            const response = await fetch(link);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Read the file as a Blob
            const fileBlob = await response.blob();

            // Assuming the file is text-based, read it as text for display
            const fileText = await fileBlob.text();

            // Display the file content
            console.log('File Content:');
            console.log(fileText);

            // Create a File object from the Blob
            const file = new File([fileBlob], fileName, { type: fileBlob.type });

            // Prepare the FormData object
            const formData = new FormData();
            formData.append('file', file);

            // Get the authentication token
            const token = getToken();

            // Set headers including Authorization token
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            };

            // Send the file to the backend
            const uploadResponse = await request2("POST", "/models/upload", headers, formData);
            console.log("Linia 129")
            console.log(uploadResponse.data);
            console.log(file.name);

            // Assuming handleCreateProjectModel is defined somewhere to handle the response
            handleCreateProjectModel(uploadResponse.data.fileName, uploadResponse.data.link, uploadResponse.data.extension, file.name, id);
        } catch (error) {
            console.error('Error:', error);
        }
    };




    const addFILE = async (filePath, nume, id) => {
        try {
            const response = await fetch(filePath);
            const fileBlob = await response.blob();
            const file = new File([fileBlob], nume, { type: fileBlob.type });

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
                setTimeout(handleCreateProjectModel(response.data.fileName, response.data.link, response.data.extension, file.name, id), 500);

            } catch (error) {
                console.log(error);
            }
        } catch (error) {
            console.log('Error fetching the file:', error);
        }
    };

    const handleCreateProjectModel = (fileName, link, extension, alias, id) => {

        const newModelProject = {
            idProject: id,
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

            }).catch(
                (error) => {

                    console.log(error);
                }
            );


    }

    const updateCode = async (id, template) => {
        const code = getTemplate(template)
        const formData = new FormData();
        const fileBlob = new Blob([code], { type: 'text/javascript' });
        formData.append('file', fileBlob, 'project_code.js');
        const token = getToken();
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        };
        request2(
            "PUT",
            `/code/update/idProject=${id}`,
            headers,
            formData,
        ).then(
            (response) => {
                console.log(response.data);


                switch (template) {
                    case 'template4':
                        addFILE2('https://firebasestorage.googleapis.com/v0/b/sodium-coil-312918.appspot.com/o/models%2ftemplate4.obj?alt=media', 'template4.obj', id);
                        break;
                    case 'template5':
                        addFILE2('https://firebasestorage.googleapis.com/v0/b/sodium-coil-312918.appspot.com/o/models%2ftemplate5.obj?alt=media', 'template5.obj', id);
                        addFILE2('https://firebasestorage.googleapis.com/v0/b/sodium-coil-312918.appspot.com/o/models%2ftemplate5.mtl?alt=media', 'template5.mtl', id);

                        break;
                }
                // addFILE('src/assets/template4.obj', id);
                navigate('/mypage');
                // setTimeout(navigate(`/editProject/${id}`), 1000);

            }).catch(
                (error) => {
                    console.log(error);
                }
            );
    }
    return (
        <div className='addProjectContainer'>
            <div className='addProject'>
                <form onSubmit={handleSubmit} className="form">
                    <h1>Add project</h1>
                    <p>Complete all fields:</p>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        placeholder='Enter project name'
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <label htmlFor="description">Description:</label>
                    <textarea
                        type="text"
                        id="description"
                        cols="30"
                        rows="5"
                        value={description}
                        placeholder="Describe your project..."
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>

                    <div className='template'>
                        <div className='column1'>
                            <div className="form-control">
                                <label>Choose a template:</label>
                                <div>
                                    <input
                                        type="radio"
                                        id="template1"
                                        name="template"
                                        value="template1"
                                        defaultChecked
                                        onChange={() => handleTemplateSelect("template1")}
                                    />
                                    <label htmlFor="template1">Illuminated cube</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="template2"
                                        name="template"
                                        value="template2"
                                        // checked='false'
                                        onChange={() => handleTemplateSelect("template2")}
                                    />
                                    <label htmlFor="template2">XYZ axes</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="template3"
                                        name="template"
                                        value="template3"
                                        // checked='false'
                                        onChange={() => handleTemplateSelect("template3")}
                                    />
                                    <label htmlFor="template3">XYZ axes & grid</label>
                                </div>

                                <div>
                                    <input
                                        type="radio"
                                        id="template4"
                                        name="template"
                                        value="template4"
                                        // checked='false'
                                        onChange={() => handleTemplateSelect("template4")}
                                    />
                                    <label htmlFor="template4">Add OBJ file to project</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="template5"
                                        name="template"
                                        value="template5"
                                        // checked='false'
                                        onChange={() => handleTemplateSelect("template5")}
                                    />
                                    <label htmlFor="template4">Add OBJ and MTL file to project</label>
                                </div>
                            </div>
                            <div className='descriptionTemplate'>
                                <p>{description_template}</p>
                            </div>
                        </div>

                        <div className='column2'>
                            {templateImage && <img src={templateImage} alt="Template Image" />}
                        </div>
                    </div>
                    <div className='button-container'>
                        <button type="submit">Create project</button>
                    </div>

                </form>
            </div>
        </div>
    )
}

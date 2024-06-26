import React, { useState, useEffect } from 'react'
import './AddProject.css';
import { useNavigate, useParams } from 'react-router-dom';
import { request, request2, getToken } from '../../../../utils/axios_helper';
import cubeImage from '../../../../../src/assets/image/templateCube.png';
import axesImage from '../../../../../src/assets/image/templateAxes.png';
import axesGridImage from '../../../../../src/assets/image/templateGrid&Axes.png';
import { getTemplate } from '../../../../utils/Utilities';
export default function AddProject() {
    const { userId } = useParams();
    let navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [description_template, setDescriptionTemplate] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [templateImage, setTemplateImage] = useState(null);
    useEffect(() => {
        if (cubeImage) {
            setTemplateImage(cubeImage);
            setDescriptionTemplate(descriptions_template[0]);
        }


    }, [cubeImage]);

    const handleSubmit = (event) => {
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
        "Cub iluminat de culoare galbenă, cu latura de o unitate",
        "Sistemul de coordonate XYZ",
        "Sistemul de coordonate XYZ împreună cu un grilaj cu latura de 20 unități",
        "Descriere 3"];
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
            default:
                setTemplateImage(null);

        }
    };
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
                navigate('/mypage');

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

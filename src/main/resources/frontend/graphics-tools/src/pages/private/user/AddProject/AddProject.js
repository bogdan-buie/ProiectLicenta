import React, { useState } from 'react'
import './AddProject.css';
import { useNavigate, useParams } from 'react-router-dom';
import { request } from '../../../../utils/axios_helper';

export default function AddProject() {
    const { userId } = useParams();
    let navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [templateImage, setTemplateImage] = useState(null);
    const [templateText, setTemplateText] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        request(
            "POST",
            `project/create/user=${userId}`,
            {
                "id": "",
                "name": `${name}`,
                "grade": null,
                "lastModification": Math.floor(Date.now() / 1000),
                "description": `${description}`
            }).then(
                (response) => {

                    if (response.data === "Project added with success") {
                        navigate('/mypage');
                    }
                    console.log(response.data);
                }).catch(
                    (error) => {
                        console.log(error);
                    }
                );

    };

    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        // Setează imaginea și textul corespunzător pentru fiecare template
        switch (template) {
            case 'template1':
                setTemplateImage('URL imaginii template1');
                setTemplateText('Text pentru template1');
                break;
            case 'template2':
                setTemplateImage('URL imaginii template2');
                setTemplateText('Text pentru template2');
                break;
            case 'template3':
                setTemplateImage('URL imaginii template3');
                setTemplateText('Text pentru template3');
                break;
            default:
                setTemplateImage(null);
                setTemplateText('');
        }
    };
    return (
        <div className='addProjectContainer'>
            <div className='addProject'>
                <form onSubmit={handleSubmit} className="form">
                    <h1>Add project</h1>
                    <p>Complete all fields:</p>
                    <div className="form-control">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            placeholder='Enter project name'
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>


                    <div className="form-control">
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
                    </div>


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
                                        checked={selectedTemplate === "template1"}
                                        onChange={() => handleTemplateSelect("template1")}
                                    />
                                    <label htmlFor="template1">Template 1</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="template2"
                                        name="template"
                                        value="template2"
                                        checked={selectedTemplate === "template2"}
                                        onChange={() => handleTemplateSelect("template2")}
                                    />
                                    <label htmlFor="template2">Template 2</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="template3"
                                        name="template"
                                        value="template3"
                                        checked={selectedTemplate === "template3"}
                                        onChange={() => handleTemplateSelect("template3")}
                                    />
                                    <label htmlFor="template3">Template 3</label>
                                </div>
                            </div>
                        </div>

                        <div className='column2'>
                            {templateImage && <img src={templateImage} alt="Template Image" />}
                            <p>{templateText}</p>
                        </div>
                    </div>
                    <button type="submit">Create project</button>
                </form>
            </div>
        </div>
    )
}

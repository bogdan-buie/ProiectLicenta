import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import './CodeEditor.css';

const CodeEditor = (props) => {
    const [code, setCode] = useState('');
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {

        if (!initialized) {
            setCode(props.initialCode);
            setInitialized(true);
        }
        handleChange(props.initialCode);
    }, [props.initialCode, initialized]);

    const handleChange = (newValue) => {
        setCode(newValue);
        props.manageCode(newValue);
        //console.log(newValue); // Afisează noua valoare în consolă
    };

    return (
        <div className='editor-container'>
            <Editor
                width="100%"
                height="100%"
                theme='vs-dark'
                defaultLanguage='javascript'
                onChange={handleChange}
                value={code}
                options={{ minimap: { enabled: false } }}
            />
        </div>
    );
};

export default CodeEditor;

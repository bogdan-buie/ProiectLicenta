import React, { useRef, useEffect, useState } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader'
import { FileLoader } from 'three/src/loaders/FileLoader';
const ThreeScene = (props) => {

    const [dimension, setDimension] = useState(props.dimension);
    const [code, setCode] = useState(props.code);
    const sceneRef = useRef(null);
    var consoleMessages = [];

    const handleConsoleMessages = () => {
        props.updateConsoleMessages(consoleMessages);
        console.log(consoleMessages);
    }
    useEffect(() => {
        setDimension(props.dimension);
        console.log(dimension);
    }, [props.dimension]);


    useEffect(() => {
        // const threeCode = props.code;
        setDimension(props.dimension);
        console.log(dimension);
        // Curățăm toți copiii din div
        while (sceneRef.current.firstChild) {
            sceneRef.current.removeChild(sceneRef.current.firstChild);
        }


        const consoleLog = console.log;
        console.log = (message) => {
            consoleMessages.push({
                type: "LOG",
                message: message
            });
            consoleLog(message);
        };

        // Executăm codul Three.js furnizat în props
        try {
            const threeCodeFunction = new Function('THREE', 'OBJLoader', 'MTLLoader', 'FileLoader', 'sceneRef', 'OrbitControls', 'height', 'width', code);
            threeCodeFunction(THREE, OBJLoader, MTLLoader, FileLoader, sceneRef, OrbitControls, dimension.height, dimension.width);


        } catch (error) {
            consoleMessages.push(
                {
                    type: "ERROR",
                    message: error.toString()
                });
        } finally {
            // Restaurăm funcționalitatea console.error și console.log
            console.log = consoleLog;
        }

        console.log(consoleMessages);
        handleConsoleMessages();

        return () => {

        };

    }, [props.code]);

    return (
        <div>
            <div ref={sceneRef} ></div>
        </div>
    );
};

export default ThreeScene;

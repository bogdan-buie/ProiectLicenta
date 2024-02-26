import React, { useRef, useEffect } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
const ThreeScene = (props) => {
    const sceneRef = useRef(null);
    var consoleMessages = [];



    const handleConsoleMessages = () => {
        props.updateConsoleMessages(consoleMessages);
        console.log(consoleMessages);
    }


    useEffect(() => {
        const threeCode = props.code;



        // Curățăm toți copiii din div
        while (sceneRef.current.firstChild) {
            sceneRef.current.removeChild(sceneRef.current.firstChild);
        }


        const consoleLog = console.log;
        console.log = (message) => {
            consoleMessages.push(message);
            consoleLog(message);
        };

        // Executăm codul Three.js furnizat în props
        try {
            const threeCodeFunction = new Function('THREE', 'sceneRef', 'OrbitControls', threeCode);
            threeCodeFunction(THREE, sceneRef, OrbitControls);


        } catch (error) {
            consoleMessages.push(error.toString());
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
            <div ref={sceneRef}></div>
        </div>
    );
};

export default ThreeScene;

import React, { useRef, useEffect, useState } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader'
import { FileLoader } from 'three/src/loaders/FileLoader';

const ThreeScene = (props) => {

    const [dimension, setDimension] = useState(props.dimension);
    const [modelProject, setModelProject] = useState(props.modelProject);
    const [projectId, setProjectId] = useState(props.id);
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
        consoleMessages = [];
        const threeCode = props.code;
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
            //consoleLog(message);
        };
        const getOBJ = (alias) => {
            return new Promise((resolve, reject) => {
                let aliasLink;
                // console.log(alias);
                for (let obj of modelProject) {
                    if (obj.alias === alias) {
                        aliasLink = obj.link;
                    }
                }
                // console.log("Link=  " + aliasLink);

                var objLoader = new OBJLoader();

                objLoader.load(aliasLink, function (object) {
                    resolve(object);
                }, undefined, function (error) {
                    reject(error);
                    // consoleLog(error); 
                });
            });
        }
        const getOBJwithMTL = (aliasMTL, aliasOBJ) => {
            return new Promise((resolve, reject) => {
                let aliasMTL_Link, aliasOBJ_Link;

                // Caută link-ul pentru fișierul .mtl
                for (let obj of modelProject) {
                    if (obj.alias === aliasMTL) {
                        aliasMTL_Link = obj.link;
                    }
                }

                // Caută link-ul pentru fișierul .obj
                for (let obj of modelProject) {
                    if (obj.alias === aliasOBJ) {
                        aliasOBJ_Link = obj.link;
                    }
                }

                // Încarcă fișierul .mtl
                const mtlLoader = new MTLLoader();
                mtlLoader.load(
                    aliasMTL_Link,
                    (materials) => {
                        materials.preload();

                        // Atunci când fișierul .mtl este încărcat, încarcă fișierul .obj
                        const objLoader = new OBJLoader();
                        objLoader.setMaterials(materials);
                        objLoader.load(
                            aliasOBJ_Link,
                            (object) => {
                                resolve(object); // Rezolvă promisiunea cu obiectul încărcat
                            },
                            (xhr) => {
                                console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
                            },
                            (error) => {
                                reject(error); // Reject the promise if there is an error
                                console.log('An error happened');
                            }
                        );
                    },
                    (xhr) => {
                        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
                    },
                    (error) => {
                        reject(error); // Reject the promise if there is an error
                        console.log('An error happened');
                    }
                );
            });
        };


        // Executăm codul Three.js furnizat în props
        try {
            const threeCodeFunction = new Function('THREE', 'getOBJ', 'getOBJwithMTL', 'OBJLoader', 'MTLLoader', 'FileLoader', 'sceneRef', 'OrbitControls', 'height', 'width', threeCode);
            threeCodeFunction(THREE, getOBJ, getOBJwithMTL, OBJLoader, MTLLoader, FileLoader, sceneRef, OrbitControls, dimension.height, dimension.width);


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
        console.log(consoleMessages);

        // return () => {

        // };

    }, [props.code]);

    return (
        <div>
            <div ref={sceneRef} ></div>
        </div>
    );
};

export default ThreeScene;

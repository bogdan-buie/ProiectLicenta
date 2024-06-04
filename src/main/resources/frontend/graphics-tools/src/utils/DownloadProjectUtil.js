import JSZip from "jszip";
import { saveAs } from "file-saver";

export const downloadZIP = async (project, modelprojects, editorData) => {
    const part1 = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <style>
            body {
                margin: 0;
            }
        </style>
    </head>
    
    <body>
    <div id="scene-container"></div>
    <script type="module">
        import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
        import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
        import { OBJLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/OBJLoader.js';
        import { MTLLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/MTLLoader.js';
    
        const sceneRef = document.getElementById('scene-container');
        let width = window.innerWidth;
        let height = window.innerHeight;
    
        function getOBJ(name) {
            return new Promise((resolve, reject) => {
                const loader = new OBJLoader();
                loader.load(
                    name, // Înlocuiește cu calea către modelul tău OBJ
                    function (object) {
                        resolve(object);
                    },
                    function (xhr) {
                        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                    },
                    function (error) {
                        reject(error);
                    }
                );
            });
        }
    
        function getOBJwithMTL(mtl, obj) {
            return new Promise((resolve, reject) => {
                const mtlLoader = new MTLLoader();
                mtlLoader.load(mtl, (materials) => {
                    materials.preload();
                    const objLoader = new OBJLoader();
                    objLoader.setMaterials(materials);
                    objLoader.load(
                        obj,
                        function (object) {
                            resolve(object);
                        },
                        function (xhr) {
                            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                        },
                        function (error) {
                            reject(error);
                        }
                    );
                }, undefined, function (error) {
                    reject(error);
                });
            });
        }
    `;

    const part3 = `
</script>
</body>

</html>
`;

    const modifyString = (input) => {
        return input.replace(
            'sceneRef.current.appendChild(renderer.domElement);',
            'sceneRef.appendChild(renderer.domElement);'
        );
    };

    const part2 = modifyString(editorData);
    const finalContent = part1 + part2 + part3;

    const zip = new JSZip();
    zip.file("index.html", finalContent);
    const zipFileName = project.name;

    if (modelprojects) {
        for (const model of modelprojects) {
            if (model.link) {
                try {
                    const response = await fetch(model.link);
                    const blob = await response.blob();
                    const filename = model.alias;
                    zip.file(filename, blob);
                } catch (error) {
                    console.error("Error downloading file:", error);
                }
            }
        }
    }


    zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, zipFileName + ".zip");
    });
};

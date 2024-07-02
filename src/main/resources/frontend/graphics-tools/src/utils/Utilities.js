export const millisToDateTime = (millis) => {
    const date = new Date(millis);
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Europe/Bucharest' // Setează fusul orar la România
    };
    return date.toLocaleDateString('ro-RO', options);
};
export const template1 = `
let scene, camera, cube;
let renderer, controls;
function sceneBuilding() {
    var material = new THREE.MeshPhongMaterial({ color: 0xFFD700, shininess: 100 });
    var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    var cube = new THREE.Mesh(cubeGeometry, material);
    scene.add(cube);
    const light = new THREE.PointLight(0xffffff, 100, 100, 4);
    light.position.set(2, 2, 2);
    scene.add(light);
    const ambientLight = new THREE.AmbientLight(0x404040); 
    scene.add(ambientLight);


}
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });

    renderer.setSize(width, height);
    controls = new OrbitControls(camera, renderer.domElement);
    sceneRef.current.appendChild(renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 0;
    controls.maxDistance = 100;
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
function render() {
    renderer.render(scene, camera)
}
function onWindowResize() {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    render();
}

window.addEventListener('resize', onWindowResize, false);
init();
sceneBuilding();
animate();

function radiani(unghi) {
    // functie utila de tranformat un unghi din grade in radiani
    return unghi * 2.0 * Math.PI / 360.0;
}`;
export const template2 = `
let scene, camera, cube;
let renderer, controls;
function sceneBuilding() {

    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: false });
    // var cubeGeometry = new THREE.BoxGeometry(1,1,1);
    // var cube = new THREE.Mesh(cubeGeometry, material);
    // scene.add(cube);

}

function createHelpers() {
    var materialX = new THREE.LineBasicMaterial({ color: 0xff0000 }); // Roșu pentru axa X
    var materialY = new THREE.LineBasicMaterial({ color: 0x00ff00 }); // Verde pentru axa Y
    var materialZ = new THREE.LineBasicMaterial({ color: 0x0000ff }); // Albastru pentru axa Z

    // Axe de coordonate si varfurile axelor(conuri)
    var geometrieX = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-10, 0, 0),
        new THREE.Vector3(10, 0, 0)
    ]);
    var geometrieY = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, -10, 0),
        new THREE.Vector3(0, 10, 0)
    ]);
    var geometrieZ = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, -10),
        new THREE.Vector3(0, 0, 10)
    ]);

    var axaX = new THREE.Line(geometrieX, materialX);
    var axaY = new THREE.Line(geometrieY, materialY);
    var axaZ = new THREE.Line(geometrieZ, materialZ);

    scene.add(axaX);
    scene.add(axaY);
    scene.add(axaZ);

    var conGeometry = new THREE.ConeGeometry(0.2, 0.5, 8);
    var conX = new THREE.Mesh(conGeometry, materialX);
    conX.position.set(10, 0, 0); // Setează poziția conului pe axa X
    conX.rotateZ(radiani(-90));
    scene.add(conX);

    var conY = new THREE.Mesh(conGeometry, materialY);
    conY.position.set(0, 10, 0); // Setează poziția conului pe axa Y
    scene.add(conY);

    var conZ = new THREE.Mesh(conGeometry, materialZ);
    conZ.position.set(0, 0, 10); // Setează poziția conului pe axa Z
    conZ.rotateX(radiani(90));
    scene.add(conZ);
}
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 10;
    camera.position.x = 10;
    camera.position.y = 10;
    console.log(7 / 100);
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });

    renderer.setSize(width, height);
    controls = new OrbitControls(camera, renderer.domElement);
    sceneRef.current.appendChild(renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 0;
    controls.maxDistance = 100;

}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
function render() {
    renderer.render(scene, camera)
}
function onWindowResize() {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height );
    render();
}

window.addEventListener('resize', onWindowResize, false);


init();

sceneBuilding();
createHelpers();
// Pornim animația
animate();

function radiani(unghi) {
    // functie utila de tranformat un unghi din grade in radiani
    return unghi * 2.0 * Math.PI / 360.0;
}`;
export const template3 = `let scene, camera, cube;
let renderer, controls;
function sceneBuilding() {

    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: false });
    // var cubeGeometry = new THREE.BoxGeometry(1,1,1);
    // var cube = new THREE.Mesh(cubeGeometry, material);
    // scene.add(cube);

}

function createHelpers() {
    const size = 20;
    const divisions = 20;
    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);
    gridHelper.visible = true;

    var materialX = new THREE.LineBasicMaterial({ color: 0xff0000 }); // Roșu pentru axa X
    var materialY = new THREE.LineBasicMaterial({ color: 0x00ff00 }); // Verde pentru axa Y
    var materialZ = new THREE.LineBasicMaterial({ color: 0x0000ff }); // Albastru pentru axa Z

    // Axe de coordonate si varfurile axelor(conuri)
    var geometrieX = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-10, 0, 0),
        new THREE.Vector3(10, 0, 0)
    ]);
    var geometrieY = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, -10, 0),
        new THREE.Vector3(0, 10, 0)
    ]);
    var geometrieZ = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, -10),
        new THREE.Vector3(0, 0, 10)
    ]);

    var axaX = new THREE.Line(geometrieX, materialX);
    var axaY = new THREE.Line(geometrieY, materialY);
    var axaZ = new THREE.Line(geometrieZ, materialZ);

    scene.add(axaX);
    scene.add(axaY);
    scene.add(axaZ);

    var conGeometry = new THREE.ConeGeometry(0.2, 0.5, 8);
    var conX = new THREE.Mesh(conGeometry, materialX);
    conX.position.set(10, 0, 0); // Setează poziția conului pe axa X
    conX.rotateZ(radiani(-90));
    scene.add(conX);

    var conY = new THREE.Mesh(conGeometry, materialY);
    conY.position.set(0, 10, 0); // Setează poziția conului pe axa Y
    scene.add(conY);

    var conZ = new THREE.Mesh(conGeometry, materialZ);
    conZ.position.set(0, 0, 10); // Setează poziția conului pe axa Z
    conZ.rotateX(radiani(90));
    scene.add(conZ);
}
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    console.log(7 / 100);
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });

    renderer.setSize(width, height);
    controls = new OrbitControls(camera, renderer.domElement);
    sceneRef.current.appendChild(renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 0;
    controls.maxDistance = 100;

}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
function render() {
    renderer.render(scene, camera)
}
function onWindowResize() {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    render();
}

window.addEventListener('resize', onWindowResize, false);


init();

sceneBuilding();
createHelpers();
// Pornim animația
animate();

function radiani(unghi) {
    // functie utila de tranformat un unghi din grade in radiani
    return unghi * 2.0 * Math.PI / 360.0;
}`;

//OBJ
export const template4 = `
let scene, camera, cube;
let renderer, controls;
function sceneBuilding() {
    console.log("Hello, world");
    const ambientLight = new THREE.AmbientLight(0x909090);
    //scene.add(ambientLight);   
    const spotLight = new THREE.SpotLight(0xffffff,100,100,radiani(30),0.5 );
    spotLight.position.set( -7, 10, -10);

    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov =5;

    scene.add( spotLight );
    getOBJ("template4.obj").then(mesh => {
        // mesh.scale.set(0.001, 0.001, 0.001); 
        scene.add(mesh);  
    });


}
function init() {
    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xffffff); 
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2;
    camera.position.y = 2;
    camera.position.x = 2;
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });

    renderer.setSize(width, height);
    controls = new OrbitControls(camera, renderer.domElement);
    sceneRef.current.appendChild(renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 0;
    controls.maxDistance = 100;
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
function render() {
    renderer.render(scene, camera)
}
function onWindowResize() {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    render();
}

window.addEventListener('resize', onWindowResize, false);
init();
sceneBuilding();
animate();

function radiani(unghi) {
    // functie utila de tranformat un unghi din grade in radiani
    return unghi * 2.0 * Math.PI / 360.0;
}
`;

export const template5 = `
let scene, camera, cube;
let renderer, controls;
function sceneBuilding() {

    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: false });
    // var cubeGeometry = new THREE.BoxGeometry(1,1,1);
    // var cube = new THREE.Mesh(cubeGeometry, material);
    // scene.add(cube);
    const light = new THREE.PointLight(0xffffff, 100, 100, 4);
    light.position.set(2, 2, 0);
    scene.add(light);
    
    getOBJwithMTL("template5.mtl","template5.obj").then(mesh => {
        // mesh.scale.set(0.05, 0.05, 0.05); 
        scene.add(mesh);  
    }).catch(error => {
        console.error("Eroare la încărcarea obiectului:", error);
    });

}

function createHelpers() {
    var materialX = new THREE.LineBasicMaterial({ color: 0xff0000 }); // Roșu pentru axa X
    var materialY = new THREE.LineBasicMaterial({ color: 0x00ff00 }); // Verde pentru axa Y
    var materialZ = new THREE.LineBasicMaterial({ color: 0x0000ff }); // Albastru pentru axa Z

    // Axe de coordonate si varfurile axelor(conuri)
    var geometrieX = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-10, 0, 0),
        new THREE.Vector3(10, 0, 0)
    ]);
    var geometrieY = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, -10, 0),
        new THREE.Vector3(0, 10, 0)
    ]);
    var geometrieZ = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, -10),
        new THREE.Vector3(0, 0, 10)
    ]);

    var axaX = new THREE.Line(geometrieX, materialX);
    var axaY = new THREE.Line(geometrieY, materialY);
    var axaZ = new THREE.Line(geometrieZ, materialZ);

    scene.add(axaX);
    scene.add(axaY);
    scene.add(axaZ);

    var conGeometry = new THREE.ConeGeometry(0.2, 0.5, 8);
    var conX = new THREE.Mesh(conGeometry, materialX);
    conX.position.set(10, 0, 0); // Setează poziția conului pe axa X
    conX.rotateZ(radiani(-90));
    scene.add(conX);

    var conY = new THREE.Mesh(conGeometry, materialY);
    conY.position.set(0, 10, 0); // Setează poziția conului pe axa Y
    scene.add(conY);

    var conZ = new THREE.Mesh(conGeometry, materialZ);
    conZ.position.set(0, 0, 10); // Setează poziția conului pe axa Z
    conZ.rotateX(radiani(90));
    scene.add(conZ);
}
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 10;
    camera.position.x = 10;
    camera.position.y = 10;
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });

    renderer.setSize(width, height);
    controls = new OrbitControls(camera, renderer.domElement);
    sceneRef.current.appendChild(renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 0;
    controls.maxDistance = 100;

}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
function render() {
    renderer.render(scene, camera)
}
function onWindowResize() {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height );
    render();
}

window.addEventListener('resize', onWindowResize, false);


init();

sceneBuilding();
createHelpers();
// Pornim animația
animate();

function radiani(unghi) {
    // functie utila de tranformat un unghi din grade in radiani
    return unghi * 2.0 * Math.PI / 360.0;
}

`;
export const getTemplate = (template) => {
    switch (template) {
        case 'template1':
            return template1;
        case 'template2':
            return template2;
        case 'template3':
            return template3;
        case 'template4':
            return template4;
        case 'template5':
            return template5;
        default:
            return template1;
    }
}
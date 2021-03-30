import { FBXLoader } from '../loaders/FBXLoader.js';
import { OrbitControls } from '../controls/OrbitControls.js';
import { FirstPersonControls } from '../controls/FirstPersonControls.js';
import { PointerLockControls } from '../controls/PointerLockControls.js';



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var textureLoader = new THREE.TextureLoader();
const renderer = new THREE.WebGLRenderer({ antialas: true });
const clock = new THREE.Clock();

//First Person Camera
const controls = new PointerLockControls(camera, renderer.domElement);
controls.maxPolarAngle = 2;
controls.minPolarAngle = 1;
scene.add(controls.getObject());
controls.getObject().position.set(0, 0, -2);
camera.rotation.y = 3;

//Mesh Import
const loader = new FBXLoader();

//Music 
// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add(listener);
// create a global audio source
const sound = new THREE.Audio(listener);

//BPM
const bpm = 130;
const secondBeat = 1 / (bpm / 60);
let timerTic = secondBeat;
var countTic = 1;
var totalTic = 1;
var demiTic;

let timerDemiTic;

//Color
var colorScene = new THREE.Color(0xff0000);

//MeshArray
const torusMesh = [];
const cubeMeshs = [];
const cubeAligned = [];

//Mesh Offsets
const cubeOffset = new THREE.Vector3(1.08, -0.5, 0.06)
let visibleMeshs = false;
let ratioCube = 0.025;

//Cube Scale Values
let cubeScaleMin = 0.1;
let cubeScaleMax = 0.2;


//Starting Button
const startButton = document.getElementById("startButton");
startButton.addEventListener('click', function () {
    init();
    hideButton();
    controls.lock();
    console.log(controls);
})
function hideButton() {
    document.getElementById("startButton").style.display = 'none';
}

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load('audio/the-living-tombstone-dog-of-wisdom-remix-blue-feat-joe-gran.mp3', function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.1);
});


function init() {

    var ySpeed = 0.1;
    var xSpeed = 0.1;

    var colorsDrawing = [
        "#ffbe0b",
        "#fb5607",
        "#ff006e",
        "#8338ec",
        "#3a86ff"
    ]

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // resize canvas on resize window
    window.addEventListener('resize', () => {
        let width = window.innerWidth
        let height = window.innerHeight
        renderer.setSize(width, height)
        camera.aspect = width / height
        camera.updateProjectionMatrix()

        ratioCubeT = 0.025

        demiTic = false
    })

    renderer.setClearColor("#111111")

    //Ambient Lights 
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
    scene.add(ambientLight)


    //Point Lights
    var pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(25, 50, 25);
    scene.add(pointLight);


    sound.play();


    //Torus 
    for (let i = 0; i < 10; i++) {
        loader.load('meshs/fbx/TorusCircle.fbx', function (object) {
            scene.add(object);
            torusMesh.push(object);

            object.position.z += 2 * i;
            object.rotation.x = 80;
            object.rotation.y = 5 * i;

            object.traverse(function (child) {
                if (child.isMesh) {
                    //Change Purple Mat
                    child.material[1].emissive = child.material[1].color;
                    child.material[1].emissiveIntensity = 0.50;

                    //Change Red Mat
                    child.material[4].emissive = child.material[4].color;
                    child.material[4].emissiveIntensity = 0.50;
                    //console.log( child.material);

                    //Change Black Mat
                    //child.material[3].color = new THREE.Color( 0xffffff );
                }
            });
            var x = 1 / 7;
            object.scale.set(x, x, x);
        });
    }

    cubeCreations();
    console.log(cubeMeshs)
}

animate();
clockTic();


//Box Animation
function animate() {
    requestAnimationFrame(animate);
    camera.position.z += 0.010;
    //Torus Rotation
    torusMesh.forEach(torus => {

        torus.rotation.y += 0.02;

        switch (countTic > 2) {
            case true:
                torus.traverse(function (child) {
                    if (child.isMesh) {
                        child.material[1].emissive = new THREE.Color(0xffffff);
                        child.material[1].color = new THREE.Color(0xffffff);
                        child.material[4].emissive = colorScene;
                        child.material[4].color = colorScene;
                    }
                });
                break;
            case false:
                torus.traverse(function (child) {
                    if (child.isMesh) {
                        child.material[1].emissive = colorScene;
                        child.material[1].color = colorScene;
                        child.material[4].emissive = new THREE.Color(0xffffff);
                        child.material[4].color = new THREE.Color(0xffffff);
                    }
                });
                break;
        }
    });


    //All Cube Rotation
    cubeMeshs.forEach(cube => {
        cube.rotation.x += 0.04;
        //cube.rotation.y += 0.04;

        if(demiTic)
        {
            ratioCube *= 2;
            cube.scale.set(cubeScaleMin + ratioCube, cubeScaleMin + ratioCube, cubeScaleMin + ratioCube)

            if (cube.scale.x > cubeScaleMax) {
                cube.scale.set(cubeScaleMax, cubeScaleMax, cubeScaleMax);
            }
        }
        else {
            ratioCube /= 2;
            cube.scale.set(cubeScaleMax - ratioCube, cubeScaleMax - ratioCube, cubeScaleMax - ratioCube)

            if (cube.scale.x < cubeScaleMin) {
                cube.scale.set(cubeScaleMax, cubeScaleMax, cubeScaleMax);
            }
        }
    });

    cubeAligned.forEach(cube => {

        switch (countTic > 2) {
            case true:
                cube.traverse(function (child) {
                    if (child.isMesh) {
                        //console.log(child.material)
                        if(child.material[0] != null)
                        {
                            child.material[0].emissive = new THREE.Color(0x000000);
                            child.material[0].color = new THREE.Color(0x000000);
                            child.material[1].emissive = new THREE.Color(0xff0000);
                            child.material[1].color = new THREE.Color(0xff0000);
                        }
                    }
                });
                break;
            case false:
                cube.traverse(function (child) {
                    if (child.isMesh) {
                        if(child.material[0] != null)
                        {
                            child.material[0].emissive = new THREE.Color(0xff0000);
                            child.material[0].color = new THREE.Color(0xff0000);
                            child.material[1].emissive = new THREE.Color(0xff0000);
                            child.material[1].color = new THREE.Color(0xff0000);
                        }
                        
                    }
                });
                break;
        }
    })

    renderer.render(scene, camera);

}


function clockTic() {
    requestAnimationFrame(clockTic);

    if (sound) {
        if (sound.isPlaying) {
            timerTic -= clock.getDelta();
            timerDemiTic = timerTic / 2;
            if (timerDemiTic < 0) {
                ratioCube = 0.15;

                timerDemiTic = secondBeat;
            }
            if (timerTic < 0) {
                countTic += 1;
                totalTic += 1;
                if (countTic > 4) {
                    countTic = 1
                }
                timerTic = secondBeat;
                checkTime();
            }
            if (timerTic <= secondBeat / 2) {
                demiTic = true;
            }
            else {
                demiTic = false;
            }
        }
    }
}

function checkTime(){
    if(totalTic > 0 && totalTic < 22){
        colorScene = new THREE.Color(0xff0000);
    }else if(totalTic > 21 && totalTic < 45){
        colorScene = new THREE.Color(0x00ff00);
    }else if(totalTic > 44 && totalTic < 66){
        colorScene = new THREE.Color(0x0000ff);
    }

    setupNewColorsMeshs();
}


//Permet de créer un mesh et de lui mettre un parent a sa position
function setUpMesh(parent, child, positionParent, offsetChild) {
    scene.add(parent);
    parent.position.copy(positionParent);
    parent.add(child);
    child.position.copy(offsetChild);
}

function getRandomIntNumberBetween(max) {
    return Math.floor(Math.random() * (max - 0 + 1) + 0);
}

function getRandomFloatNumberBetween(max) {
    return Math.random() * (max - 0 + 1) + 0;
}

function setupNewColorsMeshs(){
    cubeMeshs.forEach(object => {
        object.children[0].children[0].material[1].color = colorScene;
        object.children[0].children[0].material[1].emissive = colorScene;
    });    
}

function cubeCreations() {
    for (let i = 0; i < 10; i++) {
        if(i%2 == 0){
            for (let j = 0; j < 2; j++) {
                if (j == 0) {
                    //Cubes Right
                    loader.load('meshs/fbx/Cube.fbx', function (object) {
                        scene.add(object);
    
                        var geometry = new THREE.BoxGeometry(1, 1, 1);
                        var material = new THREE.MeshStandardMaterial({ color: 0xff0120, flatShading: true, metalness: 0, roughness: 1, visible: visibleMeshs, emissiveMap: textureLoader.load(("glowmap_test.png")), });
                        var cube = new THREE.Mesh(geometry, material);
                        cubeMeshs.push(cube);
    
                        setUpMesh(cube, object, new THREE.Vector3(0.75, 0, 1 * i), cubeOffset)
                        var x = 1 / 10;
                        object.scale.set(x, x, x);
    
                        object.traverse(function (child) {
                            if (child.isMesh) {
                                child.material[1].emissive = colorScene;
                                child.material[1].emissiveIntensity = 1;
                                child.material[1].color = colorScene;
                            }
                        });
                    });
                } else {    
                    //Cubes Left
                    console.log('1');
                    loader.load('meshs/fbx/Cube.fbx', function (object) {
                        scene.add(object);
    
                        var geometry = new THREE.BoxGeometry(1, 1, 1);
                        var material = new THREE.MeshStandardMaterial({ color: 0xff0120, flatShading: true, metalness: 0, roughness: 1, visible: visibleMeshs, emissiveMap: textureLoader.load(("glowmap_test.png")), });
                        var cube = new THREE.Mesh(geometry, material);
                        cubeMeshs.push(cube);
    
                        setUpMesh(cube, object, new THREE.Vector3(-0.75, 0, 1 * i), cubeOffset)
                        var x = 1 / 10;
                        object.scale.set(x, x, x);
    
                        object.traverse(function (child) {
                            if (child.isMesh) {
                                child.material[1].emissive = colorScene;
                                child.material[1].emissiveIntensity = 1;
                                child.material[1].color = colorScene;
                            }
                        });
                    });
                }
            }
        }else{
            for (let j = 0; j < 2; j++) {
                if (j == 0) {
                    //Cubes Right
                    loader.load('meshs/fbx/Cube.fbx', function (object) {
                        scene.add(object);
    
                        var geometry = new THREE.BoxGeometry(1, 1, 1);
                        var material = new THREE.MeshStandardMaterial({ color: 0xff0120, flatShading: true, metalness: 0, roughness: 1, visible: visibleMeshs, emissiveMap: textureLoader.load(("glowmap_test.png")), });
                        var cube = new THREE.Mesh(geometry, material);
                        cubeMeshs.push(cube);
    
                        setUpMesh(cube, object, new THREE.Vector3(0, -0.75, 1 * i), cubeOffset)
                        var x = 1 / 10;
                        object.scale.set(x, x, x);
    
                        object.traverse(function (child) {
                            if (child.isMesh) {
                                child.material[1].emissive = colorScene;
                                child.material[1].emissiveIntensity = 1;
                                child.material[1].color = colorScene;
                            }
                        });
                    });
                } else {    
                    //Cubes Left
                    console.log('1');
                    loader.load('meshs/fbx/Cube.fbx', function (object) {
                        scene.add(object);
    
                        var geometry = new THREE.BoxGeometry(1, 1, 1);
                        var material = new THREE.MeshStandardMaterial({ color: 0xff0120, flatShading: true, metalness: 0, roughness: 1, visible: visibleMeshs, emissiveMap: textureLoader.load(("glowmap_test.png")), });
                        var cube = new THREE.Mesh(geometry, material);
                        cubeMeshs.push(cube);
    
                        setUpMesh(cube, object, new THREE.Vector3(0, 0.75, 1 * i), cubeOffset)
                        var x = 1 / 10;
                        object.scale.set(x, x, x);
    
                        object.traverse(function (child) {
                            if (child.isMesh) {
                                child.material[1].emissive = colorScene;
                                child.material[1].emissiveIntensity = 1;
                                child.material[1].color = colorScene;
                            }
                        });
                    });
                }
            }
        }
    }

    
    loader.load('meshs/fbx/Cube.fbx', function (object) {
        scene.add(object);

        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshStandardMaterial({ color: 0xff0120, flatShading: true, metalness: 0, roughness: 1, visible: visibleMeshs, emissiveMap: textureLoader.load(("glowmap_test.png")) });
        let cube5 = new THREE.Mesh(geometry, material);
        cubeAligned.push(cube5);

        setUpMesh(cube5, object, new THREE.Vector3(0, 0, 0),cubeOffset)
        var x = 1 / 10;
        object.scale.set(x, x, x);

        object.traverse(function (child) {
            if (child.isMesh) {
                child.material[0].emissive = new THREE.Color(0x000000);
                child.material[0].emissiveIntensity = 1;
                child.material[0].color = new THREE.Color(0x000000);;
                child.material[1].emissive = new THREE.Color(0xff0000);
                child.material[1].emissiveIntensity = 1;
                child.material[1].color = new THREE.Color(0x000000);;
            }
        });
    });
}

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {

    /*
    var keyCode = event.which;

    if (keyCode == 90) {
        cube.position.y += ySpeed;
    }
    if (keyCode == 83) {
        cube.position.y -= ySpeed;
    }
    if (keyCode == 81) {
        cube.position.x -= xSpeed;
    }
    if (keyCode == 68) {
        cube.position.x += xSpeed;
    }

    if (keyCode == 32) {
        var cubeLenght = getRandomFloatNumberBetween(1.5 - 1);
        var geometryNext = new THREE.BoxGeometry(cubeLenght, cubeLenght, cubeLenght);
        var materialNext = new THREE.MeshStandardMaterial({ color: colorsDrawing[getRandomIntNumberBetween(colorsDrawing.length - 1)], flatShading: true, metalness: 0, roughness: 1 })
        cube = new THREE.Mesh(geometryNext, materialNext);
        scene.add(cube);
        cube.position.set(0, 0, 0);
    }
    */
}
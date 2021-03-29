import { FBXLoader } from '../loaders/FBXLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialas: true });
const clock = new THREE.Clock();

//Mesh Import
const loader = new FBXLoader();



//Music 
// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add(listener);
// create a global audio source
const sound = new THREE.Audio(listener);


//BPM
const bpm = 128;
const secondBeat = 1 / (bpm / 60);
let timerTic = secondBeat;
var countTic = 1;
//MeshArray
const torusMesh = [];
const cubeMeshs = [];

//Mesh Offsets
const cubeOffset = new THREE.Vector3(1.08, -0.5, 0.06)
let visibleMeshs = false;

//Cube1
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshStandardMaterial({ color: 0xff0120, flatShading: true, metalness: 0, roughness: 1, visible: visibleMeshs});
let cube1 = new THREE.Mesh(geometry, material);
cubeMeshs.push(cube1);

//Cube2
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshStandardMaterial({ color: 0xff0120, flatShading: true, metalness: 0, roughness: 1, visible: visibleMeshs });
let cube2 = new THREE.Mesh(geometry, material);
cubeMeshs.push(cube2);

//Cube3
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshStandardMaterial({ color: 0xff0120, flatShading: true, metalness: 0, roughness: 1, visible: visibleMeshs });
let cube3 = new THREE.Mesh(geometry, material);
cubeMeshs.push(cube3);

//Cube4
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshStandardMaterial({ color: 0xff0120, flatShading: true, metalness: 0, roughness: 1, visible: visibleMeshs });
let cube4 = new THREE.Mesh(geometry, material);
cubeMeshs.push(cube4);

const startButton = document.getElementById("startButton");
startButton.addEventListener('click', function () {
    init();
    hideButton();
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
    })

    renderer.setClearColor("#222222")

    //Ambient Lights 
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
    scene.add(ambientLight)


    //Point Lights
    var pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(25, 50, 25);
    scene.add(pointLight);


    //Camera Pos
    camera.position.z = 5;

    sound.play();


    //Torus 
    for (let i = 0; i < 4; i++) {
        loader.load('meshs/fbx/TorusCircle.fbx', function (object) {
            scene.add(object);
            torusMesh.push(object);

            object.position.z += 1 * i;
            object.rotation.x = 80;
            object.rotation.y = 5 * i;

            object.traverse(function (child) {
                if (child.isMesh) {
                    //Change Purple Mat
                    child.material[1].emissive = child.material[1].color;
                    child.material[1].emissiveIntensity = 0.30;

                    //Change Red Mat
                    child.material[4].emissive = child.material[4].color;
                    child.material[4].emissiveIntensity = 0.30;
                    //console.log( child.material);

                    //Change Black Mat
                    //child.material[3].color = new THREE.Color( 0xffffff );
                }
            });
            var x = 1 / 10;
            object.scale.set(x, x, x);
        });
    }

    cubeCreations();
}

animate();
clockTic();



//Box Animation
function animate() {
    requestAnimationFrame(animate);

    camera.position.y = 0.15;
    //Torus Rotation
    torusMesh.forEach(torus => {

        torus.rotation.y += 0.02;

        switch (countTic > 2) {
            case true:
                torus.traverse(function (child) {
                    if (child.isMesh) {
                        child.material[1].emissive = new THREE.Color(0x00ff00);
                        child.material[1].color = new THREE.Color(0x00ff00);
                        child.material[4].emissive = new THREE.Color(0xff0000);
                        child.material[4].color = new THREE.Color(0xff0000);
                    }
                });
                break;
            case false:
                torus.traverse(function (child) {
                    if (child.isMesh) {
                        child.material[1].emissive = new THREE.Color(0xff0000);
                        child.material[1].color = new THREE.Color(0xff0000);
                        child.material[4].emissive = new THREE.Color(0x00ff00);
                        child.material[4].color = new THREE.Color(0x00ff00);
                    }
                });
                break;
        }
    });

    //All Cube Rotation
    cubeMeshs.forEach(cube => {
        cube.rotation.x += 0.04;
        cube.rotation.y += 0.04;
    });

    renderer.render(scene, camera);

}

function clockTic() {
    requestAnimationFrame(clockTic);
    if (sound) {
        if (sound.isPlaying) {
            timerTic -= clock.getDelta();
            if (timerTic < 0) {
                countTic += 1;
                if (countTic > 4) {
                    countTic = 1
                }
                timerTic = secondBeat;
            }
        }
    }
}

//Permet de créer un mesh et de lui mettre un parent a sa position
function setUpMesh(parent, child, positionParent,offsetChild) {
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

function cubeCreations(){

    //Cube1
    loader.load('meshs/fbx/Cube.fbx', function (object) {
        scene.add(object);

        setUpMesh(cube1, object, new THREE.Vector3(-1.08, 0.5, 0),cubeOffset)
        var x = 1 / 10;
        object.scale.set(x, x, x);

        object.traverse(function (child) {
            if (child.isMesh) {
                child.material[1].emissive = new THREE.Color(0xff0000);
                child.material[1].emissiveIntensity = 1;
                child.material[1].color = new THREE.Color(0xff0000);;
            }
        });
    });

    
    loader.load('meshs/fbx/Cube.fbx', function (object) {
        scene.add(object);

        setUpMesh(cube2, object, new THREE.Vector3(1.08, 0.5, 0),cubeOffset)
        var x = 1 / 10;
        object.scale.set(x, x, x);

        object.traverse(function (child) {
            if (child.isMesh) {
                child.material[1].emissive = new THREE.Color(0xff0000);
                child.material[1].emissiveIntensity = 1;
                child.material[1].color = new THREE.Color(0xff0000);;
            }
        });
    });
    

        
    loader.load('meshs/fbx/Cube.fbx', function (object) {
        scene.add(object);

        setUpMesh(cube3, object, new THREE.Vector3(1.5, -1.5, 0),cubeOffset)
        var x = 1 / 10;
        object.scale.set(x, x, x);

        object.traverse(function (child) {
            if (child.isMesh) {
                child.material[1].emissive = new THREE.Color(0xff0000);
                child.material[1].emissiveIntensity = 1;
                child.material[1].color = new THREE.Color(0xff0000);;
            }
        });
    });
        
    loader.load('meshs/fbx/Cube.fbx', function (object) {
        scene.add(object);

        setUpMesh(cube4, object, new THREE.Vector3(-1.5, -1.5, 0),cubeOffset)
        var x = 1 / 10;
        object.scale.set(x, x, x);

        object.traverse(function (child) {
            if (child.isMesh) {
                child.material[1].emissive = new THREE.Color(0xff0000);
                child.material[1].emissiveIntensity = 1;
                child.material[1].color = new THREE.Color(0xff0000);;
            }
        });
    });
    
    
    /*
    loader.load('meshs/fbx/Cube.fbx', function (object) {
        scene.add(object);

        setUpMesh(cube4, object, new THREE.Vector3(-1.07, -1, 0))
        var x = 1 / 10;
        object.scale.set(x, x, x);

        object.traverse(function (child) {
            if (child.isMesh) {
                child.material[1].emissive = new THREE.Color(0xff0000);
                child.material[1].emissiveIntensity = 1;
                child.material[1].color = new THREE.Color(0xff0000);;
            }
        });
    });
    */
}

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {

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
}
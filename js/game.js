const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialas : true});

const startButton = document.getElementById("startButton");
startButton.addEventListener('click', function(){
    init();
    hideButton();
})

function hideButton(){
    
}

function init(){
    var ySpeed = 0.1;
    var xSpeed = 0.1;
    
    var colorsDrawing = [
        "#ffbe0b",
        "#fb5607",
        "#ff006e",
        "#8338ec",
        "#3a86ff"
    ]
    
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    // resize canvas on resize window
    window.addEventListener( 'resize', () => {
        let width = window.innerWidth
        let height = window.innerHeight
        renderer.setSize( width, height )
        camera.aspect = width / height
        camera.updateProjectionMatrix()
    })
    
    renderer.setClearColor("#222222")
    
    //Ambient Lights 
    var ambientLight = new THREE.AmbientLight ( 0xffffff, 0.2)
    scene.add( ambientLight )
    
    
    //Point Lights
    var pointLight = new THREE.PointLight( 0xffffff, 1 );
    pointLight.position.set( 25, 50, 25 );
    scene.add( pointLight );
   
    
    //Camera Pos
    camera.position.z = 5;

    //Music 
    // create an AudioListener and add it to the camera
    const listener = new THREE.AudioListener();
    camera.add( listener );

    // create a global audio source
    const sound = new THREE.Audio( listener );

    // load a sound and set it as the Audio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'audio/the-living-tombstone-dog-of-wisdom-remix-blue-feat-joe-gran.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.1 );
	sound.play();
});
}


//Box
const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshStandardMaterial( { color: 0xff0120, flatShading: true, metalness: 0, roughness: 1 });
const cube = new THREE.Mesh(geometry,material);
scene.add(cube);
renderer.render(scene,camera);

animate();


//Box Animation
function animate(){
    requestAnimationFrame(animate);
    cube.rotation.x += 0.04;
    cube.rotation.y += 0.04;

    camera.position.z -= 0.01;
    renderer.render(scene,camera);
}


document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event){

    var keyCode = event.which;

    if(keyCode == 90){
        cube.position.y += ySpeed;
    }
    if (keyCode == 83){
        cube.position.y -= ySpeed;
    }
    if(keyCode == 81){
        cube.position.x -= xSpeed;
    }
    if (keyCode == 68){
        cube.position.x += xSpeed;
    }

    if(keyCode == 32){
        var cubeLenght = getRandomFloatNumberBetween(1.5 - 1);
        var geometryNext = new THREE.BoxGeometry(cubeLenght,cubeLenght,cubeLenght);
        var materialNext = new THREE.MeshStandardMaterial( { color : colorsDrawing[getRandomIntNumberBetween(colorsDrawing.length-1)], flatShading: true, metalness: 0, roughness: 1 })
        cube = new THREE.Mesh(geometryNext,materialNext);
        scene.add(cube);
        cube.position.set(0,0,0);
    }

    function getRandomIntNumberBetween(max){
        return Math.floor(Math.random()*(max-0+1)+0);
    }

    function getRandomFloatNumberBetween(max){
        return Math.random()*(max-0+1)+0;
    }

}

animate();
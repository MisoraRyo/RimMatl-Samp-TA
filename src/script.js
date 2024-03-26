/////////////////////////////////////////////////////////////////////////
///// IMPORT
import './main.css'

import * as THREE from 'three'
import Stats from "three/examples/jsm/libs/stats.module";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import Vertex from "./vertex.glsl";
import Fragment from "./fragment.glsl";

import GUI, { FunctionController } from 'lil-gui';
const gui = new GUI({width:180});
gui.domElement.id = 'gui';
gui.close();

window.onload = function(){

/////////////////////////////////////////////////////////////////////////
///// Three.js
///// 
///// 
///// 
/////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////
///// SCENE CREATION
const scene = new THREE.Scene()
scene.background = new THREE.Color('#000')

/////////////////////////////////////////////////////////////////////////
///// RENDERER CONFIG

let PixelRation = 1;//初期値
PixelRation = Math.min(window.devicePixelRatio, 2.0);

const renderer = new THREE.WebGLRenderer({
  canvas:document.getElementById("MyCanvas"),
  alpha:true,
  antialias: true,
  preserveDrawingBuffer: false,//bloomのautoClearと併用
});
renderer.setPixelRatio(Math.min(PixelRation, 2.0)) //set pixel ratio
renderer.setSize(window.innerWidth, window.innerHeight) // make it full screen

//Webgl_Lose
document.getElementById("MyCanvas").addEventListener('webglcontextlost', function(e) {
    alert( e + " エラーが発生しました。再リロードいたします！");
    window.location.reload();
}, false);


/////////////////////////////////////////////////////////////////////////
// stats

const stats = new Stats();
stats
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);
Object.assign(stats.dom.style, {'position': 'fixed','height': 'max-content',
  'left': '0','right': 'auto',
  'top': 'auto','bottom': '0'
});


/////////////////////////////////////////////////////////////////////////
///// CAMERAS CONFIG
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000)

camera.position.set(3.0, 5.0, 5.0);
scene.add(camera)

/////////////////////////////////////////////////////////////////////////
///// CREATE ORBIT CONTROLS
const controls = new OrbitControls(camera, renderer.domElement)

/////////////////////////////////////////////////////////////////////////
///// CREATE Helper
const size = 20;
const divisions = 20;

const gridHelperA = new THREE.GridHelper( size, divisions, 0x444444, 0x444444 );
gridHelperA.position.set(0.0, 0.0, 0);
scene.add( gridHelperA );

const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

////////////////////////////////////////////////////////////////////////
//// PLANE

//
const geometry = new THREE.TorusKnotGeometry( 10, 3, 100, 16 ); 

// Rim Material
const material = new THREE.ShaderMaterial({
  uniforms : { 
    uPixelRation : {value: Math.min(window.devicePixelRatio, 2.0)},
    uResolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
    viewVector: { value: camera.position },//　initial camera.position
    uColor: { value: new THREE.Color(0x42a9f1)},// GrowColor
  },
  vertexShader:Vertex,
	fragmentShader: Fragment,
  transparent:true,
});

const torusKnot = new THREE.Mesh( geometry, material );
torusKnot.position.set(0,1.4,0);
torusKnot.scale.set(0.1,0.1,0.1);
scene.add( torusKnot );

/////////////////////////////////////////////////////////////////////////
//// RENDER LOOP FUNCTION

const clock = new THREE.Clock();

function renderLoop() {

    stats.begin();//stats計測
    //const delta = clock.getDelta();//animation programs
    //const elapsedTime = clock.getElapsedTime();
    camera.lookAt(0,1.5,0);

    material.uniforms.viewVector.value = camera.position;
    material.uniformsNeedUpdate = true;

    renderer.render(scene, camera) // render the scene using the camera

    requestAnimationFrame(renderLoop) //loop the render function
    stats.end();//stats計測
}

renderLoop() //start rendering


/////////////////////////////////////////////////////////////////////////
///// MAKE EXPERIENCE FULL SCREEN
window.addEventListener('resize', () => {
	
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0)) //set pixel ratio
    renderer.setSize(window.innerWidth, window.innerHeight) // make it full screen  
})

const params = {						  
  myVisibleBoolean1: true,
  myVisibleBoolean2: false,
  //
  valueA: 0.0, //
  valueB: 0.0, //
};
	
gui.add( params, 'myVisibleBoolean1').name('helper').listen()
.listen().onChange( function( value ) { 
  if( value == true ){
    axesHelper.visible = value;
    gridHelperA.visible = value;
  }else{
    axesHelper.visible = value;
    gridHelperA.visible = value;
  }
});


}//End Windows.onload

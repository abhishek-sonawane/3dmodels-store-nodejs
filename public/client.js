import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js'
import {OrbitControls} from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
// import path from '../routes/catalogue'



  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdddddd)
  const camera = new THREE.PerspectiveCamera(40 ,window.innerWidth/window.innerHeight,1,10000);
  const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('#bg')
  });

//   camera.rotation.y = 45/180*Math.PI;
//   camera.position.x = 1200;
//   camera.position.y = 500;
//   camera.position.z = 1000;


  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth/2,window.innerHeight/2)
  camera.position.setZ(10);

  renderer.render(scene,camera)


//   const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
//   const geomtexture = new THREE.MeshBasicMaterial({color: 0xffff00,wireframe:true});
//   const mesh = new THREE.Mesh(geometry,geomtexture);
//   scene.add(mesh);
//   renderer.render(scene,camera)


  // gui.add(mesh.rotation,'x',0,Math.PI).name('Rotate X axis')
  // gui.add(mesh.rotation,'y',0,Math.PI).name('Rotate y axis')
  // gui.add(mesh.rotation,'z',0,Math.PI).name('Rotate z axis')

  // gui.add( camera.position , 'z', -500, 500 ).step(1).onChange( function( value ){ camera.position.z = value; } );
  // gui.add( camera.position , 'y', -500, 500 ).step(1).onChange( function( value ){ camera.position.y = value; } );
  // gui.add( camera.position , 'x', -500, 500 ).step(1).onChange( function( value ){ camera.position.x = value; } );
 


  const controls = new OrbitControls(camera,renderer.domElement)
  function animate(){
      requestAnimationFrame(animate);
      renderer.render(scene,camera)
    //   mesh.rotation.x +=0.01  
      
    }
    animate()

 let filesourcee = './isosphere11.glb';

 const loader = new GLTFLoader;


  loader.load(filesourcee,(glb)=>{
    let car = glb.scene.children[0];
    car.scale.set(1,1,1)
    scene.add(glb.scene);

  })
 




//lighting


let hlight = new THREE.AmbientLight (0x404040,100);
scene.add(hlight);

 let directionalLight = new THREE.DirectionalLight(0xffffff,40);
directionalLight.position.set(0,1,0);
directionalLight.castShadow = true;
scene.add(directionalLight);
let light = new THREE.PointLight(0xc4c4c4,10);
light.position.set(0,300,500);
scene.add(light);
let light2 = new THREE.PointLight(0xc4c4c4,10);
light2.position.set(500,100,0);
scene.add(light2);
let light3 = new THREE.PointLight(0xc4c4c4,10);
light3.position.set(0,100,-500);
scene.add(light3);
let light4 = new THREE.PointLight(0xc4c4c4,10);
light4.position.set(-500,300,500);
scene.add(light4);



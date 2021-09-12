import {
  MAIN
} from '../main.js';
import {
  RENDERER
} from './renderer.js';
import * as THREE from '../libs/ThreeJsLib/build/three.module.js';
import * as DAT from '../libs/gui/dat.gui.module.js';
import {GLTFLoader} from '../libs/ThreeJsLib/examples/jsm/loaders/GLTFLoader.js';
// import { BufferGeometryUtils } from '../libs/ThreeJsLib/examples/jsm/utils/BufferGeometryUtils.js';
/*
* Если листву объединять в одну геометрию, то на каждую вершину нужно передать атрибут позиции центра модели и радиус модели
* так же можно передать цвет листвы
*Для ветра походу нужны рандомные значения на каждую вершину
*/

let shaderMaterial;

function create() {

  const gui = new DAT.GUI();

  RENDERER.scene.background = new THREE.Color(0x626262);

  const plane = new THREE.Mesh(new THREE.PlaneGeometry(5,5,5),new THREE.MeshPhongMaterial());
  plane.rotation.x = - Math.PI/2;
  plane.position.y = -1;
  plane.receiveShadow = true;
  RENDERER.scene.add(plane);


  const sunPosition = {
    value:new THREE.Vector3(3,3,0),
  }
  const light = new THREE.DirectionalLight();
  light.position.copy(sunPosition.value);
  light.castShadow = true;
  RENDERER.scene.add(light);
  const ambientLight = new THREE.AmbientLight(0xffffff,0.5);
  RENDERER.scene.add(ambientLight);



  const loader = new THREE.TextureLoader();
  const texture = loader.load('./text.png');
  const shadowTexture = loader.load('./textShadow.png');

  const material = new THREE.MeshPhongMaterial({color:0xff3636,map:texture,alphaTest:0.5,side:THREE.DoubleSide});


  const modelLoader = new GLTFLoader();


  SCENE.shaderMaterial = new THREE.ShaderMaterial({
      uniforms:{
        uTexture:{value:texture},
        uSunPosition:sunPosition,
        uTime:SCENE.uTime,
      },
      // 10 - 0.5
      //vModelDistance -- 1;
      //9.5 - x
      //vPointDistance -- x
      vertexShader:`
        attribute vec3 aModelPosition;
        attribute float aModelRadius;


        uniform vec3 uSunPosition;
        uniform float uTime;



        varying vec2 vUv;
        varying float vDistance;
        varying float vCenterDistance;

        void main(){
          float centerDistance = distance(aModelPosition,uSunPosition);
          float radiusDistance = distance(aModelPosition,uSunPosition)-aModelRadius;
          float vertexDistance = distance((position+aModelPosition),uSunPosition);
          vCenterDistance = distance((position+aModelPosition),aModelPosition);


          vDistance = radiusDistance/vertexDistance;
          vDistance = pow(vDistance,7.0);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          vUv = uv;
        }
      `,
      fragmentShader:`
      uniform sampler2D uTexture;

      varying vec2 vUv;
      varying float vDistance;
      varying float vCenterDistance;



      void main(){

        vec4 textureColor = texture2D(uTexture,vUv);
        if(textureColor.a < 0.5) discard;

        vec3 color = vec3(1.0,0.2,0.2);
        color = mix(vec3(0),color,vDistance);
        /*
          чтобы внутри небыл слишком темный
        */
        vec3 innerColor = mix(color,vec3(0),0.5);

        color = mix(innerColor,color,vCenterDistance*2.5);

        gl_FragColor = vec4(color,1.0);
      }
      `,
      transparent:true,
      side:THREE.DoubleSide,
    });


    modelLoader.load('./leaves.glb',(model)=>{
      const mesh = model.scene.children[0];
      mesh.position.z = 0.5;
      mesh.castShadow = true;
      mesh.material = material;
      mesh.customDepthMaterial = new THREE.MeshDepthMaterial( {
         depthPacking: THREE.RGBADepthPacking,
         map: texture,
         alphaTest: 0.3,
         side:THREE.DoubleSide,
        } );
      RENDERER.scene.add(mesh);
    });

    modelLoader.load('./leaves.glb',(model)=>{
      const mesh = model.scene.children[0];
      mesh.position.z = -0.5;
      mesh.castShadow = true;
      mesh.material = SCENE.shaderMaterial;





      mesh.customDepthMaterial = new THREE.MeshDepthMaterial( {
         depthPacking: THREE.RGBADepthPacking,
         map: texture,
         alphaTest: 0.3,
         side:THREE.DoubleSide,
        } );
      RENDERER.scene.add(mesh);
    });
};

const SCENE = {
  create,
  uTime:{value:0},
};

export {
  SCENE
};

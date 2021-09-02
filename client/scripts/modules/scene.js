import {
  MAIN
} from '../main.js';
import {
  RENDERER
} from './renderer.js';
import * as THREE from '../libs/ThreeJsLib/build/three.module.js';
import * as DAT from '../libs/gui/dat.gui.module.js';
// import {GLTFLoader} from '../libs/ThreeJsLib/examples/jsm/loaders/GLTFLoader.js';
// import { BufferGeometryUtils } from '../libs/ThreeJsLib/examples/jsm/utils/BufferGeometryUtils.js';


function create() {
  const gui = new DAT.GUI();

  RENDERER.scene.background = new THREE.Color(0xb4d4fa);

  const params = {
    color: 0xffffff,
  };
  let material = new THREE.MeshBasicMaterial({color:params.color});
  gui.addColor(params, 'color').onChange(() => {
    material.color.set(new THREE.Color(params.color));
  });

  RENDERER.scene.add(new THREE.Mesh(new THREE.BoxGeometry(),material));

};

const SCENE = {
  create,
};

export {
  SCENE
};

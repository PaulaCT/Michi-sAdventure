import * as THREE from '../libs/three.module.js'
import { TextureAnimator } from './michis-lib.js'


// Constantes
const FINAL_CAMINO_H = 25;
const carril1 = {x:25, y:3, z:0.6, s:1, i:1};
const carril2 = {x:25, y:1.35, z:0.8, s:1.75, i:2};
const carril3 = {x:25, y:-0.9, z:1, s:2.5, i:3};
 
class Interfaz extends THREE.Object3D {
  constructor() {
    super();
    
    // Cargamos la textura
    var heartTexture = new THREE.TextureLoader().load('./michis-imgs/heartTexture.png');

    // Le asignamos NearestFilter (por defecto asigna LinearFilter, que emborrona el pixelArt)
    heartTexture.magFilter = THREE.NearestFilter;

    // Gestion de la animacion de la textura (textura, casillasHorizontales, casillasVerticales, numTotalFrames, duracionCasilla)
    this.anim = new TextureAnimator(heartTexture, 7, 8, 0);

    // Material con la textura
    var material = new THREE.MeshBasicMaterial( { map: heartTexture, side:THREE.DoubleSide, transparent: true } );

    // Geometria
    var geometria = new THREE.BoxGeometry(1,1,0.2);
    // Malla
    this.vidas = new THREE.Mesh(geometria, material);



    this.vidas.position.set(25, 5, 2);
    this.vidas.scale.set(carril2.s,carril2.s,carril2.s);

    this.add(this.vidas);  
    

    


  }



  




  // ---------- Función update ----------
  // Recibe el tiempo

  update(tiempo) {
    
    

  }



}

export { Interfaz };

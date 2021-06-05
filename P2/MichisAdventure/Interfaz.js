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
    var textoDinero = new THREE.TextureLoader().load('./michis-imgs/letras.png');

    // Le asignamos NearestFilter (por defecto asigna LinearFilter, que emborrona el pixelArt)
    heartTexture.magFilter = THREE.NearestFilter;
    textoDinero.magFilter = THREE.NearestFilter;

    // Gestion de la animacion de la textura (textura, casillasHorizontales, casillasVerticales, numTotalFrames, duracionCasilla)
    this.anim = new TextureAnimator(heartTexture, 1, 8, 0);

    // Material con la textura
    var material = new THREE.MeshBasicMaterial( { map: heartTexture, side:THREE.DoubleSide, transparent: true } );
    var materialTexto = new THREE.MeshBasicMaterial( { map: textoDinero, side:THREE.DoubleSide, transparent: true } );

    // Geometria
    var geometria = new THREE.BoxGeometry(7,1,0.2);
    var geometriaTexto = new THREE.BoxGeometry(7,1,0.2);
    // Malla
    this.vidas = new THREE.Mesh(geometria, material);
    this.texto = new THREE.Mesh(geometriaTexto, materialTexto);


    this.vidas.position.set(30, 5, 2);
    this.vidas.scale.set(2, 2, 2);

    this.texto.position.set(30, 0, 2);
    this.texto.scale.set(2, 2, 2);

    this.add(this.vidas);  
    this.add(this.texto);
    
  }

  // ---------- Función update ----------
  // Recibe el tiempo

  update(vidas, dinero) {
    
    switch(vidas){
      case 7:
        this.anim.animacion(0, 1, 100000);
        break;
      case 6:
        this.anim.animacion(1, 1, 100000);
        break;
      case 5:
        this.anim.animacion(2, 1, 100000);
        break;
      case 4:
        this.anim.animacion(3, 1, 100000);
        break;
      case 3:
        this.anim.animacion(4, 1, 100000);
        break;
      case 2:
        this.anim.animacion(5, 1, 100000);
        break;
      case 1:
        this.anim.animacion(6, 1, 100000);
        break;
      case 0:
        this.anim.animacion(7, 1, 100000);
        break;
    }

  }



}

export { Interfaz };

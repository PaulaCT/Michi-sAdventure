import * as THREE from '../libs/three.module.js'
import { TextureAnimator } from './michis-lib.js'
import { ContadorMonedas } from './ContadorMonedas.js'

 
class Interfaz extends THREE.Object3D {
  constructor() {
    super();
    
    // Cargamos la textura
    var heartTexture = new THREE.TextureLoader().load('./michis-imgs/heartTexture.png');

    // Le asignamos NearestFilter (por defecto asigna LinearFilter, que emborrona el pixelArt)
    heartTexture.magFilter = THREE.NearestFilter;

    // Gestion de la animacion de la textura (textura, casillasHorizontales, casillasVerticales, numTotalFrames, duracionCasilla)
    this.anim = new TextureAnimator(heartTexture, 1, 8, 0);

    // Material con la textura
    var material = new THREE.MeshBasicMaterial( { map: heartTexture, side:THREE.DoubleSide, transparent: true } );

    // Geometria
    var geometria = new THREE.BoxGeometry(11.9, 1.5, 0.2);
    // Malla
    this.vidas = new THREE.Mesh(geometria, material);


    this.vidas.position.set(32, 5, 2);
    this.vidas.scale.set(1.5, 1.5, 1.5);

    this.contador = new ContadorMonedas();
    this.add(this.contador)


    this.add(this.vidas);  
    
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
    this.contador.update(dinero);

  }



}

export { Interfaz };

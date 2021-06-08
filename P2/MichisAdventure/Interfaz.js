import * as THREE from '../libs/three.module.js'
import { TextureAnimator } from './michis-lib.js'
import { ContadorMonedas } from './ContadorMonedas.js'

 
class Interfaz extends THREE.Object3D {
  constructor() {
    super();
    
    // Cargamos la textura
    var heartTexture = new THREE.TextureLoader().load('./michis-imgs/heartTexture.png');
    var texturaHabilidad = new THREE.TextureLoader().load('./michis-imgs/habilidad_interfaz.png');

    // Le asignamos NearestFilter (por defecto asigna LinearFilter, que emborrona el pixelArt)
    heartTexture.magFilter = THREE.NearestFilter;
    texturaHabilidad.magFilter = THREE.NearestFilter;

    // Gestion de la animacion de la textura (textura, casillasHorizontales, casillasVerticales, numTotalFrames, duracionCasilla)
    this.anim = new TextureAnimator(heartTexture, 1, 8, 0);
    this.animHabilidad = new TextureAnimator(texturaHabilidad, 1, 2, 0);

    // Material con la textura
    var material = new THREE.MeshBasicMaterial( { map: heartTexture, side:THREE.DoubleSide, transparent: true } );
    var materialHabilidad = new THREE.MeshBasicMaterial( { map: texturaHabilidad, side:THREE.DoubleSide, transparent: true } );

    // Geometria
    var geometria = new THREE.BoxGeometry(11.9, 1.5, 0.2);
    var geometriaHabilidad = new THREE.BoxGeometry(2, 2, 0.2);

    // Malla
    this.vidas = new THREE.Mesh(geometria, material);
    this.habilidad = new THREE.Mesh(geometriaHabilidad, materialHabilidad);


    this.vidas.position.set(32, 8, 2);
    this.vidas.scale.set(1.5, 1.5, 1.5);

    this.habilidad.position.set(25, 2, 2);
    this.habilidad.scale.set(2, 2, 2);

    this.contador = new ContadorMonedas();
    this.contador.position.set(26, 5, 2);


    this.add(this.contador)
    this.add(this.vidas);
    this.add(this.habilidad);  
    
  }

  // ---------- Función update ----------
  // Recibe el tiempo

  update(tipo, valor) {
    
    if(tipo == 'vidas'){
      switch(valor){
        case 7:
          this.anim.animacion(0, 1, 1);
          break;
        case 6:
          this.anim.animacion(1, 1, 1);
          break;
        case 5:
          this.anim.animacion(2, 1, 1);
          break;
        case 4:
          this.anim.animacion(3, 1, 1);
          break;
        case 3:
          this.anim.animacion(4, 1, 1);
          break;
        case 2:
          this.anim.animacion(5, 1, 1);
          break;
        case 1:
          this.anim.animacion(6, 1, 1);
          break;
        case 0:
          this.anim.animacion(7, 1, 1);
          break;
      }
    }
    else if(tipo == 'dinero')
      this.contador.update(valor);
    else{
      if(valor == 0)
        this.animHabilidad.animacion(1, 1, 1);
      else
        this.animHabilidad.animacion(0, 1, 1);
    }
      

  }



}

export { Interfaz };

import * as THREE from '../libs/three.module.js'
import { Habilidad } from './Habilidad.js'
import { TextureAnimator } from './michis-lib.js'

var clock = new THREE.Clock();

// Constantes
const FINAL_CAMINO_H = 25;
const carril1 = {x:25, y:3, z:0.6, s:1, i:1};
const carril2 = {x:25, y:1.35, z:0.8, s:1.75, i:2};
const carril3 = {x:25, y:-0.9, z:1, s:2.5, i:3};
 
class Gato extends THREE.Object3D {
  constructor() {
    super();
    
    // Cargamos la textura
    var runTexture = new THREE.TextureLoader().load('../gato/gato.png');

    // Le asignamos NearestFilter (por defecto asigna LinearFilter, que emborrona el pixelArt)
    runTexture.magFilter = THREE.NearestFilter;
    //runTexture.minFilter = THREE.NearestFilter;

    // Gestion de la animacion de la textura (textura, casillasHorizontales, casillasVerticales, numTotalFrames, duracionCasilla)
    this.anim = new TextureAnimator(runTexture, 13, 5, 150);

    // Material con la textura
    var material = new THREE.MeshBasicMaterial( { map: runTexture, side:THREE.DoubleSide, transparent: true } );

    // Geometria
    //var geometria = new THREE.PlaneGeometry(1, 1, 1, 1);
    var geometria = new THREE.BoxGeometry(1,1,0.2);
    // Malla
    this.gato = new THREE.Mesh(geometria, material);

    // Para la colisión
    this.gato.geometry.computeBoundingBox();

    this.gato.position.set(0, carril2.y, carril2.z);
    this.gato.scale.set(carril2.s,carril2.s,carril2.s);

    this.add(this.gato);  
    
    // Añadimos la habilidad
    this.hab = new Habilidad();
    this.habilidad = false;
    this.add(this.hab)
    
    // Para las animaciones
    this.label = 'run';
    this.contador = 0;

    this.carril_actual = carril2;
  }


  getBoundingBox(){
    return this.gato.geometry.boundingBox;
  }
  

  // ---------- Función getMatrixWorld ----------
  // Devuelve el matrixWordl

  getMatrixWorld() {
    return this.gato.matrixWorld;
  }
  

  // ---------- Función lanzar_habilidad ----------
  // Inicializa la habilidad

  lanzar_habilidad(carril) {
    var pos_actual = { x: 0, y: this.gato.position.y, z: this.gato.position.z,
      s: this.gato.scale.x };
    this.hab.activate(pos_actual);
    this.habilidad = true;
  }

  
  update () {
    var delta = clock.getDelta();

    switch(this.label){
      case 'run':
        this.anim.animacion(0, 4);
      break;
      case 'die':
        if (this.contador <= 5) {
          this.anim.animacion(1, 5);
          this.contador++;
          if (this.contador == 5) {
            this.label = 'run';
            this.anim.restart();
            this.contador = 0;
          }
        }
      break;
      case 'hurt':
        if (this.contador <= 5) {
          this.anim.animacion(2, 5);
          this.contador++;
          if (this.contador == 5) {
            this.label = 'run';
            this.anim.restart();
            this.contador = 0;
          }
        }
      break;
      case 'jump':
        if (this.contador < 8) {
          this.anim.animacion(3, 8);
          this.gato.position.y += (this.where.y - this.carril_actual.y) / 8;
          this.gato.position.z += (this.where.z - this.carril_actual.z) / 8;
          this.gato.scale.x += (this.where.s - this.carril_actual.s) / 8;
          this.gato.scale.y += (this.where.s - this.carril_actual.s) / 8;
          this.gato.scale.z += (this.where.s - this.carril_actual.s) / 8;
          this.contador++;
          if (this.contador == 8) {
            this.carril_actual = this.where;
            this.label = 'run';
            this.anim.restart();
            this.contador = 0;
          }
        }
      break;
      case 'idle':
        this.anim.animacion(4, 13);
      break;
      
    }   
    
    // Si se ha lanzado la habilidad
    if (this.habilidad) { 
      this.hab.update();
      // Si no ha colisionado con nada
      if (this.hab.get_pos_x() >= FINAL_CAMINO_H) {
        this.habilidad = false;
        this.hab.set_visible(false);
      }
    
    }
  }

  // ---------- Función jump ----------
  // Inicia el movimiento de saltar si es posible

  jump(direccion) {
    if (this.label == 'run') {
      if(direccion == 'up'){
        if (this.carril_actual == carril2){
          this.where = carril1;
          this.label = 'jump';
        }
        else if (this.carril_actual == carril3){
          this.where = carril2;
          this.label = 'jump';
        }
      }
      if(direccion == 'down') {
        if (this.carril_actual == carril1){
          this.where = carril2;
          this.label = 'jump';
        }
        else if (this.carril_actual == carril2){
          this.where = carril3;
          this.label = 'jump';
        }
      }
    }
  }


  // ---------- Función hurt ----------

  hurt() {
    if (this.label == 'jump') {
      this.carril_actual = this.where;
      this.gato.position.set(0, this.where.y, this.where.z);
      this.gato.scale.set(this.where.s, this.where.s, this.where.s);
      this.anim.restart();
      this.contador = 0;
    }
    this.label = 'hurt';
  }


  // ---------- Función die ----------

  die() {
    if (this.label == 'jump') {
      this.carril_actual = this.where;
      this.gato.position.set(0, this.where.y, this.where.z);
      this.gato.scale.set(this.where.s, this.where.s, this.where.s);
      this.anim.restart();
      this.contador = 0;
    }
    this.label = 'die';
  }

  // ---------- Función get_habilidad ----------
  // Devuelve el booleano

  get_habilidad() {
    return this.habilidad;
  }

  // ---------- Función get_hab ----------
  // Devuelve el objeto

  get_hab() {
    return this.hab;
  }
}

export { Gato };

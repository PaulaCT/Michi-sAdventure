import * as THREE from '../libs/three.module.js'
import { Habilidad } from './Habilidad.js'
import { TextureAnimator } from './michis-lib.js'


// Constantes
const FINAL_CAMINO_H = 25;
const carril1 = {x:25, y:3, z:0.6, s:1, i:1};
const carril2 = {x:25, y:1.35, z:0.8, s:1.75, i:2};
const carril3 = {x:25, y:-0.9, z:1, s:2.5, i:3};
 
class Gato extends THREE.Object3D {
  constructor(who) {
    super();
    
    // Identificación del michi
    this.who = who;

    var imagen;
    switch(who) {
      case 0: imagen = './michis-imgs/gato.png'; break;
      case 1: imagen = './michis-imgs/texturaCaracal.png'; break;
      case 2: imagen = './michis-imgs/gato.png'; break;
      default: break;
    }

    // Cargamos la textura
    var runTexture = new THREE.TextureLoader().load(imagen);

    // Le asignamos NearestFilter (por defecto asigna LinearFilter, que emborrona el pixelArt)
    runTexture.magFilter = THREE.NearestFilter;
    //runTexture.minFilter = THREE.NearestFilter;

    // Gestion de la animacion de la textura (textura, casillasHorizontales, casillasVerticales, numTotalFrames, duracionCasilla)
    this.anim = new TextureAnimator(runTexture, 13, 5, 150);

    // Material con la textura
    var material = new THREE.MeshBasicMaterial( { map: runTexture, side:THREE.DoubleSide, transparent: true } );

    // Geometria
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


  // ---------- Función restart ----------
  // Devuelve al gato a sus valores iniciales

  restart() {
    this.gato.position.set(0, carril2.y, carril2.z);
    this.gato.scale.set(carril2.s,carril2.s,carril2.s);
    this.label = 'run';
    this.contador = 0;
    this.carril_actual = carril2;
    this.habilidad = false;
    this.visible = true;
  }


  getBoundingBox(){
    return this.gato.geometry.boundingBox;
  }
  
  
  // ---------- Función getMatrixWorld ----------
  // Devuelve el matrixWorld

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


  // ---------- Función update ----------
  // Recibe el tiempo

  update(tiempo) {
    
    switch(this.label){
      case 'run':
        this.anim.animacion(0, 3, tiempo * 1000);
      break;
      case 'die':
        if (this.contador <= 5) {
          this.contador += this.anim.animacion(1, 4, tiempo * 1000);
          if (this.contador == 5) {
            this.label = 'run';
            this.anim.restart();
            this.contador = 0;
          }
        }
      break;
      case 'hurt':
        if (this.contador <= 5) {
          this.contador += this.anim.animacion(2, 4, tiempo * 1000);
          if (this.contador == 5) {
            this.label = 'run';
            this.anim.restart();
            this.contador = 0;
          }
        }
      break;
      case 'jump':
        if (this.contador < 8) {
          if (this.anim.animacion(3, 7, tiempo * 1000) == 1) {
            this.contador++;
            if (this.contador < 6) {
              this.gato.position.y += (this.where.y - this.carril_actual.y) / 5;
              this.gato.position.z += (this.where.z - this.carril_actual.z) / 5;
              this.gato.scale.x += (this.where.s - this.carril_actual.s) / 5;
              this.gato.scale.y += (this.where.s - this.carril_actual.s) / 5;
              this.gato.scale.z += (this.where.s - this.carril_actual.s) / 5;
            }
          }
          if (this.contador == 8) {
            this.carril_actual = this.where;
            this.label = 'run';
            this.anim.restart();
            this.contador = 0;
          }
        }
      break;
      case 'idle':
      default:
        this.anim.animacion(4, 12, tiempo * 1000);
      break;
      
    }

    // Si se ha lanzado la habilidad
    if (this.habilidad) { 
      this.hab.update(tiempo);
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


  // ---------- Función big_jump ----------
  // Inicia el movimiento de saltar largo si es posible

  big_jump(direccion) {
    if (this.label == 'run') {
      if(direccion == 'up'){
        if (this.carril_actual == carril2){
          this.where = carril1;
          this.label = 'jump';
        }
        else if (this.carril_actual == carril3){
          this.where = carril1;
          this.label = 'jump';
        }
      }
      if(direccion == 'down') {
        if (this.carril_actual == carril1){
          this.where = carril3;
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
  

  // ---------- Función iddle ----------

  iddle() {
    this.label = 'iddle';
  }


  // ---------- Función set_habilidad ----------
  // Desactiva o activa la habilidad

  set_habilidad(valor) {
    this.habilidad = valor;
    this.hab.set_visible(valor);

  }


  // ---------- Función iddle ----------

  iddle() {
    this.label = 'iddle';
  }


  // ---------- Función set_habilidad ----------
  // Desactiva o activa la habilidad

  set_habilidad(valor) {
    this.habilidad = valor;
    this.hab.set_visible(valor);
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

  // ---------- Función get_movimiento ----------
  // Devuelve el label

  get_movimiento() {
    return this.label;
  }
}

export { Gato };

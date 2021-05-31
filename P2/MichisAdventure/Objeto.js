// Dependencias
import * as THREE from '../libs/three.module.js'
import { TextureAnimator } from './michis-lib.js'
var clock = new THREE.Clock();
import { Gato } from './Gato.js'
import { Habilidad } from './Habilidad.js'

// Constantes
const VELOCIDAD = 0.02;
const VELOCIDAD_3AM = 0.002;

class Objeto extends THREE.Object3D {
  // ---------- Constructor ----------
  // Recibe la imagen que tendrá, el carril en el que aparecerá y las filas y columnas
  // de la animación (frames)
  
  constructor(imagen, carril, filas, columnas) {
    super();
    
    // Clase de la que heredarán las clases obstáculo, moneda y power-up.
    // Recibe su imagen para generar el material y el carril en el que se encuentra.

    // Creamos su mesh (geometría + material)
    var objetoGeom = new THREE.BoxGeometry(1,0.2);
    var texture = new THREE.TextureLoader().load(imagen);

    texture.magFilter = THREE.NearestFilter;
    this.annie = new TextureAnimator(texture, columnas, filas, filas*columnas, 150);

    // Con TextureAnimator podemos crear una animación tradicional
    /*if (imagen == './michis-imgs/coin_extended.png')
      this.annie = new TextureAnimator(texture,1,6,6,170);
    else this.annie = new TextureAnimator(texture,1,1,1,1000);*/

    var objetoMat = new THREE.MeshPhongMaterial ({map: texture, side:THREE.DoubleSide, transparent: true,});

    this.objeto = new THREE.Mesh (objetoGeom, objetoMat);

    // Y lo añadimos como hijo del Object3D (el this)
    this.add (this.objeto);

    // Situamos al objeto en su posición
    this.objeto.rotation.x = Math.PI/2;
    this.objeto.position.x = carril.x;
    this.objeto.position.y = carril.y;
    this.objeto.position.z = carril.z;
    this.objeto.scale.set(carril.s,carril.s,carril.s);

    // Almacenamos su posición en x
    this.pos_x = carril.x;
    this.inicio = carril;

    // Para la colisión
    this.objeto.geometry.computeBoundingBox();
  }


  // ---------- Función activate ----------
  // Inicializa el tiempo 

  activate() {
    // Hacemos esto para que el objeto empiece a desplazarse en el momento
    // en el que se lanza y no en el que ha sido creado
    this.last_time = Date.now();
  }


  // ---------- Función update ----------
  // Recibe un booleano que indica si son las 3am
  // Controla el movimiento el desplazamiento por el carril
  
  update (am, delta) { 
    // Calculamos el tiempo y desplazamos al objeto tanto como sea necesario
    //var time = Date.now();
    //var segundos = -(this.last_time - time) / 1000;
    if (am) this.pos_x = this.pos_x - (delta * VELOCIDAD_3AM);
    else this.pos_x = this.pos_x - (delta * VELOCIDAD);
    this.objeto.position.set(this.pos_x, this.inicio.y, this.inicio.z);
    //this.last_time = time;

  }


  // ---------- Función colision ----------
  // Devuelve true si el objeto ha colisionado con el gato

  colision(michi){
    this.objeto.updateMatrixWorld();
    michi.updateMatrixWorld();
    
    var obj_bound = new THREE.Box3();
    var cat_bound = new THREE.Box3();

    obj_bound.copy(this.objeto.geometry.boundingBox).applyMatrix4(this.objeto.matrixWorld );
    cat_bound.copy(michi.getBoundingBox()).applyMatrix4(michi.getMatrixWorld());

    return obj_bound.intersectsBox(cat_bound);
  }


  // ---------- Función get_annie ----------
  // Devuelve el objeto TextureAnimator

  get_annie(){
    return this.annie;
  }


  // ---------- Función get_pos_x ----------
  // Devuelve la posición en x

  get_pos_x(){
    return this.objeto.position.x;
  }


  // ---------- Función get_pos_y ----------
  // Devuelve la posición en y

  get_pos_y(){
    return this.position.y;
  }


  // ---------- Función set_position ----------
  // Recibe una posición del tipo posición = {x,y,z} y se coloca en ella
  
  set_position(posicion){
    this.objeto.position.set(posicion.x, posicion.y, posicion.z);
    this.pos_x = posicion.x;
  }
}

export { Objeto };
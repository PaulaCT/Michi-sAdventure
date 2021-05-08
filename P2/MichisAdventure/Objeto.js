// Dependencias
import * as THREE from '../libs/three.module.js'
import { TextureAnimator } from './TextureAnimator.js'

// Constantes
const VELOCIDAD = 4;
const VELOCIDAD_3AM = 9;

class Objeto extends THREE.Object3D {
  // ---------- Constructor ----------
  // Recibe la imagen que tendrá y el carril en el que aparecerá
  
  constructor(imagen, carril) {
    super();
    
    // Clase de la que heredarán las clases obstáculo, moneda y power-up.
    // Recibe su imagen para generar el material y el carril en el que se encuentra.

    // Creamos su mesh (geometría + material)
    var objetoGeom = new THREE.BoxGeometry(1,0.2);
    var texture = new THREE.TextureLoader().load(imagen);

    // Con TextureAnimator podemos crear una animación tradicional
    /*if (imagen == './michis-imgs/coin_extended.png')
      this.annie = new TextureAnimator(texture,1,6,6,170);
    else this.annie = new TextureAnimator(texture,1,1,1,1000);*/

    var objetoMat = new THREE.MeshPhongMaterial ({map: texture,transparent: true,});
    
    this.objeto = new THREE.Mesh (objetoGeom, objetoMat);

    // Y lo añadimos como hijo del Object3D (el this)
    this.add (this.objeto);

    // Situamos al objeto en su posición
    this.rotation.x = Math.PI/2;
    this.position.x = carril.x;
    this.position.y = carril.y;
    this.position.z = carril.z;
    this.scale.set(carril.s,carril.s,carril.s);

    // Almacenamos su posición en x
    this.pos_x = 0;
    this.inicio = carril;
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
  // Forma de llamar al update desde la clase que lo "hereda":
  // this.position.x = this.????.update(am);
  // Controla el movimiento de girar ??? y el desplazamiento por el carril
  
  update (am) { 
    // Calculamos el tiempo y desplazamos al objeto tanto como sea necesario
    var time = Date.now();
    var segundos = -(this.last_time - time) / 1000;
    if (am) this.pos_x = this.pos_x - segundos * VELOCIDAD_3AM;
    else this.pos_x = this.pos_x - segundos * VELOCIDAD;
    this.last_time = time;

    // Devolvemos la posición para que la clase heredera lo actualice
    return this.pos_x;
  }


  // ---------- Función get_pos_x ----------
  // Devuelve la posición en x

  get_pos_x(){
    return this.pos_x;
  }


  // ---------- Función get_annie ----------
  // Devuelve el texture animator

  get_annie() {
    return this.annie;
  }


  // ---------- Función set_position ----------
  // Recibe una posición del tipo posición = {x,y,z} y se coloca en ella
  
  set_position(posicion){
    this.position.set(posicion.x, posicion.y, posicion.z);
    this.pos_x = this.inicio.x - posicion.x;
  }
}

export { Objeto };
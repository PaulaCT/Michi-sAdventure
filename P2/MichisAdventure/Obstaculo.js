// Dependencias
import * as THREE from '../libs/three.module.js'
import { Objeto } from './Objeto.js'

class Obstaculo extends THREE.Object3D {
  // ---------- Constructor ----------
  // Recibe el carril en el que aparecerá (sus coordenadas)

  constructor(carril) {
    super();

    // "Hereda" de Object.js
    this.obstaculo = new Objeto('./michis-imgs/cerberus.png', carril);

    // Y lo añadimos como hijo del Object3D (el this)
    this.add(this.obstaculo); 

    // Almacenamos su posición en y (para que bote) y algunos parámetros de control
    this.pos_y = 0;
    this.arriba = false;
    this.invisible = false;
  }


  // ---------- Función activate ----------
  // Llama al método activate de Objeto.js

  activate(){
    this.obstaculo.activate();
  }


  // ---------- Función update ----------
  // Recibe:
  //    un booleano que indique si el obstáculo se ha de desplazar
  //    un booleano que indique si son las 3am
  // Controla el movimiento de explotar en caso de colisión

  update(mover, am){    
    if (!this.invisible){
        if (mover) {
            // Aquí implementaríamos cosas para que explotara al colisionar
            // ...

            // Llamamos al update de Objeto.js
            this.position.x = this.obstaculo.update(am);  
        } 
    } 
  }


  // ---------- Función get_pos_x ----------
  // Llama a la función get_pos_x de Objeto.js

  get_pos_x(){
    return this.obstaculo.get_pos_x();
  }


  // ---------- Función set_posicion ----------
  // Recibe una posición del tipo posición = {x,y,z}
  // Llama a la función set_posicion de Objeto.js

  set_position(posicion){
    this.obstaculo.set_position(posicion);
  }


  // ---------- Función set_visible ----------
  // Recibe un booleano que indica la visibilidad a establecer
  // Si éste es false, se detiene el movimiento del objeto y se invisibiliza
  // Si éste es true, se vuelve a iniciar el movimiento del objeto y deja de ser invisible
  
  set_visible(visible){
    this.invisible = !visible;
    this.visible = visible;
  }
}

export { Obstaculo };
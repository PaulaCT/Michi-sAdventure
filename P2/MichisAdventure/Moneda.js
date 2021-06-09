// Dependencias
import * as THREE from '../libs/three.module.js'
import { Objeto } from './Objeto.js'

var clock = new THREE.Clock();

class Moneda extends THREE.Object3D {
  // ---------- Constructor ----------
  // Recibe el carril en el que aparecerá (sus coordenadas)

  constructor(carril) {
    super();

    // "Hereda" de Object.js
    this.moneda = new Objeto('./michis-imgs/coin_extended.png', carril, 1, 6);

    // Y lo añadimos como hijo del Object3D (el this)
    this.add(this.moneda); 

    // Almacenamos su posición en y (para que bote) y algunos parámetros de control
    this.pos_y = 0;
    this.arriba = false;
    this.invisible = false;

    // Controlaremos la animación desde aquí
    this.annie = this.moneda.get_annie();
  }


  // ---------- Función activate ----------
  // Llama al método activate de Objeto.js

  activate(){
    this.moneda.activate();
  }


  // ---------- Función update ----------
  // Recibe:
  //    un booleano que indique si la moneda se ha de desplazar
  // Controla el movimiento de botar y llama al método update de Objeto.js

  update(mover, delta){    
    if (!this.invisible){
        if (mover) {

            // Movimiento: girar
            this.annie.animacion(0, 6, delta * 1000);
          
            // Movimiento: botar
            if (this.arriba){
                if (this.pos_y > -0.1){
                    this.pos_y = this.pos_y - 0.25 * delta;
                } else this.arriba = false;
            } else {
                if (this.pos_y < 0.15){
                    this.pos_y = this.pos_y + 0.25 * delta;
                } else this.arriba = true;
            }
            this.position.y = this.pos_y;
            

            // Llamamos al update de Objeto.js
            this.moneda.update(delta);  
        } 
    } 
  }


  // ---------- Función colision ----------
  // Devuelve true si la moneda ha colisionado con el gato

  colision(gato){
    return this.moneda.colision(gato);
  }


  // ---------- Función get_pos_x ----------
  // Llama a la función get_pos_x de Objeto.js

  get_pos_x(){
    return this.moneda.get_pos_x();
  }


  // ---------- Función get_visible ----------
  // Devuelve la visibilidad de la moneda

  get_visible(){
    return this.visible;
  }
  

  // ---------- Función set_position ----------
  // Recibe una posición del tipo posición = {x,y,z}
  // Llama a la función set_posicion de Objeto.js

  set_position(posicion){
    this.moneda.set_position(posicion);
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

export { Moneda };
// Dependencias
import * as THREE from '../libs/three.module.js'
import { Objeto } from './Objeto.js'

class Obstaculo extends THREE.Object3D {
  // ---------- Constructor ----------
  // Recibe el carril en el que aparecerá (sus coordenadas)

  constructor(carril) {
    super();

    // "Hereda" de Object.js
    this.obstaculo = new Objeto('./michis-imgs/texturaRoca.png', carril, 2, 8);

    // Y lo añadimos como hijo del Object3D (el this)
    this.add(this.obstaculo); 

    // Almacenamos algunos parámetros de control
    this.invisible = false;
    this.explosion = false;
    this.contador = 0;

    // Controlaremos la animación desde aquí
    this.annie = this.obstaculo.get_annie();
  }


  // ---------- Función activate ----------
  // Llama al método activate de Objeto.js

  activate(){
    this.obstaculo.activate();
    this.annie.animacion(0, 0, 150);
    this.annie.restart();
  }


  // ---------- Función update ----------
  // Recibe:
  //    un booleano que indique si el obstáculo se ha de desplazar
  //    un booleano que indique si son las 3am
  // Controla el movimiento de explotar en caso de colisión

  update(mover, am, delta){    
    if (!this.invisible){
        if (mover) {
            // Aquí implementaríamos cosas para que explotara al colisionar
             if (this.explosion) { 
              if (this.contador <= 8) {
                this.contador += this.annie.animacion(1, 7, delta * 1000);
                if (this.contador == 8) {
                  this.explosion = false;
                  this.contador = 0;
                  this.set_visible(false);
                }
              }
            }
            // else

            // Llamamos al update de Objeto.js
            this.obstaculo.update(am, delta);
            
            // if (this.contador_explosion == 6) this.explotar = false; this.contador_explosion = 0;
        } 
    } 
  }


  // ---------- Función colision ----------
  // Devuelve true si el obstáculo ha colisionado con el gato
  // Si ha colisionado llama al gato para que realice la animación y 
  // la realiza el obstáculo también
  // Recibe además del gato, las vidas restantes

  colision(gato, vidas){
    // Si se ha lanzado la habilidad y nos puede afectar
    if (gato.get_habilidad()) {
      var habilidad = gato.get_hab();
      if (habilidad.get_pos_y() == this.obstaculo.get_pos_y() && 
        habilidad.get_pos_x() <= this.obstaculo.get_pos_x()){
        // Si colisiona con la habilidad
        if (this.obstaculo.colision(gato.get_hab())) { 
          gato.set_habilidad(false);
          this.explosion = true;
        }
      }
    }
    
    if (!this.explosion && gato.get_movimiento() != 'jump' && this.obstaculo.colision(gato)) {
      // Si solo le quedaba una vida, muere
      if (vidas == 1) gato.die();
      else {
        gato.hurt();
        //this.explosion = true;
      }
      return true;
     }
    
    
    return false;
  }


  // ---------- Función get_pos_x ----------
  // Llama a la función get_pos_x de Objeto.js

  get_pos_x(){
    return this.obstaculo.get_pos_x();
  }


  // ---------- Función get_visible ----------
  // Devuelve la visibilidad del obstáculo

  get_visible(){
    return this.visible;
  }


  // ---------- Función set_position ----------
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
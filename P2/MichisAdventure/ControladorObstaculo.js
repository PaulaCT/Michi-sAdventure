// Dependencias
import * as THREE from '../libs/three.module.js'
import { Obstaculo } from './Obstaculo.js'

// Constantes
const POS_GATO = 0;
const FINAL_CAMINO = -50;

class ControladorObstaculo extends THREE.Object3D {
  // ---------- Constructor ----------
  // Recibe las coordenadas de todos los carriles y un entero que indique 
  // qué patrón seguir 
  // ...
  // Haz esto bien en algún momento

  constructor(carril1, carril2) {
    super();

    this.pos_ini = carril1;

    // Crearemos 4 monedas, aparecerán en el carril i
    this.obstaculo1 = new Obstaculo(carril2);
    this.obstaculo2 = new Obstaculo(carril2);
    this.obstaculo3 = new Obstaculo(carril1);
    this.obstaculo4 = new Obstaculo(carril1);

    this.add(this.obstaculo1);
    this.add(this.obstaculo2);
    this.add(this.obstaculo3);
    this.add(this.obstaculo4);

    //Datos para el update
    this.primera = false;
    this.segunda = false;
    this.tercera = false;
    this.cuarta = false;

    this.i_carril = carril1.i;

    this.inicio_movimiento = Date.now();
  }


  // ---------- Función update ----------
  // Recibe un booleano que indique si son las 3 am y el carril en el que está el gato

  update(am, carril_gato){  

    // Iremos lanzando obstáculos cada segundo
    var time = Date.now();
    var segundos = -(this.inicio_movimiento - time) / 1000;

    // Las vamos activando
    if (!this.primera && segundos > 2){
      this.obstaculo1.activate();
      this.primera = true;
      this.inicio_movimiento = time;
    } else if (!this.segunda && segundos > 2){
      this.obstaculo2.activate();
      this.segunda = true;
      this.inicio_movimiento = time;
    } else if (!this.tercera && segundos > 2){
      this.obstaculo3.activate();
      this.tercera = true;
      this.inicio_movimiento = time;
    } else if (!this.cuarta && segundos > 2){
      this.obstaculo4.activate();
      this.cuarta = true;
      this.inicio_movimiento = time;
    }

    // Aquí deberíamos añadir algún tipo de método para cuando una 
    // moneda sea recogida
    /*if (carril_gato == this.i_carril){
      // Si la moneda colisiona con el gato
      // Obviamiente no funciona, así no van las colisiones
      if (this.moneda1.get_pos_x() == POS_GATO) this.moneda1.set_visible(false);
      } else if (this.moneda1.get_pos_x() > POS_GATO){
        if (this.moneda2.get_pos_x() == POS_GATO){
          this.moneda2.set_visible(false);
        } else if (this.moneda2.get_pos_x() > POS_GATO){
          if (this.moneda3.get_pos_x() == POS_GATO){
            this.moneda3.set_visible(false);
          } else if (this.moneda3.get_pos_x() > POS_GATO){
            if (this.moneda4.get_pos_x() == POS_GATO) this.moneda4.set_visible(false);
          }
      }
    }*/

    // Ahora llamamos a sus respectivos métodos update
    this.obstaculo1.update(this.primera, am);
    this.obstaculo2.update(this.segunda, am);
    this.obstaculo3.update(this.tercera, am);
    this.obstaculo4.update(this.cuarta, am);

    // Detenemos a las monedas que han llegado al final del camino
    if (this.obstaculo1.get_pos_x() <= FINAL_CAMINO) this.obstaculo1.set_visible(false);
    if (this.obstaculo2.get_pos_x() <= FINAL_CAMINO) this.obstaculo2.set_visible(false);
    if (this.obstaculo3.get_pos_x() <= FINAL_CAMINO) this.obstaculo3.set_visible(false);
    if (this.obstaculo4.get_pos_x() <= FINAL_CAMINO) this.obstaculo4.set_visible(false);
  }


  // ---------- Función preprar ----------
  // Vuelve a poner a las monedas en su posición inicial y las vuelve visibles

  preparar(){
    this.obstaculo1.set_posicion(this.pos_ini);
    this.obstaculo1.set_visible(true);
    this.obstaculo2.set_posicion(this.pos_ini);
    this.obstaculo2.set_visible(true);
    this.obstaculo3.set_posicion(this.pos_ini);
    this.obstaculo3.set_visible(true);
    this.obstaculo4.set_posicion(this.pos_ini);
    this.obstaculo4.set_visible(true);
  }
}

export { ControladorObstaculo };
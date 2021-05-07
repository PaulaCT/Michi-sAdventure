// Dependencias
import * as THREE from '../libs/three.module.js'
import { Moneda } from './Moneda.js'

// Constantes
const POS_GATO = 0;
const FINAL_CAMINO = -50;

class ControladorMoneda extends THREE.Object3D {
  // ---------- Constructor ----------
  // Recibe las coordenadas del carril en el que aparecerán las monedas

  constructor(carril) {
    super();

    this.pos_ini = carril;

    // Crearemos 4 monedas, aparecerán en el carril i
    this.moneda1 = new Moneda(carril);
    this.moneda2 = new Moneda(carril);
    this.moneda3 = new Moneda(carril);
    this.moneda4 = new Moneda(carril);

    this.add(this.moneda1);
    this.add(this.moneda2);
    this.add(this.moneda3);
    this.add(this.moneda4);

    //Datos para el update
    this.primera = false;
    this.segunda = false;
    this.tercera = false;
    this.cuarta = false;

    this.i_carril = carril.i;

    this.inicio_movimiento = Date.now();

    // PREGUNTA: ¿Dónde irían el contador de monedas y las vidas?
  }


  // ---------- Función update ----------
  // Recibe un booleano que indique si son las 3 am y el carril en el que está el gato

  update(am, carril_gato){  

    // Iremos lanzando monedas cada segundo
    var time = Date.now();
    var segundos = -(this.inicio_movimiento - time) / 1000;

    // Las vamos activando
    if (!this.primera){
      this.moneda1.activate();
      this.primera = true;
      this.inicio_movimiento = time;
    } else if (!this.segunda && segundos > 1){
      this.moneda2.activate();
      this.segunda = true;
      this.inicio_movimiento = time;
    } else if (!this.tercera && segundos > 1){
      this.moneda3.activate();
      this.tercera = true;
      this.inicio_movimiento = time;
    } else if (!this.cuarta && segundos > 1){
      this.moneda4.activate();
      this.cuarta = true;
      this.inicio_movimiento = time;
    }

    // Aquí deberíamos añadir algún tipo de método para cuando una 
    // moneda sea recogida
    // ...
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
    this.moneda1.update(this.primera, am);
    this.moneda2.update(this.segunda, am);
    this.moneda3.update(this.tercera, am);
    this.moneda4.update(this.cuarta, am);

    // Detenemos a las monedas que han llegado al final del camino
    if (this.moneda1.get_pos_x() <= FINAL_CAMINO) this.moneda1.set_visible(false);
    if (this.moneda2.get_pos_x() <= FINAL_CAMINO) this.moneda2.set_visible(false);
    if (this.moneda3.get_pos_x() <= FINAL_CAMINO) this.moneda3.set_visible(false);
    if (this.moneda4.get_pos_x() <= FINAL_CAMINO) this.moneda4.set_visible(false);
  }


  // ---------- Función preprar ----------
  // Vuelve a poner a las monedas en su posición inicial y las vuelve visibles

  preparar(){
    this.moneda1.set_posicion(this.pos_ini);
    this.moneda1.set_visible(true);
    this.moneda2.set_posicion(this.pos_ini);
    this.moneda2.set_visible(true);
    this.moneda3.set_posicion(this.pos_ini);
    this.moneda3.set_visible(true);
    this.moneda4.set_posicion(this.pos_ini);
    this.moneda4.set_visible(true);
  }
}

export { ControladorMoneda };
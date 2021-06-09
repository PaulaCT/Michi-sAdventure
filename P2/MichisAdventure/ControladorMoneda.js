// Dependencias
import * as THREE from '../libs/three.module.js'
import { Moneda } from './Moneda.js'

// Constantes
const POS_GATO = 0;
const FINAL_CAMINO = -25;

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
    this.recogidas = 0;
  }


  // ---------- Función update ----------
  // Recibe el gato

  update(gato, delta){  

    // Iremos lanzando monedas cada segundo
    var time = Date.now();
    var segundos = -(this.inicio_movimiento - time) / 1000;
    var frecuencia = 1;

    // Las vamos activando
    if (!this.primera){
      this.moneda1.activate();
      this.primera = true;
      this.inicio_movimiento = time;
    } else if (!this.segunda && segundos > 1/frecuencia){
      this.moneda2.activate();
      this.segunda = true;
      this.inicio_movimiento = time;
    } else if (!this.tercera && segundos > 1/frecuencia){
      this.moneda3.activate();
      this.tercera = true;
      this.inicio_movimiento = time;
    } else if (!this.cuarta && segundos > 1/frecuencia){
      this.moneda4.activate();
      this.cuarta = true;
      this.inicio_movimiento = time;
    }

    // Aquí deberíamos añadir algún tipo de método para cuando una 
    // moneda sea recogida
    // Se comprueba la primera moneda que aún no haya llegado al gato
    // Si se ha producido colisión, ocultamos la moneda y la contamos
    if (this.moneda1.get_visible() && this.moneda1.get_pos_x() >=  POS_GATO) {
      if (this.moneda1.colision(gato)) {
        this.moneda1.set_visible(false);
        this.recogidas++;
      }
    } else if (this.moneda2.get_visible() && this.moneda2.get_pos_x() >= POS_GATO) {
      if (this.moneda2.colision(gato)) {
        this.moneda2.set_visible(false);
        this.recogidas++;
      }
    } else if (this.moneda3.get_visible() && this.moneda3.get_pos_x() >= POS_GATO) {
      if (this.moneda3.colision(gato)) {
        this.moneda3.set_visible(false);
        this.recogidas++;
      }
    } else if (this.moneda4.get_visible() && this.moneda4.get_pos_x() >= POS_GATO) {
      if (this.moneda4.colision(gato)) {
        this.moneda4.set_visible(false);
        this.recogidas++;
      }      
    }

    // Ahora llamamos a sus respectivos métodos update
    this.moneda1.update(this.primera, delta);
    this.moneda2.update(this.segunda, delta);
    this.moneda3.update(this.tercera, delta);
    this.moneda4.update(this.cuarta, delta);

    // Detenemos a las monedas que han llegado al final del camino
    if (this.moneda1.get_pos_x() <= FINAL_CAMINO) this.moneda1.set_visible(false);
    if (this.moneda2.get_pos_x() <= FINAL_CAMINO) this.moneda2.set_visible(false);
    if (this.moneda3.get_pos_x() <= FINAL_CAMINO) this.moneda3.set_visible(false);
    if (this.moneda4.get_pos_x() <= FINAL_CAMINO) this.moneda4.set_visible(false);
  }


  // ---------- Función fin_trayectoria ----------
  // Devuelve true si todas las monedas están invisibles

  fin_trayectoria(){
    return !this.moneda1.get_visible() && !this.moneda2.get_visible() 
      && !this.moneda3.get_visible() && !this.moneda4.get_visible();
  }


  // ---------- Función preprar ----------
  // Vuelve a poner a las monedas en su posición inicial y las vuelve visibles

  preparar(){
    this.moneda1.set_position(this.pos_ini);
    this.moneda1.set_visible(true);
    this.moneda2.set_position(this.pos_ini);
    this.moneda2.set_visible(true);
    this.moneda3.set_position(this.pos_ini);
    this.moneda3.set_visible(true);
    this.moneda4.set_position(this.pos_ini);
    this.moneda4.set_visible(true);
    

    // Volvemos a poner a false los booleanos del inicio del movimiento
    this.primera = false;
    this.segunda = false;
    this.tercera = false;
    this.cuarta = false;
  }

  
  // ---------- Función get_recogidas ----------
  // Devuelve el total de monedas recogidas

  get_recogidas(){
    var aux = this.recogidas;

    // Reiniciamos el contador de monedas
    this.recogidas = 0;
    return aux;
  }
}

export { ControladorMoneda };
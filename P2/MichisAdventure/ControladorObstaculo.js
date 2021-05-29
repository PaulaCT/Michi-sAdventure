// Dependencias
import * as THREE from '../libs/three.module.js'
import { Obstaculo } from './Obstaculo.js'

// Constantes
const POS_GATO = 0;
const FINAL_CAMINO = -25;

class ControladorObstaculo extends THREE.Object3D {
  // ---------- Constructor ----------
  // Recibe las coordenadas de todos los carriles y un entero que indique 
  // qué patrón seguir 
  // ...
  // Haz esto bien en algún momento

  constructor(i,carril1, carril2) {
    super();

    this.patron = i;
    this.generar(carril1, carril2);

    //Datos para el update
    this.primera = false;
    this.segunda = false;
    this.tercera = false;
    this.cuarta = false;

    // Param para el movimiento
    this.inicio_movimiento = Date.now();

    // Número de colisiones (se restarán a la vida del gato)
    this.colisiones = 0;
  }


  // ---------- Función generar ----------
  // Genera x obstáculos en los carriles indicados (patrones)

  generar(carril1, carril2){
    if (this.patron % 2 == 0) {
      this.obstaculo1 = new Obstaculo(carril1);
      this.obstaculo2 = new Obstaculo(carril2);
      this.obstaculo3 = new Obstaculo(carril2);
      this.obstaculo4 = new Obstaculo(carril1);

      this.add(this.obstaculo1);
      this.add(this.obstaculo2);
      this.add(this.obstaculo3);
      this.add(this.obstaculo4);

      this.pos_ini = [];
      this.pos_ini.push(carril1);
      this.pos_ini.push(carril2);
      this.pos_ini.push(carril2);
      this.pos_ini.push(carril1);

    } else {
      this.obstaculo1 = new Obstaculo(carril2);
      this.obstaculo2 = new Obstaculo(carril2);
      // Aquí se esperará un momento
      this.obstaculo3 = new Obstaculo(carril1);

      this.add(this.obstaculo1);
      this.add(this.obstaculo2);
      // Pausa
      this.add(this.obstaculo3);

      this.pos_ini = [];
      this.pos_ini.push(carril2);
      this.pos_ini.push(carril2);
      this.pos_ini.push(carril1);

    }
  }


  // ---------- Función update ----------
  // Recibe un booleano que indique si son las 3 am y el gato
  // También recibe las vidas restantes

  update(am, gato, vidas){  

    // Iremos lanzando obstáculos cada segundo
    var time = Date.now();
    var segundos = -(this.inicio_movimiento - time) / 1000;
    var frecuencia = 1;
    if (am) frecuencia = 2.25;

    // Las vamos activando
    if (!this.primera && segundos > 1/frecuencia){

      this.obstaculo1.activate();
      this.primera = true;
      this.inicio_movimiento = time;

    } else if (!this.segunda && segundos > 1/frecuencia){

      this.obstaculo2.activate();
      this.segunda = true;
      this.inicio_movimiento = time;

    } else if (!this.tercera && segundos > 1/frecuencia){

      // Si el patrón es par, lanzamos 4 obstáculos
      if (this.patron % 2 == 0) this.obstaculo3.activate();

      // Si es impar, no se lanzará nada aquí

      this.tercera = true;
      this.inicio_movimiento = time;

    } else if (!this.cuarta && segundos > 1/frecuencia){

      // Si el patrón es par lanzamos el cuarto obstáculo
      if (this.patron % 2 == 0) this.obstaculo4.activate();

      // Si el patrón es impar, lanzamos el tercero
      else this.obstaculo3.activate();

      this.cuarta = true;
      this.inicio_movimiento = time;
    }

    // Aquí se gestiona la colisión
    // Se comprueba el primer obstáculo que aún no haya llegado al gato
    // Si se ha producido colisión, ocultamos el obstáculo y lo contamos
    if (this.obstaculo1.get_visible() && this.obstaculo1.get_pos_x() >=  POS_GATO) {
      if (this.obstaculo1.colision(gato, vidas)) {
        this.obstaculo1.set_visible(false);
        this.colisiones++;
      }
    } else if (this.obstaculo2.get_visible() && this.obstaculo2.get_pos_x() >= POS_GATO) {
      if (this.obstaculo2.colision(gato, vidas)) {
        this.obstaculo2.set_visible(false);
        this.colisiones++;
      }
    } else if (this.obstaculo3.get_visible() && this.obstaculo3.get_pos_x() >= POS_GATO) {
      if (this.obstaculo3.colision(gato, vidas)) {
        this.obstaculo3.set_visible(false);
        this.colisiones++;
      }
    } else if (this.patron % 2 == 0 && this.obstaculo4.get_visible() && this.obstaculo4.get_pos_x() >= POS_GATO) {
      if (this.obstaculo4.colision(gato, vidas)) {
        this.obstaculo4.set_visible(false);
        this.colisiones++;
      }
    }

    // Ahora llamamos a sus respectivos métodos update
    this.obstaculo1.update(this.primera, am);
    this.obstaculo2.update(this.segunda, am);
    if (this.patron % 2 == 0) {
      this.obstaculo3.update(this.tercera, am);
      this.obstaculo4.update(this.cuarta, am);

    // Utilizamos el booleano del cuarto objeto para el tercero
    } else this.obstaculo3.update(this.cuarta, am);

    // Detenemos a los obstaculos que han llegado al final del camino
    if (this.obstaculo1.get_pos_x() <= FINAL_CAMINO) this.obstaculo1.set_visible(false);
    if (this.obstaculo2.get_pos_x() <= FINAL_CAMINO) this.obstaculo2.set_visible(false);
    if (this.obstaculo3.get_pos_x() <= FINAL_CAMINO) this.obstaculo3.set_visible(false);
    if (this.patron % 2 == 0 && this.obstaculo4.get_pos_x() <= FINAL_CAMINO) this.obstaculo4.set_visible(false);
  }


  // ---------- Función fin_trayectoria ----------
  // Devuelve true si todos los obstáculos están invisibles

  fin_trayectoria(){
    var fin = !this.obstaculo1.get_visible() && !this.obstaculo2.get_visible() && !this.obstaculo3.get_visible();
    if (this.patron % 2 == 0) fin = fin && !this.obstaculo4.get_visible();
    return fin;
  }


  // ---------- Función preprar ----------
  // Vuelve a poner los obstaculos en su posición inicial y las vuelve visibles

  preparar(){
    this.obstaculo1.set_position(this.pos_ini[0]);
    this.obstaculo1.set_visible(true);
    this.obstaculo2.set_position(this.pos_ini[1]);
    this.obstaculo2.set_visible(true);
    this.obstaculo3.set_position(this.pos_ini[2]);
    this.obstaculo3.set_visible(true);
    if (this.patron % 2 == 0) {
      this.obstaculo4.set_position(this.pos_ini[3]);
      this.obstaculo4.set_visible(true);
    }

    // Volvemos a poner a false los booleanos del inicio del movimiento
    this.primera = false;
    this.segunda = false;
    this.tercera = false;
    this.cuarta = false;
  }

  
  // ---------- Función get_colisiones ----------
  // Devuelve el total de colisiones

  get_colisiones(){
    var aux = this.colisiones;

    // Reiniciamos las colisiones
    this.colisiones = 0;
    return aux;
  }
}

export { ControladorObstaculo };
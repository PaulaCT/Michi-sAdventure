// Dependencias
import * as THREE from '../libs/three.module.js'
import { ControladorMoneda } from './ControladorMoneda.js'
import { ControladorObstaculo } from './ControladorObstaculo.js'

// Constantes
const POS_GATO = 0;
const FINAL_CAMINO = -50;
const SUERTE = 4;
const SUERTE_CHINO = 7;

class ControladorObj extends THREE.Object3D {
  // ---------- Constructor ----------
  // Recibe las coordenadas de los tres carriles

  constructor(carril1, carril2, carril3) {
    super();

    // No podrán aparecer monedas y obstáculos en el mismo carril, estas son las
    // combinaciones posibles entre ambos
    this.combinaciones = [];
    this.combinaciones.push(new THREE.Vector2(1,0));
    this.combinaciones.push(new THREE.Vector2(2,2));
    this.combinaciones.push(new THREE.Vector2(3,4));
    this.combinaciones.push(new THREE.Vector2(1,1));
    this.combinaciones.push(new THREE.Vector2(2,3));
    this.combinaciones.push(new THREE.Vector2(3,5));

    // Creamos los controladores de monedas (se reutilizan).
    // Como solo hay tres opciones y es posible que se repitan, tendremos 2 controladores
    // por carril o patrón - suplentes

    this.moneda1 = new ControladorMoneda(carril1);
    this.moneda11 = new ControladorMoneda(carril1);
    this.moneda2 = new ControladorMoneda(carril2);
    this.moneda21 = new ControladorMoneda(carril2);
    this.moneda3 = new ControladorMoneda(carril3);
    this.moneda31 = new ControladorMoneda(carril3);

    this.add(this.moneda1);
    this.add(this.moneda11);
    this.add(this.moneda2);
    this.add(this.moneda21);
    this.add(this.moneda3);
    this.add(this.moneda31);

    this.monedas = [this.moneda1, this.moneda11, this.moneda2, this.moneda21, this.moneda3, this.moneda31];

    // Y los controladores de obstáculos

    this.obstaculo1 = new ControladorObstaculo(1, carril2, carril3);
    this.obstaculo2 = new ControladorObstaculo(2, carril2, carril3);
    this.obstaculo3 = new ControladorObstaculo(3, carril1, carril3);
    this.obstaculo4 = new ControladorObstaculo(4, carril1, carril3);
    this.obstaculo5 = new ControladorObstaculo(5, carril1, carril2);
    this.obstaculo6 = new ControladorObstaculo(6, carril1, carril2);

    this.add(this.obstaculo1);
    this.add(this.obstaculo2);
    this.add(this.obstaculo3);
    this.add(this.obstaculo4);
    this.add(this.obstaculo5);
    this.add(this.obstaculo6);

    this.obstaculos = [this.obstaculo1, this.obstaculo2, this.obstaculo3, this.obstaculo4, this.obstaculo5, this.obstaculo6];

    // Creamos dos vectores de booleanos que indicarán si el controlador se ha lanzado o
    // si está preparado
    this.moneda_lista = [true, true, true, true, true, true];
    this.obstaculo_listo = [true, true, true, true, true, true];

    for (var i=0; i<6; i++) {
      this.monedas[i].preparar();
      this.obstaculos[i].preparar();
    }

    // Cada 4 segundos elegimos aleatoriamente qué objetos aparecerán 
    this.inicio_movimiento = Date.now();

    // PREGUNTA: ¿Dónde irían el contador de monedas y las vidas?
    // Aquí, no?
    // Crear un método que devuelva las colisiones y se resten a la vida en controladorObstaculo
    // Crear un método que devuelva las monedas recogidas y se sumen en controladorMoneda
    // Crear un método para exportar estos datos a la interfaz gráfica
    this.vidas = 7;
    this.dinero = 0;
  }


  // ---------- Función aleatoria ----------
  // Elige si lanzaremos monedas (cuáles) y obstáculos (cuáles)

  aleatoria(suerte) {
    var lanzar_moneda = false;
    var lanzar_obstaculo = false;

    // Primero vemos si lanzar monedas
    if (this.get_random(0,suerte) != 0) lanzar_moneda = true;

    // Y ahora vemos si lanzar obstáculos (menos posibilidad, podría variar con nivel)
    if (this.get_random(0,4) != 0) lanzar_obstaculo = true;

    if (lanzar_moneda) {
      // Elegimos el carril para las monedas
      var moneda_selec = this.get_random(0,3);

      // Si el controlador asignado a ese carril ya ha sido lanzado
      if (!this.moneda_lista[2*moneda_selec]) {

        // Usamos al suplente (si está listo)
        this.moneda_lista[2*moneda_selec + 1] = false;
    
      } else {
        // Si no lanzamos al primero
        this.moneda_lista[2*moneda_selec] = false;
      }
      
      // Si además lanzamos obstáculos, tenemos que elegir un patrón de las combinaciones posibles
      if (lanzar_obstaculo) {

        // ¡¡¡¡¡¡ DOS OPCIONES:
        // 1. Se elige aleatoriamente una de las dos opciones y en caso de que se repita mala suerte <-
        // 2. Se miran las combinaciones y si la primera ya se ha lanzado, se lanza la segunda
        // !!!!!!

        // Elegimos una de las opciones
        var obstaculo_selec = this.get_random(0,2);
        var obstaculo_selec = this.combinaciones[moneda_selec + 3*obstaculo_selec].y;

        // No tenemos suplente
        this.obstaculo_listo[obstaculo_selec] = false;
      }

    } else if (lanzar_obstaculo) {
      // Si no hay moneda, podemos lanzar cualquier objeto
      var obstaculo_selec = this.get_random(0,6);

      // Probamos 2 veces por si se repite
      if (!this.obstaculo_listo[obstaculo_selec]) obstaculo_selec = this.get_random(0,6);

      // Y si otra vez se repite pues mala suerte 
      this.obstaculo_listo[obstaculo_selec] = false;
    }
  }


  // ---------- Función actualizar_lista ----------
  // Actualiza los vectores de controladores listos

  actualizar_lista() {
    for (var i=0; i<6; i++) {
      // Si se había lanzado
      if (!this.moneda_lista[i]) {
        // Si ha terminado
        if (this.monedas[i].fin_trayectoria()) {
          this.moneda_lista[i] = true;
          this.monedas[i].preparar();
        }
      }
      // Lo mismo
      if (!this.obstaculo_listo[i]) {
        if (this.obstaculos[i].fin_trayectoria()) {
          this.obstaculo_listo[i] = true;
          this.obstaculos[i].preparar();
        }
      } 
    }
  }


  // ---------- Función update ----------
  // Recibe un booleano que indique si son las 3 am y al gato

  update(am, gato, delta, interfaz){  

    if (this.vidas == 0) {
      window.alert("Game over");
      this.vidas = 7;
      return true;
    }

    // Cada 4 segundos (o menos si am) actualizamos la lista, seleccionamos los siguientes elementos
    // y los lanzamos
    var time = Date.now();
    var segundos = -(this.inicio_movimiento - time) / 1000;
    var frecuencia = 1;
    if (am) frecuencia = 2.25;

    if (segundos > 4 / frecuencia){
      this.actualizar_lista();
      console.log("Dinero: " + this.dinero);
      console.log("Vidas: " + this.vidas);
      if (gato.who == 2) this.aleatoria(SUERTE_CHINO);
      else this.aleatoria(SUERTE);
      this.inicio_movimiento = time;
    }

    //Actualizamos interfaz
    interfaz.update(this.vidas, this.dinero);

    // Llamamos al update de todos los controladores que hayan sido lanzados 
    // y hacemos recuento de las colisiones
    for (var i=0; i<6; i++){
      if (!this.moneda_lista[i]) {
        this.dinero = this.dinero + this.monedas[i].get_recogidas();
        this.monedas[i].update(am,gato, delta);
      } 
      if (!this.obstaculo_listo[i]) {
        this.vidas = this.vidas - this.obstaculos[i].get_colisiones();
        this.obstaculos[i].update(am, gato, this.vidas, delta);
      } 
    }
    return false;
  }


  // ---------- Función get_random ----------
  // Recibe unos límites y devuelve un aleatorio entre ambos (mínimo incluido, máximo excluído)

  get_random(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
  }

}

export { ControladorObj };
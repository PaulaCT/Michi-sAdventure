
// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import * as TWEEN from '../libs/tween.esm.js'

// Clases de mi proyecto

import { ControladorObj } from './ControladorObj.js'
import { Fondo } from './Fondo.js'
import { Gato } from './Gato.js'

/// La clase fachada del modelo
/**
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
 */

 const carril1 = {x:25, y:3, z:0.6, s:1, i:1};
 const carril2 = {x:25, y:1.35, z:0.8, s:1.75, i:2};
 const carril3 = {x:25, y:-0.9, z:1, s:2.5, i:3};

 // Para el movimiento del michi. Si se asignaban con las constantes se pasaba por referencia y las constantes cambiaban solas junto con las variables
  var c1 = {x:25, y:3, z:0.6, s:1, i:1};
  var c2 = {x:25, y:1.35, z:0.8, s:1.75, i:2};
  var c3 = {x:25, y:-0.9, z:1, s:2.5, i:3};

 const SEG_HORA = 5;

 const INTENSIDAD_AMBIENTE = 0.2;
 const INTENSIDAD_MEDIA = 0.5;
 const TRANSICION = 5;//40;


 var clock = new THREE.Clock();

class MyScene extends THREE.Scene {
  constructor (myCanvas) {
    super();
    
    // Lo primero, crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
    this.renderer = this.createRenderer(myCanvas);
    
    // Se añade a la gui los controles para manipular los elementos de esta clase
    this.gui = this.createGUI ();
    
    // Construimos los distinos elementos que tendremos en la escena
    
    // Todo elemento que se desee sea tenido en cuenta en el renderizado de la escena debe pertenecer a esta. Bien como hijo de la escena (this en esta clase) o como hijo de un elemento que ya esté en la escena.
    // Tras crear cada elemento se añadirá a la escena con   this.add(variable)
    this.createLights ();
    
    // Tendremos una cámara con un control de movimiento con el ratón
    this.createCamera ();
    
    // Creamos el suelo y el fondo
    this.fondo = new Fondo();
    this.add(this.fondo);

    // Añadimos un controlador de objetos
    this.control = new ControladorObj(carril1, carril2, carril3);
    this.add(this.control);

    // Aquí irá el michi cuando se cree supongo

    this.gato = new Gato();
    this.add(this.gato);
    /*this.gato.position.set(0, c2.y, c2.z);
    this.gato.scale.set(c2.s,c2.s,c2.s);
    this.add(this.gato);

    // Animaciones Tween de movimiento del michi
    this.mov12 = new TWEEN.Tween(c1).to(c2, 500);
    this.mov21 = new TWEEN.Tween(c2).to(c1, 500);
    this.mov23 = new TWEEN.Tween(c2).to(c3, 500);
    this.mov32 = new TWEEN.Tween(c3).to(c2, 500);
    var that = this;
    this.mov12.onUpdate(function(){
      that.gato.position.set(0, c1.y, c1.z);
      that.gato.scale.set(c1.s, c1.s, c1.s);
    });
    this.mov12.onComplete(function(){
      c1 = {x:25, y:3, z:0.6, s:1, i:1};
    });
    this.mov21.onUpdate(function(){
      that.gato.position.set(0, c2.y, c2.z);
      that.gato.scale.set(c2.s, c2.s, c2.s);
    });
    this.mov21.onComplete(function(){
      c2 = {x:25, y:1.35, z:0.8, s:1.75, i:2};

    });
    this.mov23.onUpdate(function(){
      that.gato.position.set(0, c2.y, c2.z);
      that.gato.scale.set(c2.s, c2.s, c2.s);
    });
    this.mov23.onComplete(function(){
      c2 = {x:25, y:1.35, z:0.8, s:1.75, i:2};
    });
    this.mov32.onUpdate(function(){
      that.gato.position.set(0, c3.y, c3.z);
      that.gato.scale.set(c3.s, c3.s, c3.s);
    });
    this.mov32.onComplete(function(){
      c3 = {x:25, y:-0.9, z:1, s:2.5, i:3};
    });*/

    // this.michi = new Michi();
    // this.axis.add (this.michi);

    this.last_time = Date.now();
    this.am = false;
    
  }
  
  createCamera () {
    // Para crear una cámara le indicamos
    //   El ángulo del campo de visión en grados sexagesimales
    //   La razón de aspecto ancho/alto
    //   Los planos de recorte cercano y lejano
    //this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera = new THREE.OrthographicCamera( window.innerWidth / - 30, window.innerWidth / 30, window.innerHeight / 30, window.innerHeight / - 30, 1, 1000 );
    // También se indica dónde se coloca
    this.camera.position.set (0, 0, 10);
    // Y hacia dónde mira
    var look = new THREE.Vector3 (0,0,0);
    this.camera.lookAt(look);
    this.add (this.camera);
    
    // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
    this.cameraControl = new TrackballControls (this.camera, this.renderer.domElement);
    // Se configuran las velocidades de los movimientos
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;
    // Debe orbitar con respecto al punto de mira de la cámara
    this.cameraControl.target = look;
  }
  
  createGUI () {
    // Se crea la interfaz gráfica de usuario
    var gui = new GUI();
    
    // La escena le va a añadir sus propios controles. 
    // Se definen mediante una   new function()
    // En este caso la intensidad de la luz y si se muestran o no los ejes
    this.guiControls = new function() {
      // En el contexto de una función   this   alude a la función
      this.lightIntensity = 0.5;
      this.axisOnOff = true;
      this.animate = false;
      this.pause = false;
    }

    // Se crea una sección para los controles de esta clase
    var folder = gui.addFolder ('Controles');

    // PAUSA
    folder.add (this.guiControls, 'pause').name("Pausar ");
    
    // Se le añade un control para la intensidad de la luz
    folder.add (this.guiControls, 'lightIntensity', 0, 1, 0.1).name('Intensidad de la Luz : ');
    

    return gui;
  }
  
  createLights () {

    // Añadimos una luz ambiental (noche)
    var ambiente = 0xF6EDEB;
    var luz_ambiental = new THREE.AmbientLight(ambiente, INTENSIDAD_AMBIENTE);
    this.add(luz_ambiental);

    // Definimos los colores del cielo

    var amanecer = 0xF7541F; // Naranja (rojizo)
    var maniana = 0xFDC177; // Naranjita claro
    var dia = 0xFEFEFE; // Blanco
    var atardecer = 0xF83862; // Rosa
    var anochecer = 0xC048FD; // Violeta

    // Añadimos cinco luces focales

    this.luz_1 = new THREE.SpotLight(amanecer, INTENSIDAD_MEDIA);
    this.luz_2 = new THREE.SpotLight(maniana, 0);
    this.luz_3 = new THREE.SpotLight(dia, 0);
    this.luz_4 = new THREE.SpotLight(atardecer, 0);
    this.luz_5 = new THREE.SpotLight(anochecer, 0);

    // Las colocamos en sus posiciones

    this.luz_1.position.set(60, 60, 40);
    this.luz_2.position.set(60, 60, 40);
    this.luz_3.position.set(60, 60, 40);
    this.luz_4.position.set(60, 60, 40);
    this.luz_5.position.set(60, 60, 40);

    // Apuntamos al centro de la escena

    this.objetivo = new THREE.Object3D();
    this.objetivo.position.set(0, 30, 0);
    this.luz_1.target = this.luz_2.target = this.luz_3.target = this.luz_4.target =
    this.luz_5.target = this.objetivo;

    // Y las añadimos al padre

    this.add(this.luz_1);
    this.add(this.luz_2);
    this.add(this.luz_3);
    this.add(this.luz_4);
    this.add(this.luz_5);
    this.add(this.objetivo);

    // Y un controlador
    this.count_luces = 0;
  }
  
  createRenderer (myCanvas) {
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.
    
    // Se instancia un Renderer   WebGL
    var renderer = new THREE.WebGLRenderer();
    
    // Se establece un color de fondo en las imágenes que genera el render
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    
    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // La visualización se muestra en el lienzo recibido
    $(myCanvas).append(renderer.domElement);
    
    return renderer;  
  }
  
  getCamera () {
    // En principio se devuelve la única cámara que tenemos
    // Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
    return this.camera;
  }
  
  setCameraAspect (ratio) {
    // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de ventanas de
    // su sistema operativo hay que actualizar el ratio de aspecto de la cámara
    this.camera.aspect = ratio;
    // Y si se cambia ese dato hay que actualizar la matriz de proyección de la cámara
    this.camera.updateProjectionMatrix();
  }
  
  onWindowResize () {
    // Este método es llamado cada vez que el usuario modifica el tamapo de la ventana de la aplicación
    // Hay que actualizar el ratio de aspecto de la cámara
    this.setCameraAspect (window.innerWidth / window.innerHeight);
    
    // Y también el tamaño del renderizador
    this.renderer.setSize (window.innerWidth, window.innerHeight);
  }

  onKeyDown (event) {
    var keyCode = event.which;
    switch(keyCode) {
        // Up
        case 38: this.gato.jump('up'); break;
        // Down
        case 40: this.gato.jump('down'); break;
        //Space
        case 32: this.gato.lanzar_habilidad(); break;
        default: break;
    }
  }

  // Si añadimos al caracal habría que contar esto
  /*onKeyUp (event) {
    switch(x) {
        // Up
        case 87: ; break;
        // Down
        case 83: ; break;
    }
  }*/

  /*moverGato(opcion){
    if(opcion == 'up'){
      if (this.gato.position.y == carril2.y){
        this.mov21.start();
        console.log("2 a 1");
      }
      else if (this.gato.position.y == carril3.y){
        this.mov32.start();
        console.log("3 a 2");
      }
    }
    if(opcion == 'down') {
      if (this.gato.position.y == carril1.y){
        this.mov12.start();
        console.log("1 a 2");
      }
      else if (this.gato.position.y == carril2.y){
        this.mov23.start();
        console.log("2 a 3");
      }
    }
  }*/

  update () {
    
    // Se actualiza la posición de la cámara según su controlador
    this.cameraControl.update();
    
    // Se actualiza el resto del modelo, le pasamos el tiempo
    var time = Date.now();
    var segundos = -(this.last_time - time) / 1000;
    if (segundos >= SEG_HORA * 10) {
        console.log("3 am");
        this.am = true;
        this.last_time = time;
    } else if (this.am && segundos >= SEG_HORA * 2) {
        this.am = false;
        this.last_time = time;
    }


    //TWEEN.update();

    // El primer booleano le indica si se debe mover
    if (!this.guiControls.pause){

      // El fondo variará en función de la hora (no lo necesita de momento)
      this.fondo.update()

      var delta = clock.getDelta(); 

      // El primer parámetro indica si son las 3 am. Se pasa al gato como segundo parámetro
      this.control.update(this.am, this.gato, 1000 * delta);

      this.gato.update();

      // Luces
      // Amanece
      if (this.count_luces < TRANSICION) {
          // Se apaga la luz_1, comienza la luz 2
          this.luz_1.intensity -= 0.05; 
          this.luz_2.intensity += 0.05;
      } else if (this.count_luces < 2 * TRANSICION) {
          // Luz 2 completamente encendida
          this.luz_2.intensity += 0.05;
      } else if (this.count_luces < 3 * TRANSICION) {
          this.luz_2.intensity -= 0.05;

      // Ya es por la mañana
      } else if (this.count_luces < 4 * TRANSICION) {
          // Se apaga la luz_2, comienza la luz 3
          this.luz_2.intensity -= 0.05; 
          this.luz_3.intensity += 0.05;
      } else if (this.count_luces < 5 * TRANSICION) {
          // Luz 2 completamente encendida
          this.luz_3.intensity += 0.05;
      } else if (this.count_luces < 6 * TRANSICION) {
          this.luz_3.intensity -= 0.05;

      // Es de día
      } else if (this.count_luces < 7 * TRANSICION) {
          // Se apaga la luz 3, comienza la luz 4
          this.luz_3.intensity -= 0.05; 
          this.luz_4.intensity += 0.05;
      } else if (this.count_luces < 8 * TRANSICION) {
          // Luz 4 completamente encendida
          this.luz_4.intensity += 0.05;
      } else if (this.count_luces < 9 * TRANSICION) {
          this.luz_4.intensity -= 0.05;

      // Atardece
      } else if (this.count_luces < 10 * TRANSICION) {
          // Se apaga la luz 4, comienza la luz 5
          this.luz_4.intensity -= 0.05; 
          this.luz_5.intensity += 0.05;
      } else if (this.count_luces < 11 * TRANSICION) {
          // Luz 5 completamente encendida
          this.luz_5.intensity += 0.05;
      } else if (this.count_luces < 12 * TRANSICION) {
          this.luz_5.intensity -= 0.05;

      // Cae la noche
      } else if (this.count_luces < 14 * TRANSICION) {
          // Se apaga completamente la luz 5
          this.luz_5.intensity -= 0.025; 
      }else if (this.count_luces == 24 * TRANSICION) {
        this.luz_1.intensity = this.luz_2.intensity = this.luz_3.intensity 
            = this.luz_4.intensity = this.luz_5.intensity = 0;
        this.count_luces = 0;
      }
      this.count_luces++;

      //this.mundo.update();
      //this.suelo.update();
      //this.michi.update();
    }
    
    
    // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
    this.renderer.render (this, this.getCamera());

    // Este método debe ser llamado cada vez que queramos visualizar la escena de nuevo.
    // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
    // Si no existiera esta línea,  update()  se ejecutaría solo la primera vez.
    requestAnimationFrame(() => this.update())
  }
}





/// La función   main
$(function () {
  
  // Se instancia la escena pasándole el  div  que se ha creado en el html para visualizar
  var scene = new MyScene("#WebGL-output");

  // Se añaden los listener de la aplicación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
  window.addEventListener ("resize", () => scene.onWindowResize());
  window.addEventListener("keydown", (event) => scene.onKeyDown(event), true);
  //window.addEventListener("keyup" (event) => scene.onKeyUp(event), true);
  
  // Que no se nos olvide, la primera visualización.
  scene.update();
});


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
 const carril3 = {x:25, y:-1.1, z:1, s:2.5, i:3};


 const SEG_HORA = 5;

 const INTENSIDAD_AMBIENTE = 0.2;
 const INTENSIDAD_MEDIA = 0.8;
 const TRANSICION = 20000;//40;


 // Para el cambio de iluminación
  var l0 = {a: INTENSIDAD_MEDIA, b: 0, c: 0, d: 0, e: 0};
  var l1 = {a: 0, b: INTENSIDAD_MEDIA, c: 0, d: 0, e: 0};
  var l2 = {a: 0, b: 0, c: INTENSIDAD_MEDIA, d: 0, e: 0};
  var l3 = {a: 0, b: 0, c: 0, d: INTENSIDAD_MEDIA, e: 0};
  var l4 = {a: 0, b: 0, c: 0, d: 0, e: INTENSIDAD_MEDIA};
  var l5 = {a: 0, b: 0, c: 0, d: 0, e: 0};

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
        // Y sus animaciones
    var that = this;
    var amanece = new TWEEN.Tween(l5).to(l0, TRANSICION).onUpdate(function() {
      that.luz_1.intensity = l0.a;
    }).onComplete(function(){
      l0 = {a: INTENSIDAD_MEDIA, b: 0, c: 0, d: 0, e: 0};
    });
    var manianita = new TWEEN.Tween(l0).to(l1, TRANSICION).onUpdate(function() {
      that.luz_1.intensity = l1.a;
      that.luz_2.intensity = l1.b;
    }).onComplete(function(){
      l1 = {a: 0, b: INTENSIDAD_MEDIA, c: 0, d: 0, e: 0};
    });
    var pleno_dia = new TWEEN.Tween(l1).to(l2, TRANSICION).onUpdate(function() {
      that.luz_2.intensity = l2.b;
      that.luz_3.intensity = l2.c;
    }).onComplete(function(){
      l2 = {a: 0, b: 0, c: INTENSIDAD_MEDIA, d: 0, e: 0};
    });
    var atardece = new TWEEN.Tween(l2).to(l3, TRANSICION).onUpdate(function() {
      that.luz_3.intensity = l3.c;
      that.luz_4.intensity = l3.d;
    }).onComplete(function(){
      l3 = {a: 0, b: 0, c: 0, d: INTENSIDAD_MEDIA, e: 0};
    });
    var anochece = new TWEEN.Tween(l3).to(l4, TRANSICION).onUpdate(function() {
      that.luz_4.intensity = l4.d;
      that.luz_5.intensity = l4.e;
    }).onComplete(function(){
      l4 = {a: 0, b: 0, c: 0, d: 0, e: INTENSIDAD_MEDIA};
    });
    var noche = new TWEEN.Tween(l4).to(l5, TRANSICION * 5).onUpdate(function() {
      that.luz_5.intensity = l5.e;
    }).onComplete(function(){
      l5 = {a: 0, b: 0, c: 0, d: 0, e: 0};
    });
    
    manianita.start().chain(pleno_dia);
    pleno_dia.chain(atardece);
    atardece.chain(anochece);
    anochece.chain(noche);
    noche.chain(amanece);
    amanece.chain(manianita);

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

    // El primer booleano le indica si se debe mover
    if (!this.guiControls.pause){

      // El fondo variará en función de la hora (no lo necesita de momento)
      this.fondo.update()
      // El primer parámetro indica si son las 3 am. Se pasa al gato como segundo parámetro
      this.control.update(this.am, this.gato);

      this.gato.update();

      // Luces
      TWEEN.update();
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

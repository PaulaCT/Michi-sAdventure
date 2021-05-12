
// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'

// Clases de mi proyecto

import { ControladorObj } from './ControladorObj.js'
import { Fondo } from './Fondo.js'

/// La clase fachada del modelo
/**
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
 */

 const carril1 = {x:25, y:3, z:0.6, s:1, i:1};
 const carril2 = {x:25, y:1.35, z:0.8, s:1.75, i:2};
 const carril3 = {x:25, y:-0.9, z:1, s:2.5, i:3};
 //const video = document.getElementById('video');

 const SEG_HORA = 3;

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
    
    // Sustituiremos esto por el suelo y el fondo
    this.createGround();

    //this.suelo = new Suelo();
    // Background
    //this.mundo = new Mundo();
    
    // 
    this.axis = new THREE.AxesHelper (5);
    this.axis.position.set(-5,0,0);
    this.add (this.axis);

    //this.moneda = new Moneda(carril3);
    //this.axis.add(this.moneda);
    this.control = new ControladorObj(carril1, carril2, carril3);
    this.add(this.control);

    // Aquí irá el michi cuando se cree supongo
    var gato_geom = new THREE.BoxGeometry(1,1);
    var gato_mat = new THREE.MeshPhongMaterial({color: 0x7BA6EF});
    this.gato = new THREE.Mesh (gato_geom, gato_mat);
    this.gato.position.set(0, carril1.y, carril1.z);
    this.gato.scale.set(carril1.s,carril1.s,carril1.s);
    this.gato.geometry.computeBoundingBox();
    this.add(this.gato);

    this.fondo = new Fondo();
    this.add(this.fondo);

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
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // También se indica dónde se coloca
    this.camera.position.set (0, 0, 80);
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
  
  createGround () {
    this.fondo = new Fondo();
    this.add(this.fondo);

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
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como   var   y va a ser una variable local a este método
    //    se hace así puesto que no va a ser accedida desde otros métodos
    var ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
    // La añadimos a la escena
    this.add (ambientLight);
    
    // Se crea una luz focal que va a ser la luz principal de la escena
    // La luz focal, además tiene una posición, y un punto de mira
    // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
    // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
    this.spotLight = new THREE.SpotLight( 0xffffff, this.guiControls.lightIntensity );
    this.spotLight.position.set( 60, 60, 40 );
    this.add (this.spotLight);
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
        case 38: this.gato_mov(0); break;
        // Down
        case 40: this.gato_mov(1); break;
        //Space
        case 32: console.log("Habilidad"); break;
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

  gato_mov(opcion) {
    if (opcion == 0) {
        // Añadir atributo carril al gato
        if (this.gato.position.y == carril2.y) {
            this.gato.position.set(0, carril1.y, carril1.z);
            this.gato.scale.set(carril1.s, carril1.s, carril1.s);
        } else if (this.gato.position.y == carril3.y) {
            this.gato.position.set(0, carril2.y, carril2.z);
            this.gato.scale.set(carril2.s, carril2.s, carril2.s);
        }
    } else {
        if (this.gato.position.y == carril1.y) {
            this.gato.position.set(0, carril2.y, carril2.z);
            this.gato.scale.set(carril2.s, carril2.s, carril2.s);
        } else if (this.gato.position.y == carril2.y) {
            this.gato.position.set(0, carril3.y, carril3.z);
            this.gato.scale.set(carril3.s, carril3.s, carril3.s);
        }
    }
  }

  update () {
    // Se actualizan los elementos de la escena para cada frame
    // Se actualiza la intensidad de la luz con lo que haya indicado el usuario en la gui
    this.spotLight.intensity = this.guiControls.lightIntensity;
    
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

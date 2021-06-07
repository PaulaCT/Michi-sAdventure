
// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import * as TWEEN from '../libs/tween.esm.js'

// Clases de mi proyecto

import { MenuPrincipal } from './MenuPrincipal.js'
import { ControladorObj } from './ControladorObj.js'
import { Fondo } from './Fondo.js'
import { Gato } from './Gato.js'
import { Interfaz } from './Interfaz.js'
import { ControladorObstaculo } from './ControladorObstaculo.js'

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


 var clock = new THREE.Clock();


class MyScene extends THREE.Scene {
  constructor (myCanvas) {
    super();
    
    // Lo primero, crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
    this.renderer = this.createRenderer(myCanvas);
    
    // Se añade a la gui los controles para manipular los elementos de esta clase
    this.gui = this.createGUI ();
    
    // Construimos los distinos elementos que tendremos en la escena
    // Tendremos una cámara con un control de movimiento con el ratón
    this.createCamera ();

    // 1. Eje del menú principal
    this.axis = new THREE.AxesHelper(5);
    this.axis.position.set(500,-15, 0);
    this.add(this.axis);

    // 2. Luces del menú principal
    this.luz_menu = new THREE.SpotLight(0xF9CEF3, 1);
    this.luz_menu.angle = Math.PI;
    this.luz_menu.position.set(600, 60, 100);
    this.objetivo_menu = new THREE.Object3D();
    this.objetivo_menu.position.set(500, 30, 0);
    this.luz_menu.target = this.objetivo_menu;
    this.add(this.luz_menu);


    // 3. Menú principal
    this.menu = new MenuPrincipal();
    this.axis.add(this.menu);

    // Ahora construimos el resto del juego

    // 1. Luces y sus animaciones

    this.createLights ();

    // 2. Añadimos el mundo (suelo, fondo)

    this.fondo = new Fondo();
    this.add(this.fondo);

    // 3. Añadimos un controlador de objetos

    this.control = new ControladorObj(carril1, carril2, carril3);
    this.add(this.control);

    // 4. Añadimos a los michis

    // Añadir texturas !!!!!!
    this.gato = new Gato(0);
    this.caracal = new Gato(1);
    this.chino = new Gato(2);

    this.add(this.gato);
    this.add(this.caracal);
    this.add(this.chino);

    this.michis = [this.gato, this.caracal, this.chino];

    // El gato seleccionado en el menú principal será el que juegue
    this.jugando = 0;

    // Para la habilidad del Michi añadimos un tiempo de enfriamiento
    // El tiempo será falso para que empiece con la habilidad cargada
    this.enfriamiento = 1000;

    // El caracal puede saltar mucho, tendremos un tiempo para gestionarlo
    this.inicio_salto = 0;
    this.keypressed = false;

    // 5. Algunos controles extras

    // Interfaz
    this.interfaz = new Interfaz();
    this.interfaz.position.z = 2;
    this.add(this.interfaz);

    // Para la habilidad del Michi añadimos un tiempo de enfriamiento
    // El tiempo será falso para que empiece con la habilidad cargada
    this.enfriamiento = 1000;
    this.habilidad = true;

    this.last_time = Date.now();
    this.am = false;

    // Por último, añadimos el audio
    const listener = new THREE.AudioListener();
    this.camera.add( listener );

    const musiquita = new THREE.Audio( listener );

    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( './michis-imgs/begin_your_journey.mp3', function( buffer ) {
      musiquita.setBuffer( buffer );
      musiquita.setLoop( true );
      musiquita.setVolume( 0.5 );
      musiquita.play();
    });
    
    // si ves esto eliminalo que era para depurar
    this.inicio_movimiento = Date.now();

  }
  
  createCamera () {
    // Para crear una cámara le indicamos
    //   El ángulo del campo de visión en grados sexagesimales
    //   La razón de aspecto ancho/alto
    //   Los planos de recorte cercano y lejano
    //this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera = new THREE.OrthographicCamera( window.innerWidth / - 30, window.innerWidth / 30, window.innerHeight / 30, window.innerHeight / - 30, 1, 1000 );

    // También se indica dónde se coloca
    //this.camera.position.set (0, 0, 10);
    this.camera.position.set (500, 0, 10);
    // Y hacia dónde mira
    var look = new THREE.Vector3 (500,0,0);
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
      /*this.lightIntensity = 0.5;
      this.axisOnOff = true;
      this.animate = false;*/
      this.pause = true;
    }

    // Se crea una sección para los controles de esta clase
    var folder = gui.addFolder ('Controles');

    // PAUSA
    folder.add (this.guiControls, 'pause').name("Pausar ");

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

    // Las animamos
    this.animateLights();

  }

  animateLights () {
    var that = this;
    var amanece = new TWEEN.Tween(l5).to(l0, TRANSICION).onUpdate(function() {
      that.luz_1.intensity = l5.a;
    }).onComplete(function(){
      console.log("amanece completada");
    });
    var manianita = new TWEEN.Tween(l0).to(l1, TRANSICION).onUpdate(function() {
      that.luz_1.intensity = l0.a;
      that.luz_2.intensity = l0.b;
    }).onComplete(function(){
      console.log("manianita completada");
    });
    var pleno_dia = new TWEEN.Tween(l1).to(l2, TRANSICION).onUpdate(function() {
      that.luz_2.intensity = l1.b;
      that.luz_3.intensity = l1.c;
    }).onComplete(function(){
      console.log("plenodia completada");
    });
    var atardece = new TWEEN.Tween(l2).to(l3, TRANSICION).onUpdate(function() {
      that.luz_3.intensity = l2.c;
      that.luz_4.intensity = l2.d;
    }).onComplete(function(){
      console.log("atardece completada");
    });
    var anochece = new TWEEN.Tween(l3).to(l4, TRANSICION).onUpdate(function() {
      that.luz_4.intensity = l3.d;
      that.luz_5.intensity = l3.e;
    }).onComplete(function(){
      console.log("anochece completada");
    });
    var noche = new TWEEN.Tween(l4).to(l5, TRANSICION * 3).onUpdate(function() {
      that.luz_5.intensity = l4.e;
    }).onComplete(function(){
      console.log("noche completada");
    });
    
    manianita.chain(pleno_dia);
    pleno_dia.chain(atardece);
    atardece.chain(anochece);
    anochece.chain(noche);
    noche.chain(amanece);
    amanece.chain(manianita);
    manianita.start();
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
        case 38: if (this.jugando == 1) { if (!this.keypressed) {
            this.keypressed = true;
            this.inicio_salto = Date.now();
            console.log(this.keypressed);
          }} else this.michis[this.jugando].jump('up'); break;
        // Down
        case 40: if (this.jugando == 1) { if (!this.keypressed) {
            this.keypressed = true;
            this.inicio_salto = Date.now();
          }} else this.michis[this.jugando].jump('down'); break;
        //Space
        case 32: if (this.habilidad) {
            this.michis[this.jugando].lanzar_habilidad();
            this.enfriamiento = Date.now();
            this.habilidad = false;
          } else console.log ("No puedes hacer eso"); break;

        // Para el menú principal
        // Left
        case 37: this.menu.cambiarGatito('left'); break;
        // Right
        case 39: this.menu.cambiarGatito('right'); break;
        // Cambiar!!!!
        // q
        case 81: this.jugando = this.menu.start();
          this.configurarMichis();
          this.camera.position.set(0, 5, 10);
          var look = new THREE.Vector3 (0, 5, 0);
          this.camera.lookAt(look);
          this.cameraControl.target = look;
          this.camera.zoom = 1.3;
          this.camera.updateProjectionMatrix();
          this.guiControls.pause = false;
          break;
        default: break;
    }
  }

  // Si añadimos al caracal habría que contar esto
  onKeyUp (event) {
    if (this.jugando == 1 && this.keypressed){
      var keyCode = event.which;
      var now = Date.now();
      switch(keyCode) {
          // Up
          case 38: 
          if (-(this.inicio_salto - now) / 1000 <= 0.2) {
              this.michis[this.jugando].jump('up');
            } else this.michis[this.jugando].big_jump('up');
            break;
          // Down
          case 40:
            if (-(this.inicio_salto - now) / 1000 <= 0.2) {
              this.michis[this.jugando].jump('down');
            } else this.michis[this.jugando].big_jump('down');
            break;
          default: break;
      }
      this.inicio_salto = 0; this.keypressed = false;
      console.log(this.keypressed);
    }

  }

  // Detectar click en botón start
  onClick (event) {
    // Posición del ratón
    var raton = new THREE.Vector3();
    raton.x = 2 * (event.clientX / window.innerWidth) - 1;
    raton.y = 1 - 2 * ( event.clientY / window.innerHeight);

    // Añadimos el raycaster
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(raton, this.camera);

    // Objeto seleccionable
    var objeto_seleccionable = this.menu.get_boton();

    var objeto_seleccionado = raycaster.intersectObject(objeto_seleccionable, true);
    
    if (objeto_seleccionado.length > 0) {
      if (objeto_seleccionable == objeto_seleccionado[0].object) {
        // Inicio juego
        this.jugando = this.menu.start();
        this.configurarMichis();
        this.camera.position.set(0, 5, 10);
        var look = new THREE.Vector3 (0, 5, 0);
        this.camera.lookAt(look);
        this.cameraControl.target = look;
        this.camera.zoom = 1.3;
        this.camera.updateProjectionMatrix();
        this.guiControls.pause = false;
      }
    }
  }

  irAMenu(){
    this.camera.position.set(500, 0, 10);
    var look = new THREE.Vector3 (500,0,0);
    this.camera.lookAt(look);
    this.cameraControl.target = look;
  }

  configurarMichis() {
    for (var i = 0; i < 3; i++) {
      if (i == this.jugando) {
        this.michis[i].restart();
      } else this.michis[i].visible = false;
    }
  }

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

    var time = Date.now();
      var segundos = -(this.inicio_movimiento - time) / 1000;
      if (segundos > 4 ){
        console.log("Luz1: " + this.luz_1.intensity);
        console.log("Luz2: " + this.luz_2.intensity);
        console.log("Luz3: " + this.luz_3.intensity);
        console.log("Luz4: " + this.luz_4.intensity);
        console.log("Luz5: " + this.luz_5.intensity);
        console.log("\nl0: " + l0.a);
        this.inicio_movimiento = time;
      }

    // Luces
    TWEEN.update();

    if (this.guiControls.pause) {
      var delta_prueba = clock.getDelta();
      this.menu.update(delta_prueba); 
      
    } else {

      var delta = clock.getDelta(); 
      var tiempo = clock.elapsedTime;

      // El fondo variará en función de la hora (no lo necesita de momento)
      this.fondo.update(delta);

      // El primer parámetro indica si son las 3 am. Se pasa al gato como segundo parámetro
      this.guiControls.pause = this.control.update(this.am, this.michis[this.jugando], delta, this.interfaz);
      if (this.guiControls.pause) this.irAMenu();

      this.michis[this.jugando].update(delta);

      // Habilidad
      if (!this.habilidad) {
        var actual = Date.now();
        if (-(this.enfriamiento - actual) / 1000 > 10) {
          this.habilidad = true;
        }
      }
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
  window.addEventListener("keyup", (event) => scene.onKeyUp(event), false);
  window.addEventListener("click", (event) => scene.onClick(event), false);
  
  // Que no se nos olvide, la primera visualización.
  scene.update();
});

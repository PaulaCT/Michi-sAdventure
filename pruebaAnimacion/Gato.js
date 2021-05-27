import * as THREE from '../libs/three.module.js'

var clock = new THREE.Clock();
 
class Gato extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    this.createGUI(gui,titleGui);
    
    // Cargamos la textura
    var runTexture = new THREE.TextureLoader().load('runningTexture.png');

    // Le asignamos NearestFilter (por defecto asigna LinearFilter, que emborrona el pixelArt)
    runTexture.magFilter = THREE.NearestFilter;

    // Gestion de la animacion de la textura (textura, casillasHorizontales, casillasVerticales, numTotalFrames, duracionCasilla)
    this.runAnim = new TextureAnimator(runTexture, 4, 1, 4, 150);

    // Material con la textura
    var material = new THREE.MeshBasicMaterial( { map: runTexture, side:THREE.DoubleSide, transparent: true } );

    // Geometria
    var geometria = new THREE.PlaneGeometry(10, 10, 1, 1);

    // Malla
    var gatito = new THREE.Mesh(geometria, material);


    this.add(gatito);
    gatito.position.y += 5;
  }
  
  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = new function () {


      
      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      this.reset = function () {
        
      }
    } 
    
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    
  }
  
  update () {

    var delta = clock.getDelta(); 
    this.runAnim.update(1000 * delta);
    
  }
}


function TextureAnimator(textura, casillasH, casillasV, numFrames, duracionCasilla){	
		
	this.horizontales = casillasH;
	this.verticales = casillasV;
	this.numeroFrames = numFrames;

  // Hacemos que la textura se repita mediante RepeatWrapping
	textura.wrapS = textura.wrapT = THREE.RepeatWrapping; 

  // La "repeticion" será 1 / nºcasillas, equivale a ampliar dentro de la textura, mostrando solo una de las casillas
	textura.repeat.set( 1 / this.horizontales, 1 / this.verticales );

	// Duracion para cada frame
	this.duracion = duracionCasilla;

	// Tiempo que se ha mostrado el frame actual
	this.duracionActual = 0;

	// Frame actual
	this.frameActual = 0;
		
	this.update = function(milliSec){
		this.duracionActual += milliSec;
		while (this.duracionActual > this.duracion){

      // Pasamos de frame y actualizamos el tiempo de duracion
			this.duracionActual -= this.duracion;
			this.frameActual++;

      // Si hemos llegado al ultimo frame volveremos al primero
			if (this.frameActual == this.numeroFrames)
				this.frameActual = 0;
      
      // Columna en la que estamos
			var columnaActual = this.frameActual % this.horizontales;
      // Desplazamos horizontalmente
			textura.offset.x = columnaActual / this.horizontales;
      // Fila en la que estamos
			var filaActual = Math.floor( this.frameActual / this.horizontales );
      // Desplazamos verticalmente
			textura.offset.y = filaActual / this.verticales;

		}
	};

}

export { Gato };

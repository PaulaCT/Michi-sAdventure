import * as THREE from '../libs/three.module.js'

var clock = new THREE.Clock();
 
class Gato extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    this.createGUI(gui,titleGui);
    
    // Cargamos la textura
    var runTexture = new THREE.TextureLoader().load('../gato/gato.png');

    // Le asignamos NearestFilter (por defecto asigna LinearFilter, que emborrona el pixelArt)
    runTexture.magFilter = THREE.NearestFilter;
    //runTexture.minFilter = THREE.NearestFilter;

    // Gestion de la animacion de la textura (textura, casillasHorizontales, casillasVerticales, numTotalFrames, duracionCasilla)
    this.anim = new TextureAnimator(runTexture, 13, 5, 150);

    // Material con la textura
    var material = new THREE.MeshBasicMaterial( { map: runTexture, side:THREE.DoubleSide, transparent: true } );

    // Geometria
    //var geometria = new THREE.PlaneGeometry(1, 1, 1, 1);
    var geometria = new THREE.BoxGeometry(1,1);
    // Malla
    this.gato = new THREE.Mesh(geometria, material);

    // Para la colisión
    this.gato.geometry.computeBoundingBox();

    this.add(this.gato);  
    
    
    
  }

  getBoundingBox(){
    return this.gato.geometry.boundingBox;
  }
  
  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    
    
  }
  
  update (anim) {
    var delta = clock.getDelta();

    switch(anim){
      case 'run':
        this.anim.update(0, 4, 1000 * delta);
      break;
      case 'die':
        this.anim.update(1, 5, 1000 * delta);
      break;
      case 'hurt':
        this.anim.update(2, 5, 1000 * delta);
      break;
      case 'jump':
        this.anim.update(3, 8, 1000 * delta);
      break;
      case 'idle':
        this.anim.update(4, 13, 1000 * delta);
      break;
      
    }   
    

    
    
  }

}


function TextureAnimator(textura, casillasH, casillasV, duracionCasilla){	
		
	this.horizontales = casillasH;
	this.verticales = casillasV;

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

  this.update = function(fila, numFrames, milliSec){
		this.duracionActual += milliSec;
		while (this.duracionActual > this.duracion){

      // Pasamos de frame y actualizamos el tiempo de duracion
			this.duracionActual -= this.duracion;
			this.frameActual++;

      // Si hemos llegado al ultimo frame volveremos al primero
			if (this.frameActual == numFrames)
				this.frameActual = 0;
      
      // Columna en la que estamos
			var columnaActual = this.frameActual % this.horizontales;
      // Desplazamos horizontalmente
			textura.offset.x = columnaActual / this.horizontales;
      // Fila en la que estamos

			textura.offset.y = fila / this.verticales;

		}
	};

}

export { Gato };

import * as THREE from '../libs/three.module.js'

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
  
  this.animacion = function(fila, numFrames, milliSec){
    
    this.duracionActual += milliSec;
		while (this.duracionActual > this.duracion){

      // Actualizamos el tiempo de duracion
			this.duracionActual -= this.duracion;

      // Si hemos llegado al ultimo frame volveremos al primero
			if (this.frameActual == numFrames)
				this.frameActual = 0;
      
      // Columna en la que estamos
			var columnaActual = this.frameActual % this.horizontales;
      // Desplazamos horizontalmente
			textura.offset.x = columnaActual / this.horizontales;
      // Fila en la que estamos

			textura.offset.y = fila / this.verticales;

      // Pasamos de frame 
      this.frameActual++;

      return 1;
		}
    return 0;
  };

  // Actualiza el frame actual
  this.restart = function(){
    this.frameActual = 0;
    this.duracionActual = 0;
  };

  

}

export {TextureAnimator};
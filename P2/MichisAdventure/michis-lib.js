import * as THREE from '../libs/three.module.js'

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
    
  // i es la fila de la animación
  // j es el número de frames de la animación
  this.animacion = function(i, j){
    
    this.frameActual++;

    // Si hemos llegado al ultimo frame volveremos al primero
    if (this.frameActual == j)
      this.frameActual = 0;
      
    // Columna en la que estamos
    var columnaActual = this.frameActual % this.horizontales;
    // Desplazamos horizontalmente
    textura.offset.x = columnaActual / this.horizontales;
    // Fila en la que estamos
    var filaActual = i;
    // Desplazamos verticalmente
    textura.offset.y = filaActual / this.verticales;
    
  };

  

}

export {TextureAnimator};
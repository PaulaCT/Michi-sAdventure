// Dependencias
import * as THREE from '../libs/three.module.js'
import { Objeto } from './Objeto.js'

class TextureAnimator extends THREE.Object3D {
  // ---------- Constructor ----------
  // Recibe la textura, el número de casillas horizontales, el número de casillas
  // verticales, el total de casillas y la duración de la animación

  constructor(texture, hor, vert, total, duracion) {
    super();

    this.hor = hor;
    this.vert = vert;

    this.total = total;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
    texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );

    // Cuánto tiempo está cada imagen
    this.duracion = duracion;

    // Parámetros de control de animación
    // Escena 0
    this.actual = 0;
    // Segundo en escena actual
    this.actual_time = 0;

  }
      
  update = function( milliSec ) {
    this.actual_time += milliSec;
    while (this.actual_time > this.duracion) {
      this.actual_time -= this.duracion;
      this.actual++;
      if (this.actual == this.total)
        this.actual = 0;
      var columna = this.actual % this.hor;
      texture.offset.x = columna / this.hor;
      var fila = Math.floor( this.actual / this.hor );
      texture.offset.y = fila / this.ver;
    }
  }
  

}

export { TextureAnimator };

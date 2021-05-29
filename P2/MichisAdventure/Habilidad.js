import * as THREE from '../libs/three.module.js'
import { TextureAnimator } from './michis-lib.js'

// Constantes
const VELOCIDAD = 4;

class Habilidad extends THREE.Object3D {
  // ---------- Constructor ----------

  constructor() {
    super();

    // Cargamos la textura   -----   editar
    /*var texture = new THREE.TextureLoader().load('../gato/habilidad.png');
    // Le asignamos NearestFilter (por defecto asigna LinearFilter, que emborrona el pixelArt)
    texture.magFilter = THREE.NearestFilter;
    // Gestion de la animacion de la textura (textura, casillasHorizontales, casillasVerticales, numTotalFrames, duracionCasilla)
    this.annie = new TextureAnimator(texture, 13, 5, 150);
    var material = new THREE.MeshBasicMaterial( { map: texture, side:THREE.DoubleSide, transparent: true } ); */

    var habGeom = new THREE.BoxGeometry(0.5, 0.5);
    var habMat = new THREE.MeshPhongMaterial({color: 0xF71FDB});
    this.hab = new THREE.Mesh (habGeom, habMat);

    // Al principio nos da igual dónde esté (hasta que se lance)
    this.hab.position.x = 0;
    this.pos_x = 0;

    this.add(this.hab);
    
    // Creamos un booleano para saber si se ha lanzado
    this.visible = false;

    // Para la colisión
    this.hab.geometry.computeBoundingBox();
    
  }

  // ---------- Función activate ----------
  // Inicializa el tiempo y la posición (recibe el carril)

  activate(carril) {
    // Hacemos esto para que la habilidad empiece a desplazarse en el momento
    // en el que se lanza y no en el que ha sido creado. Además, colocamos al 
    // objeto en la posición adecuada
    this.hab.position.set(0, carril.y, carril.z);
    this.pos_x = 0;
    this.hab.scale.set(carril.s, carril.s, carril.s);
    this.last_time = Date.now();
    this.set_visible(true);
  }


  // ---------- Función update ----------
  // Controla el desplazamiento por el carril
  
  update() {
    
    if (this.visible) {
      // Calculamos el tiempo y desplazamos la habilidad tanto como sea necesario
      var time = Date.now();
      var segundos = -(this.last_time - time) / 1000;
      this.pos_x = this.pos_x + segundos * VELOCIDAD;
      this.hab.position.x = this.pos_x;
      this.last_time = time;
    }   
  }


  // ---------- Función set_visible ----------
  // Recibe un booleano que indica la visibilidad a establecer
  // Si éste es false, se detiene el movimiento y se invisibiliza
  // Si éste es true, se vuelve a iniciar el movimiento y deja de ser invisible
  
  set_visible(visible) {
    this.visible = visible;
  }


  // ---------- Función getBoundingBox ----------
  // Devuelve el bounding box

  getBoundingBox() {
    return this.hab.geometry.boundingBox;
  }
  

  // ---------- Función get_pos_x ----------
  // Devuelve la posición en x

  get_pos_x(){
    return this.pos_x;
  }

}


export { Habilidad };

import * as THREE from '../libs/three.module.js'
import { TextureAnimator } from './michis-lib.js'

 
class ContadorMonedas extends THREE.Object3D {
  constructor() {
    super();

    this.unidades = 0;
    this.decenas = 0;
    this.centenas = 0;
    this.dineroActual = 0;
    
    // Cargamos la textura
    var textoDinero = new THREE.TextureLoader().load('./michis-imgs/letras.png');

    var unidad = new THREE.TextureLoader().load('./michis-imgs/texturaNumeros.png');
    var decena = new THREE.TextureLoader().load('./michis-imgs/texturaNumeros.png');
    var centena = new THREE.TextureLoader().load('./michis-imgs/texturaNumeros.png');

    // Le asignamos NearestFilter (por defecto asigna LinearFilter, que emborrona el pixelArt)
    textoDinero.magFilter = THREE.NearestFilter;
    unidad.magFilter = THREE.NearestFilter;
    decena.magFilter = THREE.NearestFilter;
    centena.magFilter = THREE.NearestFilter;

    // Gestion de la animacion de la textura (textura, casillasHorizontales, casillasVerticales, numTotalFrames, duracionCasilla)
    this.animU = new TextureAnimator(unidad, 1, 10, 0);
    this.animD = new TextureAnimator(decena, 1, 10, 0);
    this.animC = new TextureAnimator(centena, 1, 10, 0);

    // Material con la textura
    var materialTexto = new THREE.MeshBasicMaterial( { map: textoDinero, side:THREE.DoubleSide, transparent: true } );
    var materialUnidad = new THREE.MeshBasicMaterial( { map: unidad, side:THREE.DoubleSide, transparent: true } );
    var materialDecena = new THREE.MeshBasicMaterial( { map: decena, side:THREE.DoubleSide, transparent: true } );
    var materialCentena = new THREE.MeshBasicMaterial( { map: centena, side:THREE.DoubleSide, transparent: true } );

    // Geometria
    var geometriaTexto = new THREE.BoxGeometry(6, 1.6, 0.2);
    var geometriaNum = new THREE.BoxGeometry(1, 1, 0.2);

    // Malla
    this.texto = new THREE.Mesh(geometriaTexto, materialTexto);
    this.unidad = new THREE.Mesh(geometriaNum, materialUnidad);
    this.decena = new THREE.Mesh(geometriaNum, materialDecena);
    this.centena = new THREE.Mesh(geometriaNum, materialCentena);

    this.texto.position.set(28, 0, 2);
    this.texto.scale.set(1.5, 1.5, 1.5);

    this.unidad.position.set(35, 0, 2);
    this.decena.position.set(34, 0, 2);
    this.centena.position.set(33, 0, 2);

    this.add(this.texto);
    this.add(this.unidad);
    this.add(this.decena);
    this.add(this.centena);

  }

  // ---------- Función update ----------
  // Recibe el tiempo

  update(dinero) {
    if(this.dineroActual < dinero){

      this.dineroActual = dinero;

      if(this.unidades != 9){
        this.unidades++;
        this.animU.animacion(this.unidades, 1, 100000);
      }
      else if(this.decenas != 9){
        this.unidades = 0;
        this.animU.animacion(this.unidades, 1, 100000);
        this.decenas++;
        this.animD.animacion(this.decenas, 1, 100000);
      }
      else if(this.centenas != 9){
        this.decenas = 0;
        this.animD.animacion(this.decenas, 1, 100000);
        this.centenas++;
        this.animC.animacion(this.centenas, 1, 100000);
      }

    }
  }



}

export { ContadorMonedas };

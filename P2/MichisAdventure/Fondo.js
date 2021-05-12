// Dependencias
import * as THREE from '../libs/three.module.js'
import { TextureAnimator } from './TextureAnimator.js'

// Constantes
const VELOCIDAD = 4;
const VELOCIDAD_3AM = 9;

class Fondo extends THREE.Object3D {
  // ---------- Constructor ----------
  
  constructor() {
    super();
    
    // Primero hacemos el cielo
    // La geometría es una caja con muy poca altura
    var cieloGeom = new THREE.BoxGeometry (50,30,0.2);
    //var texture_cielo = new THREE.TextureLoader().load('./michis-imgs/stars-ini.jpg');
    //var cieloMat = new THREE.MeshPhongMaterial({map: texture_cielo})
    var cieloMat = new THREE.MeshPhongMaterial({color: 0x5BA9FF});
    // Ya se puede construir el Mesh
    this.cielo = new THREE.Mesh (cieloGeom, cieloMat);
    this.cielo.position.y = 15;
    this.cielo.position.z = -0.6;
    
    this.add (this.cielo);

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // Ahora añadimos el sol, y la luna (darán vueltas sobre una trayectoria circular)

    // Podríamos usar una base circular en vez de una caja
    var solGeom = new THREE.BoxGeometry(2,2,0.2);
    //var textura_sol = new THREE.TextureLoader().load('');
    var solMat = new THREE.MeshPhongMaterial({color: 0xF5E866});
    this.sol = new THREE.Mesh (solGeom, solMat);
    this.sol.position.set(5,20,-0.4);
    this.add(this.sol);

    var lunaGeom = new THREE.BoxGeometry(2,2,0.2);
    //var textura_luna = new THREE.TextureLoader().load('');
    var lunaMat = new THREE.MeshPhongMaterial({color: 0xA08FD5});
    this.luna = new THREE.Mesh (lunaGeom, lunaMat);
    this.luna.position.set(5,-20,-0.4);
    this.add(this.luna);

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // Añadimos las montañas (la textura se moverá en algún futuro)

    var montaniaGeom = new THREE.BoxGeometry (50,30,0.2);
    var montaniatexture = new THREE.TextureLoader().load('./michis-imgs/montania.png');
    var montaniaMat = new THREE.MeshPhongMaterial({map: montaniatexture, transparent: true,});
    this.montania = new THREE.Mesh (montaniaGeom, montaniaMat);
    this.montania.position.y = 15;
    this.add (this.montania);


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // Ahora unas nubecitas

    var nube1Geom = new THREE.BoxGeometry (4,1.5,0.2);
    var nube1texture = new THREE.TextureLoader().load('./michis-imgs/nube1.png');
    var nube1Mat = new THREE.MeshPhongMaterial({map: nube1texture, transparent: true,});
    this.nube1 = new THREE.Mesh (nube1Geom, nube1Mat);
    this.nube1.position.y = 20;
    this.nube1.position.x = -25;
    this.add (this.nube1);

    var nube2Geom = new THREE.BoxGeometry (4,1.5,0.2);
    var nube2texture = new THREE.TextureLoader().load('./michis-imgs/nube2.png');
    var nube2Mat = new THREE.MeshPhongMaterial({map: nube2texture, transparent: true,});
    this.nube2 = new THREE.Mesh (nube2Geom, nube2Mat);
    this.nube2.position.y = 19;
    this.nube1.position.x = -10;
    this.add (this.nube2);


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // El suelo
    
    var sueloGeom = new THREE.BoxGeometry (50,20,0.2);
    var sueloMat = new THREE.MeshPhongMaterial({color: 0x008F39});
    this.suelo = new THREE.Mesh (sueloGeom, sueloMat);
    this.suelo.position.y = -10;
    this.suelo.position.z = -0.2;
    this.add (this.suelo);

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // Los carriles

    var carril1geom = new THREE.BoxGeometry (50,1,0.2);
    var carril1mat = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
    var carril1mesh = new THREE.Mesh (carril1geom, carril1mat);
    carril1mesh.position.z = 0.3;
    carril1mesh.position.y = 3;
    this.add(carril1mesh);
    
    var carril2geom = new THREE.BoxGeometry (50,2,0.2);
    var carril2mat = new THREE.MeshPhongMaterial({color: 0xF29089});
    var carril2mesh = new THREE.Mesh (carril2geom, carril2mat);
    carril2mesh.position.z = 0.3;
    carril2mesh.position.y = 1.5;
    this.add(carril2mesh);

    var carril3geom = new THREE.BoxGeometry (50,3,0.2);
    var carril3mat = new THREE.MeshPhongMaterial({color: 0x3F7A63});
    var carril3mesh = new THREE.Mesh (carril3geom, carril3mat);
    carril3mesh.position.z = 0.3;
    carril3mesh.position.y = -1;
    this.add(carril3mesh);
  }


  // ---------- Función update ----------
  // Recibe la hora
  
  update (hora) { 
    // Se mueven
    //   - Las montañas con TextureAnimator

    //   - Las nubes (hacia la izquierda)

    //   - El sol y la luna (dan vueltas)
    
    

  }
}

export { Fondo };
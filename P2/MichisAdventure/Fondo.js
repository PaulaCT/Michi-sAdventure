// Dependencias
import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'
import { ThreeBSP } from '../libs/ThreeBSP.js'

// Constantes
const VELOCIDAD_FONDO = 0.002;
const VELOCIDAD_SUELO = 0.2;
const VELOCIDAD_NUBES = 0.8;

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
    var solGeom = new THREE.BoxGeometry(4,4,0.2);
    var texturaSol = new THREE.TextureLoader().load('./michis-imgs/sol.png');
    var solMat = new THREE.MeshPhongMaterial({map: texturaSol, transparent: true,});
    this.sol = new THREE.Mesh (solGeom, solMat);
    this.sol.position.set(5,20,-0.4);
    this.add(this.sol);

    var lunaGeom = new THREE.BoxGeometry(4,4,0.2);
    var texturaLuna = new THREE.TextureLoader().load('./michis-imgs/luna.png');
    var lunaMat = new THREE.MeshPhongMaterial({map: texturaLuna, transparent: true,});
    this.luna = new THREE.Mesh (lunaGeom, lunaMat);
    this.luna.position.set(5,-20,-0.4);
    this.add(this.luna);

    // Y su caminito

    var elipse = new THREE.EllipseCurve(
        0, -2, // ax, ay
        15, 25, // radio_x, radio_y
        0, 2*Math.PI, // ángulo inicio, ángulo fin
        true, // dirección de las agujas del reloj
        0 // rotación
    );

    var puntos = elipse.getPoints(50);
    var camino = [];
    puntos.forEach ( e => {
        camino.push(new THREE.Vector3(e.x, e.y, -0.4));
    })
    this.recorrido_sol_luna = new THREE.CatmullRomCurve3(camino);

    // Posiciones
    const dia = {p:0};
    const noche = {p:0.5};
    const loop_dia = 80000      
    const loop_noche = 80000    

    var bucle_dia = new TWEEN.Tween(dia).to(noche, loop_dia).easing(TWEEN.Easing.Quadratic.InOut).onUpdate(()=>{
        var pos = this.recorrido_sol_luna.getPointAt(dia.p);
        this.sol.position.copy(pos);
        this.luna.position.copy(pos);
        this.sol.position.y = this.sol.position.y * -1;
    });

    var bucle_noche = new TWEEN.Tween(noche).to(dia, loop_noche).easing(TWEEN.Easing.Quadratic.InOut).onUpdate(()=>{
        var pos = this.recorrido_sol_luna.getPointAt(noche.p);
        this.sol.position.copy(pos);
        this.luna.position.copy(pos);
        this.luna.position.y = this.luna.position.y * -1;
        this.luna.position.x = this.luna.position.x * -1;
    });

    // Los activamos
    bucle_dia.start().chain(bucle_noche);
    bucle_noche.chain(bucle_dia);


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // Añadimos las montañas (la textura se moverá en algún futuro)

    var montaniaGeom = new THREE.BoxGeometry (80,30,0.2);
    var montaniatexture = new THREE.TextureLoader().load('./michis-imgs/montania_toro.png');
    montaniatexture.wrapS = montaniatexture.wrapT = THREE.RepeatWrapping; 
    var montaniaMat = new THREE.MeshPhongMaterial({map: montaniatexture, transparent: true,});
    this.montania = new THREE.Mesh (montaniaGeom, montaniaMat);
    this.montania.position.y = 15;
    this.add (this.montania);
    this.montania_count = 0;

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
    var suelotexture = new THREE.TextureLoader().load('./michis-imgs/grass.png');
    suelotexture.magFilter = THREE.NearestFilter;
    suelotexture.wrapS = suelotexture.wrapT = THREE.RepeatWrapping; 
    var sueloMat = new THREE.MeshPhongMaterial({map: suelotexture, transparent: true,});
    this.suelo = new THREE.Mesh (sueloGeom, sueloMat);
    this.suelo.position.y = -10;
    this.suelo.position.z = -0.2;
    this.add (this.suelo);

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // Los carriles

    var carril1geom = new THREE.BoxGeometry (50,1,0.2);
    var carril1texture = new THREE.TextureLoader().load('./michis-imgs/dirt1.png');
    carril1texture.magFilter = THREE.NearestFilter;
    carril1texture.wrapS = carril1texture.wrapT = THREE.RepeatWrapping; 
    var carril1mat = new THREE.MeshPhongMaterial({map: carril1texture});
    this.carril1 = new THREE.Mesh (carril1geom, carril1mat);
    this.carril1.position.z = 0.3;
    this.carril1.position.y = 3;
    this.add(this.carril1);
    
    var carril2geom = new THREE.BoxGeometry (50,2,0.2);
    var carril2texture = new THREE.TextureLoader().load('./michis-imgs/dirt2.png');
    carril2texture.magFilter = THREE.NearestFilter;
    carril2texture.wrapS = carril2texture.wrapT = THREE.RepeatWrapping; 
    var carril2mat = new THREE.MeshPhongMaterial({map: carril2texture});
    this.carril2 = new THREE.Mesh (carril2geom, carril2mat);
    this.carril2.position.z = 0.3;
    this.carril2.position.y = 1.5;
    this.add(this.carril2);

    var carril3geom = new THREE.BoxGeometry (50,3,0.2);
    var carril3texture = new THREE.TextureLoader().load('./michis-imgs/dirt3.png');
    carril3texture.magFilter = THREE.NearestFilter;
    carril3texture.wrapS = carril3texture.wrapT = THREE.RepeatWrapping; 
    var carril3mat = new THREE.MeshPhongMaterial({map: carril3texture, transparent: true,});
    this.carril3 = new THREE.Mesh (carril3geom, carril3mat);
    this.carril3.position.z = 0.3;
    this.carril3.position.y = -1;
    this.add(this.carril3);

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // La caja límite

    this.limite = this.create_caja();
    var texture_limite = new THREE.TextureLoader().load('./michis-imgs/marco.png');
    texture_limite.magFilter = THREE.NearestFilter;
    this.limite.material = new THREE.MeshPhongMaterial({map: texture_limite});
    this.add(this.limite);
  }

  // ---------- Función create_caja ----------
  // Crea la caja límite del juego con BSP

  create_caja() {
    var caja_ext = new THREE.BoxGeometry(200, 200, 0.2);
    var caja_int = new THREE.BoxGeometry(40, 40, 0.2);
    
    caja_ext.translate(0 , 0 , 3);
    caja_int.translate(0 , 5 , 3);  

    var caja_extBSP = new ThreeBSP(caja_ext);
    var caja_intBSP = new ThreeBSP(caja_int);

    var figura = caja_extBSP.subtract(caja_intBSP);
    return figura.toMesh();
  }


  // ---------- Función update ----------
  // Recibe la hora
  
  update (delta) { 
    // Se mueven
    //   - Las montañas se desplazan lentamente
    //this.montania_count = this.montania_count + VELOCIDAD_FONDO / 500;
    //this.montania.material.map.offset.x = this.montania_count;
    this.montania.material.map.offset.x += VELOCIDAD_FONDO * delta;

    this.suelo.material.map.offset.x += VELOCIDAD_SUELO * delta;
    this.carril1.material.map.offset.x += VELOCIDAD_SUELO * delta;
    this.carril2.material.map.offset.x += VELOCIDAD_SUELO * delta;
    this.carril3.material.map.offset.x += VELOCIDAD_SUELO * delta;

    //   - Las nubes (hacia la izquierda)
    this.nube1.position.x = this.nube1.position.x - (VELOCIDAD_NUBES * delta);
    this.nube2.position.x = this.nube2.position.x - (VELOCIDAD_NUBES * delta);
    
    if (this.nube1.position.x <= -25) this.nube1.position.x = 25;
    if (this.nube2.position.x <= -25) this.nube2.position.x = 25;

    //   - El sol y la luna (dan vueltas) 
    TWEEN.update();

  }
}

export { Fondo };
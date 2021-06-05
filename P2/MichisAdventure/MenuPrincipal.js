// Dependencias
import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'
import { Gato } from './Gato.js'

// Constantes
const DESPLAZAMIENTO = 14;
const ESCALA_SELECT = 7;
const ESCALA = 5;

class MenuPrincipal extends THREE.Object3D {
  // ---------- Constructor ----------
  
  constructor() {
    super();

    // Elige a tu personaje
    
    // Añadimos a los gatitos
    this.gato = new Gato(); //Pasarle imagen gato
    this.caracal = new Gato();//'./michis-imgs/caracal.png');
    this.suerte = new Gato();//'./michis-imgs/suerte.png');

    this.add(this.gato);
    this.add(this.caracal);
    this.add(this.suerte);

    this.caracal.position.set(-DESPLAZAMIENTO, 0, 0);
    this.caracal.scale.set(ESCALA, ESCALA, ESCALA);
    this.caracal.iddle();

    this.gato.scale.set(ESCALA_SELECT, ESCALA_SELECT, ESCALA_SELECT);
    this.gato.iddle();

    this.suerte.position.set(DESPLAZAMIENTO, 0, 0);
    this.suerte.scale.set(ESCALA, ESCALA, ESCALA);
    this.suerte.iddle();

    this.michi_afortunado = 'gato';

    // Fondo
    var fondo_geom = new THREE.BoxGeometry(200, 200, 0.2);
    var fondo_textura = new THREE.TextureLoader().load('./michis-imgs/yoquese.jpg');
    var fondo_mat = new THREE.MeshPhongMaterial({map: fondo_textura});
    this.fondo = new THREE.Mesh (fondo_geom, fondo_mat);
    this.add(this.fondo);

    // Botón
    var boton_geom = new THREE.BoxGeometry(8, 6, 1);
    var boton_textura = new THREE.TextureLoader().load('./michis-imgs/yoquese.jpg');
    var boton_mat = new THREE.MeshPhongMaterial({map: boton_textura});
    this.boton = new THREE.Mesh (boton_geom, boton_mat);
    this.add(this.boton);

    this.boton.position.set(0, -6, 0);
  }


  // ---------- Función update ----------
  // Recibe la hora
  
  update (delta) { 
    this.gato.update(delta);
    this.caracal.update(delta);
    this.suerte.update(delta);
  }

  // ---------- Función cambiarGatito ----------
  // Cambia el gatito seleccionado

  cambiarGatito (direccion) {
    if (direccion == 'right') {
        switch(this.michi_afortunado) {
            case 'gato': 
                //this.suerte.position.x -= DESPLAZAMIENTO;
                this.suerte.scale.set(ESCALA_SELECT, ESCALA_SELECT, ESCALA_SELECT);
                //this.gato.position.x -= DESPLAZAMIENTO;
                this.gato.scale.set(ESCALA, ESCALA, ESCALA);
                //this.caracal.position.x -= DESPLAZAMIENTO;
                this.michi_afortunado = 'chino';
                break;
            case 'caracal':
                //this.suerte.position.x -= DESPLAZAMIENTO;
                //this.gato.position.x -= DESPLAZAMIENTO;
                this.gato.scale.set(ESCALA_SELECT, ESCALA_SELECT, ESCALA_SELECT);
                //this.caracal.position.x -= DESPLAZAMIENTO;
                this.caracal.scale.set(ESCALA, ESCALA, ESCALA);
                this.michi_afortunado = 'gato';
                break;
            default: break;  
        }
    } else if (direccion == 'left') {
        switch(this.michi_afortunado) {
            case 'chino': 
                //this.suerte.position.x += DESPLAZAMIENTO;
                this.suerte.scale.set(ESCALA, ESCALA, ESCALA);
                //this.gato.position.x += DESPLAZAMIENTO;
                this.gato.scale.set(ESCALA_SELECT, ESCALA_SELECT, ESCALA_SELECT);
                //this.caracal.position.x += DESPLAZAMIENTO;
                this.michi_afortunado = 'gato';
                break;
            case 'gato':
                //this.suerte.position.x += DESPLAZAMIENTO;
                //this.gato.position.x += DESPLAZAMIENTO;
                this.gato.scale.set(ESCALA, ESCALA, ESCALA);
                //this.caracal.position.x += DESPLAZAMIENTO;
                this.caracal.scale.set(ESCALA_SELECT, ESCALA_SELECT, ESCALA_SELECT);
                this.michi_afortunado = 'caracal';
                break;
            default: break;  
        }
    }
  }

  // ---------- Función start ----------
  // Devuelve el gatito seleccionado

  start () {
    return this.michi_afortunado;
  }


  // ---------- Función get_boton ----------
  // Devuelve el boton

  get_boton() {
    return this.boton;
  }
}

export { MenuPrincipal };
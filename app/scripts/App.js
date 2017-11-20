import earth from "./../data/europe.json"; 
import datas from "./../data/elevation.js";

import Helper from './Helper'; 
import Blob from './Blob';
import Earth from "./Earth";
import OrbitControls from 'three/examples/js/controls/OrbitControls'
import Projector from 'three/examples/js/renderers/Projector'

export default class App {

    constructor() {
        this.counter = 0
    
        this.initScene();       // scene, renderer, camera & control
        this.initEarth();       // earth     
        this.initUi();          // HTML Composant
        this.initEvents();      // Events (mousemove, resize)
        this.initRaycaster();   // Raycaster

        this.renderer.animate( this.render.bind(this) );
    }

    ///////////////////////////////////
    //      INITIALISATION
    ///////////////////////////////////

    initUi() {
        this.coordDisplay = document.getElementById("coord-display");
    }

    initEvents() {
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        this.onWindowResize();
    }

    initEarth(){
        this.earth = new Earth({
            size: 5,
            datasType: 'raw', // can be geojson
            datas: datas // raw data
            //datas: earth, // Geogjaon
        });
        this.earth.initObject3d();
        this.scene.add(this.earth.mesh);
        this.blob = new Blob(this.scene);
        this.earth.on('noiseEnd', () => {
            this.blob.toScale(1, 10);
        })


    }

    initScene() {
        this.container = document.querySelector( '#main' );
        document.body.appendChild( this.container );

        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: 1 } );
        this.renderer.setClearColor( 0x000000, 0 );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.container.appendChild( this.renderer.domElement );

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 100 );
        this.camera.position.z = 15;

        this.controls = new THREE.OrbitControls( this.camera );
        this.controls.update();
    }

    initRaycaster() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.earth.createCasterHelper();
        this.scene.add(this.earth.casterHelper);
    }

    initCastLine() {
        var material = new THREE.LineBasicMaterial({ color: 0x000000 });
        var geometry = new THREE.Geometry();
        geometry.vertices.push( new THREE.Vector3( -10, 0, 0 ), new THREE.Vector3( -10, 0, 0 ) );

        this.castLine = new THREE.Line( geometry, material );
        this.scene.add( this.castLine );
    }

    ///////////////////////////////////
    //              RAF
    ///////////////////////////////////

    render() {
        this.counter += 0.1;
        this.raycaster.setFromCamera( this.mouse, this.camera );

        this.mouseCall();

        this.blob.update(this.counter)
        this.earth.update(this.counter, this.target);

    	this.renderer.render( this.scene, this.camera );
    }


    ///////////////////////////////////
    //              Events
    ///////////////////////////////////

    mouseCall() {
        // calculate objects intersecting the picking ray
        var intersects = this.raycaster.intersectObjects( this.scene.children );
        for(var i=0; i<intersects.length; i++) {
            if(intersects[i].object.name == "CasterTarget") {

                this.target = new THREE.Vector3()
                .copy(intersects[i].point)
                .applyAxisAngle( new THREE.Vector3( 1, 0, 0 ), Math.PI/2 )
                .applyAxisAngle( new THREE.Vector3( 0, 0, 1 ), -this.earth.mesh.rotation.y );
                    
                var coord = this.earth.getGeoCoord(this.target); 
                this.coordDisplay.innerHTML = Math.floor(coord.lon*10)/10+ " | "+Math.floor(coord.lat*10)/10

                if(this.castLine) {
                    this.castLine.geometry.vertices[1] = intersects[i].point;
                    this.castLine.geometry.verticesNeedUpdate = true;
                }
            }
        }
    }

    onMouseMove( event ) {        
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }


    onWindowResize() {
    	this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
}

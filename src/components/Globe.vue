<template>
  <div class="start" @mousemove="onMouseMove" >
      <div class="globe__container" :class="canvasClass">
        <p id="coord-display"></p>
        <div id="canvas" class="globe" @mousedown="onMouseDown" @mouseup="onMouseUp"></div>
      </div>
      <detail v-if="detailActive && cd" :cd="cd" :coord="geoCoord" @close="hideDetail"></detail>
      <timeline></timeline>
  </div>
</template>

<script>

import datas from "./../data/elevation.js";

import GeoUtil from './../models/GeoUtil';
import Blob from './../models/Blob';
import Earth from "./../models/Earth";
import GeoData from "./../models/GeoData";
import OrbitControls from './../models/OrbitControls';
import Detail from './Detail';
import Timeline from "./Timeline";
import {Scene, PerspectiveCamera, WebGLRenderer, Vector3, Vector2, Mesh, Raycaster, LineBasicMaterial, Geometry, Line} from 'three';

export default {

  components: { Detail, Timeline },

  data: function () {
    return {
      canvas: null,
      detailActive: false,
      cd: null,
      geoCoord: null
    }
  },

  computed: {
    canvasClass: function(){
      return this.detailActive ? "globe__container--hide" : "globe__container--display"
    }
  },

  mounted: function () {
    this.counter = 0;
    this.canvas = this.$el.querySelector( '#canvas' )
    this.initScene();       // scene, renderer, camera & control
    this.initEarth();       // earth
    this.initUi();          // HTML Composant
    this.initEvents();      // Events (mousemove, resize)
    this.initRaycaster();   // Raycaster

    this.render();
  },

  methods: {

    /////////////////////////////////////
    //      INITIALISATION
    /////////////////////////////////////

    initUi: function() {
        this.coordDisplay = document.getElementById("coord-display");
    },

    initEvents: function() {
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        canvas.addEventListener('mousedown', this.onMouseDown.bind(this), false);
        canvas.addEventListener('mouseup', this.onMouseUp.bind(this), false);
        this.onWindowResize();
    },

    unsetEvents() {
        window.removeEventListener('resize', this.onWindowResize.bind(this));
        window.removeEventListener('mousemove', this.onMouseMove.bind(this));
        canvas.removeEventListener('mousedown', this.onMouseDown.bind(this));
        canvas.removeEventListener('mouseup', this.onMouseUp.bind(this));
    },

    initEarth: function(){
      var firstTime = this.$store.state.firstTime;
      this.earth = new Earth({
          size: 5,
          datasType: 'raw', // can be geojson
          datas: datas, // raw data
          firstTime: firstTime
      });
      this.earth.initObject3d();
      this.scene.add(this.earth.mesh);
      this.blob = new Blob(this.scene, firstTime);
      if( firstTime ){
        this.$store.state.firstTime = false;
        this.earth.on('noiseEnd', () => {
            this.blob.toScale(1, 10);
        })
      }

    },

    initScene: function() {
      this.canvas = this.$el.querySelector( '#canvas' );
      this.scene = new Scene();
      this.renderer = new WebGLRenderer( { antialias: true, alpha: 1 } );
      this.renderer.setClearColor( 0x000000, 0 );
      this.renderer.setPixelRatio( window.devicePixelRatio );
      this.renderer.setSize( window.innerWidth, window.innerHeight );
      this.canvas.appendChild( this.renderer.domElement );
      this.camera = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 100 );
      this.camera.position.copy(GeoUtil.coordToCart(this.$store.state.coord, 15));
      this.controls = new OrbitControls( this.camera );
      this.controls.update();
    },

    initRaycaster: function() {
        this.raycaster = new Raycaster();
        this.mouse = new Vector2();
        this.earth.createCasterHelper();
        this.scene.add(this.earth.casterHelper);
    },

    initCastLine: function() {
      var material = new LineBasicMaterial({ color: 0x000000 });
      var geometry = new Geometry();
      geometry.vertices.push( new Vector3( -10, 0, 0 ), new Vector3( -10, 0, 0 ) );

      this.castLine = new Line( geometry, material );
      this.scene.add( this.castLine );
    },

    showDetail: function(cd) {
      this.cd = cd;
      this.detailActive = true;
      cancelAnimationFrame(this.raf);
    },

    hideDetail: function() {
      this.cd = null;
      this.detailActive = false;
      this.render();
    },

    ///////////////////////////////////
    //              RAF
    ///////////////////////////////////

    render: function() {
      this.counter += 0.1;
      this.raycaster.setFromCamera( this.mouse, this.camera );
      this.mouseCall();

      this.blob.update(this.counter)
      this.earth.update(this.counter, this.target);

      this.renderer.render( this.scene, this.camera );
      this.raf = requestAnimationFrame( this.render.bind(this) );
    },


    ///////////////////////////////////
    //              Events
    ///////////////////////////////////

    mouseCall: function() {
        // calculate objects intersecting the picking ray
        var intersects = this.raycaster.intersectObjects( this.scene.children );
        for(var i=0; i<intersects.length; i++) {
            if(intersects[i].object.name == "CasterTarget") {

                this.target = new Vector3()
                .copy(intersects[i].point)
                .applyAxisAngle( new Vector3( 1, 0, 0 ), Math.PI/2 )
                .applyAxisAngle( new Vector3( 0, 0, 1 ), -this.earth.mesh.rotation.y );

                this.geoCoord = this.earth.getGeoCoord(this.target);
                this.coordDisplay.innerHTML = Math.floor(this.geoCoord.lon*10)/10+ " | "+Math.floor(this.geoCoord.lat*10)/10

                if(this.castLine) {
                    this.castLine.geometry.vertices[1] = intersects[i].point;
                    this.castLine.geometry.verticesNeedUpdate = true;
                }
                break;
            }
        }
    },

    onMouseMove: function( event ) {
      this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    },

    onMouseDown: function(event){
      this.lastMouseDown = Date.now();
    },

    onMouseUp: function(event){
      if( this.geoCoord && this.lastMouseDown && Date.now() - this.lastMouseDown < 100 ) {
        this.lastMouseDown = null;
        GeoData.getCountryFromCoord(this.geoCoord, (cd) => {
          if(cd){
            this.unsetEvents();
            this.showDetail(cd);
          }
        });
      }
    },
    onWindowResize: function() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>

.globe
  &__container
    transition: 1s all ease
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100vh
    &--display
      transform: translateY(0)
    &--hide
      transform: translateY(-100%)
</style>

<template>
  <div class="start" @mousemove="onMouseMove" >
      <p id="warning" v-if="warning">{{ warning }}</p>
      <div class="globe__container" :class="canvasClass">
        <p id="coord-display"></p>
        <div id="canvas" class="globe" @mousedown="onMouseDown" @mouseup="onMouseUp"></div>
      </div>
      <detail v-if="detailActive && cd" :cd="cd" :coord="detailCoord" @close="hideDetail"></detail>
      <timeline @update="updateTimeline"></timeline>
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
import CameraMover from "./../models/CameraMover";

export default {

  components: { Detail, Timeline },

  data: function () {
    return {
      canvas: null,
      detailActive: false,
      cd: null,
      rayCoord: null,
      warning: null,
      detailCoord: null
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
    this.now = Date.now();
    this.renderer.animate( this.render.bind(this) );
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

        this.cameraMover.on("end", this.onMoveFinish.bind(this))
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
      this.blob = new Blob(this.scene, firstTime, GeoData.getWaterElevation());
      if( firstTime ){
        this.$store.state.firstTime = false;
        this.earth.on('noiseEnd', () => {
            this.blob.toScale(1, 10);
        })
      }

    },

    initScene: function() {
      this.canvas = this.$el.querySelector( '#canvas' );
      this.scene = new THREE.Scene();
      this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: 1 } );
      this.renderer.setClearColor( 0x000000, 0 );
      this.renderer.setPixelRatio( window.devicePixelRatio );
      this.renderer.setSize( window.innerWidth, window.innerHeight );
      this.canvas.appendChild( this.renderer.domElement );
      this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 100 );
      this.camera.position.copy(GeoUtil.coordToCart(this.$store.state.coord, 15));
      this.cameraMover = new CameraMover(this.camera);
      this.camera.lookAt(new THREE.Vector3());
      this.controls = new OrbitControls( this.camera );
      this.controls.update();
      this.controls.noPan = false;
    },

    initRaycaster: function() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.earth.createCasterHelper();
        this.scene.add(this.earth.casterHelper);
    },

    initCastLine: function() {
      var material = new THREE.LineBasicMaterial({ color: 0x000000 });
      var geometry = new THREE.Geometry();
      geometry.vertices.push( new THREE.Vector3( -10, 0, 0 ), new THREE.Vector3( -10, 0, 0 ) );

      this.castLine = new THREE.Line( geometry, material );
      this.scene.add( this.castLine );
    },

    showDetail: function(cd) {
      this.cd = cd;
      this.detailActive = true;
    },

    hideDetail: function() {
      this.cd = null;
      this.detailActive = false;
    },

    launchWarning: function(message, duration){
      this.warning = message;
      setTimeout(() => {
        this.warning = null;
      }, duration)
    },

    ///////////////////////////////////
    //              RAF
    ///////////////////////////////////

    render: function() {
      var now = Date.now();
      var delta = now - this.now;
      this.now = now;

      this.counter += 0.1;

      this.raycaster.setFromCamera( this.mouse, this.camera );
      this.mouseCall();

      this.blob.update(this.counter)
      this.earth.update(this.counter, this.target);
      this.cameraMover.update(delta)

      this.renderer.render( this.scene, this.camera );
    },


    ///////////////////////////////////
    //              Events
    ///////////////////////////////////

    updateTimeline(val) {
      this.blob.scaleFromYear(val);
    },

    mouseCall: function() {
        // calculate objects intersecting the picking ray
        var intersects = this.raycaster.intersectObjects( this.scene.children );
        for(var i=0; i<intersects.length; i++) {
            if(intersects[i].object.name == "CasterTarget") {

                this.target = new THREE.Vector3()
                .copy(intersects[i].point)
                .applyAxisAngle( new THREE.Vector3( 1, 0, 0 ), Math.PI/2 )

                if(!this.cameraMover.animate) {
                  this.rayCoord = this.earth.getGeoCoord(this.target);
                  this.coordDisplay.innerHTML = Math.floor(this.rayCoord.lon*10)/10+ " | "+Math.floor(this.rayCoord.lat*10)/10
                }

                break;
            }
        }
    },

    onMoveFinish: function(){
      this.detailCoord = this.cameraMover.coords.end;
      GeoData.getCountryFromCoord(this.detailCoord, (cd) => {
        if(cd){
          this.unsetEvents();
          this.showDetail(cd);
        } else {
          this.launchWarning("Il n'existe pas de données sur ces coordonnées", 5000);
        }
      });
      // this.controls.enabled = true
      // this.controls.update();
    },

    onMouseMove: function( event ) {
      this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    },

    onMouseDown: function(event){
      this.lastMouseDown = Date.now();
    },

    onMouseUp: function(event){
      if( this.rayCoord && this.lastMouseDown && Date.now() - this.lastMouseDown < 100 ) {
        this.lastMouseDown = null;
        this.controls.enabled = false;
        this.cameraMover.moveTo(this.rayCoord)

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

#warning
  position: absolute
  top: 20px
  width: 100%
  left: 0
  text-align: center
  z-index: 999

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

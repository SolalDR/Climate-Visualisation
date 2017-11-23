<template>
  <div class="strate" :style="style" :class="'strate--'+type + ' strate--'+type+'-'+state ">
    <v-map v-if="type !== 'co2'" ref="map" :zoom="country.zoom" :minZoom="country.zoom" :maxZoom="country.zoom" :center="[country.coordMap.lat, country.coordMap.lon]" :dragging="false" >
      <v-tilelayer url="http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"></v-tilelayer>
      <v-geojson :geojson="parseGeo" :options="geoJsonOptions"></v-geojson>
    </v-map>
  </div>
</template>

<script>

import Vue2Leaflet from "vue2-leaflet";

export default {

  props: ["type", "value", "country", "rank", "total", "geojson"],

  components: {
    'v-map': Vue2Leaflet.Map,
    'v-tilelayer': Vue2Leaflet.TileLayer,
    'v-marker': Vue2Leaflet.Marker,
    'v-geojson': Vue2Leaflet.GeoJSON
  },

  computed: {
    parseGeo: function(){
      return JSON.parse(JSON.stringify(this.geojson));
    },
    style: function(){
      if( this.decal && this.opacity ){
        return `transform: scale(${this.scale}) translateY(${this.translateY}px) rotateX(${this.rotateX}deg) rotateZ(${this.rotateZ}deg) translateZ(${this.decal}px); opacity:${this.opacity};`;
      }
      return null
    },

    scale: {
      get: function(){
        if(this.type == 'co2') {
          var prop = this.$store.state.limits.co2[2] / (this.value - this.$store.state.limits.co2[0]) * this.country.pop[this.$store.state.year]/10000;
          return Math.min(2.5, Math.max(0.5, prop));
        }
        return 1;
      }
    },

    opacity: {
      get:function(){

        if(this.type == 'co2') {

          return this.$store.state.limits.co2[2] / (this.value - this.$store.state.limits.co2[0]) * 5;

        } else {
          if ( this.compressState ) {
            return 0;
          } else {
            return 1;
          }
        }

        return null
      }
    }
  },

  data: function(){
    return {
      space: 10,
      decal: null,
      state: 1,
      svg: null,
      boundary: null,
      radius: 2,
      rat: 100,
      rotateX: 0,
      rotateZ: 0,
      translateY: 0,
      geoJsonOptions: {
        style: {
          "color": "#ff7800",
          "weight": 1,
          "opacity": 0.65
        }
      }
    }
  },


  mounted: function() {
    this.decompress();
    this.toggleState();
    setInterval( this.toggleState.bind(this), 4000)
    if(this.$refs.map)
      this.$refs.map.mapObject.dragging.disable();

    if(this.type == "pop") {
      this.managePopulation();
      this.$watch("value", () => {
        this.updateCircles()
      })
    }
    if(this.type == "co2") {
      this.manageCO2();
    }
  },

  methods: {

    toggleState(){
      this.state = this.state == 10 ? 1 : this.state+1;
    },

    removeRandomCircle: function(n, circles) {
      var circle, rank;
      for(var i=0; i<n; i++) {
        rank = Math.floor(Math.random()*circles.length);
        circle = circles[rank];
        circle.parentNode.removeChild(circle)
        if( !circles.length )
          break;
      }
    },

    addRandomCircle: function(n){
      var circle;
      for(var i=0; i<n; i++) {
        circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
        circle.setAttribute("r", this.radius)
        circle.setAttribute("cx", this.boundary.x+Math.random()*this.boundary.width)
        circle.setAttribute("cy", this.boundary.y+Math.random()*this.boundary.height)
        circle.setAttribute("fill", "red")
        circle.setAttribute("mask", "url(#countryMask)");
        this.svg.appendChild(circle)
      }
    },

    updateCircles(){
      var currentPop = this.country.pop ? this.country.pop[this.value] : 0;
      var circles = this.svg.getElementsByTagName("circle");
      var diff = Math.floor(currentPop/this.rat) - circles.length;
      if( diff >= 0 ){
        this.addRandomCircle(diff);
      } else {
        this.removeRandomCircle(diff*-1, circles);
      }
    },

    managePopulation: function() {
      this.svg = this.$el.querySelector("svg.leaflet-zoom-animated");
      var pathEl = this.$el.querySelector(".leaflet-zoom-animated path");
      var mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
      var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      defs.appendChild(mask)
      mask.setAttribute("id", "countryMask")

      // Add defs to g
      this.$el.querySelector(".leaflet-zoom-animated g").appendChild(defs)

      mask.appendChild(pathEl.cloneNode(true))
      this.boundary = pathEl.getBBox();

      var startCount = this.country.pop["2010"]

      if(startCount < 200000) {
        this.radius = 2;
        this.rat = 100;
      } else if(startCount < 400000) {
        this.radius = 4;
        this.rat = 400;
      } else {
        this.radius = 8;
        this.rat = 1600;
      }

      this.updateCircles();
    },

    manageCO2: function() {
      this.rotateX = -60
      this.rotateZ = -10
      this.translateY = -50
    },

    compress: function() {
      this.space = 10;
      this.compressState = true
      this.decal = -1*(this.rank * this.space - ((this.total * this.space)/2))
    },

    decompress: function() {
      this.space = 100;
      this.compressState = false
      this.decal = -1*(this.rank * this.space - ((this.total * this.space)/2))
    }

  }

}
</script>

<style lang="sass">

.strate
  transition: .4s all
  width: 600px
  height: 600px
  position: absolute
  top: 0
  left: 0
  transform: translateZ(0px)
  background-color: transparent

  &--pop, &--co2
    .leaflet-tile-pane
      opacity: 0
  &--map

  &--co2
    //transform: translateZ(100px) rotateX(-70deg) rotateZ(-7deg) !important
    opacity: 1
    background-color: transparent
    height: 200px
    width: 400px
    background-image: url('./../assets/nuage1.png')
    background-repeat: no-repeat
    background-size: contain
    background-position: center
    opacity: 0.3
    &::after, &::before
      content: ""
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background-repeat: no-repeat
      background-size: contain
      background-position: center
      transition: all 10s
    &::after
      background-image: url('./../assets/nuage2.png')
    &::before
      background-image: url('./../assets/nuage2.png')

@for $i from 1 to 10
  .strate--co2-#{$i}
    &::after
      top: random(50) + px
      left: random(80) + px
    &::before
      top: random(50) + px
      left: random(80) + px


.leaflet-container
  background-color: transparent !important

.leaflet-control-zoom
  display: none

.leaflet-control-container
  display: none


</style>

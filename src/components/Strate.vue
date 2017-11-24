<template>
  <div class="strate" :style="style" :class="'strate--'+type + ' strate--'+type+'-'+state ">
    <v-map v-if="type !== 'co2'" ref="map" :zoom="zoom" :minZoom="zoom" :maxZoom="zoom" :center="[country.coordMap.lat, country.coordMap.lon]" :dragging="false" >
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
        return `transform: translateZ(${this.decal}px); opacity:${this.opacity};`;
      }
      return null;
    },

    opacity: {
      get:function(){
        return this.compressState ? 0 : 1;
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
      zoom: 3,
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

    if(this.$refs.map)
      this.$refs.map.mapObject.dragging.disable();

    if(this.type == "pop") {
      this.managePopulation();
      this.$watch("value", () => {
        this.updateCircles()
      })
    }
  },

  methods: {

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

    calcZoomExpected: function(pathEl){
      this.boundary = pathEl.getBBox();
      var value = this.boundary.width/this.$el.offsetWidth
      var count = 0
      while(value < 1) {
        value *= 2
        count ++;
      }
      this.zoom = count
      console.log(this.zoom)
      this.$refs.map.mapObject.setZoom(this.zoom);
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

  &:not(.strate--map)
    background-color: rgba(0, 0, 0, .03)
    .leaflet-tile-pane
      opacity: 0

.leaflet
  &-container
    background-color: transparent !important
  &-control-zoom
    display: none
  &-control-container
    display: none

</style>

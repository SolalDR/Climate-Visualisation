<template>
  <div class="strate" :style="style" :class="'strate--'+type">
    <v-map ref="map" :zoom=3 :minZoom=3 :maxZoom=3 :center="[country.coordMap.lat, country.coordMap.lon]" :dragging="false" >
      <v-tilelayer url="http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"></v-tilelayer>
      <v-geojson :geojson="parseGeo" :options="geoJsonOptions"></v-geojson>
    </v-map>
  </div>
</template>

<script>

import Vue2Leaflet from "vue2-leaflet";

export default {

  props: ["type", "country", "rank", "total", "geojson"],

  components: {
    'v-map': Vue2Leaflet.Map,
    'v-tilelayer': Vue2Leaflet.TileLayer,
    'v-marker': Vue2Leaflet.Marker,
    'v-geojson': Vue2Leaflet.GeoJSON
  },

  computed: {
    parseGeo: function(){
      return JSON.parse(JSON.stringify(this.geojson));
    }
  },

  data: function(){
    return {
      style: null,
      space: 10,
      decal: null,
      opacity: 0,
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
    // if(this.type !== "map")
    this.$refs.map.mapObject.dragging.disable();
    var circles = [];
    var ns = "http://www.w3.org/2000/svg";

    var svg = this.$el.querySelector("svg.leaflet-zoom-animated");
    var pathEl = this.$el.querySelector(".leaflet-zoom-animated path");
    var g = this.$el.querySelector(".leaflet-zoom-animated g");
    var mask = document.createElementNS(ns, "mask");
    var defs = document.createElementNS(ns, "defs");
    defs.appendChild(mask)
    mask.setAttribute("id", "countryMask")
    g.appendChild(defs)

    var maskPath = pathEl.cloneNode(true);
    mask.appendChild(maskPath)
    var boundary = pathEl.getBBox();
    for(var i=0; i<500; i++) {
      circles.push(document.createElementNS(ns, "circle"))
      circles[i].setAttribute("r", 2)
      circles[i].setAttribute("cx", boundary.x+Math.random()*boundary.width)
      circles[i].setAttribute("cy", boundary.y+Math.random()*boundary.height)
      circles[i].setAttribute("fill", "red")
      circles[i].setAttribute("mask", "url(#countryMask)");
      svg.appendChild(circles[i])
    }
  },

  methods: {

    compress: function() {
      this.space = 10;
      this.decal = -1*(this.rank * this.space - ((this.total * this.space)/2))
      this.style = `transform: translateZ(${this.decal}px); opacity:${this.opacity};`;
    },

    decompress: function() {
      this.space = 100;
      this.opacity = 1;
      this.decal = -1*(this.rank * this.space - ((this.total * this.space)/2))
      this.style = `transform: translateZ(${this.decal}px); opacity:${this.opacity};`;
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

.leaflet-container
  background-color: transparent !important

.leaflet-control-zoom
  display: none

.leaflet-control-container
  display: none


</style>

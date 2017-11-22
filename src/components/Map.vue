<template>
  <div class="map" v-if="load">
    <strate :type="'co2'" :rank="0" :total="2" :value="$store.state.year" :country="country" :geojson="geojson"></strate>
    <strate :type="'pop'" :rank="1" :total="2" :value="$store.state.year" :country="country" :geojson="geojson"></strate>
    <strate :type="'map'" :rank="2" :total="2" :value="$store.state.year" :country="country" :geojson="geojson"></strate>
  </div>
</template>

<script>

import Strate from "./Strate";

export default {

  components: { Strate },
  props: ["country"],

  data: function () {
    return {
      geojson: null,
      load: false
    }
  },

  created: function(){
    console.log("Launch request", `/static/countries/${this.country.cd}.geo.json`)
    this.$http.get(`/static/countries/${this.country.cd}.geo.json`).then(response => {
      this.geojson = JSON.parse(response.bodyText);
      this.load = true;
    });
  },

  computed: {
    canvasClass: function(){
      return this.detailActive ? "globe__container--hide" : "globe__container--display"
    }
  },
}
</script>

<style lang="sass">

.map
  position: absolute
  transform: rotateX(70deg) rotateZ(20deg)
  transform-style: preserve-3d
  transform-origin: 170px 250px
  &__container
    position: absolute
    top: calc(50% - 250px)
    left: calc(50% - 250px)
    width: 500px
    height: 500px


</style>

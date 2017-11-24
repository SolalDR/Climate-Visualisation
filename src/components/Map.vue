<template>
  <div>
    <clouds></clouds>
    <div class="map" v-if="load" :style="style">
      <strate :type="'pop'" :rank="1" :total="2" :value="$store.state.year" :country="country" :geojson="geojson"></strate>
      <strate :type="'map'" :rank="2" :total="2" :value="$store.state.year" :country="country" :geojson="geojson"></strate>
    </div>
  </div>
</template>
<!-- <strate :type="'co2'" :rank="0" :total="2" :value="$store.state.year" :country="country" :geojson="geojson"></strate> -->
<script>

import Strate from "./Strate";
import Clouds from "./Cloud";

export default {

  components: { Strate, Clouds },
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
    style: function(){
      var value = -20 + (this.$store.state.year - 1990) / 110 * 40;
      return `transform: rotateX(70deg) rotateZ(${value}deg)`
    }
  },
}
</script>

<style lang="sass">

.map
  position: absolute
  //transition: transform .1s
  transform-style: preserve-3d
  transform-origin: 170px 250px
  &__container
    position: absolute
    top: calc(50% - 250px)
    left: calc(50% - 250px)
    width: 500px
    height: 500px


</style>

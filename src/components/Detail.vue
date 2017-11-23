<template>
  <div class="detail">
    <h1 class="detail__title">{{ country.nameLong }}</h1>
    <button class="detail__back" @click="close"></button>
    <div class="map__container">
      <map3d :country="country"></map3d>
    </div>
  </div>
</template>

<script>

import {Scene, PerspectiveCamera, AmbientLight, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh} from 'three';
import Map3d from "./Map"

export default {

  components: { Map3d },

  props: ["cd", "coord"],

  data: function () {
    return {
      country: {}
    }
  },

  created: function () {
    this.country = this.$store.state.countries[this.cd];
    if( !this.country ){
      this.close();
      return;
    }
    this.country.coordMap = this.coord;
    this.$store.state.currentCountry = this.country;
  },

  methods: {
    close: function(){
      this.$emit("close", true);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>

.detail
  height: 100vh
  padding: 30px
  box-sizing: border-box
  &__back
    position: absolute
    top: 20px
    right: 20px
    height: 50px
    width: 50px
    background-color: #CCC

  &__title
    margin-top: 30px
    text-transform: uppercase
    font-weight: normal
    font-size: 60px

</style>

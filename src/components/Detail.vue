<template>
  <div class="detail">
    <h1 class="detail__title">{{ country.nameLong }}</h1>

    <transition name="slide-right">
      <button class="detail__back" @click="close"></button>
    </transition>
    <transition name="fade" appear>
      <div class="map__container">
        <map3d :country="country"></map3d>
      </div>
    </transition>

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
    top: 30px
    right: 30px
    height: 30px
    width: 30px
    background-color: white
    background-image: url('./../assets/close.png')
    background-position: center
    background-repeat: no-repeat
    background-size: contain
    border: 0
    transition: all .4s
    &:hover
      transform: rotate(45deg)

  &__title
    margin-top: 30px
    text-transform: uppercase
    font-weight: normal
    font-size: 60px

@media screen and (max-width: 1360px)
  .detail__title
    font-size: 30px
    margin-top: 10px


</style>

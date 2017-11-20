<template>
  <div class="detail">
    <h1>{{ country.nameLong }}</h1>
    <h2>{{ country.cd }}</h2>
    <button id="back" @click.stop="toGlobe"></button>
  </div>
</template>

<script>

import {Scene, PerspectiveCamera, AmbientLight, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh} from 'three';

export default {
  props: ["cd"],
  data: function () {
    return {
      country: {}
    }
  },
  mounted: function () {
    this.country = this.$store.state.countries[this.$route.params.cd];
    console.log(this.country)
  },

  methods: {
    toGlobe: function(){
      this.$router.push({ path: "/globe" })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
h1
  color: green

#back
  position: absolute
  top: 20px
  right: 20px
  height: 50px
  width: 50px
  background-color: #CCC
</style>

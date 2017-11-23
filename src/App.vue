<template>
  <div id="app">
    <transition appear name="router" mode="out-in">
      <router-view></router-view>
    </transition>

  </div>
</template>

<script>
import store from 'store'

import { mapActions, mapGetters } from 'vuex'
export default {
  store
}
</script>

<style lang="sass">

@import "style/leaflet.css";
@import "style/app"



</style>

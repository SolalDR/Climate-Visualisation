<template>
  <div id="app">
    <router-view></router-view>
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
@import "style/app"
</style>

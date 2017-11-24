<template>
  <div class="credit">
    <button @click="open" class="credit__button">
      Crédits
    </button>
    <transition name="slide-right">
      <div v-if="display" class="">
        <button @click="close" class="credit-panel__button"></button>
        Yolo les gard
      </div>
    </transition>
  </div>
</template>

<script>

export default {
  methods: {
    close: function(){

    },
    open: function(){

    }
  }
}

</script>

<style lang="sass">

.credit
  position: absolute
  top: 40px
  right: 0
  &__button
    height: 40px
    width: calc(100vh - 80px)
    transform: rotate(-90deg)
    background-color: black
    color: white
    position: relative
    top: calc(50vh - 60px)
    left: 40vh
    border: 0
    font-size: 20px
    left: calc(50% - 20px)

  &-panel__button

</style>

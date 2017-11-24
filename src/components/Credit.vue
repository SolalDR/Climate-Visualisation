<template>
  <div class="credit">


    <transition name="slide-right">
      <div :class="classComputed">
        <a @click="open" @mouseenter="open" class="credit__button">
          <span>Crédits</span>
        </a>
        <button @click="close" class="credit-panel__button"></button>
          <div class="credit__content">

            <div class="credit__block">
              <h2 class="credit__title">Sources</h2>
              <div>
                <a class="credit__link" target="_blank" href="http://data.worldbank.org">http://data.worldbank.org</a><br>
                <a class="credit__link" target="_blank" href="http://esa.un.org">http://esa.un.org</a>
              </div>
            </div>

            <div class="credit__block">
              <h2 class="credit__title">Développement</h2>
              <div>
                <a class="credit__link" target="_blank" href="http://solaldussout-revel.com">Solal Dussout-Revel</a>
              </div>
            </div>

            <div class="credit__block">
              <h2 class="credit__title">Sources</h2>
              <div>
                <a class="credit__link" target="_blank" href="http://data.worldbank.org">Robin Blanc-Beyne</a>
              </div>
            </div>
          </div>
      </div>
    </transition>
  </div>
</template>

<script>

export default {
  data: function() {
    return {
      display: false,
      isMoving: false
    }
  },

  computed: {
    classComputed: function(){
      return this.display ? "credit--display" : "credit--hide"
    }
  },

  methods: {
    move: function(){
      this.isMoving = true;
      setTimeout(()=>{
        this.isMoving = false;
      }, 500)
    },

    close: function(){
      this.display = false
      this.move();
    },
    open: function(){
      if(!this.isMoving) {
        this.display = true
        this.move();
      }
    }
  }
}

</script>

<style lang="sass">

.credit
  position: absolute
  top: 40px
  right: 0
  width: 400px
  height: calc(100vh - 80px)
  &-panel__button
    height: 40px
    width: 40px
    right: 0
    position: absolute
    right: 60px
    top: 20px
    background-image: url("./../assets/close.png")
    background-repeat: no-repeat
    background-size: 70%
    background-position: center
    background-color: transparent
    border: 0

  &__block
    padding-top: 100px
    text-align: left
    padding-left: 80px

  &__link
    text-decoration: none
    color: black

  &__title
    margin-top: 0
  &__button
    width: 40px
    height: calc(100vh - 80px)
    background-color: black
    color: white
    position: absolute
    left: 0
    top: 0
    border: 0
    span
      transform: rotate(-90deg)
      display: inline-block
      top: 50%
      position: relative
      left: -18px
      font-size: 24px
      font-weight: 400

  &--display
    transform: translateX(0)
    height: 100%
    transition: .4s ease
  &--hide
    transform: translateX(360px)
    height: 100%
    transition: .4s ease

  &-panel__button

</style>

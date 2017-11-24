<template>
  <div class="clouds" :style="style">
    <div class="cloud cloud--1" :class="'cloud-state--'+state"></div>
    <div class="cloud cloud--2" :class="'cloud-state--'+state"></div>
    <div class="cloud cloud--3" :class="'cloud-state--'+state"></div>
  </div>
</template>

<script>
  export default {

    computed: {
      style: function(){
        if(this.$store.state.currentCountry && this.$store.state.currentCountry.co2) {
          var co2 = Math.max(0, this.$store.state.currentCountry.co2[this.$store.state.year])*this.$store.state.currentCountry.pop[this.$store.state.year];
          return `opacity: ${Math.min(1, 0.25 + co2 / 5000000)}`;
        }
        return ""
      }
    },

    data: function(){
      return {
        state: 1
      }
    },

    mounted: function(){
      this.state = this.state == 10 ? 1 : this.state+1;
      setInterval( () => {
        this.state = this.state == 10 ? 1 : this.state+1;
      }, 4000)
    },

    methods: {
    }
  }
</script>

<style lang="sass">

.clouds
  position: relative
  .cloud
    background-color: transparent
    height: 200px
    width: 600px
    background-repeat: no-repeat
    background-size: 300px
    background-position: center
    transition: all 10s
    position: absolute
    top: 0
    left: 0
    opacity: 0.6

    @for $i from 1 to 3
      &--#{$i}
        background-image: url('./../assets/nuage#{$i}.png')
        @for $j from 1 to 10
          &.cloud-state--#{$j}
            transform: translateY(#{random(50) - 25 + px}) translateX(#{random(80) - 40 + px}) rotate(#{random(10) - 5 + deg})

</style>


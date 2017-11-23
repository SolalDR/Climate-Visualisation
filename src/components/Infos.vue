<template>
  <div class="infos">
    <div v-if="active && co2" class="info info--white">
      <p class="info__title">Production de CO<span class="exposant">2</span></p>
      <p class="info__value">{{ co2 }}KT / AN</p>
      <span class="info__mention">Depuis 1990</span>
    </div>
    <div v-if="active && pop" class="info info--white">
      <p class="info__title">Population</p>
      <p class="info__value">+{{ pop }}</p>
      <span class="info__mention">Depuis 1990</span>
    </div>
    <div class="info info--white">
      <p class="info__title">Montée des eaux</p>
      <p class="info__value blue">+{{ elevation }}MM</p>
      <span class="info__mention">Depuis 1990</span>
    </div>
    <div class="info__group">
      <p class="info__year">{{ year }}</p>
      <p class="info__temperature">+{{ temperature }}°C</p>
    </div>
  </div>
</template>

<script>
  export default {
    props: ["active", "year", "elevation", "globeTemp"],
    computed: {
      pop: function(){
        if(this.$store.state.currentCountry.pop){
          return this.numberWithSpaces(this.round(this.$store.state.currentCountry.pop[this.$store.state.year]*1000, 2))
        } else {
          return null;
        }
      },
      co2: function(){
        if(this.$store.state.currentCountry.co2){
          return this.numberWithSpaces(this.round(this.$store.state.currentCountry.co2[this.$store.state.year] * this.$store.state.currentCountry.pop[this.$store.state.year], 2))
        } else {
          return null;
        }
      },
      temperature: function(){
        if( this.active && this.$store.state.currentCountry.temperatures ){
          return this.round(this.$store.state.currentCountry.temperatures[this.$store.state.year] - 0.01, 2)
        } else {
          return this.globeTemp;
        }
      }
    },
    methods: {
      round: function(val, number){
        var fact = Math.pow(10, number);
        return Math.floor(val*fact)/fact;
      },
      numberWithSpaces: function(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return parts.join(".");
      }
    }
  }
</script>

<style lang="sass">

.infos
  position: fixed
  bottom: 0
  left: 0
  z-index: 999
  bottom: 98px
  border: 2px solid black
  border-top: 0
  padding: 0
  min-width: 350px

.info
  padding: 20px
  &__title
    text-transform: uppercase
    font-size: 24px
    padding-top: 10px
    margin: 0
  &--white
    border-top: 2px solid black

  &__value
    font-weight: bold
    padding-top: 5px
    font-size: 24px
    margin: 0
  &__mention
    color: black
    text-transform: uppercase
    margin-top: 5px
    display: block

  &__year
    float: left
    background-color: black
    color: white
    padding: 20px
    font-size: 40px
    letter-spacing: 0px
    margin: 0
    width: 60%
    text-align: center
    line-height: 25px
    padding-top: 25px
  &__temperature
    float: left
    margin: 0
    padding: 25px
    width: 40%
    text-align: center
    font-size: 20px
    font-weight: bold
    border-top: 2px solid black
    height: 70px
    color: #dd2d2d
</style>

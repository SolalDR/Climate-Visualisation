<template>
  <div class="infos">
    <transition-group name="list" tag="div">
      <div v-if="needInfoDetail && co2" class="info info--white" v-bind:key="1">
        <p class="info__title">Production de CO<span class="exposant">2</span></p>
        <p class="info__value">{{ co2 }}KT / AN</p>
        <span class="info__mention">Depuis 1990</span>
      </div>
      <div v-if="needInfoDetail && pop" class="info info--white" v-bind:key="2">
        <p class="info__title">Population</p>
        <p class="info__value">{{ pop }}</p>
      </div>
    </transition-group>
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
    props: ["detailActive", "year", "elevation", "globeTemp"],
    computed: {
      needInfoDetail: function(){
        return this.detailActive && this.$store.state.currentCountry ? true : false;
      },
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
        if( this.needInfoDetail && this.$store.state.currentCountry.temperatures ){
          return this.round(this.$store.state.currentCountry.temperatures[this.$store.state.year] - 0.01, 2)
        } else {
          return this.globeTemp;
        }
      }
    },
    methods: {
      round: function(val, number){
        let fact = Math.pow(10, number);
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
.list-enter-active, .list-leave-active
  transition: all 1s

.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */
  transform: translateX(-100%)



$font-size: 24px
$font-size-small: 18px

$wrapper: 350px
$wrapper-small: 230px

$padding: 20px
$padding-small: 10px

.infos
  position: fixed
  bottom: 0
  left: 0
  z-index: 999
  bottom: 98px

  border-top: 0
  padding: 0
  width: $wrapper

.info
  padding: 20px
  border: 2px solid black
  &__title
    text-transform: uppercase
    font-size: $font-size
    margin: 0

  &--white
    border-bottom: 0px solid black
    background-color: white

  &__value
    font-weight: bold
    padding-top: 5px
    font-size: $font-size
    margin: 0

  &__mention
    color: black
    text-transform: uppercase
    margin-top: 5px
    display: block
    font-size: $font-size-small

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
    height: 70px

  &__temperature
    float: left
    margin: 0
    padding: 25px 0
    width: 40%
    text-align: center
    font-size: 20px
    font-weight: bold
    border-right: 2px solid black
    border-top: 2px solid black
    height: 70px
    color: #dd2d2d
    background-color: white

@media screen and (max-width: 1360px)
  .infos
    width: $wrapper-small
    bottom: 78px
  .info
    padding: 15px 20px
    &__title, &__value
      font-size: $font-size-small
    &__year
      font-size: 30px
      width: 50%
    &__temperature
      width: 50%
    &__mention
      font-size: 13px


</style>

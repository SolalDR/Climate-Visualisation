<template>
  <div class="start">
    <div class="frame center--vertical">
      <div class="start__container ">
        <p class="start__intro">Une exploration visuelle de différents phénomènes liés à l'évolution de climat selon un scénario probable. Elle met en influence des pays dans l'augmentation globale et permet de repérer les zones les plus à risque.</p>
        <div class="text-center">
          <router-link class="start__button" to="/globe">Commencer</router-link>
        </div>

      </div>
      <div class="start__credit">

      </div>
    </div>
    <p>
    </p>
  </div>
</template>

<script>
export default {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
h1
  color: green

.frame
  padding: 4%
  text-align: center
  height: 100vh

.start
  &__container
    width: 60%
    min-width: 300px
    max-width: 900px
    margin: auto
    display: inline-block
    text-align: left
    padding-bottom: 40px

  &__button
    text-decoration: none
    color: white
    background-color: black
    padding: 15px 40px 15px 80px
    height: 50px
    margin-top: 20px
    display: inline-block
    position: relative
    &::before
      content: ""
      height: 50px
      width: 50px
      border-right: 1px solid white
      display: block
      position: absolute
      top: 0
      left: 0


.center--vertical
  flex-direction: column
  display: flex
  justify-content: center


</style>

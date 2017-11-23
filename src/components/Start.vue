<template>
  <div class="start">
    <div class="frame center--vertical">
      <svg version="1.1" id="bg_frame" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;"
       xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 600"
       style="enable-background:new 0 0 1000 600;" xml:space="preserve">
        <line id="left-line" class="st0" x1="30" y1="0" x2="30" y2="600"/>
        <line id="right-line" class="st0" x1="970" y1="0" x2="970" y2="600"/>
        <line id="top-line" class="st0" x1="0" y1="29.5" x2="1000" y2="32"/>
        <line id="bottom-line" class="st0" x1="0" y1="570" x2="1000" y2="572.4"/>
      </svg>

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
export default {
  mounted: function(){
    this.updateSize();
    window.addEventListener("resize", () => {
      this.updateSize();
    })
  },
  methods: {
    updateSize: function(){
      var svg = this.$el.querySelector("#bg_frame");
      svg.setAttribute("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`)
      var left = this.$el.querySelector("#left-line");
      var right = this.$el.querySelector("#right-line");
      var top = this.$el.querySelector("#top-line");
      var bottom = this.$el.querySelector("#bottom-line");

      left.setAttribute("y2", window.innerHeight)
      top.setAttribute("x2", window.innerWidth)

      right.setAttribute("y2", window.innerHeight)
      right.setAttribute("x1", window.innerWidth - 30)
      right.setAttribute("x2", window.innerWidth - 30)

      bottom.setAttribute("y2", window.innerHeight - 30)
      bottom.setAttribute("y1", window.innerHeight - 30)
      bottom.setAttribute("x2", window.innerWidth)
    }
  }
}
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
    max-width: 600px
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

#bg_frame
  position: absolute
  height: 100vh
  width: 100%
  top: 0
  left: 0
  .st0
    stroke: #000

.center--vertical
  flex-direction: column
  display: flex
  justify-content: center


</style>

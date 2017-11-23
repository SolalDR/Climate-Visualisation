<template>
  <div class="range-slider__container">
    <div class="range-slider">
      <span class="range-slider__limit range-slider__start">{{ start }}</span>
      <input class="range-slider__range" @input.stop="update" @mousedown.stop="" type="range" :value="value" :min="start" :max="end">
      <span class="range-slider__limit range-slider__end">{{ end }}</span>
    </div>
  </div>
</template>

<script>
export default {

  data: function(){
    return {
      range: null,
      valueEl: null,
      value: 2017,
      start: 1990,
      end: 2100
    }
  },

  mounted: function(){
    this.range = this.$el.querySelector('.range-slider__range')
    this.$store.state.year = this.value;
  },

  methods: {
    update: function(val){
      this.value = this.range.value;
      this.$store.state.year = this.value;
      this.$emit("update", this.value);
    }
  }

}
</script>



<style lang="scss">
  // Base Colors
$shade-10: #2c3e50 !default;
$shade-1: #000000 !default;
$shade-0: #fff !default;
$teal: #1abc9c !default;

.range-slider__limit {
  position: absolute;
  top: 0px;
  font-size: 25px;
}
.range-slider__start {
  left: -70px;
}
.range-slider__end {
  right: -70px;
}

// Reset
* {
  &,
  &:before,
  &:after {
    box-sizing: border-box;
  }
}

body {
  font-family: sans-serif;
  padding: 60px 20px;

  @media (min-width: 600px) {
    padding: 60px;
  }
}

.range-slider {
  margin: 0;
}

// Range Slider
$range-width: 100% !default;

$range-handle-color: #9cc6f0 !default;
$range-handle-color-hover: darken(#9cc6f0, 10%) !default;
$range-handle-size: 20px !default;

$range-track-color: $shade-1 !default;
$range-track-height: 5px !default;

$range-label-color: #9cc6f0 !default;
$range-label-width: 60px !default;

.range-slider {
  width: $range-width;
}

.range-slider__container {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 45px 15%;
  z-index: 999;
  height: 100px;
  box-sizing: border-box;
  border-top: 2px solid black;
  background-color: white;
}

.range-slider__range {
  -webkit-appearance: none;
  width: 100%;
  height: $range-track-height;
  border-radius: 5px;
  background: $range-track-color;
  outline: none;
  padding: 0;
  margin: 0;

  // Range Handle
  &::-webkit-slider-thumb {
    appearance: none;
    width: $range-handle-size;
    height: $range-handle-size;
    border-radius: 50%;
    background: $range-handle-color;
    cursor: pointer;
    transition: background .15s ease-in-out;

    &:hover {
      background: $range-handle-color-hover;
    }
  }

  &:active::-webkit-slider-thumb {
    background: $range-handle-color-hover;
  }

  &::-moz-range-thumb {
    width: $range-handle-size;
    height: $range-handle-size;
    border: 0;
    border-radius: 50%;
    background: $range-handle-color;
    cursor: pointer;
    transition: background .15s ease-in-out;

    &:hover {
      background: $range-handle-color-hover;
    }
  }

  &:active::-moz-range-thumb {
    background: $range-handle-color-hover;
  }
}


// Range Label
.range-slider__value {
  display: inline-block;
  position: relative;
  width: $range-label-width;
  color: $shade-0;
  line-height: 20px;
  text-align: center;
  border-radius: 3px;
  background: $range-label-color;
  padding: 5px 10px;
  margin-left: 8px;

  &:after {
    position: absolute;
    top: 8px;
    left: -7px;
    width: 0;
    height: 0;
    border-top: 7px solid transparent;
    border-right: 7px solid $range-label-color;
    border-bottom: 7px solid transparent;
    content: '';
  }
}


// Firefox Overrides
::-moz-range-track {
    background: $range-track-color;
    border: 0;
}

input::-moz-focus-inner,
input::-moz-focus-outer {
  border: 0;
}

@media screen and (max-width: 1360px) {
  .range-slider__container {
    padding: 30px 15%;
    height: 80px;
  }
}
</style>

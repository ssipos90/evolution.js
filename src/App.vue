<template>
  <div id="app">
    <div id="grid" ref="grid" :style="gridStyle">
      <div v-for="({row, column, item}, i) in flatLand" :key="i"
           :style="{gridColumnStart: column , gridRowStart: row}"></div>
    </div>
  </div>
</template>

<script>
import {createLand} from '@/ceva';
let active = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;
function dragStart (e) {
  if (e.type === 'touchstart') {
    initialX = e.touches[0].clientX - xOffset;
    initialY = e.touches[0].clientY - yOffset;
  } else {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
  }

  if (e.target === dragItem) {
    active = true;
  }
}

function dragEnd (e) {
  initialX = currentX;
  initialY = currentY;

  active = false;
}

function drag (e) {
  if (active) {
    if (e.type === 'touchmove') {
      e.preventDefault();

      currentX = e.touches[0].clientX - initialX;
      currentY = e.touches[0].clientY - initialY;
    } else {
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
    }

    xOffset = currentX;
    yOffset = currentY;

    setTranslate(currentX, currentY, dragItem);
  }
}

function setTranslate (xPos, yPos, el) {
  el.style.transform = 'translate3d(' + xPos + 'px, ' + yPos + 'px, 0)';
}

export default {
  name: 'App',
  data () {
    const mul = 3;
    const x = 9 * mul;
    const y = 16 * mul;

    return {
      scale: 1,
      x,
      y,
      land: createLand(x, y),
      scrollFn: e => {
        this.handleScroll(e);
      }
    };
  },
  computed: {
    flatLand () {
      return this.land
        .reduce((carry, rowItems, row) => carry.concat(
          rowItems.map((item, column) => ({
            row: row + 1,
            column: column + 1,
            item
          }))
        ), []);
    },
    gridStyle () {
      return {
        'grid-template-rows': (100 / this.x) + '%',
        'grid-template-columns': (100 / this.y) + '%',
        'transform': 'scale(' + this.scale + ')'
      };
    }
  },
  methods: {
    handleScroll (e) {
      if (e.deltaY > 0 && this.scale > 1) {
        this.scale /= 1.1;
      } else if (e.deltaY < 0 && this.scale < 2) {
        this.scale *= 1.1;
      }
    },
    handlePinch (e) {

    }
  },
  mounted () {
    this.$el.addEventListener('wheel', this.scrollFn);
    this.$el.addEventListener('touchstart', dragStart, false);
    this.$el.addEventListener('touchend', dragEnd, false);
    this.$el.addEventListener('touchmove', drag, false);
    this.$el.addEventListener('mousedown', dragStart, false);
    this.$el.addEventListener('mouseup', dragEnd, false);
    this.$el.addEventListener('mousemove', drag, false);
  },
  destroyed () {
    this.$el.removeEventListener('wheel', this.scrollFn);
  }
};
</script>

<style lang="stylus">
  body, html
    height: 100%

  body
    margin: 0

  #app
    font-family: 'Avenir', Helvetica, Arial, sans-serif
    -webkit-font-smoothing: antialiased
    -moz-osx-font-smoothing: grayscale
    color: #2c3e50
    height: 100%
    width: 100%
    overflow hidden
    position: relative
    #grid
      position: absolute
      display: grid
      transform: scale(1)
      touch-action: none
      user-select: none
      > div
        box-sizing: border-box
        height: 20px
        width: 20px;
        background-color: pink
        border: 1px solid blue
        grid-row-end: span 1
        grid-column-end: span 1
</style>

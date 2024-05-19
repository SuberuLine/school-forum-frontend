<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconClassName"></use>
  </svg>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  // 添加自定义类名
  className: {
    type: String,
    default: ''
  },
  // iconfont中的名字
  iconName: {
    type: String,
    required: true
  },
  isButton: {
    type: Boolean,
    default: false
  }
})

const svgClass = computed(() => {
  if (props.className) {
    return `svg-icon ${ props.className }`
  } else if (props.isButton) {
    return `svg-icon ${ props.className } button`
  } else {
    return 'svg-icon'
  }
})
const iconClassName = computed(() => `#${ props.iconName }`)
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 2em;
  height: 2em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.button {
  cursor: pointer;
  :hover {
    color: #409eff;
  }
}
</style>

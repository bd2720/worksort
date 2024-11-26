<script setup>
import { getFavicon } from '../util.js'

const props = defineProps({
  url: String, // url to get favicon of
  size: Number // side length in px
})
</script>

<template>
  <img :src="getFavicon(props.url, props.size)" alt="-----" :width="props.size" :height="props.size">
</template>
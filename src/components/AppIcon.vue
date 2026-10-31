<template><image :src="`/static/icons/${name}.svg`" :style="{width:size+'rpx',height:size+'rpx'}" mode="aspectFit" /></template>
<script setup lang="ts">withDefaults(defineProps<{name:string,size?:number}>(),{size:40})</script>

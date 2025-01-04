<template>
  <div id="sheet-box"></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import "@sheet/style/index.scss"
import sheet from "@sheet/index"

onMounted(()=>{
  sheet.create({
    container:'sheet-box',
  })
})

</script>

<style lang="scss">
#sheet-box {
  width: 100vw;
  height: 100vh;
  // border: 1px solid #000;
}
</style>

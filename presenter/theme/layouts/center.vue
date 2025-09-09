<script setup lang="ts">
import { computed } from "vue";
import { handleBackground } from "../layoutHelper";

const props = defineProps({
  background: {
    default: "./assets/center.png",
  },
});

const style = computed(() => handleBackground(props.background, true));
</script>

<template>
  <div
    class="slidev-layout center h-full grid place-content-center"
    :style="style"
  >
    <div class="my-auto">
      <slot />
    </div>
  </div>
</template>

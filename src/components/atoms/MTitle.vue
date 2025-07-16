<script setup lang="ts">
import { computed } from 'vue';

type ALIGN = 'left' | 'center' | 'right'
const props = withDefaults(
  defineProps<{align?: ALIGN; class?: string}>(),
  { align: 'left' }
);
const classes = computed(() => {
  return [`text-${props.align}`, props.class];
});
</script>
<template>
  <h2
    class="text-lg font-semibold mb-4"
    :class="classes"
  ><slot></slot></h2>
</template>

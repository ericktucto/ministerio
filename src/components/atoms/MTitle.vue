<script setup lang="ts">
import { computed } from 'vue';

type ALIGN = 'left' | 'center' | 'right'
type SIZE = 'sm' | 'lg' | 'base'
const props = withDefaults(
  defineProps<{align?: ALIGN; class?: string, size?: SIZE}>(),
  { align: 'left', size: 'lg' }
);
const classes = computed(() => {
  return [`text-${props.align}`, `text-${props.size}`, props.class];
});
</script>
<template>
  <h2
    class="font-semibold"
    :class="classes"
  ><slot></slot></h2>
</template>

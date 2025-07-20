<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue';
import { Gps01Icon, Settings02Icon } from '@hugeicons/core-free-icons';
defineEmits(['myLocation']);
</script>
<template>
  <div class="absolute top-0 z-1000 w-full h-[4rem] flex gap-2 p-2">
    <input
      type="text"
      class="flex-1 h-full rounded-full bg-white px-4"
      placeholder="Buscar revisita o lugar..."
    />
    <button
      type="button"
      class="p-2 rounded-full bg-white w-12 h-12 grid place-items-center"
    ><HugeiconsIcon
      class="w-6 h-6"
      :icon="Gps01Icon"
      @click="$emit('myLocation')"
    /></button>
    <button
      type="button"
      class="p-2 rounded-full bg-white w-12 h-12 grid place-items-center"
    ><HugeiconsIcon class="w-6 h-6" :icon="Settings02Icon" /></button>
  </div>
</template>

<script setup lang="ts">
import MBadge from '@/components/atoms/MBadge.vue';
defineProps<{ text: string }>()
defineEmits<{
  focused: [e: Event],
  clicked: [e: Event],
}>();
</script>
<template>
  <div
    class="p-4 bg-white"
    @focus="$emit('focused', $event)"
    @click="$emit('clicked', $event)"
    tabindex="0"
  >
    <span class="flex items-center justify-between gap-2">
      <span>{{ text }}</span>
      <MBadge class="text-xs" text="Ubicar" icon="Location01Icon" />
    </span>
  </div>
</template>

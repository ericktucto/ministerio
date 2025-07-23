<script setup lang="ts">
import MBadge from '@/components/atoms/MBadge.vue';
withDefaults(
  defineProps<{ text: string, details?: string }>(),
  { details: '' }
)
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
      <strong>{{ text }}</strong>
      <MBadge class="text-xs" text="Ubicar" icon="Location01Icon" />
    </span>
    <p class="max-h-6 text-s text-gray-500 max-w-[300px] overflow-hidden text-nowrap text-ellipsis">{{ details }}</p>
  </div>
</template>

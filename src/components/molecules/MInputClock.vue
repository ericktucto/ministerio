<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue';
import { Clock01Icon } from '@hugeicons/core-free-icons';
import { inject } from 'vue';
import { modalKey } from '@/modalfloat';

const injected = inject(modalKey);
if (!injected) {
    throw new Error('Error inject modal');
}
const { getModal } = injected;

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

async function onOpen() {
  const response = await getModal<{ time: string }>(
    'timeselect', { time: props.modelValue }
  );
  if ('error' in response) {
    return;
  }
  emit('update:modelValue', response.time);
}
</script>
<template>
  <span
    class="border border-blue-500 flex items-center gap-2 w-full rounded-md px-3 py-2"
    @click="onOpen"
  >
    <HugeiconsIcon
      class="text-blue-500"
      :icon="Clock01Icon"
      :size="16"
      :strokeWidth="2"
    />
    <span>{{ modelValue }}</span>
  </span>
</template>

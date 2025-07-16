<script setup lang="ts">
import{ computed } from 'vue';
const props = defineProps<{ modelValue: string, label: string, class?: string }>()
const classes = computed(() => {
  return [props.class];
});
</script>
<template>
  <label class="relative block" :class="classes">
    <input
      :value="modelValue"
      class="
        peer w-full border rounded-md px-3 py-2
        border-blue-500
        focus:outline-none
        focus:border-blue-500
        placeholder-shown:border-gray-300
      "
      placeholder=""
      type="text"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span
      class="
        absolute bg-white px-1 transition-all duration-150 ease-in-out translate-y-[-50%]
        top-0
        left-0
        scale-75
        text-blue-500
        peer-placeholder-shown:top-1/2
        peer-placeholder-shown:left-3
        peer-placeholder-shown:scale-100
        peer-placeholder-shown:text-base
        peer-placeholder-shown:text-gray-500
        peer-focus:top-0
        peer-focus:left-0
        peer-focus:scale-75
        peer-focus:text-blue-500
      "
    >{{ label }}</span>
  </label>
</template>

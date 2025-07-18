<script setup lang="ts">
defineProps<{ active: boolean }>()
</script>
<template>
  <!-- Fondo opaco oscuro -->
  <div v-show="active" class="fixed inset-0 flex items-end justify-center z-2000">
    <div class="w-full h-full absolute bg-black/40" @click="$emit('close')"></div>
      <div class="relative w-full bg-white rounded-t-2xl p-4 shadow-lg">
      <!-- Barra superior del modal -->
      <div class="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>
      <!-- Aquí irían los controles (omitidos) -->
      <slot></slot>
      <!-- Espacio reservado -->
      <div class="h-40"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import { modalKey } from '@/modal';
import MTitle from '@/components/atoms/MTitle.vue';
import MInput from '@/components/atoms/MInput.vue';
import Revisita from '@/models/revisita';

const injected = inject(modalKey);
if (!injected) {
    throw new Error('Error inject modal');
}
const { resolveModal } = injected;

const name = ref('');
function onClick() {
  const rev = new Revisita();
  rev.setName(name.value);
  resolveModal(rev);
  name.value = '';
}
</script>
<template>
  <MTitle align="center">Nueva Revisita</MTitle>
  <MInput v-model="name" class="w-full mb-4" label="Nombre completo" />
  <button
      type="button"
      class="rounded bg-blue-500 text-white px-4 py-2 w-full"
      @click="onClick"
  >Crear</button>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { modalKey, type ModalError } from '@/modal';
import Revisita from '@/models/revisita';
import RevisitaRepository from '@/repositories/revisita';

const injected = inject(modalKey);
if (!injected) {
    throw new Error('Error inject modal');
}
const { getModal } = injected;

defineProps<{
  lat: number,
  lng: number,
}>();
const emit = defineEmits<{
  newRevisita: [revisita: Revisita],
}>();
async function onNewRevisita(lat: number, lng: number) {
  const revisita = await getModal<Revisita | ModalError>('newrevisita');
  if ('error' in revisita) {
    return;
  }
  revisita.setLat(lat);
  revisita.setLng(lng);
  const repo = new RevisitaRepository();
  emit(
    'newRevisita',
    await repo.save(revisita)
  );
}
</script>
<template>
  <button
    class="p-2 rounded bg-blue-500 text-white"
    @click="() => onNewRevisita(lat, lng)"
  >Agregar revisita</button>
</template>

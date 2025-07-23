<script setup lang="ts">
import { inject } from 'vue';
import * as L from 'leaflet';
import { modalKey, type ModalError } from '@/modal';
import Revisita from '@/models/revisita';
import RevisitaRepository from '@/repositories/revisita';

const injected = inject(modalKey);
if (!injected) {
    throw new Error('Error inject modal');
}
const { getModal } = injected;

defineProps<{
  popup: L.Popup,
}>();
const emit = defineEmits<{
  newRevisita: [revisita: Revisita],
}>();
async function onNewRevisita(popup: L.Popup) {
  const latlng = popup.getLatLng();
  if (!latlng) {
    return;
  }
  const lat = latlng.lat;
  const lng = latlng.lng;
  const revisita = await getModal<Revisita | ModalError>('newrevisita', { lat, lng });
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
    @click="() => onNewRevisita(popup)"
  >Agregar revisita</button>
</template>

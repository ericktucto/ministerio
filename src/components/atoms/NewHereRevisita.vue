<script setup lang="ts">
import { inject } from 'vue';
import * as L from 'leaflet';
import { modalKey, type ModalError } from '@/modal';
import Revisita from '@/models/revisita';
import RevisitaRepository from '@/repositories/revisita';
import Cita from '@/models/cita';
import CitaRepository from '@/repositories/cita';

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
interface ModalResponse {
  revisita: Revisita;
  cita: Cita;
}
async function onNewRevisita(popup: L.Popup) {
  const latlng = popup.getLatLng();
  if (!latlng) {
    return;
  }
  const lat = latlng.lat;
  const lng = latlng.lng;
  const result = await getModal<ModalResponse | ModalError>('newrevisita', { lat, lng });
  if ('error' in result) {
    return;
  }
  const revisita = result.revisita;
  const cita = result.cita;
  revisita.setLat(lat);
  revisita.setLng(lng);
  const repo = new RevisitaRepository();
  const rev = await repo.save(revisita);

  cita.setRevisitaId(rev.getId());
  (new CitaRepository).save(cita);
  emit(
    'newRevisita',
    rev
  );
}
</script>
<template>
  <button
    class="p-2 rounded bg-blue-500 text-white"
    @click="() => onNewRevisita(popup)"
  >Agregar revisita</button>
</template>

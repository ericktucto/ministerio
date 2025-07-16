<script setup lang="ts">
import { nextTick, ref, inject, onMounted } from 'vue';
import * as L from 'leaflet';
import MTitle from '@/components/atoms/MTitle.vue';
import ViewMap from '@/components/atoms/ViewMap.vue';
import Revisita from '@/models/revisita';
import RevisitaRepository from '@/repositories/revisita';
import { modalKey, type ModalError } from '@/modal';

const injected = inject(modalKey);
if (!injected) {
    throw new Error('Error inject modal');
}
const { getModal } = injected;

const addrev = ref<HTMLElement | null>(null);
const map = ref<InstanceType<typeof ViewMap> | null>(null);
const popup = ref<L.Popup | null>(null);
const Lat = ref(40.4165);
const Lng = ref(-3.70256);
let _map: L.Map | null = null;

function onTouched(e: L.LeafletMouseEvent, map: L.Map) {
  if (addrev.value === null) {
    return;
  }
  popup.value = L.popup()
    .setLatLng([e.latlng.lat, e.latlng.lng])
    .setContent(addrev.value)
    .openOn(map);
  _map = map;
  Lat.value = e.latlng.lat;
  Lng.value = e.latlng.lng;
}
async function onNewRevisita() {
  const revisita = await getModal<Revisita | ModalError>('newrevisita');
  if (_map && popup.value) {
    _map.closePopup((popup.value as L.Popup))
  }
  if ('error' in revisita) {
    return;
  }
  revisita.setLat(Lat.value);
  revisita.setLng(Lng.value);
  const repo = new RevisitaRepository();
  await repo.save(revisita);
}
async function loadRevisitas() {
  const repo = new RevisitaRepository();
  const revisitas = await repo.all();
  if (!map.value) {
    await nextTick();
    if (!map.value) {
      throw new Error("No exist map");
    }
  }
  const marks: L.Marker[] = [];
  revisitas.forEach((revisita) => {
    const latlng = L.latLng(revisita.getLat(), revisita.getLng());
    const mark = L.marker(latlng);
    mark.bindPopup(`<strong>${revisita.getName()}</strong>`);
    marks.push(mark);
  });
  map.value.setMarks(marks);
}
onMounted(() => {
  loadRevisitas();
});
</script>
<template>
  <div class="grid h-full containermap">
    <MTitle class="p-4">Mapa</MTitle>
    <template>
      <div ref="addrev" class="flex py-3">
        <!-- Pasarlo a un componente -->
        <button
          class="p-2 rounded bg-blue-500 text-white"
          @click="onNewRevisita"
        >Agregar revisita</button>
      </div>
    </template>
    <ViewMap
      ref="map"
      class="h-full"
      @touched="onTouched"
      :lat="Lat"
      :lng="Lng"
    />
  </div>
</template>
<style>
.containermap {
    grid-template-rows: 3.75rem 1fr;
}
</style>

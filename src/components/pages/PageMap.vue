<script setup lang="ts">
import { nextTick, ref, onMounted } from 'vue';
import * as L from 'leaflet';
import MTitle from '@/components/atoms/MTitle.vue';
import ViewMap from '@/components/atoms/ViewMap.vue';
import RevisitaRepository from '@/repositories/revisita';
import NewHereRevisita from '@/components/atoms/NewHereRevisita.vue';
import type Revisita from '@/models/revisita';
import { revisitaToMarker } from '@/adapters';
import { HugeiconsIcon } from '@hugeicons/vue';
import { User03Icon } from '@hugeicons/core-free-icons';

// dom references
const addrev = ref<HTMLElement | null>(null);
const info = ref<HTMLElement | null>(null);
const map = ref<InstanceType<typeof ViewMap> | null>(null);

// objects leaflet
const popup = L.popup();

// refs
const Lat = ref(40.4165);
const Lng = ref(-3.70256);
const currentRevisita = ref<Revisita | null>(null);

function onTouched(e: L.LeafletMouseEvent, map: L.Map) {
  popup
    ?.setLatLng(e.latlng)
    ?.openOn(map);
  Lat.value = e.latlng.lat;
  Lng.value = e.latlng.lng;
}
async function loadRevisitas() {
  const repo = new RevisitaRepository();
  const revisitas = await repo.all();
  map.value?.setMarkers(
    revisitas.map((revisita) => {
      const mark = revisitaToMarker(revisita)
      mark.on('click', () => onClickMarker(revisita));
      return mark;
    })
  );
}
function onClickMarker(revisita: Revisita) {
  currentRevisita.value = revisita;
}
function onNewRevisita(revisita: Revisita) {
  popup?.close();
  map.value?.addMarker(
    revisitaToMarker(revisita)
  );
}
async function boot() {
  await nextTick();
  popup.setContent((addrev.value as HTMLElement));
  loadRevisitas();
}
onMounted(() => {
  boot();
});
</script>
<template>
  <div class="grid h-full containermap relative">
    <MTitle class="p-4">Mapa</MTitle>
    <template>
      <div ref="addrev" class="flex py-3">
        <NewHereRevisita
          :lat="Lat"
          :lng="Lng"
          @newRevisita="onNewRevisita"
        />
      </div>
    </template>
    <ViewMap
      ref="map"
      class="h-full"
      @touched="onTouched"
      :lat="Lat"
      :lng="Lng"
    />
    <div
      ref="info"
      v-show="currentRevisita"
      class="absolute w-full bottom-6 z-2000 bg-transparent px-4"
    >
      <div class="flex gap-2 p-4 bg-white rounded-xl">
        <div
          class="w-12 h-12 rounded-full bg-blue-500 flex justify-center items-center text-white"
        >
          <HugeiconsIcon
            :icon="User03Icon"
            :size="24"
            :strokeWidth="1.5"
          />
        </div>
        <div>
          <MTitle>{{ currentRevisita?.getName() }}</MTitle>
          <button
            class="py-2 px-4 rounded bg-red-500 text-white"
          >Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.containermap {
    grid-template-rows: 3.75rem 1fr;
}
</style>

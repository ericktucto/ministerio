<script setup lang="ts">
import { nextTick, ref, onMounted } from 'vue';
import * as L from 'leaflet';
import ViewMap from '@/components/atoms/ViewMap.vue';
import RevisitaRepository from '@/repositories/revisita';
import NewHereRevisita from '@/components/atoms/NewHereRevisita.vue';
import type Revisita from '@/models/revisita';
import { revisitaToMarker } from '@/adapters';
import CardInfo from '@/components/organisms/CardInfo.vue';
import TopActionMap from '@/components/organisms/TopActionMap.vue';

// dom references
const addrev = ref<HTMLElement | null>(null);
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
async function onNewRevisita(revisita: Revisita) {
  popup?.close();
  map.value?.addMarker(
    revisitaToMarker(revisita)
  );
  await loadRevisitas();
}
async function onDeleteRevisita() {
  const repo = new RevisitaRepository();
  const response = confirm('¿Borrar revisita?');
  if (response) {
    await repo.delete((currentRevisita.value?.getId() as string));
    currentRevisita.value = null;
    await loadRevisitas();
  }
}
async function boot() {
  await nextTick();
  popup.setContent((addrev.value as HTMLElement));
  await loadRevisitas();
}
onMounted(() => {
  boot();
});
</script>
<template>
  <div class="grid h-full containermap relative">
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
      gps
      :lat="Lat"
      :lng="Lng"
    />
    <TopActionMap
      @myLocation="() => map?.goToMyLocation()"
    />
    <CardInfo
      :revisita="(currentRevisita as Revisita)"
      @trash="onDeleteRevisita"
    />
  </div>
</template>
<style>
</style>

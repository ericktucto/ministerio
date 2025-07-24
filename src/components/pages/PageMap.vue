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
import type Cita from '@/models/cita';
import CitaRepository from '@/repositories/cita';

// dom references
const addrev = ref<HTMLElement | null>(null);
const map = ref<InstanceType<typeof ViewMap> | null>(null);

// objects leaflet
const popup = ref(L.popup());

// refs
const currentRevisita = ref<Revisita | null>(null);
const currentCita = ref<Cita | null>(null);

function onTouched(e: L.LeafletMouseEvent, map: L.Map) {
  setCurrentRevisita(null);
  popup.value
    ?.setLatLng(e.latlng)
    ?.openOn(map);
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
async function lastCita(revisita: Revisita): Promise<Cita|null> {
  const repo = new CitaRepository();
  const result = await repo.all()
  const citas = result
    .filter((cita) => cita.getRevisitaId() == revisita.getId())
    .sort(
      (citaA, citaB) => citaA.getDateObj().getTime() - citaB.getDateObj().getTime()
    );
  return citas.length > 0 ? citas[0] : null;
}
async function setCurrentRevisita(revisita: Revisita|null) {
  if (revisita === null) {
    currentRevisita.value = null;
    currentCita.value = null;
    return;
  }
  currentRevisita.value = revisita;
  currentCita.value = await lastCita(revisita);
}
async function onClickMarker(revisita: Revisita) {
  await setCurrentRevisita(revisita);
}
async function onNewRevisita(revisita: Revisita) {
  popup.value?.close();
  map.value?.addMarker(
    revisitaToMarker(revisita)
  );
  await loadRevisitas();
}
async function onDeleteRevisita() {
  const repo = new RevisitaRepository();
  const response = confirm('¿Borrar revisita?');
  if (response && currentRevisita.value) {
    // delete revisita
    const id = currentRevisita.value.getId();
    await repo.delete(id);

    // delete cita
    const repoCita = new CitaRepository();
    const result = await repoCita.all()
    result
      .filter((cita) => cita.getRevisitaId() == id)
      .forEach(async (cita) => {
        await repoCita.delete(cita.getId());
      });

    setCurrentRevisita(null);
    await loadRevisitas();
  }
}
async function onShowTo(data: {
  id?: string,
  lat?: number,
  lng?: number,
  type: "revisita" | "direccion",
}) {
  if (data.type === 'direccion' && data.lat && data.lng) {
    const latlng = L.latLng(data.lat, data.lng);
    map.value?.goToCoords(latlng, 19);
    return;
  }
  const repo = new RevisitaRepository();
  const revisitas = await repo.all()
  const rev = revisitas.find((revisita) => revisita.getId() === data.id);
  if (rev) {
    setCurrentRevisita(rev);
    const latlng = L.latLng(rev.getLat(), rev.getLng());
    map.value?.goToCoords(latlng, 19);
  }
}
async function boot() {
  await nextTick();
  popup.value?.setContent((addrev.value as HTMLElement));
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
          :popup="(popup as L.Popup)"
          @newRevisita="onNewRevisita"
        />
      </div>
    </template>
    <ViewMap
      ref="map"
      class="h-full"
      @touched="onTouched"
      @initialized="() => loadRevisitas()"
      gps
      :lat="40.4165"
      :lng="-3.70256"
    />
    <TopActionMap
      @myLocation="() => map?.goToMyLocation()"
      @showto="onShowTo"
      @focusinput="setCurrentRevisita(null)"
    />
    <CardInfo
      :revisita="(currentRevisita as Revisita)"
      :lastCita="(currentCita as Cita)"
      @trash="onDeleteRevisita"
    />
  </div>
</template>
<style>
</style>

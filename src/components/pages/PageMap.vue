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
import Cita from '@/models/cita';
import CitaRepository from '@/repositories/cita';
import { getModal, type ModalError } from '@/modal';

// dom references
const addrev = ref<HTMLElement | null>(null);
const map = ref<InstanceType<typeof ViewMap> | null>(null);

// objects leaflet
const popup = ref(L.popup());

// refs
const currentRevisita = ref<Revisita | null>(null);
const currentCitas = ref<Cita[]>([]);

function onTouched(e: L.LeafletMouseEvent, map: L.Map) {
  setCurrentRevisita(null);
  popup.value?.setLatLng(e.latlng)?.openOn(map);
}
async function loadRevisitas() {
  const repo = new RevisitaRepository();
  const revisitas = await repo.all();
  map.value?.setMarkers(
    revisitas.map((revisita) => {
      const mark = revisitaToMarker(revisita);
      mark.on('click', () => onClickMarker(revisita));
      return mark;
    }),
  );
}
async function getCitas(revisita: Revisita): Promise<Cita[]> {
  const repo = new CitaRepository();
  const result = await repo.all();
  return result.filter((cita) => cita.getRevisitaId() == revisita.getId());
}
async function setCurrentRevisita(revisita: Revisita | null) {
  if (revisita === null) {
    currentRevisita.value = null;
    currentCitas.value = [];
    return;
  }
  currentRevisita.value = revisita;
  currentCitas.value = await getCitas(revisita);
}
async function onClickMarker(revisita: Revisita) {
  await setCurrentRevisita(revisita);
}
async function onNewRevisita(revisita: Revisita) {
  popup.value?.close();
  map.value?.addMarker(revisitaToMarker(revisita));
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
    const result = await repoCita.all();
    result
      .filter((cita) => cita.getRevisitaId() == id)
      .forEach(async (cita) => {
        await repoCita.delete(cita.getId());
      });

    setCurrentRevisita(null);
    await loadRevisitas();
  }
}
async function onDeleteCita(cita: Cita) {
  const repo = new CitaRepository();
  await repo.delete(cita.getId());
  if (!currentRevisita.value) {
    return;
  }
  const revisita = currentRevisita.value as Revisita;
  currentCitas.value = await getCitas(revisita);
}
interface ModalResponse {
  cita: Cita;
}
async function onCreateNewCita() {
  if (!currentRevisita.value) {
    return;
  }
  const id = currentRevisita.value.getId();
  const revisitas = await new RevisitaRepository().all();
  const revisita = revisitas.find((rev) => rev.getId() === id);

  const result = await getModal<ModalResponse | ModalError>('newcita', {
    revisita,
  });
  if ('error' in result) {
    return;
  }
  const repo = new CitaRepository();
  result.cita.setRevisitaId(id);
  const cita = await repo.save(result.cita);
  currentCitas.value = [cita];
}

async function onShowTo(data: {
  id?: string;
  lat?: number;
  lng?: number;
  type: 'revisita' | 'direccion';
}) {
  if (data.type === 'direccion' && data.lat && data.lng) {
    const latlng = L.latLng(data.lat, data.lng);
    map.value?.goToCoords(latlng, 19);
    return;
  }
  const repo = new RevisitaRepository();
  const revisitas = await repo.all();
  const rev = revisitas.find((revisita) => revisita.getId() === data.id);
  if (rev) {
    setCurrentRevisita(rev);
    const latlng = L.latLng(rev.getLat(), rev.getLng());
    map.value?.goToCoords(latlng, 19);
  }
}
async function boot() {
  await nextTick();
  popup.value?.setContent(addrev.value as HTMLElement);
}
onMounted(() => {
  boot();
});
</script>
<template>
  <div class="grid h-full containermap relative">
    <template>
      <div
        ref="addrev"
        class="flex py-3"
      >
        <NewHereRevisita
          :popup="popup as L.Popup"
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
      :revisita="currentRevisita as Revisita"
      :citas="currentCitas as Cita[]"
      @trash="onDeleteRevisita"
      @newCita="onCreateNewCita"
      @trashCita="onDeleteCita"
    />
  </div>
</template>
<style></style>

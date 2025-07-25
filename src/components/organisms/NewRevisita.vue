<script setup lang="ts">
import { inject, ref, onMounted } from 'vue';
import { modalKey } from '@/modal';
import * as nominatim from '@/services/nominatim';
import MTitle from '@/components/atoms/MTitle.vue';
import MInput from '@/components/atoms/MInput.vue';
import MTextarea from '@/components/atoms/MTextarea.vue';
import MInputDate from '@/components/molecules/MInputDate.vue';
import MInputClock from '@/components/molecules/MInputClock.vue';
import Revisita from '@/models/revisita';
import Cita from '@/models/cita';

const injected = inject(modalKey);
if (!injected) {
    throw new Error('Error inject modal');
}
const { resolveModal, getData } = injected;
onMounted(() => {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  time.value = `${hour}:${minute < 10 ? '0' + minute : minute}`
});

type DataComputed = {
  lat: number,
  lng: number,
}
const name = ref('');
const description = ref('');
const descriptionCita = ref('');
const nextDate = ref(new Date());
const time = ref('00:00');
async function fetchAddress (): Promise<string> {
  const data: DataComputed | null = getData('newrevisita');
  if (!data) {
    return ''
  }
  console.warn(data);
  try {
    const json: nominatim.ReverseResponse = await nominatim.reverse(data.lat, data.lng);
    const address = [];
    if (json.address.road) {
      address.push(json.address.road);
    }
    if (json.address.neighbourhood) {
      address.push(json.address.neighbourhood);
    }
    if (json.address.town) {
      address.push(json.address.town);
    } else {
      if (json.address.city) {
        address.push(json.address.city);
      }
    }
    if (json.address.region) {
      address.push(json.address.region);
    } else {
      if (json.address.state) {
        address.push(json.address.state);
      }
    }

    return address.join(', ');
  } catch(_) {
  }
  return '';
}
async function onClick() {
  const rev = new Revisita();
  rev.setName(name.value);
  rev.setDescription(description.value);
  rev.setAddress(
    await fetchAddress()
  );
  return;

  const cita = new Cita();
  cita.setDateObj(new Date()); // hoy
  cita.setDescription(descriptionCita.value);
  cita.setNextDateObj(nextDate.value);

  resolveModal({ revisita: rev, cita });
  name.value = '';
  description.value = '';
  descriptionCita.value = '';
  nextDate.value = new Date();
}
</script>
<template>
  <MTitle align="center" class="mb-4">Nueva Revisita</MTitle>
  <MInput v-model="name" class="w-full mb-4" label="Nombre completo" />
  <MTextarea v-model="description" class="w-full mb-4" label="Descripcion de la casa" />
  <MTextarea v-model="descriptionCita" class="w-full mb-4" label="Notas de la visita" />
  <MTitle size='sm' align="center" class="mb-4">¿Cuando es la siguiente visita?</MTitle>
  <div class="flex gap-2">
    <MInputDate v-model="nextDate" class="mb-4" />
    <MInputClock v-model="time" class="mb-4" />
  </div>
  <button
      type="button"
      class="rounded bg-blue-500 text-white px-4 py-2 w-full"
      @click="onClick"
  >Crear</button>
</template>

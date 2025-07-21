<script setup lang="ts">
import { inject, ref } from 'vue';
import { modalKey } from '@/modal';
import * as nominatim from '@/services/nominatim';
import MTitle from '@/components/atoms/MTitle.vue';
import MInput from '@/components/atoms/MInput.vue';
import MTextarea from '@/components/atoms/MTextarea.vue';
import Revisita from '@/models/revisita';

const injected = inject(modalKey);
if (!injected) {
    throw new Error('Error inject modal');
}
const { resolveModal, getData } = injected;

type DataComputed = {
  lat: number,
  lng: number,
}
const name = ref('');
const description = ref('');
async function fetchAddress (): Promise<string> {
  const data: DataComputed | null = getData('newrevisita');
  if (!data) {
    return ''
  }
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
  resolveModal(rev);
  name.value = '';
  description.value = '';
}
</script>
<template>
  <MTitle align="center" class="mb-4">Nueva Revisita</MTitle>
  <MInput v-model="name" class="w-full mb-4" label="Nombre completo" />
  <MTextarea v-model="description" class="w-full mb-4" label="Descripcion de la casa" />
  <button
      type="button"
      class="rounded bg-blue-500 text-white px-4 py-2 w-full"
      @click="onClick"
  >Crear</button>
</template>

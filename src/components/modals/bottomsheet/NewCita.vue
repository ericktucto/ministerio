<script setup lang="ts">
import { inject, ref, onMounted } from 'vue';
import { getData, modalKey } from '@/modal';
import MTitle from '@/components/atoms/MTitle.vue';
import MTextarea from '@/components/atoms/MTextarea.vue';
import MInputDate from '@/components/molecules/MInputDate.vue';
import MInputClock from '@/components/molecules/MInputClock.vue';
import Cita from '@/models/cita';
import type Revisita from '@/models/revisita';

const injected = inject(modalKey);
if (!injected) {
    throw new Error('Error inject modal');
}
const { resolveModal } = injected;
onMounted(() => {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const amPm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  time.value = `${String(hour12).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${amPm}`
});

const description = ref('');
const nextDate = ref(new Date());
const time = ref('01:00 AM');
const revisita = ref<Revisita | null>(null);
async function onClick() {
  const cita = new Cita();
  cita.setDateObj(new Date()); // hoy
  cita.setDescription(description.value);
  const n = new Date(nextDate.value)
  const amPm = time.value.slice(-2).toUpperCase().trim();
  const hours = time.value.split(':')[0].trim();
  const minutes = time.value.replace(/(AM|PM)/, '').split(':')[1].padStart(2, '0').trim();
  n.setMinutes(Number(minutes));
  n.setHours(amPm == 'PM' ? Number(hours) + 12 : Number(hours));
  cita.setNextDateObj(n);

  resolveModal({ cita });
  description.value = '';
  nextDate.value = new Date();
}
onMounted(() => {
  const data = getData<{ revisita: Revisita }>('newcita');
  revisita.value = data.revisita;
});
</script>
<template>
  <MTitle align="center" class="mb-4">Hoy cité a {{ revisita?.getName() }}</MTitle>
  <MTextarea v-model="description" class="w-full mb-4" label="Notas de la visita" />
  <MTitle size='sm' align="center" class="mb-4">¿Cuando es la siguiente visita?</MTitle>
  <div class="flex gap-2">
    <MInputDate v-model="nextDate" class="mb-4 flex-1 text-nowrap" />
    <MInputClock v-model="time" class="mb-4" />
  </div>
  <button
      type="button"
      class="rounded bg-blue-500 text-white px-4 py-2 w-full"
      @click="onClick"
  >Crear</button>
</template>

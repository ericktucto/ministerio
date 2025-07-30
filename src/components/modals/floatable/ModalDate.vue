<script setup lang="ts">
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ref, onMounted, computed } from 'vue';
import { getData, resolveModal, onCloseModal } from '@/modalfloat';
import ScrollItems from '@/components/atoms/ScrollItems.vue';

interface TimeData {
  date: Date;
};
const configes = { locale: es };
const numbersYears = Array.from({ length: 7 }, (_, i) => String(new Date().getFullYear() + i));
const numbersMonths = Array.from({ length: 12 }, (_, i) => format(new Date(2025, i, 1), 'MMMM', configes));

const numbersDays = computed(() => {
  const m = numbersMonths.indexOf(month.value);
  const date = new Date(Number(year.value), m + 1, 0);
  return Array.from({ length: date.getDate() }, (_, i) => {
    const date = new Date(Number(year.value), m, i + 1);
    return format(date, "iiii dd", configes);
  })
});

const day = ref('01');
const month = ref('01');
const year = ref((new Date()).getFullYear().toString());

function onAccept() {
  const d = Number(day.value.split(' ')[1]);
  const m = numbersMonths.indexOf(month.value);
  resolveModal({ date: new Date(Number(year.value), m, d) })
}
onMounted(() => {
  const data = getData<TimeData>('dateselect');
  if (data?.date) {
    const date = data.date;
    year.value = String(date.getFullYear());
    month.value = format(date, "MMMM", configes);
    day.value = format(date, "iiii dd", configes);
  }
})
</script>
<template>
  <div class="flex mb-4 gap-4 items-center justify-evenly text-center text-nowrap">
    <div>
      <h3 class="mb-2">Día</h3>
      <ScrollItems
        v-model="day"
        :options="numbersDays"
      />
    </div>
    <div>
      <h3 class="mb-2">Mes</h3>
      <ScrollItems
        v-model="month"
        :options="numbersMonths"
      />
    </div>
    <div>
      <h3 class="mb-2">Año</h3>
      <ScrollItems
        v-model="year"
        :options="numbersYears"
      />
    </div>
  </div>
  <div class="flex justify-evenly items-center">
    <button
      type="button"
      class="py-2 px-4 bg-blue-500 rounded-md text-white"
      @click="onAccept"
    >Aceptar</button>
    <button
      type="button"
      class="py-2 px-4 bg-red-500 rounded-md text-white"
      @click="onCloseModal"
    >Cancelar</button>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ref, onMounted } from 'vue';
import { getData, resolveModal, onCloseModal } from '@/modalfloat';
import ScrollItems from '@/components/atoms/ScrollItems.vue';

interface TimeData {
  date: Date;
};
const configes = { locale: es };
const numbersYears = ref<string[]>([])
const numbersMonths = Array.from({ length: 12 }, (_, i) => format(new Date(2025, i, 1), 'MMMM', configes));
const numbersDays = ref<string[]>([])

function getDaysArray() {
  const m = numbersMonths.indexOf(month.value);
  const date = new Date(Number(year.value), m + 1, 0);
  return Array.from({ length: date.getDate() }, (_, i) => {
    const date = new Date(Number(year.value), m, i + 1);
    return format(date, "iiii dd", configes);
  })
}

const day = ref('01');
const month = ref('01');
const year = ref((new Date()).getFullYear().toString());

function onAccept() {
  const d = Number(day.value.split(' ')[1]);
  const m = numbersMonths.indexOf(month.value);
  resolveModal({ date: new Date(Number(year.value), m, d) })
}
onMounted(() => {
  const now = new Date(2025,11);
  numbersYears.value.push(now.getFullYear().toString());
  if (now.getMonth() === 0) {
    // es enero
    numbersYears.value.push((now.getFullYear() - 1 ).toString());
  } else if (now.getMonth() === 11) {
    // es diciembre
    numbersYears.value.push((now.getFullYear() + 1 ).toString());
  }
  numbersYears.value = numbersYears.value.sort();
  const data = getData<TimeData>('dateselect');
  const date = data?.date || new Date();
  year.value = String(date.getFullYear());
  month.value = format(date, "MMMM", configes);
  numbersDays.value = getDaysArray();
  day.value = format(date, "iiii dd", configes);
})
function onYear(y: string) {
  year.value = y;
  const res = getDaysArray();
  numbersDays.value = res;
}
function onMonth(_: string) {
  numbersDays.value = getDaysArray();
}
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
        @update:modelValue="onMonth"
        :options="numbersMonths"
      />
    </div>
    <div>
      <h3 class="mb-2 text-center">Año</h3>
      <div
        class="picker w-16 overflow-y-hidden snap-y snap-mandatory rounded-[30px] bg-gray-200 rounded-xl scrollbar-hidden"
        :style="`height: ${numbersYears.length * 40}px`"
      >
        <div
          class="item flex items-center justify-center snap-center text-base select-none"
          :class="{
            'bg-blue-500 text-white': year == numbersYears[0]
          }"
          style="height: 40px"
          @click="onYear(numbersYears[0])"
        >{{ numbersYears[0] }}</div>
        <div
          v-if="numbersYears.length > 1"
          class="item flex items-center justify-center snap-center text-base select-none"
          :class="{
            'bg-blue-500 text-white': year == numbersYears[1]
          }"
          style="height: 40px"
          @click="onYear(numbersYears[1])"
        >{{ numbersYears[1] }}</div>
      </div>
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

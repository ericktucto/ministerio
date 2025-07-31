<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getData, resolveModal, onCloseModal } from '@/modalfloat';
import ScrollItems from '@/components/atoms/ScrollItems.vue';

interface TimeData {
  time: string;
};
const numbersMinutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const numbersHours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

const hours = ref(numbersHours[0]);
const minutes = ref(numbersMinutes[0]);
const amPm = ref('AM');

function onAccept() {
  resolveModal({ time: `${hours.value}:${minutes.value} ${amPm.value}` })
}
onMounted(() => {
  const data = getData<TimeData>('timeselect');
  if (/^\d{2}:\d{2} (AM|PM)$/.test(data.time)) {
    amPm.value = data.time.slice(-2).toUpperCase().trim();
    hours.value = data.time.slice(0, 2);
    minutes.value = data.time.slice(3, 5);
  }
})
</script>
<template>
  <div class="grid gap-6 text-center px-6 py-2">
    <div class="flex gap-4 items-center justify-evenly">
      <div>
        <h3 class="mb-2 text-center">Horas</h3>
        <ScrollItems
          v-model="hours"
          :options="numbersHours"
          class="w-16"
        />
      </div>
      <div>
        <h3 class="mb-2 text-center">Minutos</h3>
        <ScrollItems
          v-model="minutes"
          :options="numbersMinutes"
          class="w-16"
        />
      </div>
      <div>
        <h3 class="mb-2 text-center">AM/PM</h3>
        <div
          class="picker w-16 overflow-y-hidden snap-y snap-mandatory rounded-[30px] bg-gray-200 rounded-xl scrollbar-hidden"
          :style="`height: ${2 * 40}px`"
        >
          <div
            class="item flex items-center justify-center snap-center text-base select-none"
            :class="{
              'bg-blue-500 text-white': amPm == 'AM'
            }"
            style="height: 40px"
            @click="amPm = 'AM'"
          >AM</div>
          <div
            class="item flex items-center justify-center snap-center text-base select-none"
            :class="{
              'bg-blue-500 text-white': amPm == 'PM'
            }"
            style="height: 40px"
            @click="amPm = 'PM'"
          >PM</div>
        </div>
      </div>
    </div>
    <div class="flex justify-evenly items-center">
      <button
        type="button"
        class="py-2 px-4 bg-blue-500 rounded-md text-white"
        data-cancel="0"
        @click="onAccept"
      >Aceptar</button>
      <button
        type="button"
        class="py-2 px-4 bg-red-500 rounded-md text-white"
        data-cancel="1"
        @click="onCloseModal"
      >Cancelar</button>
    </div>
  </div>

</template>

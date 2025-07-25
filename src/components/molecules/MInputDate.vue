<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue';
import { Clock01Icon } from '@hugeicons/core-free-icons';
import { onMounted, computed, ref } from 'vue';
import ScrollItems from '@/components/atoms/ScrollItems.vue';

const opened = ref(false);
const props = defineProps<{ modelValue: Date }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: Date): void }>()

const numbersYears = Array.from({ length: 7 }, (_, i) => String(new Date().getFullYear() + i));
const numbersMonths = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const numbersDays = computed(() => {
  const date = new Date(props.modelValue.getFullYear(), props.modelValue.getMonth() + 1, 0);
  return Array.from({ length: date.getDate() }, (_, i) => String(i + 1).padStart(2, '0'));
});
// split :
const day = computed(() => {
  const value = props.modelValue.getDate();
  return String(value).padStart(2, '0');
});
const month = computed(() => {
  const value = props.modelValue.getMonth() + 1;
  return String(value).padStart(2, '0');
});
const year = computed(() => {
  const value = props.modelValue.getFullYear();
  return String(value);
});
const tempValue = ref();
function onOpen(e: Event) {
  const elm = e.target as HTMLElement;
  if (elm.tagName.toUpperCase() != 'SPAN') {
    if (elm.dataset.hasOwnProperty('cancel')) {
      const cancel = elm.dataset.cancel == '1';
      if (cancel && tempValue.value) {
        emit('update:modelValue', tempValue.value);
      }
      startanimation.value = false;
    }
    return;
  }
  tempValue.value = props.modelValue;
  opened.value = true;
}
const startanimation = ref(false);
function onContainerAnimationEnd() {
  startanimation.value = true
}
const toclose = ref(false);
function onModalAnimationEnd() {
  if (toclose.value) {
    opened.value = false;
    toclose.value = false;
    return;
  }
  toclose.value = true;
}
function createDate(value: number, to: 'day' | 'month' | 'year') {
  if (!tempValue.value || !value) {
    return;
  }
  const date = new Date(tempValue.value);
  if (to === 'day') {
    date.setDate(value);
  }
  if (to === 'month') {
    date.setMonth(value);
  }
  if (to === 'year') {
    date.setFullYear(value);
  }
  console.warn("createDate", date);
  emit('update:modelValue', date);
}
</script>
<template>
  <span
    class="border border-blue-500 flex items-center gap-2 w-full rounded-md px-3 py-2"
    :class="{ opened }"
    @click="onOpen"
  >
    <HugeiconsIcon
      class="text-blue-500"
      :icon="Clock01Icon"
      :size="16"
      :strokeWidth="2"
    />
    <span>{{ day }}-{{ month }}-{{ year }}</span>
    <div
      class="minputclockmodal flex fixed top-0 left-0 items-center justify-center w-dvw h-dvh"
      :class="{ startanimation }"
      @transitionend="onContainerAnimationEnd"
    >
      <div class="relative w-full h-full">
      <div
        class="backgroundclock absolute w-full h-full bg-black"
        data-cancel="1"
      ></div>
      <div
        class="modalclock absolute grid relative w-[400px] h-[400px] bg-white rounded-md"
        @transitionend="onModalAnimationEnd"
      >
        <div class="flex items-center justify-evenly">
          <div>
            <h3 class="mb-2">Día</h3>
            <ScrollItems
              :modelValue="day"
              @update:modelValue="$emit('update:modelValue', new Date(`${year}-${month}-${$event}`))"
              :options="numbersDays"
              style="height: 200px"
            />
          </div>
          <div>
            <h3 class="mb-2">Mes</h3>
            <ScrollItems
              :modelValue="month"
              @update:modelValue="$emit('update:modelValue', new Date(`${year}-${$event}-${day}`))"
              :options="numbersMonths"
              style="height: 200px"
            />
          </div>
          <div>
            <h3 class="mb-2">Año</h3>
            <ScrollItems
              :modelValue="year"
              @update:modelValue="$emit('update:modelValue', new Date(`${$event}-${month}-${day}`))"
              :options="numbersYears"
              style="height: 200px"
            />
          </div>
        </div>
        <div class="flex justify-evenly items-center">
          <button
            type="button"
            class="py-2 px-4 bg-blue-500 rounded-md text-white"
            data-cancel="0"
          >Aceptar</button>
          <button
            type="button"
            class="py-2 px-4 bg-red-500 rounded-md text-white"
            data-cancel="1"
          >Cancelar</button>
        </div>
      </div>
      </div>
    </div>
  </span>
</template>
<style scoped>
span .minputclockmodal {
  transform: translateY(-100vh);
  transition: all 0.001s ease-in-out;
  .backgroundclock {
    opacity: 0;
    transition: all 0.3s ease-in-out;
  }
  .modalclock {
    left: 50%;
    transform: translate(-50%, -100%);
    transition: all 0.3s ease-in-out;
  }
}
span.opened .minputclockmodal {
  transform: translateY(0);
}
span.opened .minputclockmodal.startanimation {
  .backgroundclock {
    opacity: 0.5;
  }
  .modalclock {
    transform: translate(-50%, 50%);
  }
}
</style>

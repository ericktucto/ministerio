<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue';
import { Gps01Icon, Settings02Icon } from '@hugeicons/core-free-icons';
import RevisitaRepository from '@/repositories/revisita';
import MBadge from '@/components/atoms/MBadge.vue';
import { ref, onMounted } from 'vue';
const emit = defineEmits<{
  myLocation: [],
  showto: [data: DataShowTo],
}>();

interface DataShowTo {
  id: string;
}
interface ResultInput {
  text: string;
  details: string;
  id: string;
}

const resultInput = ref<Array<ResultInput>>([]);

async function search(text: string) {
  const search = text.trim().toLowerCase();
  const repo = new RevisitaRepository();
  const revisitas = await repo.all();
  const result = revisitas.filter((revisita) => {
    return revisita.getName().includes(search)
      || revisita.getAddress().includes(search)
      || revisita.getDescription().includes(search);
  }).map((revisita) => ({
    text: revisita.getName(),
    details: revisita.getDescription(),
    id: revisita.getId(),
  }));
  resultInput.value = result;
}
async function onSearch(event: Event) {
  const target = (event.target as HTMLInputElement);
  search(target.value.trim().toLowerCase());
}
function onClickResult(e: Event, r: ResultInput) {
  const div = (e.target as HTMLDivElement);
  emit('showto', { id: r.id });
  div.blur();
}
onMounted(() => {
  search("");
});
</script>
<template>
  <div class="absolute top-0 z-1000 w-full h-[4rem] p-2">
    <div class="flex gap-2">
      <input
        type="text"
        class="flex-1 rounded-full bg-white h-12 px-4 py-2 shadow-md focus:outline-none"
        placeholder="Buscar revisita o lugar..."
        @input="onSearch"
      />
      <button
        type="button"
        class="p-2 rounded-full bg-white w-12 h-12 grid place-items-center shadow-md"
      ><HugeiconsIcon
        class="w-6 h-6"
        :icon="Gps01Icon"
        @click="$emit('myLocation')"
      /></button>
      <button
        type="button"
        class="p-2 rounded-full bg-white w-12 h-12 grid place-items-center shadow-md"
      ><HugeiconsIcon class="w-6 h-6" :icon="Settings02Icon" /></button>
    </div>
    <div class="resultsearch hidden gap-2 mt-2">
      <div
        v-for="r in resultInput"
        class="p-4 bg-white shadow-md rounded-xl"
        @focus="(e) => onClickResult(e, r)"
        tabindex="0"
      >
        <span class="flex items-center justify-between gap-2">
          <strong>{{ r.text }}</strong>
          <MBadge class="text-xs" text="Ubicar" icon="Location01Icon" />
        </span>
        <p class="max-h-6 text-s text-gray-500">{{ r.details }}</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.absolute:focus-within .resultsearch.hidden {
  display: grid;
}
</style>

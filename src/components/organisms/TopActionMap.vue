<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Gps01Icon, Search01Icon, Settings02Icon } from '@hugeicons/core-free-icons';
import RevisitaRepository from '@/repositories/revisita';
import MBadge from '@/components/atoms/MBadge.vue';
import * as nominatim from '@/services/nominatim';
const emit = defineEmits<{
  myLocation: [],
  showto: [data: DataShowTo],
}>();
interface TypeResult {
  type: 'revisita' | 'direccion';
}
interface DataShowTo extends TypeResult {
  id?: string;
  lat?: number;
  lng?: number;
}
interface ResultInput extends TypeResult {
  text: string;
  details: string;
  id: string;
}

const resultInput = ref<ResultInput[]>([]);
const search = ref('');
const searchinput = ref<HTMLInputElement|null>(null);
const loading = ref({
  nominatim: false,
});

async function _search(text: string) {
  const search = text.trim().toLowerCase();
  const repo = new RevisitaRepository();
  const revisitas = await repo.all();
  const result: ResultInput[] = revisitas.filter((revisita) => {
    return revisita.getName().includes(search)
      || revisita.getAddress().includes(search)
      || revisita.getDescription().includes(search);
  }).map((revisita) => ({
    text: revisita.getName(),
    details: revisita.getDescription(),
    id: revisita.getId(),
    type: 'revisita',
  }));
  resultInput.value = result;
}
async function onSearch(event: Event) {
  directions.value = [];
  const target = (event.target as HTMLInputElement);
  _search(target.value.trim().toLowerCase());
}
function onClickDirection(e: Event, r: DirectionSearch) {
  const div = (e.target as HTMLDivElement);
  const result = (r as DirectionSearch);
  emit('showto', {
    lat: Number(result.lat),
    lng: Number(result.lon),
    type: 'direccion',
  });
  div.blur();
}
function onClickResult(e: Event, r: ResultInput) {
  const div = (e.target as HTMLDivElement);
  const result = (r as ResultInput);
  emit('showto', { id: result.id, type: 'revisita' });
  div.blur();
}
interface DirectionSearch extends TypeResult {
  display_name: string;
  lat: string;
  lon: string;
};
const directions = ref<DirectionSearch[]>([]);
async function onClickSearch() {
  if (search.value.trim() && !loading.value.nominatim) {
    try {
      loading.value.nominatim = true
      const response: DirectionSearch[] = await nominatim.search(search.value.trim());
      directions.value = response;
      searchinput.value?.focus();
    } catch (_) {
    }
    loading.value.nominatim = false;
  }
}
onMounted(() => {
  _search("");
});
</script>
<template>
  <div class="absolute top-0 z-1000 w-full h-[4rem] p-2">
    <div class="flex gap-2">
      <input
        ref="searchinput"
        v-model="search"
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
        v-for="(d, index) in directions"
        :key="`direction-${index}`"
        class="inline-flex w-full gap-2 items-center p-4 bg-white shadow-md rounded-xl"
        @focus="(e) => onClickDirection(e, d)"
        tabindex="0"
      >
        <span class="flex items-center justify-between gap-2">
          <span>{{ d.display_name }}</span>
          <MBadge class="text-xs" text="Ubicar" icon="Location01Icon" />
        </span>
      </div>
      <button
        v-show="directions.length === 0"
        type="button"
        class="italic inline-flex w-full gap-2 items-center p-4 bg-white shadow-md rounded-xl"
        @focus="onClickSearch"
      ><HugeiconsIcon
        class="w-6 h-6"
          :icon="Search01Icon"
        />{{ loading.nominatim ? 'Buscando...' : 'Buscar dirección' }}</button>
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

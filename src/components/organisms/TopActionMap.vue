<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import { ArrowLeft02Icon, Gps01Icon, Location01Icon, Search01Icon } from '@hugeicons/core-free-icons';
import RevisitaRepository from '@/repositories/revisita';
import * as nominatim from '@/services/nominatim';
import ResultRevisita from '@/components/molecules/ResultRevisita.vue';
import ResultDirection from '../molecules/ResultDirection.vue';
const emit = defineEmits<{
  myLocation: [],
  focusinput: [],
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
function onFocusInputSearch() {
  emit('focusinput')
  _search(search.value);
}
function onMyLocation() {
  emit('myLocation');
  blurComponent();
}
function onBack(e: Event) {
  const btn = (e.target as HTMLButtonElement);
  btn.blur();
  blurComponent();
}
function blurComponent() {
  searchinput.value?.focus();
  searchinput.value?.blur();
}
onMounted(() => {
  _search("");
});
</script>
<template>
  <div class="absolute top-0 z-1000 w-full max-h-[100dvh]
      focus-within:h-dvh
      focus-within:bg-white
    "
  >
    <div class="flex gap-2">
      <div class="flex-row-reverse flex-1 gap-1 flex rounded-full bg-white h-12 p-2 shadow-md focus:outline-none">
        <input
          ref="searchinput"
          v-model="search"
          type="text"
          class="peer flex-1 bg-white focus:outline-none"
          placeholder="Buscar revisita o lugar..."
          @focus="onFocusInputSearch"
          @input="onSearch"
        />
        <button
          type="button"
          class="bg-white p-1 w-8 h-8 place-items-center peer-focus-within:hidden"
          @click="() => searchinput?.focus()"
        ><HugeiconsIcon
          :icon="Location01Icon"
        /></button>
        <button
          type="button"
          class="hidden bg-white p-1 w-8 h-8 place-items-center peer-focus-within:grid"
          @click="onBack"
          @focus="onBack"
        ><HugeiconsIcon
          :icon="ArrowLeft02Icon"
        /></button>
      </div>
      <button
        type="button"
        class="p-2 rounded-full bg-white w-12 h-12 grid place-items-center shadow-md"
      ><HugeiconsIcon
        class="w-6 h-6"
        :icon="Gps01Icon"
        @click="onMyLocation"
      /></button>
    </div>
    <div class="resultsearch hidden mt-2">
      <ResultDirection
        v-for="(d, index) in directions"
        :key="`direction-${index}`"
        :text="d.display_name"
        @focus="(e: Event) => onClickDirection(e, d)"
        class="border-gray-200 border-t"
        :class="{
          'border-y': index === directions.length - 1 && resultInput.length === 0,
        }"
      />
      <button
        v-show="directions.length === 0"
        type="button"
        class="italic inline-flex w-full gap-2 items-center p-4 bg-white border-gray-200 border-t"
        :class="{ 'border-b': resultInput.length === 0 }"
        @focus="onClickSearch"
      ><HugeiconsIcon
        class="w-6 h-6"
          :icon="Search01Icon"
        />{{ loading.nominatim ? 'Buscando...' : 'Buscar dirección' }}</button>
      <ResultRevisita
        v-for="(r, index) in resultInput"
        :key="`result-${r.id}`"
        :text="r.text"
        :details="r.details"
        @focused="(e) => onClickResult(e, r)"
        class="border-gray-200 border-t"
        :class="{
          'border-y': index === resultInput.length - 1,
        }"
      />
    </div>
  </div>
</template>
<style scoped>
.absolute:focus-within .resultsearch.hidden {
  display: grid;
  overflow-y: scroll;
}
</style>

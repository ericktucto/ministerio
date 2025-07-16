<script setup lang="ts">
import * as L from 'leaflet';
import { nextTick, onMounted, ref } from 'vue';

const mapcontainer = ref<HTMLElement | null>(null);
const map = ref<L.Map | null>(null);
const layer = ref('https://tile.openstreetmap.org/{z}/{x}/{y}.png');

const Lat = ref(40.4165);
const Lng = ref(-3.70256);

async function loadMap() {
    await nextTick();
    if (mapcontainer.value) {
        const m = L.map(mapcontainer.value, {
            center: [Lat.value, Lng.value],
            zoom: 19,
        });
        L.tileLayer(layer.value, {
            attribution: '© OpenStreetMap',
            maxZoom: 19,
        }).addTo(m);
        map.value = m;
    }
}
onMounted(() => {
    loadMap();
});
</script>
<template>
    <div ref="mapcontainer" class="border-red-500"></div>
</template>

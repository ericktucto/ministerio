<script setup lang="ts">
import * as L from 'leaflet';
import { nextTick, onMounted, ref } from 'vue';

const props = defineProps<{ lat: number; lng: number }>();
const emit = defineEmits<{
  touched: [e: L.LeafletMouseEvent, map: L.Map],
}>();

const mapcontainer = ref<HTMLElement | null>(null);
const map = ref<L.Map | null>(null);
const layer = ref('https://tile.openstreetmap.org/{z}/{x}/{y}.png');

async function loadMap() {
    await nextTick();
    if (mapcontainer.value) {
        const m = L.map(mapcontainer.value, {
            center: [props.lat, props.lng],
            zoom: 19,
        });
        L.tileLayer(layer.value, {
            attribution: '© OpenStreetMap',
            maxZoom: 19,
        }).addTo(m);
        m.on('click', (e) => emit('touched', e, m));
        map.value = m;
    }
}
function setMarkers(markers: L.Marker[]) {
    if (!map.value) {
      return;
    }
    map.value.eachLayer((l) => {
        if (l instanceof L.Marker) {
            map.value?.removeLayer(l);
        }
    });
    markers.forEach((m) => {
        m.addTo((map.value as L.Map));
    });
}
function addMarker(marker: L.Marker) {
  if (!map.value) {
    return;
  }
  marker.addTo((map.value as L.Map));
}
function closePopup(popup: L.Popup) {
  if(!map.value) {
    return;
  }
  map.value.closePopup(popup);
}
onMounted(() => {
    loadMap();
});
defineExpose({ setMarkers, addMarker, closePopup });
</script>
<template>
    <div>
        <div ref="mapcontainer" class="h-full w-full"></div>
    </div>
</template>

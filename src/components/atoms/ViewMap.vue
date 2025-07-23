<script setup lang="ts">
import * as L from 'leaflet';
import { nextTick, onMounted, ref } from 'vue';

const props = withDefaults(
  defineProps<{ lat: number; lng: number, gps?: boolean }>(),
  { gps: false }
);
const emit = defineEmits<{
  touched: [e: L.LeafletMouseEvent, map: L.Map],
  initialized: [map: L.Map],
}>();

const mapcontainer = ref<HTMLElement | null>(null);
const map = ref<L.Map | null>(null);
const layer = ref('https://tile.openstreetmap.org/{z}/{x}/{y}.png');

function gps(callback: PositionCallback): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('GPS no es soportado en tu navegador'));
    }
    navigator.geolocation.watchPosition((position) => {
      callback(position);
      resolve(position);
    }, reject, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 2000,
    });
  })
}
const circle = ref<L.Circle | null>(null);
function loopToGPS(position: GeolocationPosition) {
  if (!map.value || position.coords.accuracy > 50) {
    return;
  }
  const latlng = L.latLng(position.coords.latitude, position.coords.longitude);
  if (circle.value) {
    circle.value.setLatLng(latlng)
    return;
  }
  map.value.setView(latlng);
  circle.value = L.circle(latlng, {
    radius: 2,
    className: 'bg-blue-500',
    fillOpacity: 0.5
  }).addTo((map.value as L.Map));
}
async function loadMap() {
    await nextTick();
    const center: L.LatLng = new L.LatLng(props.lat, props.lng);
    if (props.gps && navigator.geolocation) {
      const position = await gps(loopToGPS);
      center.lat = position.coords.latitude;
      center.lng = position.coords.longitude;
    }
    if (mapcontainer.value) {
        const m = L.map(mapcontainer.value, {
            center,
            zoom: 19,
            zoomControl: false,
        });
        L.tileLayer(layer.value, {
            attribution: '© OpenStreetMap',
            maxZoom: 19,
        }).addTo(m);
        m.on('click', (e) => emit('touched', e, m));
        map.value = m;
        emit('initialized', m);
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
function goToCoords(latlng: L.LatLng, zoom?: number) {
  map.value?.setView(latlng, zoom);
}
function goToMyLocation() {
  const latlng = circle.value?.getLatLng()
  if (!latlng) {
    return;
  }
  goToCoords(latlng, 19);
}
onMounted(() => {
    loadMap();
});
defineExpose({ goToMyLocation, goToCoords, setMarkers, addMarker, closePopup });
</script>
<template>
    <div>
        <div ref="mapcontainer" class="h-full w-full"></div>
    </div>
</template>

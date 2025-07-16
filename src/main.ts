import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from '@/App.vue'
import * as L from 'leaflet';

// Corrige rutas de íconos en Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
    iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
    shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.mount('#app')

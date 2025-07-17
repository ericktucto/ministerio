import * as L from 'leaflet';
import type Revisita from "./models/revisita";

export function revisitaToMarker(revisita: Revisita): L.Marker {
  return L.marker(
    L.latLng(revisita.getLat(), revisita.getLng())
  );
}

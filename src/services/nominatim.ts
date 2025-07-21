const URI_BASE = 'https://nominatim.openstreetmap.org';
export async function search(q: string) {
  const url = `${URI_BASE}/search?q=${q}&format=jsonv2&polygon_geojson=1`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      }
    });
    const json = await response.json();
    return json;
  } catch (e) {
    console.error(e);
    throw new Error('Error al buscar la ubicación');
  }
}
export type AddressObject = {
  road?: string;
  neighbourhood?: string;
  town?: string;
  city?: string;
  region?: string;
  state?: string;
};
export type ReverseResponse = {
  display_name: string;
  name: string;
  lat: string;
  lon: string;
  address: AddressObject;
}
export async function reverse(lat: number, lon: number) {
  const url = `${URI_BASE}/reverse?lat=${lat}&lon=${lon}&format=jsonv2`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      }
    });
    const json = await response.json();
    return json;
  } catch (e) {
    console.error(e);
    throw new Error('Error al buscar la ubicación');
  }
}

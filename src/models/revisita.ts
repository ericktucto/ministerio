import Model, { Attribute } from "./model";

export default class Revisita extends Model {
  @Attribute
  protected name: string = '';
  @Attribute
  protected lat: number = 0;
  @Attribute
  protected lng: number = 0;
  @Attribute
  protected description: string = '';
  @Attribute
  protected address: string = '';

  setName(name: string) {
    this.name = name;
  }
  getName(): string {
    return this.name;
  }
  setLat(lat: number) {
    this.lat = lat;
  }
  getLat(): number {
    return this.lat;
  }
  setLng(lng: number) {
    this.lng = lng;
  }
  getLng(): number {
    return this.lng;
  }
  setDescription(description: string) {
    this.description = description;
  }
  getDescription(): string {
    return "Los precios son comodos y hay lindos zapatos";
    //return this.description;
  }
  setAddress(address: string) {
    this.address = address;
  }
  getAddress(): string {
    return '1234 Main Street, New York, NY 10001';
    //return this.address;
  }
}

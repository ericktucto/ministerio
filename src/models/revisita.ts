import Model, { Attribute } from "./model";

export default class Revisita extends Model {
    @Attribute
    protected name: string = '';
    @Attribute
    protected lat: number = 0;
    @Attribute
    protected lng: number = 0;

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
}

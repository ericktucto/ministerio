import Model, { Attribute } from "./model";

export default class Revisita extends Model {
    @Attribute
    protected name: string = '';
    @Attribute
    protected lat: number = 0;
    @Attribute
    protected log: number = 0;

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
    setLog(log: number) {
        this.log = log;
    }
    getLog(): number {
        return this.log;
    }
}

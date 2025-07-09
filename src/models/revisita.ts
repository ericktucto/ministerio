import { generateId } from "./utils";

export default class Revisita {
    protected id: string = '';
    protected name: string = '';
    protected lat: number = 0;
    protected log: number = 0;

    protected generateId() {
        this.id = generateId();
    }

    getId(): string {
        return this.id;
    }
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

    static create(data: Revisita): Revisita {
        const entity = new Revisita();
        entity.generateId();
        entity.name = data.name;
        entity.lat = data.lat;
        entity.log = data.log;
        return entity
    }
}

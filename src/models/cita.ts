import Model from "./model";

export default class Cita extends Model {
    protected date: string = '';
    protected revisitaId: string = '';
    protected description: string = '';

    getId(): string {
        return this.id;
    }
    setDate(date: string) {
        this.date = date;
    }
    getDate(): string {
        return this.date;
    }
    setDateObj(date: Date) {
        this.date = date.toString();
    }
    getDateObj(): Date {
        return new Date(this.date);
    }
    setRevisitaId(id: string) {
        this.revisitaId = id;
    }
    getRevisitaId(): string {
        return this.revisitaId;
    }
    setDescription(description: string) {
        this.description = description;
    }
    getDescription(): string {
        return this.description;
    }

    static create(data: Cita): Cita {
        const entity = new Cita();
        entity.generateId();
        entity.date = data.date;
        entity.revisitaId = data.revisitaId;
        entity.description = data.description;
        return entity
    }
}


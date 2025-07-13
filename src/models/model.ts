import { generateId } from "./utils";

export interface ModelClass<T extends Model> {
    new(): T;
    create(data: T): T;
}

export function Attribute(target: any, propertyKey: string) {
    if (!target.constructor.prototype.attributes) {
        target.constructor.prototype.attributes = [];
    }
    target.constructor.prototype.attributes.push(propertyKey);
}

export default abstract class Model {
    protected attributes: string[] = [];
    protected id: string = generateId();
    protected generateId() {
        this.id = generateId();
    }

    getId(): string {
        return this.id;
    }

    static create<T extends Model>(this: new () => T, data: T): T {
        const entity = new this();
        const attributes = this.prototype.attributes as string[];
        for (const key of attributes) {
            if (key in data) {
                (entity as any)[key] = (data as any)[key];
            }
        }
        entity.generateId();
        return entity
    }
}

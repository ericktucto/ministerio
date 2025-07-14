import { generateId } from "./utils";

export interface ModelClass<T extends Model> {
    new(): T;
    create(data: T): T;
    make(data: Partial<T>): T;
    getAttributes(): string;
}

export function Attribute(target: any, propertyKey: string) {
    if (!target.constructor.prototype.attributes) {
        target.constructor.prototype.attributes = [];
    }
    target.constructor.prototype.attributes.push(propertyKey);
}

export default abstract class Model {
    protected attributes: string[] = [];
    protected id: string = '';
    protected generateId() {
        this.id = generateId();
    }

    getId(): string {
        return this.id;
    }

    setAttribute(key: string, value: any) {
        const entity = (this as any)
        return entity[key] = value;
    }

    getAttribute(key: string) {
        const entity = (this as any)
        return entity[key];
    }

    static getAttributes(): string[] {
        return this.prototype.attributes as string[];
    }

    static make<T extends Model>(this: new () => T, data: Partial<T>): T {
        const entity = new this();
        Object.assign(entity, data);
        return entity
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

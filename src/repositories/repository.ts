import Model from "@/models/model";
import type { ModelClass } from "@/models/model";

const modelRegistry = new Map<Function, any>();

export function To<Entity extends Model>(modelClass: new () => Entity) {
    return function(target: Function) {
        modelRegistry.set(target, modelClass);
    }
}

export function getModelFromRepo<Entity extends Model>(target: any): ModelClass<Entity> {
    const repoClass = target.constructor ?? target;
    const model = modelRegistry.get(repoClass);
    if (!model) {
        throw new Error(`Entity ${repoClass.name} not found`);
    }
    return model;
}

export default abstract class Repository<T extends Model> {
    protected modelClass: ModelClass<T> = getModelFromRepo<T>(this);
    protected data: Array<T> = [];
    constructor() {
        const data = localStorage.getItem(`db_${this.getTableName()}`) || '[]';
        try {
            this.data = Array.from(
                JSON.parse(data)
            ).map(
                (item) => this.modelClass.make((item as any))
            );
        } catch (e) {
            console.error(e);
        }
    }
    protected abstract getTableName(): string;

    async all(): Promise<T[]> {
        return Promise.resolve(this.data);
    }

    delete(id: string): Promise<void> {
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].getId() === id) {
                this.data.splice(i, 1);
                break;
            }
        }
        localStorage.setItem(`db_${this.getTableName()}`, JSON.stringify(this.data));;
        return Promise.resolve();
    }

    update(model: T): Promise<T> {
        const attrs = this.modelClass.getAttributes();
        for (const item of this.data) {
            if (item.getId() === model.getId()) {
                for (const attr of attrs) {
                    item.setAttribute(attr, model.getAttribute(attr));
                }
                break;
            }
        }
        localStorage.setItem(`db_${this.getTableName()}`, JSON.stringify(this.data));;
        return Promise.resolve(model);
    }
    save(model: T): Promise<T> {
        const saved = this.modelClass.create(model);
        this.data.push(saved);
        localStorage.setItem(`db_${this.getTableName()}`, JSON.stringify(this.data));;
        return Promise.resolve(saved);
    }
    getEntity(id: string): Promise<T | null> {
        const result = this.data.find((r: T) => r.getId() === id);
        if (result) {
            return Promise.resolve(result);
        }
        return Promise.resolve(null);
    }
}

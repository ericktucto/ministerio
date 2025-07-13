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
            this.data = JSON.parse(data);
        } catch (e) {
            console.log(e);
        }
    }
    protected abstract getTableName(): string;

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

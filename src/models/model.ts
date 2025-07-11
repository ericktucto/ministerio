import { generateId } from "./utils";

export default abstract class Model {
    protected id: string = generateId();
    protected generateId() {
        this.id = generateId();
    }
}

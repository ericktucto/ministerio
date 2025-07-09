import Revisita from "@/models/revisita";

export default class RevisitaRepository {
    private data: Array<Revisita> = [];
    constructor() {
        const data = localStorage.getItem("revisitas") || '[]';
        try {
            this.data = JSON.parse(data);
        } catch (e) {
            console.log(e);
        }
    }

    save(revisita: Revisita): Promise<Revisita> {
        revisita = Revisita.create(revisita);
        this.data.push(revisita);
        localStorage.setItem("revisitas", JSON.stringify(this.data));;
        return Promise.resolve(revisita);
    }

    getEntity(id: string): Promise<Revisita | null> {
        const rev = this.data.find((r: Revisita) => r.getId() === id);
        if (rev) {
            return Promise.resolve(rev);
        }
        return Promise.resolve(null);
    }
}

import Cita from "@/models/cita";

export default class CitaRepository {
    private data: Array<Cita> = [];
    constructor() {
        const data = localStorage.getItem("citas") || '[]';
        try {
            this.data = JSON.parse(data);
        } catch (e) {
            console.log(e);
        }
    }

    save(cita: Cita): Promise<Cita> {
        cita = Cita.create(cita);
        this.data.push(cita);
        localStorage.setItem("citas", JSON.stringify(this.data));;
        return Promise.resolve(cita);
    }

    getEntity(id: string): Promise<Cita | null> {
        const rev = this.data.find((r: Cita) => r.getId() === id);
        if (rev) {
            return Promise.resolve(rev);
        }
        return Promise.resolve(null);
    }
}

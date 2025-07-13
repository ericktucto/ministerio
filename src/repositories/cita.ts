import Cita from "@/models/cita";
import Repository, { To } from "./repository";

@To(Cita)
export default class CitaRepository extends Repository<Cita> {
    protected getTableName(): string {
        return 'revisitas';
    }
}

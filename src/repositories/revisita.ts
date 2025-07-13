import Revisita from "@/models/revisita";
import Repository, { To } from "./repository";

@To(Revisita)
export default class RevisitaRepository extends Repository<Revisita> {
    protected getTableName(): string {
        return 'revisitas';
    }
}

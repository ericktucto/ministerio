import { describe, expect, it, vi, afterEach } from 'vitest'
import * as utils from '@/models/utils';
import CitaRepository from '@/repositories/cita'
import Cita from '@/models/cita';

describe('CRUD de cita', () => {
    afterEach(() => {
        localStorage.clear();
        vi.resetAllMocks();
    });
    function createCita() {
        const repo = new CitaRepository();
        const entity = new Cita();
        entity.setDate("2025-10-10 13:00:00");
        entity.setRevisitaId("fakeid2");
        entity.setDescription("This is my description");
        return repo.save(entity);
    }
    it('Create una cita y Read una cita', async () => {
        vi.spyOn(utils, "generateId").mockImplementation(() => 'fakeid');
        const repo = new CitaRepository();
        const entity = new Cita();
        entity.setDate("2025-10-10 13:00:00");
        entity.setRevisitaId("fakeid2");
        entity.setDescription("This is my description");
        await repo.save(entity);
        const cit = await repo.getEntity('fakeid');
        expect(cit).not.toBeNull();
        if (cit) {
            expect(cit.getDate()).toBe("2025-10-10 13:00:00");
            expect(cit.getDateObj()).toBeInstanceOf(Date);
            expect(cit.getRevisitaId()).toBe("fakeid2");
            expect(cit.getDescription()).toBe("This is my description");
            expect(cit.getId()).toBe("fakeid");
        }
    });
    it('Update una cit', async () => {
        const spy = vi.spyOn(utils, "generateId");
        spy.mockImplementationOnce(() => 'fakeid');
        const rev = await createCita()
        await createCita();
        await createCita();

        const repo = new CitaRepository();

        const allRev = await repo.all();

        expect(allRev).toHaveLength(3);
        expect(allRev[0].getId()).toBe('fakeid');
        expect(allRev[1].getId()).not.toBe('fakeid');

        rev.setDescription("New Description");

        const revUpdated = await repo.update(rev);
        expect(revUpdated.getId()).toBe('fakeid');
        expect(revUpdated.getDescription()).toBe('New Description');

        const allRev2 = await repo.all();

        expect(allRev2).toHaveLength(3);
        expect(allRev2[0].getDescription()).toBe('New Description');
    })

    it('Delete una revisita', async () => {
        const spy = vi.spyOn(utils, "generateId");
        spy.mockImplementationOnce(() => 'fakeid');
        await createCita();
        await createCita();
        await createCita();

        const repo = new CitaRepository();

        const allRev = await repo.all();

        expect(allRev).toHaveLength(3);
        expect(allRev[0].getId()).toBe('fakeid');

        await repo.delete('fakeid');

        const allRev2 = await repo.all();

        expect(allRev2).toHaveLength(2);
        expect(allRev2[0].getId()).not.toBe('fakeid');
        expect(allRev2[1].getId()).not.toBe('fakeid');
    })
});

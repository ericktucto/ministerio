import { describe, expect, it, vi, afterEach } from 'vitest'
import * as utils from '@/models/utils';
import RevisitaRepository from '@/repositories/revisita'
import Revisita from '@/models/revisita';

describe('CRUD de revisitas', () => {
    afterEach(() => {
        localStorage.clear();
        vi.resetAllMocks();
    });
    function createRevisita() {
        const repo = new RevisitaRepository();
        const entity = new Revisita();
        entity.setName("Stix Code");
        entity.setLat(-10.9);
        entity.setLng(12.8);
        return repo.save(entity);
    }
    it('Create una revisita y Read una revisita', async () => {
        vi.spyOn(utils, "generateId").mockImplementation(() => 'fakeid');
        const repo = new RevisitaRepository();
        const entity = new Revisita();
        entity.setName("Stix Code");
        entity.setLat(-10.9);
        entity.setLng(12.8);
        await repo.save(entity);
        const rev = await repo.getEntity('fakeid');
        expect(rev).not.toBeNull();
        if (rev) {
            expect(rev.getName()).toBe("Stix Code");
            expect(rev.getLat()).toBe(-10.9);
            expect(rev.getLng()).toBe(12.8);
            expect(rev.getId()).toBe("fakeid");
        }
    });
    it('Update una revisita', async () => {
        const spy = vi.spyOn(utils, "generateId");
        spy.mockImplementationOnce(() => 'fakeid');
        const rev = await createRevisita()
        await createRevisita();
        await createRevisita();

        const repo = new RevisitaRepository();

        const allRev = await repo.all();

        expect(allRev).toHaveLength(3);
        expect(allRev[0].getId()).toBe('fakeid');
        expect(allRev[1].getId()).not.toBe('fakeid');

        rev.setName("John Doe");

        const revUpdated = await repo.update(rev);
        expect(revUpdated.getId()).toBe('fakeid');
        expect(revUpdated.getName()).toBe('John Doe');

        const allRev2 = await repo.all();

        expect(allRev2).toHaveLength(3);
        expect(allRev2[0].getName()).toBe('John Doe');
    })

    it('Delete una revisita', async () => {
        const spy = vi.spyOn(utils, "generateId");
        spy.mockImplementationOnce(() => 'fakeid');
        await createRevisita();
        await createRevisita();
        await createRevisita();

        const repo = new RevisitaRepository();

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

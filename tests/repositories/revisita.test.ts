import { describe, expect, it, vi, afterEach } from 'vitest'
import RevisitaRepository from '@/repositories/revisita'
import Revisita from '@/models/revisita';

describe('CRUD de revisitas', () => {
    afterEach(() => {
        localStorage.clear();
        vi.resetAllMocks();
    });
    it('Create una revisita y Read una revisita', async () => {
        vi.mock(
            '@/models/utils',
            () => ({ generateId: vi.fn(() => 'fakeid') })
        )
        const repo = new RevisitaRepository();
        const entity = new Revisita();
        entity.setName("Stix Code");
        entity.setLat(-10.9);
        entity.setLog(12.8);
        await repo.save(entity);
        const rev = await repo.getEntity('fakeid');
        expect(rev).not.toBeNull();
        if (rev) {
            expect(rev.getName()).toBe("Stix Code");
            expect(rev.getLat()).toBe(-10.9);
            expect(rev.getLog()).toBe(12.8);
            expect(rev.getId()).toBe("fakeid");
        }
    });
});

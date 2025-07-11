import { describe, expect, it, vi, afterEach } from 'vitest'
import CitaRepository from '@/repositories/cita'
import Cita from '@/models/cita';

describe('CRUD de cita', () => {
    afterEach(() => {
        localStorage.clear();
        vi.resetAllMocks();
    });
    it('Create una cita y Read una cita', async () => {
        vi.mock(
            '@/models/utils',
            () => ({ generateId: vi.fn(() => 'fakeid') })
        )
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
});

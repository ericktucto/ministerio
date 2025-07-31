import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest'
import * as utils from '@/models/utils';
import CitaRepository from '@/repositories/cita'
import Cita from '@/models/cita';
import RevisitaRepository from '@/repositories/revisita';
import Revisita from '@/models/revisita';

describe('Integrando Revisita y Citas', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
  });
  it('Cuando se crea un revisita, se asigna una cita', async () => {
    vi.spyOn(utils, "generateId").mockImplementationOnce(() => 'fakeid');
    const repoRev = new RevisitaRepository();
    const rev = new Revisita();
    rev.setName("Stix Code");
    rev.setLat(-10.9);
    rev.setLng(12.8);
    const revisita = await repoRev.save(rev);

    const repoCit = new CitaRepository();
    const cit = new Cita();
    cit.setDate("2025-10-10 13:00:00");
    cit.setDescription("This is my description");
    cit.setRevisitaId(revisita.getId());
    await repoCit.save(cit);

    const allRev = await repoRev.all();
    const allCit = await repoCit.all();
    expect(allRev.length).toBe(1);
    expect(allCit.length).toBe(1);
  });
});


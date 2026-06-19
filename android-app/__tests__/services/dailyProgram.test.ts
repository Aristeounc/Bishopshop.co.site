import { generateDailyProgram, calculateProgramProgress, getProgramPhaseLabel } from '../../src/services/dailyProgram';
import { CONCEPT_LIBRARY, getConceptForWeakestSkill, getConceptsForSkill } from '../../src/services/concepts';
import { SkillProgress, SkillTrackId } from '../../src/models/types';
import { ELO_CONFIG } from '../../src/utils/constants';

const defaultProgress: Record<SkillTrackId, SkillProgress> = {
  regulate: { trackId: 'regulate', elo: 100, sessionsCompleted: 0, conceptsMastered: [] },
  connect: { trackId: 'connect', elo: 100, sessionsCompleted: 0, conceptsMastered: [] },
  close: { trackId: 'close', elo: 100, sessionsCompleted: 0, conceptsMastered: [] },
  defend: { trackId: 'defend', elo: 100, sessionsCompleted: 0, conceptsMastered: [] },
  listen: { trackId: 'listen', elo: 100, sessionsCompleted: 0, conceptsMastered: [] },
  assert: { trackId: 'assert', elo: 100, sessionsCompleted: 0, conceptsMastered: [] },
  negotiate: { trackId: 'negotiate', elo: 100, sessionsCompleted: 0, conceptsMastered: [] },
  empathize: { trackId: 'empathize', elo: 100, sessionsCompleted: 0, conceptsMastered: [] },
};

describe('Daily Program Generator', () => {
  describe('generateDailyProgram', () => {
    it('generates a complete program', () => {
      const program = generateDailyProgram('2026-06-19', defaultProgress, [], []);

      expect(program.date).toBe('2026-06-19');
      expect(program.warmup.conceptName).toBeTruthy();
      expect(program.warmup.summary).toBeTruthy();
      expect(program.warmup.keyTakeaways.length).toBeGreaterThan(0);
      expect(program.drills.length).toBeGreaterThanOrEqual(2);
      expect(program.sparringConfig.personaId).toBeTruthy();
      expect(program.completed).toBe(false);
    });

    it('avoids already-completed concepts', () => {
      const firstProgram = generateDailyProgram('2026-06-19', defaultProgress, [], []);
      const secondProgram = generateDailyProgram(
        '2026-06-20',
        defaultProgress,
        [firstProgram.warmup.conceptId],
        [],
      );

      expect(secondProgram.warmup.conceptId).not.toBe(firstProgram.warmup.conceptId);
    });

    it('targets weakest skills', () => {
      const weakProgress = {
        ...defaultProgress,
        defend: { ...defaultProgress.defend, elo: 10 },
      };
      const program = generateDailyProgram('2026-06-19', weakProgress, [], []);
      const concept = CONCEPT_LIBRARY.find((c) => c.id === program.warmup.conceptId);
      expect(concept).toBeTruthy();
    });

    it('includes 3 drills per program', () => {
      const program = generateDailyProgram('2026-06-19', defaultProgress, [], []);
      expect(program.drills.length).toBe(3);
    });

    it('drills start as incomplete', () => {
      const program = generateDailyProgram('2026-06-19', defaultProgress, [], []);
      for (const drill of program.drills) {
        expect(drill.completed).toBe(false);
      }
    });
  });

  describe('calculateProgramProgress', () => {
    it('starts at phase 0 with 0 progress', () => {
      const program = generateDailyProgram('2026-06-19', defaultProgress, [], []);
      const progress = calculateProgramProgress(program);
      expect(progress.phase).toBe(0);
      expect(progress.overallProgress).toBe(0);
    });

    it('advances to phase 1 when drills start', () => {
      const program = generateDailyProgram('2026-06-19', defaultProgress, [], []);
      program.drills[0].completed = true;
      const progress = calculateProgramProgress(program);
      expect(progress.phase).toBe(1);
      expect(progress.overallProgress).toBeGreaterThan(0);
    });

    it('advances to phase 2 when all drills complete', () => {
      const program = generateDailyProgram('2026-06-19', defaultProgress, [], []);
      program.drills.forEach((d) => (d.completed = true));
      const progress = calculateProgramProgress(program);
      expect(progress.phase).toBe(2);
      expect(progress.overallProgress).toBe(0.5);
    });

    it('reaches phase 3 when program is completed', () => {
      const program = generateDailyProgram('2026-06-19', defaultProgress, [], []);
      program.drills.forEach((d) => (d.completed = true));
      program.completed = true;
      const progress = calculateProgramProgress(program);
      expect(progress.phase).toBe(3);
      expect(progress.overallProgress).toBe(1);
    });
  });

  describe('getProgramPhaseLabel', () => {
    it('returns correct labels', () => {
      expect(getProgramPhaseLabel(0)).toBe('Warm-Up');
      expect(getProgramPhaseLabel(1)).toBe('Drill');
      expect(getProgramPhaseLabel(2)).toBe('Sparring');
      expect(getProgramPhaseLabel(3)).toBe('Recovery');
    });
  });
});

describe('Concept Library', () => {
  it('has at least 33 concepts', () => {
    expect(CONCEPT_LIBRARY.length).toBeGreaterThanOrEqual(33);
  });

  it('each concept has required fields', () => {
    for (const concept of CONCEPT_LIBRARY) {
      expect(concept.id).toBeTruthy();
      expect(concept.name).toBeTruthy();
      expect(concept.expertSource).toBeTruthy();
      expect(concept.summary.length).toBeGreaterThan(20);
      expect(concept.keyTakeaways.length).toBeGreaterThanOrEqual(2);
      expect(concept.drillPrompts.length).toBeGreaterThanOrEqual(1);
      expect(concept.primarySkill).toBeTruthy();
    }
  });

  it('covers all 8 skill tracks', () => {
    const coveredSkills = new Set(CONCEPT_LIBRARY.map((c) => c.primarySkill));
    expect(coveredSkills.size).toBe(8);
  });

  it('getConceptsForSkill returns relevant concepts', () => {
    const regulateConcepts = getConceptsForSkill('regulate');
    expect(regulateConcepts.length).toBeGreaterThan(0);
    for (const c of regulateConcepts) {
      const relevant =
        c.primarySkill === 'regulate' || c.secondarySkills.includes('regulate');
      expect(relevant).toBe(true);
    }
  });

  it('getConceptForWeakestSkill prioritizes weak skills', () => {
    const elos: Record<SkillTrackId, number> = {
      regulate: 1000, connect: 1000, close: 1000, defend: 10,
      listen: 1000, assert: 1000, negotiate: 1000, empathize: 1000,
    };
    const concept = getConceptForWeakestSkill(elos, []);
    const relevant =
      concept.primarySkill === 'defend' || concept.secondarySkills.includes('defend');
    expect(relevant).toBe(true);
  });
});

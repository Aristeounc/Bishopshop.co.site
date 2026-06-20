import { createSparringEngine } from '../../src/services/sparring/engine';
import { getPersona, getRandomOpeningLine, getRecommendedPersona, buildScenario } from '../../src/services/sparring/personas';
import { SPARRING_PERSONAS } from '../../src/utils/constants';
import { SkillTrackId } from '../../src/models/types';

describe('Sparring Engine', () => {
  const engine = createSparringEngine();

  describe('startSession', () => {
    it('creates a session with opening messages', () => {
      const session = engine.startSession('user1', 'charmer', ['defend', 'regulate']);
      expect(session.id).toBeTruthy();
      expect(session.userId).toBe('user1');
      expect(session.personaId).toBe('charmer');
      expect(session.skillTracks).toEqual(['defend', 'regulate']);
      expect(session.messages.length).toBe(2);
      expect(session.messages[0].role).toBe('coach');
      expect(session.messages[1].role).toBe('persona');
      expect(session.phase).toBe('sparring');
    });
  });

  describe('processUserMessage', () => {
    it('returns user message, feedback, and persona response', () => {
      const session = engine.startSession('user1', 'closer', ['regulate', 'assert']);
      const response = engine.processUserMessage(
        session,
        'I appreciate the urgency, but I need time to make a good decision.',
      );

      expect(response.userMessage.role).toBe('user');
      expect(response.userMessage.content).toContain('I appreciate');
      expect(response.coachFeedback).toBeDefined();
      expect(response.coachFeedback.score).toBeGreaterThan(0);
      expect(response.personaResponse.role).toBe('persona');
      expect(response.personaResponse.content).toBeTruthy();
    });

    it('signals end after max rounds', () => {
      let session = engine.startSession('user1', 'stonewaller', ['connect', 'listen', 'empathize']);

      for (let i = 0; i < 10; i++) {
        const msgs = Array(i + 1).fill(null).map((_, idx) => ({
          id: `msg_${idx}`,
          role: 'user' as const,
          content: 'test',
          timestamp: new Date().toISOString(),
        }));
        session = { ...session, messages: [...session.messages, ...msgs] };
      }

      const response = engine.processUserMessage(session, 'final message');
      expect(response.shouldEndSession).toBe(true);
    });
  });

  describe('transitionPhase', () => {
    it('adds transition message and updates phase', () => {
      const session = engine.startSession('user1', 'charmer', ['defend']);
      const updated = engine.transitionPhase(session, 'recovery');

      expect(updated.phase).toBe('recovery');
      const lastMsg = updated.messages[updated.messages.length - 1];
      expect(lastMsg.role).toBe('coach');
      expect(lastMsg.content).toContain('Recovery');
    });
  });

  describe('endSession', () => {
    it('generates debrief with ELO changes', () => {
      const session = engine.startSession('user1', 'negotiator', ['negotiate', 'close', 'listen']);

      const withMessages = {
        ...session,
        messages: [
          ...session.messages,
          {
            id: 'msg_user_1',
            role: 'user' as const,
            content: 'I feel this is a fair starting point.',
            timestamp: new Date().toISOString(),
            feedback: {
              score: 70,
              faithfulness: 75,
              techniqueUsage: 65,
              emotionalRegulation: 80,
              summary: 'Good response.',
              suggestions: [],
              conceptsApplied: ['I-Statements'],
            },
          },
        ],
      };

      const skillElos: Record<SkillTrackId, number> = {
        regulate: 100, connect: 100, close: 100, defend: 100,
        listen: 100, assert: 100, negotiate: 100, empathize: 100,
      };

      const completed = engine.endSession(withMessages, skillElos);
      expect(completed.completedAt).toBeTruthy();
      expect(completed.debrief).toBeDefined();
      expect(completed.debrief!.strengths.length).toBeGreaterThan(0);
      expect(completed.debrief!.areasForGrowth.length).toBeGreaterThan(0);
    });
  });
});

describe('Personas', () => {
  describe('getPersona', () => {
    it('returns the correct persona', () => {
      const persona = getPersona('charmer');
      expect(persona.name).toBe('The Charmer');
      expect(persona.primarySkills).toContain('defend');
    });

    it('throws for unknown persona', () => {
      expect(() => getPersona('unknown' as any)).toThrow('Unknown persona');
    });
  });

  describe('getRandomOpeningLine', () => {
    it('returns a string from persona opening lines', () => {
      const persona = getPersona('closer');
      const line = getRandomOpeningLine(persona);
      expect(persona.openingLines).toContain(line);
    });
  });

  describe('getRecommendedPersona', () => {
    it('recommends persona matching weakest skills', () => {
      const recommended = getRecommendedPersona(['defend', 'regulate'], []);
      expect(recommended).toBeTruthy();
      const skills = recommended!.primarySkills;
      const hasOverlap = skills.some((s) => ['defend', 'regulate'].includes(s));
      expect(hasOverlap).toBe(true);
    });

    it('prefers novel personas', () => {
      const recommended = getRecommendedPersona(['negotiate'], ['negotiator']);
      if (recommended) {
        expect(recommended.id).not.toBe('negotiator');
      }
    });
  });

  describe('buildScenario', () => {
    it('returns a scenario string for each persona', () => {
      for (const persona of SPARRING_PERSONAS) {
        const scenario = buildScenario(persona);
        expect(typeof scenario).toBe('string');
        expect(scenario.length).toBeGreaterThan(10);
      }
    });
  });

  it('all 6 personas are defined', () => {
    expect(SPARRING_PERSONAS).toHaveLength(6);
    const ids = SPARRING_PERSONAS.map((p) => p.id);
    expect(ids).toContain('charmer');
    expect(ids).toContain('closer');
    expect(ids).toContain('guilt_tripper');
    expect(ids).toContain('stonewaller');
    expect(ids).toContain('authority');
    expect(ids).toContain('negotiator');
  });

  it('each persona has required fields', () => {
    for (const persona of SPARRING_PERSONAS) {
      expect(persona.name).toBeTruthy();
      expect(persona.systemPrompt.length).toBeGreaterThan(50);
      expect(persona.openingLines.length).toBeGreaterThanOrEqual(2);
      expect(persona.primarySkills.length).toBeGreaterThanOrEqual(2);
      expect(persona.difficulty).toBeGreaterThanOrEqual(1);
      expect(persona.difficulty).toBeLessThanOrEqual(5);
    }
  });
});

import { SPARRING_PERSONAS } from '@/utils/constants';
import { PersonaId, SparringPersona } from '@/models/types';

export function getPersona(id: PersonaId): SparringPersona {
  const persona = SPARRING_PERSONAS.find((p) => p.id === id);
  if (!persona) throw new Error(`Unknown persona: ${id}`);
  return persona;
}

export function getRandomOpeningLine(persona: SparringPersona): string {
  const index = Math.floor(Math.random() * persona.openingLines.length);
  return persona.openingLines[index];
}

export function getPersonasByDifficulty(maxDifficulty: number): SparringPersona[] {
  return SPARRING_PERSONAS.filter((p) => p.difficulty <= maxDifficulty);
}

export function getRecommendedPersona(
  weakestSkills: string[],
  completedPersonas: PersonaId[],
): SparringPersona | null {
  const scored = SPARRING_PERSONAS.map((persona) => {
    const skillOverlap = persona.primarySkills.filter((s) => weakestSkills.includes(s)).length;
    const noveltyBonus = completedPersonas.includes(persona.id) ? -3 : 1;
    return { persona, score: skillOverlap * 2 + noveltyBonus };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.persona ?? null;
}

export function buildScenario(persona: SparringPersona): string {
  const scenarios: Record<PersonaId, string[]> = {
    charmer: [
      'A new colleague is pitching you on joining their side project after hours.',
      'A vendor is trying to upsell you on premium services your team may not need.',
      'Someone at a networking event wants your endorsement for their startup.',
    ],
    closer: [
      'A car salesperson is pressuring you to sign today for a "limited" discount.',
      'Your manager wants you to commit to leading a project by end of day.',
      'A recruiter insists you need to accept the offer before the weekend.',
    ],
    guilt_tripper: [
      'A friend is upset that you can\'t attend their event this weekend.',
      'A coworker says they\'re overwhelmed and implies you\'re not pulling your weight.',
      'A family member brings up past favors when asking for a large loan.',
    ],
    stonewaller: [
      'You need to discuss a recurring issue with your partner who shuts down.',
      'A team member won\'t engage in a post-mortem discussion about a failed project.',
      'Your teenager gives one-word answers about a concerning situation at school.',
    ],
    authority: [
      'A senior executive dismisses your proposal in a strategy meeting.',
      'A doctor disagrees with your request for a second opinion.',
      'A professor challenges your thesis argument in front of the class.',
    ],
    negotiator: [
      'You\'re negotiating your salary for a new role you\'ve been offered.',
      'You\'re buying a car and the dealer has made their opening offer.',
      'You\'re negotiating contract terms with a key client.',
    ],
  };

  const options = scenarios[persona.id];
  return options[Math.floor(Math.random() * options.length)];
}

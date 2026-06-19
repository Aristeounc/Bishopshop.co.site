import {
  DailyProgram,
  WarmupContent,
  DrillContent,
  SparringConfig,
  SkillTrackId,
  SkillProgress,
} from '@/models/types';
import { getConceptForWeakestSkill, Concept } from './concepts';
import { getRecommendedPersona } from './sparring/personas';

export function generateDailyProgram(
  date: string,
  skillProgress: Record<SkillTrackId, SkillProgress>,
  completedConceptIds: string[],
  completedPersonaIds: string[],
): DailyProgram {
  const skillElos = Object.fromEntries(
    Object.entries(skillProgress).map(([k, v]) => [k, v.elo]),
  ) as Record<SkillTrackId, number>;

  const concept = getConceptForWeakestSkill(skillElos, completedConceptIds);
  const warmup = buildWarmup(concept);
  const drills = buildDrills(concept);
  const sparringConfig = buildSparringConfig(skillElos, completedPersonaIds, concept);

  return {
    date,
    warmup,
    drills,
    sparringConfig,
    completed: false,
  };
}

function buildWarmup(concept: Concept): WarmupContent {
  return {
    conceptId: concept.id,
    conceptName: concept.name,
    summary: concept.summary,
    keyTakeaways: concept.keyTakeaways,
    expertSource: concept.expertSource,
  };
}

function buildDrills(concept: Concept): DrillContent[] {
  const drillTypes: DrillContent['type'][] = ['listening', 'boundary_setting', 'reframing', 'empathy', 'assertion'];

  const skillToDrillType: Record<SkillTrackId, DrillContent['type']> = {
    regulate: 'reframing',
    connect: 'empathy',
    close: 'assertion',
    defend: 'boundary_setting',
    listen: 'listening',
    assert: 'assertion',
    negotiate: 'reframing',
    empathize: 'empathy',
  };

  const primaryType = skillToDrillType[concept.primarySkill] ?? 'listening';
  const secondaryTypes = concept.secondarySkills
    .map((s) => skillToDrillType[s])
    .filter((t) => t !== primaryType);

  const drills: DrillContent[] = [];

  if (concept.drillPrompts.length >= 1) {
    drills.push({
      id: `drill_${concept.id}_1`,
      type: primaryType,
      prompt: concept.drillPrompts[0],
      skillTrack: concept.primarySkill,
      completed: false,
    });
  }

  if (concept.drillPrompts.length >= 2) {
    drills.push({
      id: `drill_${concept.id}_2`,
      type: secondaryTypes[0] ?? primaryType,
      prompt: concept.drillPrompts[1],
      skillTrack: concept.secondarySkills[0] ?? concept.primarySkill,
      completed: false,
    });
  }

  drills.push({
    id: `drill_${concept.id}_apply`,
    type: primaryType,
    prompt: `Apply the ${concept.name} framework to a real situation from your week. Describe the situation and how you would use what you learned.`,
    skillTrack: concept.primarySkill,
    completed: false,
  });

  return drills;
}

function buildSparringConfig(
  skillElos: Record<SkillTrackId, number>,
  completedPersonaIds: string[],
  concept: Concept,
): SparringConfig {
  const weakestSkills = Object.entries(skillElos)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 3)
    .map(([id]) => id);

  const persona = getRecommendedPersona(weakestSkills, completedPersonaIds as any);
  const personaId = persona?.id ?? 'charmer';

  const targetSkills = [concept.primarySkill, ...concept.secondarySkills.slice(0, 1)];

  const avgElo = Object.values(skillElos).reduce((a, b) => a + b, 0) / Object.values(skillElos).length;
  const difficulty = avgElo < 200 ? 1 : avgElo < 400 ? 2 : avgElo < 700 ? 3 : avgElo < 1000 ? 4 : 5;

  return {
    personaId,
    scenario: `Practice applying ${concept.name} under pressure.`,
    targetSkills,
    difficulty,
    roundCount: 5,
  };
}

export function getProgramPhaseLabel(phaseIndex: number): string {
  const phases = ['Warm-Up', 'Drill', 'Sparring', 'Recovery'];
  return phases[phaseIndex] ?? 'Unknown';
}

export function getProgramPhaseDescription(phaseIndex: number): string {
  const descriptions = [
    'Review today\'s concept and prepare your mindset.',
    'Practice specific techniques in focused micro-exercises.',
    'Apply everything under real conversational pressure.',
    'Debrief your performance, review patterns, and update your ELO.',
  ];
  return descriptions[phaseIndex] ?? '';
}

export function calculateProgramProgress(program: DailyProgram): {
  phase: number;
  phaseProgress: number;
  overallProgress: number;
} {
  const drillsCompleted = program.drills.filter((d) => d.completed).length;
  const totalDrills = program.drills.length;

  if (drillsCompleted === 0) {
    return { phase: 0, phaseProgress: 0, overallProgress: 0 };
  }

  if (drillsCompleted < totalDrills) {
    return {
      phase: 1,
      phaseProgress: drillsCompleted / totalDrills,
      overallProgress: 0.25 + (drillsCompleted / totalDrills) * 0.25,
    };
  }

  if (!program.completed) {
    return { phase: 2, phaseProgress: 0, overallProgress: 0.5 };
  }

  return { phase: 3, phaseProgress: 1, overallProgress: 1 };
}

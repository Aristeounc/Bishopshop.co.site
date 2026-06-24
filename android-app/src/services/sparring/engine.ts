import {
  SparringSession,
  SparringMessage,
  PersonaId,
  SkillTrackId,
  GymPhase,
  CoachFeedback,
  SparringConfig,
} from '@/models/types';
import { getPersona, getRandomOpeningLine, buildScenario } from './personas';
import { evaluateResponse } from './scoring';
import { generateDebrief } from './feedback';
import { generateSessionId } from '@/utils/helpers';
import { SESSION_CONFIG } from '@/utils/constants';

export interface SparringEngine {
  startSession: (userId: string, personaId: PersonaId, targetSkills: SkillTrackId[]) => SparringSession;
  processUserMessage: (session: SparringSession, userInput: string) => SparringEngineResponse;
  generatePersonaResponse: (session: SparringSession) => SparringMessage;
  transitionPhase: (session: SparringSession, newPhase: GymPhase) => SparringSession;
  endSession: (session: SparringSession, skillElos: Record<SkillTrackId, number>) => SparringSession;
}

export interface SparringEngineResponse {
  userMessage: SparringMessage;
  coachFeedback: CoachFeedback;
  personaResponse: SparringMessage;
  shouldEndSession: boolean;
}

export function createSparringEngine(): SparringEngine {
  return {
    startSession(userId: string, personaId: PersonaId, targetSkills: SkillTrackId[]): SparringSession {
      const persona = getPersona(personaId);
      const scenario = buildScenario(persona);
      const openingLine = getRandomOpeningLine(persona);

      const config: SparringConfig = {
        personaId,
        scenario,
        targetSkills,
        difficulty: persona.difficulty,
        roundCount: SESSION_CONFIG.MAX_ROUNDS,
      };

      const openingMessage: SparringMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}_0`,
        role: 'persona',
        content: openingLine,
        timestamp: new Date().toISOString(),
      };

      const scenarioMessage: SparringMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}_scenario`,
        role: 'coach',
        content: `Scenario: ${scenario}\n\nYou're facing ${persona.name} — ${persona.subtitle}. ${persona.trainsFocus}. Use the techniques you've learned.`,
        timestamp: new Date().toISOString(),
      };

      return {
        id: generateSessionId(),
        userId,
        personaId,
        phase: 'sparring',
        skillTracks: targetSkills,
        messages: [scenarioMessage, openingMessage],
        startedAt: new Date().toISOString(),
        eloChanges: {} as Record<SkillTrackId, number>,
      };
    },

    processUserMessage(session: SparringSession, userInput: string): SparringEngineResponse {
      const persona = getPersona(session.personaId);

      const userMessage: SparringMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}_user`,
        role: 'user',
        content: userInput,
        timestamp: new Date().toISOString(),
      };

      const feedback = evaluateResponse(userInput, persona.tactics, session.messages);
      userMessage.feedback = feedback;

      const coachMessage: SparringMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}_coach`,
        role: 'coach',
        content: feedback.summary,
        timestamp: new Date().toISOString(),
        feedback,
      };

      const personaResponse = this.generatePersonaResponse(session);

      const userMessages = [...session.messages, userMessage].filter((m) => m.role === 'user');
      const shouldEndSession = userMessages.length >= SESSION_CONFIG.MAX_ROUNDS;

      return {
        userMessage,
        coachFeedback: feedback,
        personaResponse,
        shouldEndSession,
      };
    },

    generatePersonaResponse(session: SparringSession): SparringMessage {
      const persona = getPersona(session.personaId);
      const userMessages = session.messages.filter((m) => m.role === 'user');
      const roundNumber = userMessages.length;

      const response = generateContextualResponse(persona.id, roundNumber, session.messages);

      return {
        id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}_persona`,
        role: 'persona',
        content: response,
        timestamp: new Date().toISOString(),
      };
    },

    transitionPhase(session: SparringSession, newPhase: GymPhase): SparringSession {
      const transitionMessage: SparringMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}_transition`,
        role: 'coach',
        content: getPhaseTransitionMessage(newPhase),
        timestamp: new Date().toISOString(),
      };

      return {
        ...session,
        phase: newPhase,
        messages: [...session.messages, transitionMessage],
      };
    },

    endSession(
      session: SparringSession,
      skillElos: Record<SkillTrackId, number>,
    ): SparringSession {
      const persona = getPersona(session.personaId);
      const debrief = generateDebrief(session, skillElos, persona.difficulty);

      return {
        ...session,
        completedAt: new Date().toISOString(),
        eloChanges: debrief.eloSummary
          ? Object.fromEntries(
              Object.entries(debrief.eloSummary).map(([k, v]) => [k, v.change]),
            ) as Record<SkillTrackId, number>
          : ({} as Record<SkillTrackId, number>),
        debrief,
      };
    },
  };
}

function generateContextualResponse(
  personaId: PersonaId,
  roundNumber: number,
  _messages: SparringMessage[],
): string {
  const responses: Record<PersonaId, string[][]> = {
    charmer: [
      [
        "You know, I can tell you really get it. Most people don't have that kind of intuition.",
        "I love how you think about this. You're clearly someone who values real connection.",
      ],
      [
        "Honestly? Between you and me, I've talked to a lot of people about this, and you're the only one who's really understood the vision.",
        "The fact that you're even considering this tells me everything I need to know about your character.",
      ],
      [
        "I have to say, after meeting hundreds of people in this space, your perspective is genuinely refreshing.",
        "People like us — we see things differently, don't we? That's why I think we'd work so well together.",
      ],
    ],
    closer: [
      [
        "Look, I want to be straight with you — I can only hold this price until end of business today.",
        "I've already got two other buyers lined up. I came to you first because I respect you.",
      ],
      [
        "The market's moving fast. Every day you wait, you're losing leverage.",
        "I'm going to level with you — my manager approved this deal, but only for today. Tomorrow it's off the table.",
      ],
      [
        "I know you need to think, but honestly? The people who overthink these things are the ones who miss out.",
        "This is the last one at this price point. After this, you're looking at a 30% premium.",
      ],
    ],
    guilt_tripper: [
      [
        "No, no, I get it. You have your priorities. I just... I thought ours aligned, that's all.",
        "It's fine. Really. I'll figure it out. I always do, eventually.",
      ],
      [
        "I just remember when the roles were reversed, I didn't hesitate. But everyone's different, I guess.",
        "I'm not trying to make you feel bad. I'm just... disappointed, I suppose.",
      ],
      [
        "You know what hurts most? It's not the 'no.' It's feeling like I don't matter enough for a real conversation about it.",
        "I've been thinking about this a lot, and I realize maybe I've been asking too much of people. Maybe I need to expect less.",
      ],
    ],
    stonewaller: [
      ["I don't know.", "Sure. Whatever."],
      ["Can we just drop it?", "I said it's fine."],
      ["There's nothing to talk about.", "I don't see the point."],
    ],
    authority: [
      [
        "I appreciate your enthusiasm, but the data simply doesn't support that approach.",
        "In my experience — and I've been doing this for two decades — that's a common misconception.",
      ],
      [
        "Look, I don't say this to be dismissive, but you might not have the full picture here.",
        "The research is quite clear on this. I'd be happy to share some papers if you'd like to understand better.",
      ],
      [
        "I've seen dozens of people try exactly what you're suggesting. It doesn't end well.",
        "With respect, I think you're oversimplifying a very nuanced issue.",
      ],
    ],
    negotiator: [
      [
        "That's an interesting starting point. Here's what I was thinking — and I think this is fair for both of us.",
        "I hear you. Let me offer a counter that I think addresses your concerns while being realistic about mine.",
      ],
      [
        "I appreciate you sharing that. In the spirit of transparency, let me tell you what I can work with.",
        "You've made some good points. I'm willing to move on X if you can be flexible on Y.",
      ],
      [
        "We're getting closer. I want to make this work — how about we package it differently?",
        "I've already made significant concessions. I need you to meet me halfway on this one.",
      ],
    ],
  };

  const personaResponses = responses[personaId] ?? responses.charmer;
  const roundIndex = Math.min(roundNumber, personaResponses.length - 1);
  const options = personaResponses[roundIndex];
  return options[Math.floor(Math.random() * options.length)];
}

function getPhaseTransitionMessage(phase: GymPhase): string {
  switch (phase) {
    case 'warmup':
      return "Let's begin with a warm-up. Review today's concept and prepare your mindset.";
    case 'drill':
      return "Time for drills. Practice the specific techniques in focused micro-exercises.";
    case 'sparring':
      return "Sparring time. Apply everything you've practiced under real conversational pressure.";
    case 'recovery':
      return "Recovery phase. Let's debrief your performance, review patterns, and update your ELO.";
  }
}

export const sparringEngine = createSparringEngine();

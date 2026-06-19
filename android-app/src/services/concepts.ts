import { SkillTrackId } from '@/models/types';

export interface Concept {
  id: string;
  name: string;
  expertSource: string;
  summary: string;
  keyTakeaways: string[];
  primarySkill: SkillTrackId;
  secondarySkills: SkillTrackId[];
  drillPrompts: string[];
}

export const CONCEPT_LIBRARY: Concept[] = [
  {
    id: 'nvc_observations',
    name: 'Observations vs. Evaluations',
    expertSource: 'Marshall Rosenberg — Nonviolent Communication',
    summary: 'Separate what you observe from how you interpret it. Observations are facts anyone would agree on; evaluations are your judgments about those facts. Leading with observations reduces defensiveness.',
    keyTakeaways: [
      'State what you see or hear without adding judgment',
      '"You left the dishes out" vs. "You never clean up"',
      'Observations invite dialogue; evaluations invite defense',
    ],
    primarySkill: 'connect',
    secondarySkills: ['regulate', 'empathize'],
    drillPrompts: [
      'Rewrite this evaluation as a pure observation: "You\'re always late to meetings."',
      'Your roommate left clothes on the floor again. Practice stating what you observe without judgment.',
    ],
  },
  {
    id: 'nvc_feelings',
    name: 'Identifying Feelings vs. Thoughts',
    expertSource: 'Marshall Rosenberg — Nonviolent Communication',
    summary: 'True feelings are emotions (sad, anxious, grateful). Thoughts disguised as feelings ("I feel ignored") actually contain a judgment about another person. Distinguishing the two helps you communicate authentically.',
    keyTakeaways: [
      '"I feel frustrated" = feeling. "I feel like you don\'t care" = thought.',
      'Authentic feelings create connection; thought-feelings create blame',
      'Practice naming the emotion underneath the story',
    ],
    primarySkill: 'regulate',
    secondarySkills: ['empathize', 'connect'],
    drillPrompts: [
      'Convert this thought-feeling into a real feeling: "I feel like nobody listens to me."',
      'Name three feelings you had today without using "good," "bad," or "fine."',
    ],
  },
  {
    id: 'nvc_needs',
    name: 'Expressing Needs Clearly',
    expertSource: 'Marshall Rosenberg — Nonviolent Communication',
    summary: 'Behind every feeling is an unmet need. When we express needs directly (safety, autonomy, connection) instead of strategies (you should, I want you to), we give others a chance to contribute willingly.',
    keyTakeaways: [
      'Needs are universal; strategies are specific ways to meet them',
      '"I need respect" → "I need to feel heard when I share ideas"',
      'Expressing needs vulnerably invites collaboration',
    ],
    primarySkill: 'assert',
    secondarySkills: ['connect', 'empathize'],
    drillPrompts: [
      'Identify the need behind this complaint: "You never text me back."',
      'Express a need without telling the other person what to do.',
    ],
  },
  {
    id: 'nvc_requests',
    name: 'Making Clear Requests',
    expertSource: 'Marshall Rosenberg — Nonviolent Communication',
    summary: 'Requests are specific, actionable, and genuinely open to "no." If saying no would have consequences, it\'s a demand disguised as a request. True requests empower the other person to contribute freely.',
    keyTakeaways: [
      'Requests are positive (what you want) not negative (what you don\'t want)',
      'They\'re specific enough to act on: "Would you be willing to..." ',
      'A request becomes a demand when "no" isn\'t genuinely acceptable',
    ],
    primarySkill: 'assert',
    secondarySkills: ['negotiate', 'connect'],
    drillPrompts: [
      'Turn this demand into a request: "Stop interrupting me."',
      'Make a request of your partner that is specific, positive, and truly open to no.',
    ],
  },
  {
    id: 'tactical_empathy',
    name: 'Tactical Empathy',
    expertSource: 'Chris Voss — Never Split the Difference',
    summary: 'Tactical empathy means understanding the other person\'s feelings and mindset, then using that understanding to influence the situation. It\'s not agreement — it\'s acknowledgment of their perspective.',
    keyTakeaways: [
      'Label emotions: "It sounds like you\'re feeling..."',
      'Mirrors: repeat the last 1-3 words they said as a question',
      'Accusation audits: preemptively acknowledge the worst they might think of you',
    ],
    primarySkill: 'empathize',
    secondarySkills: ['negotiate', 'listen'],
    drillPrompts: [
      'Your colleague says "This project is a nightmare." Create a tactical empathy response using a label.',
      'Practice an accusation audit for asking your boss for a raise.',
    ],
  },
  {
    id: 'calibrated_questions',
    name: 'Calibrated Questions',
    expertSource: 'Chris Voss — Never Split the Difference',
    summary: 'Calibrated questions start with "How" or "What" and give the other side the illusion of control while steering the conversation. They transform confrontation into collaborative problem-solving.',
    keyTakeaways: [
      '"How am I supposed to do that?" is more powerful than "No"',
      '"What" and "How" make them solve your problem for you',
      'Avoid "Why" — it triggers defensiveness',
    ],
    primarySkill: 'negotiate',
    secondarySkills: ['defend', 'close'],
    drillPrompts: [
      'Convert "I can\'t accept that price" into a calibrated question.',
      'Your partner wants to make a big purchase you disagree with. Ask three "How/What" questions instead of saying no.',
    ],
  },
  {
    id: 'gottman_repair',
    name: 'Repair Attempts',
    expertSource: 'John Gottman — The Gottman Method',
    summary: 'Repair attempts are any statement or action that prevents negativity from escalating. They can be humorous, affectionate, or simply a de-escalation. The ability to make and receive repair attempts is the #1 predictor of relationship success.',
    keyTakeaways: [
      'Repair attempts work even if they\'re clumsy',
      '"Can we start over?" is a valid repair',
      'The listener\'s job: watch for and accept repair attempts',
    ],
    primarySkill: 'connect',
    secondarySkills: ['regulate', 'empathize'],
    drillPrompts: [
      'An argument with your partner is escalating. Generate three different repair attempts.',
      'Your friend made a repair attempt but you missed it. How would you recognize one in retrospect?',
    ],
  },
  {
    id: 'four_horsemen',
    name: 'The Four Horsemen',
    expertSource: 'John Gottman — The Gottman Method',
    summary: 'Criticism, contempt, defensiveness, and stonewalling are the four communication patterns that predict relationship failure. Each has an antidote: gentle startup, appreciation, responsibility, and self-soothing.',
    keyTakeaways: [
      'Criticism → use gentle startup with "I feel... about... I need..."',
      'Contempt → build culture of appreciation and respect',
      'Defensiveness → take even partial responsibility',
      'Stonewalling → take a 20-minute break, then return',
    ],
    primarySkill: 'regulate',
    secondarySkills: ['connect', 'empathize'],
    drillPrompts: [
      'Identify which Horseman this is: "You ALWAYS forget. What\'s wrong with you?" Write the antidote.',
      'You notice yourself getting defensive. Practice taking partial responsibility first.',
    ],
  },
  {
    id: 'brene_vulnerability',
    name: 'The Vulnerability Framework',
    expertSource: 'Brené Brown — Daring Greatly',
    summary: 'Vulnerability is not weakness — it\'s the birthplace of connection, creativity, and change. It means showing up and being seen when you can\'t control the outcome. Courage starts with showing up.',
    keyTakeaways: [
      'Vulnerability requires boundaries, not over-sharing',
      'Sharing with people who have earned the right to hear it',
      'Armor (perfectionism, numbing, cynicism) blocks connection',
    ],
    primarySkill: 'connect',
    secondarySkills: ['assert', 'empathize'],
    drillPrompts: [
      'Share something mildly vulnerable with someone you trust today. Observe how it changes the dynamic.',
      'Identify one "armor" pattern you use. What emotion is it protecting?',
    ],
  },
  {
    id: 'jefferson_composure',
    name: 'The Three Cs: Composure',
    expertSource: 'Jefferson Fisher — The Three Cs Framework',
    summary: 'Composure is the first C — maintaining calm under verbal pressure. You don\'t respond to the energy of the attack; you respond at the energy you want the conversation to operate at.',
    keyTakeaways: [
      'Your calm is contagious — or your panic is',
      'Pause before responding. The pause is the technique.',
      'Lower your voice when provoked, don\'t raise it',
    ],
    primarySkill: 'regulate',
    secondarySkills: ['defend', 'assert'],
    drillPrompts: [
      'Someone raises their voice at you. Practice responding at half their volume.',
      'Count to five before your next three responses in any conversation today.',
    ],
  },
  {
    id: 'deep_listening',
    name: 'Deep Listening',
    expertSource: 'Celeste Headlee — We Need to Talk',
    summary: 'Deep listening means being fully present without planning your response. Most people listen just enough to form their reply. True listening requires setting aside your own agenda temporarily.',
    keyTakeaways: [
      'Don\'t equate your experience with theirs ("That happened to me too...")',
      'Stay out of the weeds — focus on their emotional experience',
      'If you lose attention, say "I want to make sure I understand"',
    ],
    primarySkill: 'listen',
    secondarySkills: ['empathize', 'connect'],
    drillPrompts: [
      'In your next conversation, count how many times you plan your response while they\'re talking.',
      'Practice asking a follow-up question instead of sharing your own story.',
    ],
  },
  {
    id: 'polyvagal_awareness',
    name: 'Polyvagal Awareness',
    expertSource: 'Stephen Porges — Polyvagal Theory',
    summary: 'Your nervous system has three states: ventral vagal (safe/social), sympathetic (fight/flight), and dorsal vagal (freeze/shutdown). Recognizing which state you\'re in is the first step to regulating your response.',
    keyTakeaways: [
      'You can\'t think clearly in fight/flight — regulate first',
      'Long exhales activate your ventral vagal (calming) system',
      'Co-regulation: a calm nervous system can calm others',
    ],
    primarySkill: 'regulate',
    secondarySkills: ['listen', 'empathize'],
    drillPrompts: [
      'Notice your nervous system state right now. Are you in ventral vagal, sympathetic, or dorsal?',
      'Practice the physiological sigh: double inhale through the nose, long exhale through the mouth.',
    ],
  },
  {
    id: 'boundary_formula',
    name: 'The Boundary Formula',
    expertSource: 'Nedra Glennon Tawwab — Set Boundaries, Find Peace',
    summary: 'Boundaries are not ultimatums — they\'re clear statements about what you will do. The formula: name the behavior, state the impact, make the request, state the consequence.',
    keyTakeaways: [
      'Boundaries protect you; they don\'t control others',
      '"When you X, I feel Y. I need Z. If it continues, I will W."',
      'You can be compassionate and firm simultaneously',
    ],
    primarySkill: 'assert',
    secondarySkills: ['regulate', 'defend'],
    drillPrompts: [
      'Write a boundary statement for a coworker who consistently interrupts you in meetings.',
      'Practice saying no to a request without explaining or apologizing.',
    ],
  },
  {
    id: 'influence_defense',
    name: 'Recognizing Influence Tactics',
    expertSource: 'Robert Cialdini — Influence: The Psychology of Persuasion',
    summary: 'Six principles of influence: reciprocity, commitment/consistency, social proof, authority, liking, and scarcity. Understanding these helps you recognize when they\'re being weaponized.',
    keyTakeaways: [
      'Reciprocity: unsolicited favors create obligation',
      'Social proof: "everyone is doing it" bypasses critical thinking',
      'Scarcity: artificial urgency short-circuits decision-making',
    ],
    primarySkill: 'defend',
    secondarySkills: ['negotiate', 'regulate'],
    drillPrompts: [
      'Recall a recent purchase. Which of Cialdini\'s six principles were used on you?',
      'Identify three influence tactics in the next advertisement you see.',
    ],
  },
  {
    id: 'emotional_bids',
    name: 'Emotional Bids',
    expertSource: 'John Gottman — The Relationship Cure',
    summary: 'An emotional bid is any attempt to connect — a comment, a question, a look, a touch. You can turn toward (engage), turn away (ignore), or turn against (reject). Consistently turning toward builds trust.',
    keyTakeaways: [
      'Most bids are subtle: "Look at that sunset" is a bid for shared experience',
      'Turning toward builds emotional bank account',
      'Masters of relationships turn toward 86% of the time',
    ],
    primarySkill: 'listen',
    secondarySkills: ['connect', 'empathize'],
    drillPrompts: [
      'Count how many emotional bids you receive today and whether you turned toward, away, or against.',
      'Make three intentional bids toward someone you care about.',
    ],
  },
  {
    id: 'eft_attachment',
    name: 'Attachment Patterns in Conflict',
    expertSource: 'Sue Johnson — Emotionally Focused Therapy',
    summary: 'In conflict, we fall into protest (pursuing) or withdrawal (distancing) patterns based on attachment needs. The underlying question is always: "Are you there for me?" Recognizing the pattern breaks the cycle.',
    keyTakeaways: [
      'Pursuers escalate to get a response; withdrawers shut down to stay safe',
      'Both are trying to manage the same fear: disconnection',
      'Name the pattern out loud to disrupt it',
    ],
    primarySkill: 'empathize',
    secondarySkills: ['connect', 'regulate'],
    drillPrompts: [
      'In your last argument, were you the pursuer or the withdrawer? What were you really asking for?',
      'Practice saying "I think we\'re in our pattern. Can we slow down?"',
    ],
  },
];

export function getConceptById(id: string): Concept | undefined {
  return CONCEPT_LIBRARY.find((c) => c.id === id);
}

export function getConceptsForSkill(skillId: SkillTrackId): Concept[] {
  return CONCEPT_LIBRARY.filter(
    (c) => c.primarySkill === skillId || c.secondarySkills.includes(skillId),
  );
}

export function getRandomConcept(excludeIds: string[] = []): Concept {
  const available = CONCEPT_LIBRARY.filter((c) => !excludeIds.includes(c.id));
  if (available.length === 0) return CONCEPT_LIBRARY[0];
  return available[Math.floor(Math.random() * available.length)];
}

export function getConceptForWeakestSkill(
  skillElos: Record<SkillTrackId, number>,
  completedConceptIds: string[],
): Concept {
  const sortedSkills = Object.entries(skillElos)
    .sort(([, a], [, b]) => a - b)
    .map(([id]) => id as SkillTrackId);

  for (const skillId of sortedSkills) {
    const concepts = getConceptsForSkill(skillId).filter(
      (c) => !completedConceptIds.includes(c.id),
    );
    if (concepts.length > 0) return concepts[0];
  }

  return getRandomConcept(completedConceptIds);
}

import { SkillTrackId } from '@/models/types';

export interface SubtextPrompt {
  id: string;
  statement: string;
  speaker: string;
  context: string;
  actualSubtext: string;
  underlyingEmotion: string;
  difficulty: number;
  skillTrack: SkillTrackId;
}

export interface SubtextSet {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  prompts: SubtextPrompt[];
}

export const SUBTEXT_SETS: SubtextSet[] = [
  {
    id: 'everyday_deflections',
    title: 'Everyday Deflections',
    description: 'Common phrases people use to hide what they really feel in daily life',
    difficulty: 1,
    prompts: [
      {
        id: 'ed_1',
        statement: "It's fine.",
        speaker: 'Your partner',
        context: 'You just cancelled dinner plans to work late for the third time this month.',
        actualSubtext: "I'm hurt that you chose something else over our time together but I don't feel safe saying that directly",
        underlyingEmotion: 'hurt',
        difficulty: 1,
        skillTrack: 'listen',
      },
      {
        id: 'ed_2',
        statement: "I'm not mad.",
        speaker: 'Your friend',
        context: 'You forgot their birthday last week and just realized it today.',
        actualSubtext: "I am hurt and disappointed but I don't want to seem needy or make you feel guilty",
        underlyingEmotion: 'sadness',
        difficulty: 1,
        skillTrack: 'empathize',
      },
      {
        id: 'ed_3',
        statement: "No worries!",
        speaker: 'Your coworker',
        context: 'You accidentally took credit for their idea in a team meeting.',
        actualSubtext: 'It actually does bother me but I want to keep things smooth and avoid confrontation',
        underlyingEmotion: 'resentment',
        difficulty: 2,
        skillTrack: 'listen',
      },
      {
        id: 'ed_4',
        statement: "I don't care.",
        speaker: 'Your teenage child',
        context: 'You told them they can\'t go to a party all their friends are attending.',
        actualSubtext: 'I care deeply and feel powerless and left out but showing that feels too vulnerable',
        underlyingEmotion: 'frustration',
        difficulty: 1,
        skillTrack: 'empathize',
      },
      {
        id: 'ed_5',
        statement: "Whatever you think is best.",
        speaker: 'Your partner',
        context: 'You\'re deciding where to move, and they clearly had a different city in mind.',
        actualSubtext: "I feel like my opinion doesn't matter and I've given up trying to be heard in this decision",
        underlyingEmotion: 'loneliness',
        difficulty: 2,
        skillTrack: 'listen',
      },
    ],
  },
  {
    id: 'workplace_tensions',
    title: 'Workplace Tensions',
    description: 'The things colleagues and bosses say when they can\'t speak plainly',
    difficulty: 2,
    prompts: [
      {
        id: 'wt_1',
        statement: 'Must be nice.',
        speaker: 'Your coworker',
        context: 'You mention leaving early on Friday for a long weekend.',
        actualSubtext: 'I feel resentful that I can\'t do the same and unappreciated for staying behind to cover',
        underlyingEmotion: 'resentment',
        difficulty: 2,
        skillTrack: 'listen',
      },
      {
        id: 'wt_2',
        statement: "I just think it's interesting that...",
        speaker: 'Your manager',
        context: 'They\'re reviewing your project timeline after a missed deadline.',
        actualSubtext: 'I am criticizing you but wrapping it in observational language to avoid direct confrontation',
        underlyingEmotion: 'frustration',
        difficulty: 2,
        skillTrack: 'defend',
      },
      {
        id: 'wt_3',
        statement: "I'm sure you tried your best.",
        speaker: 'Your boss',
        context: 'Your presentation didn\'t go well with the client.',
        actualSubtext: 'I am disappointed in your work and questioning your competence but want to seem supportive',
        underlyingEmotion: 'frustration',
        difficulty: 3,
        skillTrack: 'listen',
      },
      {
        id: 'wt_4',
        statement: "Per my last email...",
        speaker: 'A senior colleague',
        context: 'You asked a question that was already answered in a previous thread.',
        actualSubtext: "I'm annoyed that you didn't read my previous message and I feel my time is being wasted",
        underlyingEmotion: 'anger',
        difficulty: 2,
        skillTrack: 'defend',
      },
      {
        id: 'wt_5',
        statement: "That's one way to do it.",
        speaker: 'Your team lead',
        context: 'You just presented your approach to solving a technical problem.',
        actualSubtext: 'I think your approach is wrong but I don\'t want to directly override you in front of others',
        underlyingEmotion: 'frustration',
        difficulty: 3,
        skillTrack: 'listen',
      },
    ],
  },
  {
    id: 'relationship_undercurrents',
    title: 'Relationship Undercurrents',
    description: 'The loaded statements that surface in romantic relationships',
    difficulty: 3,
    prompts: [
      {
        id: 'ru_1',
        statement: 'Do whatever you want.',
        speaker: 'Your spouse',
        context: 'You\'re arguing about whether to visit your family or theirs for the holidays.',
        actualSubtext: 'I feel powerless in this conversation and I\'m withdrawing because fighting feels pointless',
        underlyingEmotion: 'hurt',
        difficulty: 3,
        skillTrack: 'empathize',
      },
      {
        id: 'ru_2',
        statement: "I just find it funny how...",
        speaker: 'Your partner',
        context: 'You went out with friends instead of staying home as loosely planned.',
        actualSubtext: 'I am angry and want to express it but wrapping it in humor lets me deny it if challenged',
        underlyingEmotion: 'anger',
        difficulty: 3,
        skillTrack: 'listen',
      },
      {
        id: 'ru_3',
        statement: "You wouldn't understand.",
        speaker: 'Your partner',
        context: 'You asked them what\'s been bothering them all evening.',
        actualSubtext: "I feel emotionally alone even when I'm with you and I've lost hope that you can meet me where I am",
        underlyingEmotion: 'loneliness',
        difficulty: 4,
        skillTrack: 'empathize',
      },
      {
        id: 'ru_4',
        statement: "I'm happy if you're happy.",
        speaker: 'Your partner',
        context: 'You just accepted a job offer that means relocating to another state.',
        actualSubtext: "I'm not happy about this at all but I'm suppressing my needs because I'm afraid of losing you",
        underlyingEmotion: 'fear',
        difficulty: 3,
        skillTrack: 'listen',
      },
      {
        id: 'ru_5',
        statement: "It's not a big deal.",
        speaker: 'Your partner',
        context: 'You forgot your anniversary. They said it casually but haven\'t spoken much since.',
        actualSubtext: 'It is a very big deal and I feel unimportant and like our relationship isn\'t a priority for you',
        underlyingEmotion: 'hurt',
        difficulty: 2,
        skillTrack: 'empathize',
      },
    ],
  },
  {
    id: 'family_dynamics',
    title: 'Family Dynamics',
    description: 'The subtext that runs deep in family conversations across generations',
    difficulty: 4,
    prompts: [
      {
        id: 'fd_1',
        statement: "I just want you to be happy.",
        speaker: 'Your mother',
        context: 'You told her you\'re changing careers from law to art.',
        actualSubtext: "I'm scared you're making a mistake and I feel helpless to protect you, but I know saying that would push you away",
        underlyingEmotion: 'fear',
        difficulty: 4,
        skillTrack: 'empathize',
      },
      {
        id: 'fd_2',
        statement: "Your sister never had this problem.",
        speaker: 'Your father',
        context: 'You\'re asking for help with a financial issue.',
        actualSubtext: "I'm disappointed and worried about you and I'm expressing it through comparison because I don't know how to be vulnerable",
        underlyingEmotion: 'shame',
        difficulty: 4,
        skillTrack: 'regulate',
      },
      {
        id: 'fd_3',
        statement: "Don't worry about me.",
        speaker: 'Your elderly parent',
        context: 'You live across the country and asked if they\'re lonely.',
        actualSubtext: 'I am lonely and I miss you terribly but I don\'t want to be a burden or make you feel guilty',
        underlyingEmotion: 'loneliness',
        difficulty: 3,
        skillTrack: 'empathize',
      },
      {
        id: 'fd_4',
        statement: "We'll see.",
        speaker: 'Your parent',
        context: 'You asked if they\'re coming to your wedding after they expressed disapproval of your partner.',
        actualSubtext: "I'm struggling between my desire to control and my fear of losing you and I'm stalling to avoid committing either way",
        underlyingEmotion: 'fear',
        difficulty: 5,
        skillTrack: 'regulate',
      },
      {
        id: 'fd_5',
        statement: "I guess I'm just old-fashioned.",
        speaker: 'Your parent',
        context: 'You shared that you and your partner are not planning to have children.',
        actualSubtext: "I feel grief about the future I imagined for our family and I'm using generational framing to avoid admitting this is about my own loss",
        underlyingEmotion: 'sadness',
        difficulty: 5,
        skillTrack: 'empathize',
      },
    ],
  },
  {
    id: 'social_masks',
    title: 'Social Masks',
    description: 'What people say to strangers, acquaintances, and in group settings to keep up appearances',
    difficulty: 3,
    prompts: [
      {
        id: 'sm_1',
        statement: "I'm so busy right now.",
        speaker: 'An acquaintance',
        context: 'You suggested getting coffee to catch up. They\'ve declined the last three times.',
        actualSubtext: "I don't want to invest in this relationship but I can't bring myself to say that directly",
        underlyingEmotion: 'anxiety',
        difficulty: 2,
        skillTrack: 'listen',
      },
      {
        id: 'sm_2',
        statement: "Oh, I didn't even notice.",
        speaker: 'Your friend',
        context: 'You got a promotion and they didn\'t. Everyone else congratulated you at dinner.',
        actualSubtext: "I did notice and I'm feeling jealous and left behind but admitting that feels shameful",
        underlyingEmotion: 'shame',
        difficulty: 3,
        skillTrack: 'empathize',
      },
      {
        id: 'sm_3',
        statement: "I was just joking.",
        speaker: 'A friend in a group',
        context: 'They made a cutting remark about your weight and you called it out.',
        actualSubtext: 'I meant what I said but I\'m retreating behind humor because I don\'t want to face accountability',
        underlyingEmotion: 'shame',
        difficulty: 3,
        skillTrack: 'defend',
      },
      {
        id: 'sm_4',
        statement: "You do you.",
        speaker: 'A close friend',
        context: 'You told them you\'re getting back together with an ex everyone warned you about.',
        actualSubtext: 'I think you\'re making a terrible mistake and I\'m frustrated that you won\'t listen, so I\'m detaching to protect myself',
        underlyingEmotion: 'frustration',
        difficulty: 4,
        skillTrack: 'listen',
      },
      {
        id: 'sm_5',
        statement: "That's... brave.",
        speaker: 'A colleague at a party',
        context: 'You mentioned you quit your stable job to start a food truck.',
        actualSubtext: "I think it's reckless and I would never do it but I can't say that without seeming unsupportive",
        underlyingEmotion: 'anxiety',
        difficulty: 3,
        skillTrack: 'listen',
      },
    ],
  },
];

export const SUBTEXT_PROMPTS: SubtextPrompt[] = SUBTEXT_SETS.flatMap((set) => set.prompts);

export function getSetById(id: string): SubtextSet | undefined {
  return SUBTEXT_SETS.find((s) => s.id === id);
}

export function getPromptsByDifficulty(maxDifficulty: number): SubtextPrompt[] {
  return SUBTEXT_PROMPTS.filter((p) => p.difficulty <= maxDifficulty);
}

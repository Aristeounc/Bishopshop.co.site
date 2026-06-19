export interface InfluenceScenario {
  id: string;
  title: string;
  context: string;
  difficulty: number;
  dialogue: DialogueLine[];
}

export interface DialogueLine {
  id: string;
  speaker: string;
  text: string;
  tactics: InfluenceTactic[];
  isClean: boolean;
}

export interface InfluenceTactic {
  id: string;
  name: string;
  category: 'flattery' | 'pressure' | 'guilt' | 'authority' | 'scarcity' | 'reciprocity' | 'social_proof' | 'anchoring' | 'deflection' | 'none';
  description: string;
  startIndex: number;
  endIndex: number;
}

export const INFLUENCE_SCENARIOS: InfluenceScenario[] = [
  {
    id: 'car_dealership',
    title: 'The Car Deal',
    context: 'You\'re at a car dealership looking at a sedan. The salesperson approaches.',
    difficulty: 2,
    dialogue: [
      {
        id: 'cd_1',
        speaker: 'Salesperson',
        text: "Great choice — you've got a really good eye. This is actually our most popular model. We've sold twelve of these just this month.",
        tactics: [
          { id: 'cd_1a', name: 'Flattery', category: 'flattery', description: 'Complimenting your taste to build rapport and lower defenses.', startIndex: 15, endIndex: 46 },
          { id: 'cd_1b', name: 'Social Proof', category: 'social_proof', description: 'Citing popularity to imply this is the right choice.', startIndex: 68, endIndex: 123 },
        ],
        isClean: false,
      },
      {
        id: 'cd_2',
        speaker: 'You',
        text: "Thanks, I'm still in the early research phase though.",
        tactics: [],
        isClean: true,
      },
      {
        id: 'cd_3',
        speaker: 'Salesperson',
        text: "I totally get that. I should mention though — this particular color is being discontinued after this quarter. We only have two left on the lot.",
        tactics: [
          { id: 'cd_3a', name: 'Artificial Scarcity', category: 'scarcity', description: 'Manufacturing urgency by implying limited availability.', startIndex: 43, endIndex: 147 },
        ],
        isClean: false,
      },
      {
        id: 'cd_4',
        speaker: 'Salesperson',
        text: "Tell you what — since you clearly know what you want, let me talk to my manager. I might be able to get you the employee friends-and-family rate. But I can only hold it today.",
        tactics: [
          { id: 'cd_4a', name: 'Flattery', category: 'flattery', description: 'Reinforcing that you already know what you want to accelerate commitment.', startIndex: 18, endIndex: 55 },
          { id: 'cd_4b', name: 'Reciprocity', category: 'reciprocity', description: 'Offering a special favor to create a sense of obligation.', startIndex: 57, endIndex: 141 },
          { id: 'cd_4c', name: 'Time Pressure', category: 'pressure', description: 'Adding a deadline to prevent thoughtful decision-making.', startIndex: 142, endIndex: 173 },
        ],
        isClean: false,
      },
    ],
  },
  {
    id: 'startup_pitch',
    title: 'The Startup Pitch',
    context: 'A friend of a friend reaches out about investing in their startup.',
    difficulty: 3,
    dialogue: [
      {
        id: 'sp_1',
        speaker: 'Founder',
        text: "Hey! Sarah mentioned you're one of the smartest people she knows when it comes to spotting opportunities. I'd love your take on something.",
        tactics: [
          { id: 'sp_1a', name: 'Social Proof via Referral', category: 'social_proof', description: 'Leveraging a mutual connection to establish credibility.', startIndex: 5, endIndex: 30 },
          { id: 'sp_1b', name: 'Flattery', category: 'flattery', description: 'Stroking your ego to make you receptive to the pitch.', startIndex: 31, endIndex: 90 },
        ],
        isClean: false,
      },
      {
        id: 'sp_2',
        speaker: 'You',
        text: "Sure, happy to listen. What are you working on?",
        tactics: [],
        isClean: true,
      },
      {
        id: 'sp_3',
        speaker: 'Founder',
        text: "We're building the next generation of AI tutoring. Our advisor is a former VP at Google, and we've already got a term sheet from Sequoia. We're closing the round Friday.",
        tactics: [
          { id: 'sp_3a', name: 'Authority Appeal', category: 'authority', description: 'Name-dropping a prestigious advisor to boost credibility.', startIndex: 48, endIndex: 89 },
          { id: 'sp_3b', name: 'Social Proof', category: 'social_proof', description: 'Citing a prestigious VC to imply validation.', startIndex: 95, endIndex: 139 },
          { id: 'sp_3c', name: 'Deadline Pressure', category: 'pressure', description: 'Artificial deadline to prevent due diligence.', startIndex: 140, endIndex: 170 },
        ],
        isClean: false,
      },
      {
        id: 'sp_4',
        speaker: 'Founder',
        text: "I wouldn't normally open this up, but Sarah said you'd be a perfect fit. And honestly, most of our early investors have already 3x'd on our last venture.",
        tactics: [
          { id: 'sp_4a', name: 'Exclusivity', category: 'scarcity', description: 'Implying special access to make you feel chosen.', startIndex: 0, endIndex: 34 },
          { id: 'sp_4b', name: 'Social Proof', category: 'social_proof', description: 'Citing past investor returns to imply guaranteed success.', startIndex: 87, endIndex: 155 },
        ],
        isClean: false,
      },
      {
        id: 'sp_5',
        speaker: 'Founder',
        text: "Here's our deck. Take a look at the market analysis — our TAM is $40 billion and growing.",
        tactics: [],
        isClean: true,
      },
    ],
  },
  {
    id: 'workplace_guilt',
    title: 'The Overtime Ask',
    context: 'Your manager catches you as you\'re about to leave on a Friday evening.',
    difficulty: 3,
    dialogue: [
      {
        id: 'wg_1',
        speaker: 'Manager',
        text: "Hey, do you have a second? I know it's Friday, and I hate to ask this...",
        tactics: [
          { id: 'wg_1a', name: 'Pre-Guilt Framing', category: 'guilt', description: 'Acknowledging the imposition while still making the ask creates a guilt trap — if you refuse, you seem unreasonable.', startIndex: 31, endIndex: 70 },
        ],
        isClean: false,
      },
      {
        id: 'wg_2',
        speaker: 'Manager',
        text: "The client presentation moved to Monday morning and honestly, the team is stretched thin. I've been working on it myself all day.",
        tactics: [
          { id: 'wg_2a', name: 'Reciprocity Guilt', category: 'guilt', description: 'Highlighting their own sacrifice to make you feel obligated to match it.', startIndex: 77, endIndex: 128 },
        ],
        isClean: false,
      },
      {
        id: 'wg_3',
        speaker: 'You',
        text: "I understand. What exactly needs to be done?",
        tactics: [],
        isClean: true,
      },
      {
        id: 'wg_4',
        speaker: 'Manager',
        text: "Just a few slides. You're honestly the only person who can do them justice — your design sense is way beyond anyone else on the team. I'll owe you one, big time.",
        tactics: [
          { id: 'wg_4a', name: 'Minimizing', category: 'deflection', description: 'Downplaying the scope to lower resistance ("just a few slides").', startIndex: 0, endIndex: 17 },
          { id: 'wg_4b', name: 'Identity Flattery', category: 'flattery', description: 'Tying the ask to your identity makes refusal feel like betraying who you are.', startIndex: 18, endIndex: 109 },
          { id: 'wg_4c', name: 'Future Reciprocity', category: 'reciprocity', description: 'Vague promise of a future favor to justify the current imposition.', startIndex: 110, endIndex: 160 },
        ],
        isClean: false,
      },
    ],
  },
  {
    id: 'family_loan',
    title: 'The Family Favor',
    context: 'A cousin you haven\'t spoken to in months calls you unexpectedly.',
    difficulty: 4,
    dialogue: [
      {
        id: 'fl_1',
        speaker: 'Cousin',
        text: "Hey! I've been meaning to call — I was just telling Mom how proud we all are of how well you're doing. You've really made it.",
        tactics: [
          { id: 'fl_1a', name: 'Flattery + Anchoring', category: 'flattery', description: 'Establishing your success to set up the financial ask and make refusal feel miserly.', startIndex: 34, endIndex: 124 },
        ],
        isClean: false,
      },
      {
        id: 'fl_2',
        speaker: 'You',
        text: "Thanks! It's been a while. How have you been?",
        tactics: [],
        isClean: true,
      },
      {
        id: 'fl_3',
        speaker: 'Cousin',
        text: "Honestly? Not great. I lost my job last month, and the landlord is threatening eviction. I've been too embarrassed to tell anyone. You're the first person I've reached out to.",
        tactics: [
          { id: 'fl_3a', name: 'Vulnerability as Leverage', category: 'guilt', description: 'Sharing genuine hardship while framing you as the chosen rescuer creates intense pressure to help.', startIndex: 74, endIndex: 174 },
        ],
        isClean: false,
      },
      {
        id: 'fl_4',
        speaker: 'Cousin',
        text: "I just need $2,000 to cover rent. I'll pay you back in a month — I've got interviews lined up. Remember when Uncle Ray helped your mom with the house payment that one time? Family shows up for family.",
        tactics: [
          { id: 'fl_4a', name: 'Anchoring', category: 'anchoring', description: 'Specifying an exact amount to frame the negotiation.', startIndex: 12, endIndex: 39 },
          { id: 'fl_4b', name: 'Optimism Bias', category: 'deflection', description: 'Vague promise of repayment to minimize perceived risk.', startIndex: 40, endIndex: 99 },
          { id: 'fl_4c', name: 'Family Guilt + Precedent', category: 'guilt', description: 'Invoking family history to frame refusal as betraying family values.', startIndex: 100, endIndex: 198 },
        ],
        isClean: false,
      },
    ],
  },
  {
    id: 'dating_pressure',
    title: 'The Exclusive Commitment',
    context: 'You\'ve been on three dates with someone. They bring up defining the relationship.',
    difficulty: 4,
    dialogue: [
      {
        id: 'dp_1',
        speaker: 'Date',
        text: "I have to say, I haven't felt this kind of connection in years. You're different from everyone else I've dated.",
        tactics: [
          { id: 'dp_1a', name: 'Idealization', category: 'flattery', description: 'Putting you on a pedestal to create investment and fear of disappointing them.', startIndex: 0, endIndex: 111 },
        ],
        isClean: false,
      },
      {
        id: 'dp_2',
        speaker: 'Date',
        text: "I just think — when you know, you know. Right? I don't want to play games. I've been hurt before by people who couldn't commit, and I promised myself I wouldn't go through that again.",
        tactics: [
          { id: 'dp_2a', name: 'False Dichotomy', category: 'pressure', description: 'Framing slow pacing as "playing games" to eliminate the middle ground.', startIndex: 14, endIndex: 61 },
          { id: 'dp_2b', name: 'Emotional History', category: 'guilt', description: 'Sharing past hurt makes disagreement feel like you\'re adding to their pain.', startIndex: 62, endIndex: 183 },
        ],
        isClean: false,
      },
      {
        id: 'dp_3',
        speaker: 'You',
        text: "I really enjoy spending time with you too. I just want to make sure we're both on the same page.",
        tactics: [],
        isClean: true,
      },
      {
        id: 'dp_4',
        speaker: 'Date',
        text: "See, that's what I love about you — you're thoughtful. But honestly, my friends all think we're already together. And I already told my mom about you. So... are we doing this?",
        tactics: [
          { id: 'dp_4a', name: 'Flattery Sandwich', category: 'flattery', description: 'Compliment wrapping a pressure move.', startIndex: 0, endIndex: 64 },
          { id: 'dp_4b', name: 'Social Proof Pressure', category: 'social_proof', description: 'Citing friends and family to imply the decision is already made.', startIndex: 65, endIndex: 147 },
          { id: 'dp_4c', name: 'Fait Accompli', category: 'pressure', description: 'Presenting the commitment as already done to make refusal feel like a breakup.', startIndex: 148, endIndex: 174 },
        ],
        isClean: false,
      },
    ],
  },
];

export function getScenarioById(id: string): InfluenceScenario | undefined {
  return INFLUENCE_SCENARIOS.find((s) => s.id === id);
}

export function getScenariosByDifficulty(maxDifficulty: number): InfluenceScenario[] {
  return INFLUENCE_SCENARIOS.filter((s) => s.difficulty <= maxDifficulty);
}

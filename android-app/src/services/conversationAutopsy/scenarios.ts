import { SkillTrackId } from '@/models/types';

export interface AutopsyLine {
  id: string;
  speaker: string;
  text: string;
  isDerailment: boolean;
}

export type MistakeCategory =
  | 'criticism'
  | 'contempt'
  | 'defensiveness'
  | 'stonewalling'
  | 'boundary_violation'
  | 'manipulation'
  | 'escalation'
  | 'invalidation';

export interface AutopsyScenario {
  id: string;
  title: string;
  context: string;
  difficulty: number;
  dialogue: AutopsyLine[];
  derailmentDiagnosis: string;
  mistakeCategory: MistakeCategory;
  betterAlternative: string;
  skillsInvolved: SkillTrackId[];
}

export const AUTOPSY_SCENARIOS: AutopsyScenario[] = [
  {
    id: 'chores_blowup',
    title: 'The Chores Argument',
    context: 'A couple is discussing how to split household chores after a long week. Both are tired.',
    difficulty: 2,
    dialogue: [
      {
        id: 'cb_1',
        speaker: 'Alex',
        text: "Hey, can we talk about the dishes? They've been piling up and it's starting to stress me out.",
        isDerailment: false,
      },
      {
        id: 'cb_2',
        speaker: 'Jordan',
        text: "Yeah, I noticed. I was planning to get to them after I finished this work thing.",
        isDerailment: false,
      },
      {
        id: 'cb_3',
        speaker: 'Alex',
        text: "Okay, but this keeps happening. Can we figure out a system so it doesn't pile up like this?",
        isDerailment: false,
      },
      {
        id: 'cb_4',
        speaker: 'Jordan',
        text: "I mean, I do plenty around here. I took out the trash, I did laundry last weekend...",
        isDerailment: false,
      },
      {
        id: 'cb_5',
        speaker: 'Alex',
        text: "You ALWAYS do this. You never just handle things without me having to nag you about it. I'm basically your parent.",
        isDerailment: true,
      },
      {
        id: 'cb_6',
        speaker: 'Jordan',
        text: "Wow, okay. That's really unfair. I'm done talking about this.",
        isDerailment: false,
      },
      {
        id: 'cb_7',
        speaker: 'Alex',
        text: "See? You can't even have a conversation without shutting down.",
        isDerailment: false,
      },
    ],
    derailmentDiagnosis: "Alex shifted from a specific request about dishes to a sweeping character attack using \"always\" and \"never.\" Comparing Jordan to a child they need to parent turns a solvable logistics problem into a personal indictment.",
    mistakeCategory: 'criticism',
    betterAlternative: "I notice I'm getting frustrated because this has happened a few times. Could we set up a rotation or a shared checklist so we both know what's expected?",
    skillsInvolved: ['regulate', 'assert', 'connect'],
  },
  {
    id: 'feedback_shutdown',
    title: 'The Performance Review',
    context: 'A manager is giving a direct report feedback on a client presentation that had some issues.',
    difficulty: 3,
    dialogue: [
      {
        id: 'fs_1',
        speaker: 'Manager',
        text: "Thanks for sitting down. I wanted to talk about the Parsons presentation yesterday.",
        isDerailment: false,
      },
      {
        id: 'fs_2',
        speaker: 'Employee',
        text: "Sure. I thought it went pretty well overall. The client seemed engaged.",
        isDerailment: false,
      },
      {
        id: 'fs_3',
        speaker: 'Manager',
        text: "There were some strong moments. I did notice a few spots where the data slides could have been clearer. Want to walk through them?",
        isDerailment: false,
      },
      {
        id: 'fs_4',
        speaker: 'Employee',
        text: "Well, the data was correct. I double-checked everything. And honestly, the slides were based on the template you approved last month.",
        isDerailment: true,
      },
      {
        id: 'fs_5',
        speaker: 'Manager',
        text: "I'm not questioning the accuracy. I'm talking about how it was presented to the client.",
        isDerailment: false,
      },
      {
        id: 'fs_6',
        speaker: 'Employee',
        text: "I just think it's hard to hear feedback when nobody mentioned any issues during the dry run.",
        isDerailment: false,
      },
      {
        id: 'fs_7',
        speaker: 'Manager',
        text: "That's a fair point about the dry run. Let's figure out how to catch these things earlier next time.",
        isDerailment: false,
      },
    ],
    derailmentDiagnosis: "Instead of hearing the feedback, the employee immediately deflected by asserting the data was correct (addressing a different concern) and then shifted blame to the manager by citing the approved template. This defensiveness closed the door on a constructive conversation.",
    mistakeCategory: 'defensiveness',
    betterAlternative: "That's good to hear. I want to keep improving these. Which slides felt unclear? I'd like to understand what the client was missing.",
    skillsInvolved: ['listen', 'regulate', 'connect'],
  },
  {
    id: 'money_owed',
    title: 'The Unpaid Debt',
    context: 'Two friends are at a coffee shop. One lent the other $300 two months ago and it hasn\'t been repaid.',
    difficulty: 3,
    dialogue: [
      {
        id: 'mo_1',
        speaker: 'Sam',
        text: "Hey, this is a little awkward, but I wanted to bring up the $300 from a couple months ago. Are you able to pay that back soon?",
        isDerailment: false,
      },
      {
        id: 'mo_2',
        speaker: 'Riley',
        text: "Oh yeah, I've been meaning to get to that. Things have been really tight with the car repair and everything.",
        isDerailment: false,
      },
      {
        id: 'mo_3',
        speaker: 'Sam',
        text: "I understand things are tight. I'm just a little stretched myself, so I wanted to check in on a timeline.",
        isDerailment: false,
      },
      {
        id: 'mo_4',
        speaker: 'Riley',
        text: "I mean, I'll get to it when I can. You know I'm good for it.",
        isDerailment: false,
      },
      {
        id: 'mo_5',
        speaker: 'Sam',
        text: "I know, but it's been two months. Could we maybe set a date, even if it's in installments?",
        isDerailment: false,
      },
      {
        id: 'mo_6',
        speaker: 'Riley',
        text: "Wow. I didn't realize our friendship had a price tag. After everything I've done for you? I helped you move, I drove you to the airport at 4 AM. But sure, let's nickel-and-dime each other.",
        isDerailment: true,
      },
      {
        id: 'mo_7',
        speaker: 'Sam',
        text: "That's not what I'm saying at all. I'm not keeping score.",
        isDerailment: false,
      },
      {
        id: 'mo_8',
        speaker: 'Riley',
        text: "It sure sounds like you are.",
        isDerailment: false,
      },
    ],
    derailmentDiagnosis: "Riley deflected a reasonable financial request by guilt-tripping Sam, reframing a straightforward debt as an attack on the friendship. Bringing up unrelated past favors and accusing Sam of putting a price tag on the relationship is manipulation designed to make Sam feel ashamed for asking.",
    mistakeCategory: 'manipulation',
    betterAlternative: "You're right, two months is a while. I can't do it all at once, but how about $100 this Friday and the rest over the next month? I don't want this hanging over us.",
    skillsInvolved: ['regulate', 'assert', 'negotiate'],
  },
  {
    id: 'curfew_clash',
    title: 'The Curfew Talk',
    context: 'A parent is discussing curfew with their 16-year-old after they came home an hour late last weekend.',
    difficulty: 2,
    dialogue: [
      {
        id: 'cc_1',
        speaker: 'Parent',
        text: "We need to talk about Saturday. You were supposed to be home by 10 and you got in at 11.",
        isDerailment: false,
      },
      {
        id: 'cc_2',
        speaker: 'Teen',
        text: "I know. Marcus's mom was late picking us up. I texted you.",
        isDerailment: false,
      },
      {
        id: 'cc_3',
        speaker: 'Parent',
        text: "You texted at 10:30, a half hour after you were already late. That's not the same as giving me a heads up.",
        isDerailment: false,
      },
      {
        id: 'cc_4',
        speaker: 'Teen',
        text: "It's not like I was out doing anything bad. We were literally just at Marcus's house playing video games. I don't understand why it's such a big deal.",
        isDerailment: false,
      },
      {
        id: 'cc_5',
        speaker: 'Parent',
        text: "It doesn't matter what you were doing. The rule is 10 o'clock, period.",
        isDerailment: false,
      },
      {
        id: 'cc_6',
        speaker: 'Teen',
        text: "But every single one of my friends has a later curfew. Even Marcus, and his parents are way stricter than you. It's embarrassing.",
        isDerailment: false,
      },
      {
        id: 'cc_7',
        speaker: 'Parent',
        text: "I don't care what other parents do. And honestly, you're being dramatic. It's not \"embarrassing\" — you just want to do whatever you want with zero consequences.",
        isDerailment: true,
      },
      {
        id: 'cc_8',
        speaker: 'Teen',
        text: "Forget it. You never listen to me anyway.",
        isDerailment: false,
      },
    ],
    derailmentDiagnosis: "The parent dismissed the teen's emotional experience by calling them \"dramatic\" and then attributed a selfish motive (\"zero consequences\") that the teen never expressed. This invalidation shuts down dialogue because the teen no longer feels their perspective is being heard at all.",
    mistakeCategory: 'invalidation',
    betterAlternative: "I hear you that it feels unfair compared to your friends. That's a real frustration. The curfew exists because I need to know you're safe, not to embarrass you. Can we talk about what a reasonable check-in plan looks like?",
    skillsInvolved: ['empathize', 'listen', 'connect'],
  },
  {
    id: 'project_clash',
    title: 'The Project Direction',
    context: 'Two coworkers are debating whether to rebuild a system from scratch or iterate on the existing one. A deadline is two weeks out.',
    difficulty: 4,
    dialogue: [
      {
        id: 'pc_1',
        speaker: 'Dana',
        text: "I really think we need to start fresh. The current codebase has so much technical debt that patching it will take longer than rebuilding.",
        isDerailment: false,
      },
      {
        id: 'pc_2',
        speaker: 'Marcus',
        text: "I disagree. We have two weeks. A rewrite is risky and we don't know what edge cases we'll hit. Iterating is safer.",
        isDerailment: false,
      },
      {
        id: 'pc_3',
        speaker: 'Dana',
        text: "Iterating on garbage just gives you polished garbage. We've patched this thing three times already and it still breaks.",
        isDerailment: false,
      },
      {
        id: 'pc_4',
        speaker: 'Marcus',
        text: "That's because the patches were rushed. If we take a disciplined approach this time, we can stabilize it.",
        isDerailment: false,
      },
      {
        id: 'pc_5',
        speaker: 'Dana',
        text: "A \"disciplined approach.\" Right. That's what you said last quarter, and we ended up doing an emergency deploy on a Sunday.",
        isDerailment: false,
      },
      {
        id: 'pc_6',
        speaker: 'Marcus',
        text: "That wasn't entirely my fault and you know it. The requirements changed mid-sprint.",
        isDerailment: false,
      },
      {
        id: 'pc_7',
        speaker: 'Dana',
        text: "Look, I know you're attached to this code because you wrote most of it, but maybe that's exactly why you can't see how broken it is. Someone with fresh eyes would agree with me in a second.",
        isDerailment: true,
      },
      {
        id: 'pc_8',
        speaker: 'Marcus',
        text: "So now I'm biased and incompetent? Great. Real productive, Dana.",
        isDerailment: false,
      },
      {
        id: 'pc_9',
        speaker: 'Dana',
        text: "I didn't say that. I'm saying we need to be objective.",
        isDerailment: false,
      },
    ],
    derailmentDiagnosis: "Dana stopped arguing the technical merits and instead attacked Marcus's ability to be objective by implying he's emotionally attached to his own code. The contemptuous framing — \"someone with fresh eyes would agree with me\" — positions Marcus as the only person who doesn't see the obvious truth, dismissing his judgment entirely.",
    mistakeCategory: 'contempt',
    betterAlternative: "I hear your concern about the risk. What if we time-box it? We spend two days on a rebuild spike, and if it's not clearly faster by Wednesday, we pivot to iterating. That way we're making the call based on evidence, not assumptions.",
    skillsInvolved: ['negotiate', 'regulate', 'assert'],
  },
  {
    id: 'vacation_planning',
    title: 'The Vacation Standoff',
    context: 'A couple is trying to plan their annual vacation. One wants the beach, the other wants a city trip.',
    difficulty: 3,
    dialogue: [
      {
        id: 'vp_1',
        speaker: 'Morgan',
        text: "So I was looking at flights to Barcelona. There's a great deal for the second week of August.",
        isDerailment: false,
      },
      {
        id: 'vp_2',
        speaker: 'Casey',
        text: "I thought we talked about doing a beach trip this year. I really need to just decompress.",
        isDerailment: false,
      },
      {
        id: 'vp_3',
        speaker: 'Morgan',
        text: "Barcelona has beaches! Plus there's amazing food and architecture. It's the best of both worlds.",
        isDerailment: false,
      },
      {
        id: 'vp_4',
        speaker: 'Casey',
        text: "That's not the same and you know it. A city beach crammed with tourists isn't relaxing. I'm talking about somewhere quiet where we can actually unwind.",
        isDerailment: false,
      },
      {
        id: 'vp_5',
        speaker: 'Morgan',
        text: "We did a beach trip two years ago and you were bored by day three. You were on your phone the whole time.",
        isDerailment: false,
      },
      {
        id: 'vp_6',
        speaker: 'Casey',
        text: "...",
        isDerailment: false,
      },
      {
        id: 'vp_7',
        speaker: 'Morgan',
        text: "Hello? Are you just going to sit there?",
        isDerailment: false,
      },
      {
        id: 'vp_8',
        speaker: 'Casey',
        text: "I don't know what you want me to say. You've clearly already decided. You always do this — you \"ask\" for my input but you've already booked the flights in your head. I'm done talking about it. Go wherever you want.",
        isDerailment: true,
      },
    ],
    derailmentDiagnosis: "Casey withdrew from the conversation entirely and combined stonewalling (\"I'm done talking about it\") with a sweeping accusation (\"You always do this\"). Instead of expressing frustration about feeling unheard, Casey escalated by shutting down and handing over all agency, which guarantees resentment rather than resolution.",
    mistakeCategory: 'escalation',
    betterAlternative: "I'm feeling frustrated because it seems like the decision is already made. I need us to actually weigh both options together. Can we each list what matters most and find something that hits both our priorities?",
    skillsInvolved: ['regulate', 'assert', 'negotiate', 'connect'],
  },
  {
    id: 'roommate_boundaries',
    title: 'The Uninvited Guest',
    context: 'Two roommates are talking after one repeatedly had their partner stay over without asking.',
    difficulty: 4,
    dialogue: [
      {
        id: 'rb_1',
        speaker: 'Taylor',
        text: "Hey, I need to bring something up. Chris has been staying over almost every night this week and it's starting to affect me.",
        isDerailment: false,
      },
      {
        id: 'rb_2',
        speaker: 'Avery',
        text: "It hasn't been every night. It's been like three or four times.",
        isDerailment: false,
      },
      {
        id: 'rb_3',
        speaker: 'Taylor',
        text: "Okay, several nights. The point is, when I signed the lease, I expected it to be two people sharing the space, not three.",
        isDerailment: false,
      },
      {
        id: 'rb_4',
        speaker: 'Avery',
        text: "Chris doesn't take up that much space. They're quiet, they clean up after themselves. I don't see the problem.",
        isDerailment: false,
      },
      {
        id: 'rb_5',
        speaker: 'Taylor',
        text: "The problem is that I didn't agree to a third person being here most of the week. I feel uncomfortable in my own apartment.",
        isDerailment: false,
      },
      {
        id: 'rb_6',
        speaker: 'Avery',
        text: "You're uncomfortable? That's kind of weird honestly. Chris has been nothing but nice to you. Maybe the issue is that you're just jealous because you're single. When you start dating someone, you'll understand.",
        isDerailment: true,
      },
      {
        id: 'rb_7',
        speaker: 'Taylor',
        text: "That's completely out of line. This has nothing to do with my relationship status.",
        isDerailment: false,
      },
      {
        id: 'rb_8',
        speaker: 'Avery',
        text: "I'm just saying, when you have someone, you'll get why this matters.",
        isDerailment: false,
      },
    ],
    derailmentDiagnosis: "Avery dismissed Taylor's legitimate boundary concern by attacking Taylor's character and relationship status. Calling the discomfort \"weird,\" attributing it to jealousy, and implying Taylor lacks the life experience to understand — this is a boundary violation that makes the conversation about Taylor's perceived deficiencies instead of the actual issue.",
    mistakeCategory: 'boundary_violation',
    betterAlternative: "I hear that it's more than you signed up for. I didn't realize it was bothering you that much. Can we set a number of nights per week that works for both of us? Like a max of two or three?",
    skillsInvolved: ['listen', 'empathize', 'negotiate'],
  },
];

export function getAutopsyById(id: string): AutopsyScenario | undefined {
  return AUTOPSY_SCENARIOS.find((s) => s.id === id);
}

export function getAutopsyByDifficulty(maxDifficulty: number): AutopsyScenario[] {
  return AUTOPSY_SCENARIOS.filter((s) => s.difficulty <= maxDifficulty);
}

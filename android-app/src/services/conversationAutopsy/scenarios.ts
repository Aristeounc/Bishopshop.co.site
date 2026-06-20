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
  {
    id: 'salary_negotiation',
    title: 'The Salary Negotiation',
    context: 'An employee has scheduled a meeting with their manager to discuss a raise after two years without one. The employee has prepared data on their contributions.',
    difficulty: 3,
    dialogue: [
      {
        id: 'sn_1',
        speaker: 'Employee',
        text: "Thanks for making time. I wanted to discuss my compensation. I've been at the same level for two years and I think my contributions have grown a lot since then.",
        isDerailment: false,
      },
      {
        id: 'sn_2',
        speaker: 'Manager',
        text: "Sure, I'm glad you brought it up. You've definitely taken on more responsibility. What are you thinking?",
        isDerailment: false,
      },
      {
        id: 'sn_3',
        speaker: 'Employee',
        text: "I've done some research and I think a 15% adjustment would bring me in line with market rate for my role and output.",
        isDerailment: false,
      },
      {
        id: 'sn_4',
        speaker: 'Manager',
        text: "Fifteen percent is significant. I'd need to look at the budget, but I hear you on the market data. Can you send me what you've pulled together?",
        isDerailment: false,
      },
      {
        id: 'sn_5',
        speaker: 'Employee',
        text: "Absolutely. I also wanted to mention that I led the Henderson account recovery, which saved us about $200K in annual revenue.",
        isDerailment: false,
      },
      {
        id: 'sn_6',
        speaker: 'Manager',
        text: "After everything we've invested in you — the training, the mentorship, the flexibility when you needed time off last year — I'm honestly a little surprised you're coming in here asking for more. Most people in your position would be grateful.",
        isDerailment: true,
      },
      {
        id: 'sn_7',
        speaker: 'Employee',
        text: "I... I am grateful. I wasn't trying to be ungrateful.",
        isDerailment: false,
      },
      {
        id: 'sn_8',
        speaker: 'Manager',
        text: "I know. Let me just see what I can do and we'll circle back.",
        isDerailment: false,
      },
    ],
    derailmentDiagnosis: "The manager shifted from a professional compensation discussion to a guilt-laden personal attack. By framing standard professional development and reasonable workplace accommodations as personal favors, and implying the employee should feel \"grateful\" rather than advocate for themselves, the manager used manipulation to make the employee feel ashamed for a legitimate request.",
    mistakeCategory: 'manipulation',
    betterAlternative: "I appreciate you laying this out with data. Fifteen percent is above what I can approve unilaterally, but let me take your market research and the Henderson example to the leadership team. Can we set a follow-up in two weeks to discuss what's possible?",
    skillsInvolved: ['regulate', 'listen', 'negotiate'],
  },
  {
    id: 'group_project',
    title: 'The Group Project',
    context: 'Three college students are meeting in the library to plan their semester research project. They need to choose a topic and divide responsibilities.',
    difficulty: 2,
    dialogue: [
      {
        id: 'gp_1',
        speaker: 'Priya',
        text: "Okay, so we need to pick a topic by Friday. I was thinking we could do something on urban food deserts — there's a ton of recent research on it.",
        isDerailment: false,
      },
      {
        id: 'gp_2',
        speaker: 'Jaden',
        text: "That could work. I also had an idea about social media's impact on local elections. It's super relevant right now.",
        isDerailment: false,
      },
      {
        id: 'gp_3',
        speaker: 'Lena',
        text: "Both are interesting. Priya, what angle were you thinking for the food deserts one?",
        isDerailment: false,
      },
      {
        id: 'gp_4',
        speaker: 'Priya',
        text: "I was thinking we could look at how zoning policies contribute to them and compare two neighborhoods in the city. We could even do some field research.",
        isDerailment: false,
      },
      {
        id: 'gp_5',
        speaker: 'Jaden',
        text: "I mean, no offense, but that's basically a high school topic. We're in a 400-level seminar. We need something that actually shows we can think critically, not just summarize articles about grocery stores.",
        isDerailment: true,
      },
      {
        id: 'gp_6',
        speaker: 'Priya',
        text: "It's not just about grocery stores. There's serious policy analysis involved.",
        isDerailment: false,
      },
      {
        id: 'gp_7',
        speaker: 'Lena',
        text: "Can we take a step back? I think both ideas have merit. Jaden, what specifically would your social media angle look like?",
        isDerailment: false,
      },
      {
        id: 'gp_8',
        speaker: 'Jaden',
        text: "I haven't fully fleshed it out yet, but it would definitely be more sophisticated than the food thing.",
        isDerailment: false,
      },
    ],
    derailmentDiagnosis: "Jaden dismissed Priya's well-developed idea with contempt by calling it a \"high school topic\" and implying she lacks critical thinking ability. Rather than engaging with the substance of her proposal or offering a concrete reason his idea was stronger, he belittled her contribution to elevate his own — which he hadn't even fleshed out.",
    mistakeCategory: 'contempt',
    betterAlternative: "That's a solid idea. My concern is whether the scope is narrow enough for a semester project. What if we compare the two topics on feasibility — data access, timeline, and how much original analysis we can do — and pick whichever one is stronger?",
    skillsInvolved: ['listen', 'assert', 'connect'],
  },
  {
    id: 'doctor_visit',
    title: 'The Doctor Visit',
    context: 'A patient has scheduled a longer appointment to discuss persistent fatigue and joint pain that has been affecting their daily life for several months. They have done some reading and want to explore possible causes.',
    difficulty: 4,
    dialogue: [
      {
        id: 'dv_1',
        speaker: 'Patient',
        text: "I've been dealing with fatigue and joint pain for about four months now. It's getting worse and it's affecting my work.",
        isDerailment: false,
      },
      {
        id: 'dv_2',
        speaker: 'Doctor',
        text: "I see. Let's go over your symptoms. Where exactly is the joint pain, and is it worse at any particular time of day?",
        isDerailment: false,
      },
      {
        id: 'dv_3',
        speaker: 'Patient',
        text: "Mostly my hands and knees, and it's worse in the morning. I've also noticed some swelling. I did some reading and I was wondering if it could be an autoimmune condition — maybe rheumatoid arthritis?",
        isDerailment: false,
      },
      {
        id: 'dv_4',
        speaker: 'Doctor',
        text: "Let's not jump to conclusions. Morning stiffness and swelling can have a lot of causes. I'd like to run some bloodwork first.",
        isDerailment: false,
      },
      {
        id: 'dv_5',
        speaker: 'Patient',
        text: "Of course. I just wanted to mention it because my aunt has RA and I know there's a genetic component. Should we include a rheumatoid factor test in the bloodwork?",
        isDerailment: false,
      },
      {
        id: 'dv_6',
        speaker: 'Doctor',
        text: "Look, I appreciate that you've been researching, but I'm the doctor here. Let me decide what tests to order. When patients come in with a diagnosis from Google, it actually makes it harder for me to do my job.",
        isDerailment: true,
      },
      {
        id: 'dv_7',
        speaker: 'Patient',
        text: "I wasn't trying to diagnose myself. I just thought the family history was relevant.",
        isDerailment: false,
      },
      {
        id: 'dv_8',
        speaker: 'Doctor',
        text: "It is, and I'll note it in your chart. Let's get the labs ordered and go from there.",
        isDerailment: false,
      },
      {
        id: 'dv_9',
        speaker: 'Patient',
        text: "Okay.",
        isDerailment: false,
      },
    ],
    derailmentDiagnosis: "The doctor used their authority to shut down a well-informed and reasonable patient question. The patient wasn't self-diagnosing — they were sharing relevant family history and asking if a specific test should be included. By framing the patient's engagement as an obstacle ('makes it harder for me to do my job'), the doctor invalidated the patient's agency in their own healthcare and discouraged future advocacy.",
    mistakeCategory: 'invalidation',
    betterAlternative: "That family history is actually really helpful — RA does have a genetic component. I'll include a rheumatoid factor and anti-CCP antibody test along with the standard panel. It's good that you're paying attention to this. Let's see what the results show and then we can discuss next steps together.",
    skillsInvolved: ['listen', 'empathize', 'connect'],
  },
  {
    id: 'breakup_conversation',
    title: 'The Breakup Conversation',
    context: 'A couple who have been together for three years are having a planned conversation about ending the relationship. Both agreed beforehand to try to handle it with respect.',
    difficulty: 5,
    dialogue: [
      {
        id: 'bc_1',
        speaker: 'Nadia',
        text: "I've been thinking a lot about what we talked about last week. I think we both know this isn't working anymore.",
        isDerailment: false,
      },
      {
        id: 'bc_2',
        speaker: 'Eli',
        text: "Yeah. It's hard to say out loud, but I feel it too. We've been going through the motions for a while.",
        isDerailment: false,
      },
      {
        id: 'bc_3',
        speaker: 'Nadia',
        text: "I still care about you. I just think we want different things going forward, and I don't want us to grow to resent each other.",
        isDerailment: false,
      },
      {
        id: 'bc_4',
        speaker: 'Eli',
        text: "I care about you too. I think part of the problem is that we stopped really talking to each other a long time ago.",
        isDerailment: false,
      },
      {
        id: 'bc_5',
        speaker: 'Nadia',
        text: "I agree. And I take responsibility for my part in that. I pulled away when things got hard instead of working through them.",
        isDerailment: false,
      },
      {
        id: 'bc_6',
        speaker: 'Eli',
        text: "You know what's funny? You say you pulled away, but I told you about my depression. I opened up to you about the darkest period of my life, and you're the one who decided to leave. So I hope you can live with that.",
        isDerailment: true,
      },
      {
        id: 'bc_7',
        speaker: 'Nadia',
        text: "That's not fair. Your mental health is not something I'm abandoning. That's a completely separate thing.",
        isDerailment: false,
      },
      {
        id: 'bc_8',
        speaker: 'Eli',
        text: "Is it? Because it sure feels like the same thing from where I'm sitting.",
        isDerailment: false,
      },
      {
        id: 'bc_9',
        speaker: 'Nadia',
        text: "Eli, I supported you through that. You know I did. Please don't use it like this.",
        isDerailment: false,
      },
    ],
    derailmentDiagnosis: "Eli weaponized a vulnerable disclosure — his depression — to guilt Nadia into staying or at minimum to inflict emotional pain on the way out. By reframing a mutual breakup as Nadia abandoning him during a mental health crisis, he turned something she'd supported him through into a weapon. The phrase 'I hope you can live with that' is designed to make her carry shame for a decision they both agreed was necessary.",
    mistakeCategory: 'manipulation',
    betterAlternative: "I hear you, and I know I have my part in it too. I'm scared about doing this alone, honestly. When you started pulling away, it felt connected to when I was at my lowest, and that's still something I'm processing. But I know that's my work to do, not yours to fix by staying.",
    skillsInvolved: ['regulate', 'empathize', 'assert', 'connect'],
  },
  {
    id: 'neighbor_dispute',
    title: 'The Neighbor Dispute',
    context: 'A resident knocks on their downstairs neighbor\'s door on a Saturday morning to discuss ongoing noise from late-night gatherings that have been happening every weekend.',
    difficulty: 3,
    dialogue: [
      {
        id: 'nd_1',
        speaker: 'Pat',
        text: "Hey, sorry to bother you. Do you have a minute? I wanted to talk about the noise from last night.",
        isDerailment: false,
      },
      {
        id: 'nd_2',
        speaker: 'Devon',
        text: "Oh, were we loud? I had a few friends over. Sorry if it carried.",
        isDerailment: false,
      },
      {
        id: 'nd_3',
        speaker: 'Pat',
        text: "Yeah, it was pretty loud until about 2 AM. My bedroom is right above your living room, so I can hear the music and conversations pretty clearly. This is the third weekend in a row.",
        isDerailment: false,
      },
      {
        id: 'nd_4',
        speaker: 'Devon',
        text: "I didn't realize it was that bad. I'll try to keep it down. It's just hard because my friends come over and we lose track of time.",
        isDerailment: false,
      },
      {
        id: 'nd_5',
        speaker: 'Pat',
        text: "I get that. I'm not saying you can't have people over. I just need the volume to come down after 11 or so. I get up early for work even on weekends.",
        isDerailment: false,
      },
      {
        id: 'nd_6',
        speaker: 'Devon',
        text: "Eleven? That's pretty early for a weekend. I mean, I pay rent here too. I have a right to enjoy my apartment.",
        isDerailment: false,
      },
      {
        id: 'nd_7',
        speaker: 'Pat',
        text: "I know you do. Maybe we can compromise — midnight? And just move the speakers away from the ceiling?",
        isDerailment: false,
      },
      {
        id: 'nd_8',
        speaker: 'Devon',
        text: "You know what, if you have a problem, go ahead and call the landlord. Or call the cops. See what happens. But I'm not going to have my neighbor dictating what I do in my own home. Keep knocking on my door and see how that works out for you.",
        isDerailment: true,
      },
      {
        id: 'nd_9',
        speaker: 'Pat',
        text: "I'm not trying to dictate anything. I came here to talk it out instead of going to the landlord.",
        isDerailment: false,
      },
    ],
    derailmentDiagnosis: "Devon escalated a reasonable neighbor conversation into a confrontation by issuing veiled threats ('see how that works out for you') and daring Pat to involve authorities. Pat had been respectful, offered compromises, and specifically chose direct conversation over formal complaints. Devon's response punished that good faith effort and reframed a polite request as an attack on their autonomy.",
    mistakeCategory: 'escalation',
    betterAlternative: "Midnight is more reasonable, yeah. And I can move the speakers — I honestly didn't think about the ceiling thing. If it's still too loud some night, just text me and I'll turn it down right away. I'd rather work it out between us.",
    skillsInvolved: ['regulate', 'negotiate', 'listen'],
  },
];

export function getAutopsyById(id: string): AutopsyScenario | undefined {
  return AUTOPSY_SCENARIOS.find((s) => s.id === id);
}

export function getAutopsyByDifficulty(maxDifficulty: number): AutopsyScenario[] {
  return AUTOPSY_SCENARIOS.filter((s) => s.difficulty <= maxDifficulty);
}

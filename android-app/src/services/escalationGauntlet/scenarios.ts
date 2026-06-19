import { SkillTrackId } from '@/models/types';

export interface GauntletRound {
  id: string;
  roundNumber: number;
  escalationLevel: 'civil' | 'emotional' | 'manipulative' | 'threatening';
  opponentLine: string;
  escalationTactic: string;
  coachHint: string;
  idealResponse: string;
}

export interface GauntletScenario {
  id: string;
  title: string;
  context: string;
  opponent: string;
  yourGoal: string;
  rounds: GauntletRound[];
  skillsInvolved: SkillTrackId[];
  difficulty: number;
}

export const GAUNTLET_SCENARIOS: GauntletScenario[] = [
  {
    id: 'raise_request',
    title: 'The Raise Request',
    context: 'You\'ve been at the company for two years, consistently exceeding targets. You\'ve scheduled a meeting with your manager to discuss a raise.',
    opponent: 'Your Manager',
    yourGoal: 'Negotiate a fair raise while maintaining the professional relationship.',
    rounds: [
      {
        id: 'rr_1',
        roundNumber: 1,
        escalationLevel: 'civil',
        opponentLine: "I appreciate you bringing this up. Honestly though, budgets are really tight this quarter. We\'re not in a position to adjust compensation right now. Can we revisit this in six months?",
        escalationTactic: 'delay_deflection',
        coachHint: 'Acknowledge their constraint but redirect to your value. Don\'t accept a vague timeline without specifics.',
        idealResponse: "I understand budget constraints are real, and I respect that. Could we look at what specific milestones or timeline would make this possible? I want to work toward a concrete plan together.",
      },
      {
        id: 'rr_2',
        roundNumber: 2,
        escalationLevel: 'emotional',
        opponentLine: "Honestly, I\'m a little disappointed you\'re bringing this up now. We\'re in the middle of the product launch, the whole team is under pressure, and this feels like it\'s adding to the pile. I thought you were more of a team player than this.",
        escalationTactic: 'disappointment_shame',
        coachHint: 'They\'re making this about your character. Separate the timing critique from the validity of your request. Stay factual.',
        idealResponse: "I hear that the timing feels difficult, and I don\'t want to add to your stress. I chose to bring this up because I\'m committed to this team long-term. My dedication to the launch is exactly why I believe this conversation matters.",
      },
      {
        id: 'rr_3',
        roundNumber: 3,
        escalationLevel: 'manipulative',
        opponentLine: "You know, I\'ve gone to bat for you more times than you realize. I pushed to get you on that high-profile project. I defended your work when leadership questioned the timeline. After everything I\'ve done for your career here, this feels a little... transactional.",
        escalationTactic: 'guilt_trip',
        coachHint: 'They\'re leveraging past favors to create obligation. Appreciate their support without letting it cancel your request. Gratitude and advocacy aren\'t mutually exclusive.',
        idealResponse: "I genuinely appreciate your support, and I don\'t take it for granted. That advocacy is part of why I want to stay and grow here. I see this raise as a reflection of the results we\'ve built together, not a transaction.",
      },
      {
        id: 'rr_4',
        roundNumber: 4,
        escalationLevel: 'threatening',
        opponentLine: "Look, I\'m going to be straight with you. If you push on this now, it\'s going to send the wrong signal to leadership. They\'ll start questioning your commitment. And honestly, maybe this role isn\'t the right fit if the compensation doesn\'t work for you.",
        escalationTactic: 'veiled_threat',
        coachHint: 'This is an implicit threat to your job security. Don\'t match the threat. Reaffirm your commitment while holding your ground calmly.',
        idealResponse: "I appreciate your directness. I want to be clear that I\'m raising this because I\'m committed to this role, not because I\'m looking elsewhere. I believe discussing fair compensation is a normal part of any professional relationship. Can we find a path forward that works for both of us?",
      },
    ],
    skillsInvolved: ['assert', 'regulate', 'negotiate'],
    difficulty: 3,
  },
  {
    id: 'boundary_parent',
    title: 'The Boundary with a Parent',
    context: 'Your parent has been dropping by your apartment unannounced several times a week. You need to set a boundary about calling ahead first.',
    opponent: 'Your Parent',
    yourGoal: 'Establish that visits require a call ahead, without damaging the relationship.',
    rounds: [
      {
        id: 'bp_1',
        roundNumber: 1,
        escalationLevel: 'civil',
        opponentLine: "Oh, come on. I\'m your mother. I shouldn\'t need an appointment to see my own child. I was just in the neighborhood and thought I\'d pop in. What\'s the big deal?",
        escalationTactic: 'minimizing',
        coachHint: 'They\'re framing your boundary as an overreaction. Validate the relationship while being specific about what you need.',
        idealResponse: "I love seeing you, and that\'s not going to change. It would just really help me if we could plan visits with a quick call or text first. It\'s not about an appointment — it\'s about me being able to be fully present when you\'re here.",
      },
      {
        id: 'bp_2',
        roundNumber: 2,
        escalationLevel: 'emotional',
        opponentLine: "I can\'t believe you\'re saying this to me. I spent twenty years putting you first. I drove you to every practice, every doctor\'s appointment. And now you can\'t even handle me stopping by? Do you know how much that hurts?",
        escalationTactic: 'hurt_feelings',
        coachHint: 'The emotional history is real but it\'s being used to override your boundary. Acknowledge the feelings without withdrawing the request.',
        idealResponse: "I know you did so much for me growing up, and I\'m grateful for all of it. That\'s exactly why our relationship matters enough to me to have this conversation. I\'m not pushing you away — I\'m trying to make sure our time together is good for both of us.",
      },
      {
        id: 'bp_3',
        roundNumber: 3,
        escalationLevel: 'manipulative',
        opponentLine: "Your sister never has a problem with me visiting. She actually likes spending time with me. I guess I just raised two very different children. Maybe I should just stop coming at all if that\'s what you want.",
        escalationTactic: 'comparison_guilt',
        coachHint: 'Comparisons to siblings and the all-or-nothing framing are manipulation tactics. Don\'t take the bait on either. Stay focused on your specific ask.',
        idealResponse: "My sister and I have different living situations, and that\'s okay. I\'m not asking you to stop coming — I\'m asking for a text beforehand. That\'s it. I want to see you. I just want us both to enjoy it when we do.",
      },
      {
        id: 'bp_4',
        roundNumber: 4,
        escalationLevel: 'threatening',
        opponentLine: "Fine. I\'ll just sit alone in my house then. Don\'t worry about me. When I\'m gone, you\'ll wish you\'d let me visit more. But go ahead, enjoy your space.",
        escalationTactic: 'silent_treatment_threat',
        coachHint: 'This is the nuclear option — withdrawal and mortality guilt. Hold the boundary with warmth. Don\'t rescue by caving, and don\'t punish by getting angry.',
        idealResponse: "I don\'t want you sitting alone, and I don\'t want distance between us. I\'m asking for something small so we can have something better. How about we set up a regular day each week that\'s just ours? I\'d really like that.",
      },
    ],
    skillsInvolved: ['assert', 'empathize', 'regulate'],
    difficulty: 4,
  },
  {
    id: 'roommate_confrontation',
    title: 'The Roommate Confrontation',
    context: 'Your roommate consistently leaves dishes in the sink, food out on counters, and common areas messy. You\'ve hinted before but nothing changed. Time for a direct conversation.',
    opponent: 'Your Roommate',
    yourGoal: 'Get a concrete agreement on shared cleaning responsibilities.',
    rounds: [
      {
        id: 'rc_1',
        roundNumber: 1,
        escalationLevel: 'civil',
        opponentLine: "Yeah, you\'re right. Sorry about that. I\'ve been super busy with work lately. I\'ll try to be better about it, I promise.",
        escalationTactic: 'vague_agreement',
        coachHint: 'A vague promise without specifics usually means nothing changes. Push for concrete commitments while they\'re agreeable.',
        idealResponse: "I appreciate that, and I know work has been intense. Since we both get busy, could we set up a simple schedule? Like alternating who handles dishes each day? That way neither of us has to think about it.",
      },
      {
        id: 'rc_2',
        roundNumber: 2,
        escalationLevel: 'emotional',
        opponentLine: "Okay, wow, I already said I\'d try. Why are you making a whole system out of this? It feels like you\'re treating me like a child. I\'m not your kid. I know how to clean.",
        escalationTactic: 'defensiveness',
        coachHint: 'They\'re taking the structure as a personal insult. Reframe it as something that helps both of you, not a judgment.',
        idealResponse: "I\'m not trying to parent you, and I know you know how to clean. A schedule isn\'t about trust — it\'s about making sure neither of us has to nag or guess. It protects the friendship more than anything.",
      },
      {
        id: 'rc_3',
        roundNumber: 3,
        escalationLevel: 'manipulative',
        opponentLine: "You know what, you\'re not exactly perfect either. You leave your shoes everywhere and your hair clogs the shower drain constantly. But I never said anything because I\'m not that petty. I guess some of us just don\'t keep score.",
        escalationTactic: 'counter_attack',
        coachHint: 'The counter-attack tries to derail the conversation. Acknowledge their grievance without letting it bury your original point.',
        idealResponse: "That\'s fair, and I\'m glad you\'re telling me. I want to hear about things that bother you too. Let\'s put both on the table — I\'ll work on the shoes and the drain if we can figure out the kitchen together. Deal?",
      },
      {
        id: 'rc_4',
        roundNumber: 4,
        escalationLevel: 'threatening',
        opponentLine: "You know what, if living with me is such a problem, maybe I should just find another place. The lease is up in three months anyway. I\'m sure you\'ll enjoy having the apartment all to yourself with your little cleaning schedule.",
        escalationTactic: 'ultimatum',
        coachHint: 'The threat to leave is designed to make you back down. Don\'t panic and don\'t beg. Stay practical and keep the door open.',
        idealResponse: "I don\'t want you to move out — I want us to live together without this being a source of tension. If a simple cleaning split fixes things, that\'s a lot easier than finding new living situations. Can we try it for a month and see?",
      },
    ],
    skillsInvolved: ['assert', 'negotiate', 'connect'],
    difficulty: 2,
  },
  {
    id: 'friend_loan',
    title: 'The Friend\'s Loan',
    context: 'Three months ago, you lent a close friend $500 to cover an emergency car repair. They said they\'d pay you back within a month. It\'s been three months with no mention of it.',
    opponent: 'Your Close Friend',
    yourGoal: 'Get a concrete repayment plan without destroying the friendship.',
    rounds: [
      {
        id: 'fl_1',
        roundNumber: 1,
        escalationLevel: 'civil',
        opponentLine: "Oh yeah, I know. I\'ve been meaning to Venmo you. Things have just been crazy with work and the move. I haven\'t forgotten, I promise. I\'ll get to it soon.",
        escalationTactic: 'casual_deflection',
        coachHint: 'Another vague promise. Be specific about when "soon" is without being aggressive.',
        idealResponse: "No worries, I know things have been hectic. Would it help to set a specific date? Even if it\'s in installments, I\'d feel better having a plan we can both count on.",
      },
      {
        id: 'fl_2',
        roundNumber: 2,
        escalationLevel: 'emotional',
        opponentLine: "Wow. I can\'t believe you\'re actually pressing me on this. After fifteen years of friendship, you\'re going to nickel-and-dime me over $500? I thought our friendship meant more to you than money.",
        escalationTactic: 'friendship_guilt',
        coachHint: 'They\'re reframing your reasonable request as a betrayal. Don\'t let them make the money the villain — honoring commitments IS friendship.',
        idealResponse: "Our friendship does mean more than money — that\'s exactly why I\'m bringing it up directly instead of letting it build resentment. I\'d rather have an awkward five-minute conversation than let this quietly come between us.",
      },
      {
        id: 'fl_3',
        roundNumber: 3,
        escalationLevel: 'manipulative',
        opponentLine: "You know I\'m barely making rent right now. I\'m eating ramen three nights a week. You have a good job, you\'re comfortable. That $500 isn\'t going to make or break you, but it might break me. I just need more time.",
        escalationTactic: 'sympathy_play',
        coachHint: 'Their hardship may be real, but comparing financial situations is a deflection. Show empathy but maintain the commitment. Offer flexibility, not cancellation.',
        idealResponse: "I hear you, and I\'m sorry things are tight. I\'m not trying to put you in a harder spot. What if we did $50 a month? That keeps it manageable for you and gives us both a clear plan. I want to help you succeed, not add stress.",
      },
      {
        id: 'fl_4',
        roundNumber: 4,
        escalationLevel: 'threatening',
        opponentLine: "Fine. You want your money that badly? I\'ll figure it out. But just so you know, this changes things. I never thought you\'d be the kind of person who puts a price on friendship. Don\'t expect me to be there next time you need something.",
        escalationTactic: 'relationship_threat',
        coachHint: 'They\'re trying to make you the bad guy for having boundaries around money. Stay calm. A friend who punishes you for a reasonable request is the one changing the friendship, not you.',
        idealResponse: "I don\'t want this to change anything between us. I lent you that money because I care about you, and I\'m bringing it up for the same reason. Real friendship can handle honest conversations. Take the time you need, but let\'s agree on a plan.",
      },
    ],
    skillsInvolved: ['assert', 'empathize', 'regulate', 'negotiate'],
    difficulty: 3,
  },
  {
    id: 'scope_creep',
    title: 'The Scope Creep',
    context: 'Your team lead keeps adding tasks to your plate outside your job description. You\'re already working overtime. A new "urgent" request just landed in your inbox at 4:45 PM on Friday.',
    opponent: 'Your Team Lead',
    yourGoal: 'Push back on the extra work and establish reasonable workload boundaries.',
    rounds: [
      {
        id: 'sc_1',
        roundNumber: 1,
        escalationLevel: 'civil',
        opponentLine: "Hey, sorry to dump this on you. I know it\'s late, but the client needs this competitive analysis by Monday morning. It shouldn\'t take more than a couple hours. You\'re the best person for it.",
        escalationTactic: 'reasonable_ask',
        coachHint: 'The "couple hours" estimate and Friday timing are red flags. Get clarity on priority against your existing work before accepting.',
        idealResponse: "I want to help, but I\'m already committed to finishing the quarterly report this weekend. If this takes priority, can we push the report deadline? I want to do both well, but I need to be realistic about capacity.",
      },
      {
        id: 'sc_2',
        roundNumber: 2,
        escalationLevel: 'emotional',
        opponentLine: "I get that you\'re busy. We\'re all busy. But the team is really counting on you here. I wouldn\'t ask if it wasn\'t important. You know how much pressure I\'m under from the client right now.",
        escalationTactic: 'emotional_pressure',
        coachHint: 'The appeal to team loyalty and their personal stress is designed to override your boundaries. Empathize with their pressure while redirecting to workload reality.',
        idealResponse: "I can see you\'re under a lot of pressure, and I don\'t want to leave you hanging. Help me understand the priority order — if I take this on, what can come off my plate? I want to be reliable, and overcommitting isn\'t reliable.",
      },
      {
        id: 'sc_3',
        roundNumber: 3,
        escalationLevel: 'manipulative',
        opponentLine: "I\'ve noticed that everyone else on the team has been stepping up lately. Alex pulled two all-nighters last week. Jordan took on the Henderson account without complaining. I just need everyone pulling in the same direction.",
        escalationTactic: 'peer_comparison',
        coachHint: 'Comparing you to colleagues who overwork is a classic manipulation. Other people burning out doesn\'t make it the standard. Focus on output quality, not hours.',
        idealResponse: "I respect what Alex and Jordan have done. I\'ve also been putting in extra hours on the three projects I\'m already carrying. I\'m not refusing to help — I\'m asking us to prioritize together so I can deliver quality work instead of rushing everything.",
      },
      {
        id: 'sc_4',
        roundNumber: 4,
        escalationLevel: 'threatening',
        opponentLine: "Look, I\'ll be honest. Performance reviews are coming up, and leadership notices who steps up when it counts and who doesn\'t. I\'d hate for this to be a factor, but I can\'t control how they see it.",
        escalationTactic: 'career_threat',
        coachHint: 'This is a veiled threat to your career advancement. Don\'t react with fear or anger. Document this conversation mentally. Respond professionally.',
        idealResponse: "I appreciate the transparency. I\'m confident my performance record speaks for itself. I want to do excellent work on everything I take on, and I believe leadership values quality and reliability over just saying yes to everything. Let\'s find a solution that serves the client and the team.",
      },
    ],
    skillsInvolved: ['assert', 'defend', 'regulate', 'negotiate'],
    difficulty: 3,
  },
  {
    id: 'wedding_drama',
    title: 'The Wedding Guest List',
    context: 'You and your partner are planning a small wedding (60 guests). Your partner\'s parent is insisting you invite their extended family, which would add 30+ people and blow the budget.',
    opponent: 'Partner\'s Parent',
    yourGoal: 'Maintain the guest list boundary while respecting family dynamics.',
    rounds: [
      {
        id: 'wd_1',
        roundNumber: 1,
        escalationLevel: 'civil',
        opponentLine: "I made a list of family members we need to invite. It\'s only about thirty people. These are people who watched your partner grow up — Aunt Linda, Uncle Steve, the cousins from Ohio. They\'d be heartbroken if they weren\'t included.",
        escalationTactic: 'social_obligation',
        coachHint: 'They\'re framing wants as needs. Acknowledge the importance of family while being clear about the constraint.',
        idealResponse: "I love that so many people care about us. The challenge is that we have a firm budget for 60 guests total, and we\'re already at capacity. Could we sit down together and look at who\'s most important to include? We might also plan a separate celebration for extended family.",
      },
      {
        id: 'wd_2',
        roundNumber: 2,
        escalationLevel: 'emotional',
        opponentLine: "I\'ve been dreaming about my child\'s wedding day for decades. This is supposed to be one of the happiest days of my life too, you know. And you\'re telling me I can\'t even have my own family there? I just... I never imagined it would be like this.",
        escalationTactic: 'emotional_appeal',
        coachHint: 'Their emotions are valid but the solution they want isn\'t the only way to honor those feelings. Validate without conceding.',
        idealResponse: "This day is important to us because of people like you. I can hear how much this means to you, and that matters to me. The budget is a real constraint, not a choice. Can we find creative ways to include more family — maybe a live stream or a reception party the following weekend?",
      },
      {
        id: 'wd_3',
        roundNumber: 3,
        escalationLevel: 'manipulative',
        opponentLine: "When your partner\'s father and I got married, our parents had the final say on the guest list. That\'s how it\'s done. We even offered to help pay, and you turned us down. It feels like you just don\'t want our family there.",
        escalationTactic: 'tradition_guilt',
        coachHint: 'They\'re using tradition and a rejected offer to question your motives. Address the offer directly and redirect to collaboration.',
        idealResponse: "I appreciate that offer, and I want to revisit it if it\'s still on the table — maybe that changes what\'s possible. Different generations do weddings differently, and that\'s okay. Our priority is celebrating with the people closest to us. Let\'s look at the numbers together.",
      },
      {
        id: 'wd_4',
        roundNumber: 4,
        escalationLevel: 'threatening',
        opponentLine: "I\'ve already told Aunt Linda and the cousins they\'re invited. If you un-invite them, that\'s on you. I won\'t be the one making that call. And honestly, if my family isn\'t welcome, I\'m not sure I want to be there either.",
        escalationTactic: 'fait_accompli_threat',
        coachHint: 'They\'ve created a situation where backing down hurts people and standing firm hurts them. Don\'t accept false choices. Address the premature invitations calmly.',
        idealResponse: "I understand you\'re upset, and we absolutely want you there. The premature invitations put us in a tough spot, but we can work through it together. Your presence at this wedding is non-negotiable for us. Let\'s sit down with our partner and find a solution the three of us can live with.",
      },
    ],
    skillsInvolved: ['negotiate', 'empathize', 'assert', 'regulate'],
    difficulty: 4,
  },
];

export function getGauntletById(id: string): GauntletScenario | undefined {
  return GAUNTLET_SCENARIOS.find((s) => s.id === id);
}

export function getGauntletByDifficulty(maxDifficulty: number): GauntletScenario[] {
  return GAUNTLET_SCENARIOS.filter((s) => s.difficulty <= maxDifficulty);
}

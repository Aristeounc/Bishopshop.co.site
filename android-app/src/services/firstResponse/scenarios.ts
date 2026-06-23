export interface FirstResponseSet {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  rounds: FirstResponseRound[];
}

export interface FirstResponseRound {
  id: string;
  provocation: string;
  speaker: string;
  context: string;
  timeLimitMs: number;
  strategies: ResponseStrategy[];
  correctStrategyId: string;
  idealResponse: string;
  explanation: string;
}

export interface ResponseStrategy {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export const FIRST_RESPONSE_SETS: FirstResponseSet[] = [
  {
    id: 'heated_moments',
    title: 'Heated Moments',
    description: 'Choose the right opening move when emotions run high',
    difficulty: 2,
    rounds: [
      {
        id: 'hm_1',
        provocation: '"You NEVER listen to me! I\'m done trying to explain myself!"',
        speaker: 'Partner',
        context: 'Recurring argument about household responsibilities',
        timeLimitMs: 15000,
        strategies: [
          { id: 'hm_1_mirror', label: 'Mirror', description: 'Reflect back what they said to show you heard them', icon: 'mirror' },
          { id: 'hm_1_defend', label: 'Defend', description: 'Explain why their accusation is wrong', icon: 'shield' },
          { id: 'hm_1_label', label: 'Label the Emotion', description: 'Name what they\'re feeling underneath the anger', icon: 'heart-pulse' },
          { id: 'hm_1_counter', label: 'Counter-Attack', description: 'Point out what they do wrong too', icon: 'sword' },
        ],
        correctStrategyId: 'hm_1_label',
        idealResponse: '"It sounds like you feel really unheard, and that\'s exhausting. I don\'t want that for us."',
        explanation: 'When someone says "you never listen," they\'re expressing emotional pain, not requesting debate. Labeling the emotion ("you feel unheard") de-escalates by showing you understand the feeling, not just the words.',
      },
      {
        id: 'hm_2',
        provocation: '"This is the worst service I\'ve ever experienced. I want to speak to your manager. NOW."',
        speaker: 'Angry customer',
        context: 'Their order was delayed by 20 minutes',
        timeLimitMs: 12000,
        strategies: [
          { id: 'hm_2_explain', label: 'Explain', description: 'Tell them why the delay happened', icon: 'information' },
          { id: 'hm_2_validate', label: 'Validate + Act', description: 'Acknowledge their frustration and take immediate action', icon: 'check-circle' },
          { id: 'hm_2_policy', label: 'Cite Policy', description: 'Explain the company\'s policy on delays', icon: 'file-document' },
          { id: 'hm_2_escalate', label: 'Escalate', description: 'Immediately get the manager', icon: 'arrow-up' },
        ],
        correctStrategyId: 'hm_2_validate',
        idealResponse: '"You\'re right to be frustrated — a 20-minute wait is too long. Let me fix this right now."',
        explanation: 'Explaining or citing policy feels like dismissal when someone is angry. Validate first, then act. The combination of "you\'re right" + immediate action usually disarms the escalation.',
      },
      {
        id: 'hm_3',
        provocation: '"You\'re being selfish. Everything is always about what YOU want."',
        speaker: 'Friend',
        context: 'You declined their invitation for the second time this month',
        timeLimitMs: 15000,
        strategies: [
          { id: 'hm_3_apologize', label: 'Apologize', description: 'Say sorry to defuse the situation', icon: 'hand-wave' },
          { id: 'hm_3_curious', label: 'Get Curious', description: 'Ask what\'s really going on for them', icon: 'head-question' },
          { id: 'hm_3_boundary', label: 'Hold Boundary', description: 'Reaffirm your right to say no', icon: 'shield-check' },
          { id: 'hm_3_match', label: 'Match Energy', description: 'Tell them they\'re being unfair', icon: 'flash' },
        ],
        correctStrategyId: 'hm_3_curious',
        idealResponse: '"That\'s a strong word. Help me understand — is this about tonight, or is something bigger going on?"',
        explanation: '"Selfish" is often a protest word that means "I feel unimportant to you." Getting curious about the real feeling prevents you from either caving (apologizing when you shouldn\'t) or escalating (defending your right to say no).',
      },
      {
        id: 'hm_4',
        provocation: '"I don\'t think you\'re ready for this promotion. Maybe in a year or two."',
        speaker: 'Manager',
        context: 'Annual review — you were expecting the promotion',
        timeLimitMs: 15000,
        strategies: [
          { id: 'hm_4_accept', label: 'Accept Quietly', description: 'Nod and plan to prove them wrong', icon: 'check' },
          { id: 'hm_4_calibrate', label: 'Calibrated Question', description: 'Ask a question that makes them think deeper', icon: 'target' },
          { id: 'hm_4_emotional', label: 'Show Disappointment', description: 'Express how let down you feel', icon: 'emoticon-sad' },
          { id: 'hm_4_threaten', label: 'Leverage', description: 'Mention other opportunities you\'re considering', icon: 'exit-run' },
        ],
        correctStrategyId: 'hm_4_calibrate',
        idealResponse: '"What would I need to demonstrate in the next quarter for you to feel confident in promoting me?"',
        explanation: 'Calibrated questions (what/how) put the other person to work solving your problem. This question makes your manager commit to specific criteria — turning a vague rejection into a concrete roadmap.',
      },
      {
        id: 'hm_5',
        provocation: '"If you leave me, I\'ll have nothing to live for."',
        speaker: 'Partner',
        context: 'You brought up concerns about the relationship',
        timeLimitMs: 15000,
        strategies: [
          { id: 'hm_5_stay', label: 'Reassure', description: 'Promise not to leave to calm them down', icon: 'hand-heart' },
          { id: 'hm_5_name', label: 'Name the Pattern', description: 'Point out that this is emotional manipulation', icon: 'alert' },
          { id: 'hm_5_care', label: 'Care + Boundary', description: 'Show compassion while not accepting responsibility for their wellbeing', icon: 'shield-heart' },
          { id: 'hm_5_ignore', label: 'Ignore It', description: 'Continue with what you were saying', icon: 'skip-forward' },
        ],
        correctStrategyId: 'hm_5_care',
        idealResponse: '"I care about you deeply, and what you\'re saying worries me. Your wellbeing matters — can we talk about getting you support?"',
        explanation: 'This is emotional crisis, not a negotiation. Don\'t promise to stay (enabling), call it manipulation (escalating), or ignore it (dangerous). Express genuine care while redirecting to professional support.',
      },
      {
        id: 'hm_6',
        provocation: '"You know what your problem is? You think you\'re smarter than everyone else."',
        speaker: 'Sibling',
        context: 'Family dinner after you corrected a factual error they made',
        timeLimitMs: 12000,
        strategies: [
          { id: 'hm_6_deflect', label: 'Deflect with Humor', description: 'Make a self-deprecating joke to lighten the mood', icon: 'emoticon-wink' },
          { id: 'hm_6_validate', label: 'Validate', description: 'Acknowledge their feeling even if you disagree with the framing', icon: 'heart' },
          { id: 'hm_6_correct', label: 'Correct', description: 'Explain that you were just sharing a fact', icon: 'book-open' },
          { id: 'hm_6_attack', label: 'Return Fire', description: 'Point out their insecurities', icon: 'fire' },
        ],
        correctStrategyId: 'hm_6_validate',
        idealResponse: '"I can see how that came across. That wasn\'t my intent. I value your perspective."',
        explanation: 'Personal attacks at family events are usually old wounds talking. Validating their perception (even if unfair) defuses the moment. Being "right" at dinner is never worth the family damage.',
      },
      {
        id: 'hm_7',
        provocation: '"I\'m fine." (Said with clenched jaw and watery eyes)',
        speaker: 'Close friend',
        context: 'You asked how they\'re doing after their parent\'s health scare',
        timeLimitMs: 15000,
        strategies: [
          { id: 'hm_7_accept', label: 'Accept It', description: 'Take their word for it and move on', icon: 'check' },
          { id: 'hm_7_push', label: 'Push Harder', description: 'Say "No you\'re not, tell me what\'s wrong"', icon: 'arrow-right-bold' },
          { id: 'hm_7_door', label: 'Leave the Door Open', description: 'Acknowledge + give permission without pushing', icon: 'door-open' },
          { id: 'hm_7_fix', label: 'Try to Fix', description: 'Start offering solutions and resources', icon: 'wrench' },
        ],
        correctStrategyId: 'hm_7_door',
        idealResponse: '"Okay. I\'m here whenever, no judgment. You don\'t have to carry this alone."',
        explanation: '"I\'m fine" when clearly not fine is a boundary test. Pushing past it feels invasive. Accepting it feels uncaring. The middle path: acknowledge gently and leave an open door. Let them choose when to walk through it.',
      },
      {
        id: 'hm_8',
        provocation: '"We need to cut your team\'s budget by 30%. Non-negotiable."',
        speaker: 'VP',
        context: 'Surprise budget meeting, your projects are at stake',
        timeLimitMs: 12000,
        strategies: [
          { id: 'hm_8_comply', label: 'Comply', description: 'Accept the cut and figure out how to make it work', icon: 'check-circle' },
          { id: 'hm_8_impact', label: 'Quantify Impact', description: 'Ask what outcomes they\'re willing to sacrifice', icon: 'chart-bar' },
          { id: 'hm_8_plead', label: 'Plead Your Case', description: 'List everything your team has accomplished', icon: 'text-box' },
          { id: 'hm_8_refuse', label: 'Refuse', description: 'Say you can\'t operate under those constraints', icon: 'close-circle' },
        ],
        correctStrategyId: 'hm_8_impact',
        idealResponse: '"I understand the need for cuts. Help me understand — which deliverables are you comfortable deprioritizing with a 30% reduction?"',
        explanation: 'Never fight the number — fight the scope. Making them choose what to cut forces them to confront the real cost of the decision. Often this reveals the cut is too deep, or at least gives you negotiating room.',
      },
    ],
  },
  {
    id: 'manipulation_defense',
    title: 'Manipulation Defense',
    description: 'Pick the right counter-move when someone tries to manipulate you',
    difficulty: 3,
    rounds: [
      {
        id: 'md_1',
        provocation: '"After everything I\'ve done for you, this is how you repay me?"',
        speaker: 'Parent',
        context: 'You chose a career path they disapprove of',
        timeLimitMs: 15000,
        strategies: [
          { id: 'md_1_guilt', label: 'Accept the Guilt', description: 'Acknowledge their sacrifices and reconsider', icon: 'hand-heart' },
          { id: 'md_1_separate', label: 'Separate + Affirm', description: 'Distinguish their love from your choices', icon: 'vector-difference' },
          { id: 'md_1_deflect', label: 'Deflect', description: 'Change the subject', icon: 'arrow-u-right-top' },
          { id: 'md_1_confront', label: 'Confront', description: 'Call out the guilt trip directly', icon: 'alert-circle' },
        ],
        correctStrategyId: 'md_1_separate',
        idealResponse: '"I\'m grateful for everything you\'ve given me. My career choice isn\'t a rejection of you — it\'s me building on what you taught me."',
        explanation: 'The guilt trip frames your independence as betrayal. The antidote is separating love from compliance. You can honor their investment AND choose your own path. These aren\'t contradictions.',
      },
      {
        id: 'md_2',
        provocation: '"Everyone else on the team is fine with working weekends. Are you not a team player?"',
        speaker: 'Manager',
        context: 'You pushed back on weekend work for the third time',
        timeLimitMs: 12000,
        strategies: [
          { id: 'md_2_comply', label: 'Comply', description: 'Agree to work the weekend to prove yourself', icon: 'check' },
          { id: 'md_2_reframe', label: 'Reframe', description: 'Redirect from loyalty to productivity', icon: 'refresh' },
          { id: 'md_2_argue', label: 'Argue', description: 'Tell them that\'s not fair', icon: 'message-alert' },
          { id: 'md_2_report', label: 'Report', description: 'Go to HR about the pressure', icon: 'flag' },
        ],
        correctStrategyId: 'md_2_reframe',
        idealResponse: '"I\'m committed to the team. I\'m also committed to delivering my best work, which requires rest. What can I reprioritize to hit our deadline during regular hours?"',
        explanation: 'The manipulation tactic here is false framing: weekend work = team player. Reframe it: sustained quality work = real team player. Then offer a concrete alternative.',
      },
      {
        id: 'md_3',
        provocation: '"I\'m not sure you could do better than me. You should feel lucky to have someone who puts up with you."',
        speaker: 'Partner',
        context: 'You mentioned feeling unhappy in the relationship',
        timeLimitMs: 15000,
        strategies: [
          { id: 'md_3_agree', label: 'Agree', description: 'Maybe they\'re right — lower your expectations', icon: 'trending-down' },
          { id: 'md_3_name', label: 'Name What\'s Happening', description: 'Identify this as a diminishing tactic', icon: 'eye' },
          { id: 'md_3_leave', label: 'Walk Away', description: 'End the conversation immediately', icon: 'exit-run' },
          { id: 'md_3_fight', label: 'Fight Back', description: 'Tell them all the things wrong with them', icon: 'sword-cross' },
        ],
        correctStrategyId: 'md_3_name',
        idealResponse: '"What I\'m hearing is that I should feel grateful instead of addressing what\'s not working. That\'s not a partnership — that\'s a power play."',
        explanation: 'This is a control tactic — diminishing your worth to keep you compliant. Naming the dynamic exposes it. You don\'t need to fight or flee; just see it clearly and say what it is.',
      },
      {
        id: 'md_4',
        provocation: '"I heard you talking about me to Sarah. I thought we were friends."',
        speaker: 'Friend',
        context: 'You vented to Sarah about a legitimate concern with this friend',
        timeLimitMs: 15000,
        strategies: [
          { id: 'md_4_deny', label: 'Deny', description: 'Say it didn\'t happen or was taken out of context', icon: 'close' },
          { id: 'md_4_own', label: 'Own + Redirect', description: 'Acknowledge honestly and redirect to the underlying issue', icon: 'arrow-right' },
          { id: 'md_4_blame', label: 'Blame Sarah', description: 'Say Sarah shouldn\'t have told them', icon: 'account-alert' },
          { id: 'md_4_flip', label: 'Flip It', description: 'Point out that the underlying concern is still valid', icon: 'swap-horizontal' },
        ],
        correctStrategyId: 'md_4_own',
        idealResponse: '"You\'re right, I should have come to you directly. I had a concern I didn\'t know how to bring up. Can we talk about it now?"',
        explanation: 'Own the mistake (talking behind their back) without abandoning the valid concern. This shows integrity — you\'re accountable AND honest. Don\'t let the method distract from the message.',
      },
      {
        id: 'md_5',
        provocation: '"You\'re overreacting. It was just a joke. Can\'t you take a joke?"',
        speaker: 'Colleague',
        context: 'They made a joke at your expense in a meeting',
        timeLimitMs: 12000,
        strategies: [
          { id: 'md_5_laugh', label: 'Laugh It Off', description: 'Pretend it didn\'t bother you', icon: 'emoticon' },
          { id: 'md_5_assert', label: 'Assert Your Reality', description: 'Stand firm on your experience without apologizing', icon: 'shield-check' },
          { id: 'md_5_escalate', label: 'Escalate', description: 'Report it to management', icon: 'arrow-up-bold' },
          { id: 'md_5_joke_back', label: 'Joke Back', description: 'Make a joke at their expense', icon: 'flash' },
        ],
        correctStrategyId: 'md_5_assert',
        idealResponse: '"If it lands as hurtful, it doesn\'t matter that it was intended as a joke. I\'d appreciate you not doing that in meetings."',
        explanation: '"It was just a joke" is a classic deflection that puts the blame on your reaction instead of their behavior. Assert that impact matters more than intent, and set a clear boundary.',
      },
      {
        id: 'md_6',
        provocation: '"If you really loved me, you wouldn\'t need time away from me."',
        speaker: 'Partner',
        context: 'You mentioned wanting a weekend trip with friends',
        timeLimitMs: 15000,
        strategies: [
          { id: 'md_6_prove', label: 'Prove Your Love', description: 'Cancel the trip and spend the weekend together', icon: 'heart' },
          { id: 'md_6_detach', label: 'Detach + Affirm', description: 'Separate love from constant proximity', icon: 'vector-difference' },
          { id: 'md_6_confront', label: 'Call It Out', description: 'Tell them this is controlling behavior', icon: 'alert-octagon' },
          { id: 'md_6_compromise', label: 'Compromise', description: 'Offer to shorten the trip', icon: 'scale-balance' },
        ],
        correctStrategyId: 'md_6_detach',
        idealResponse: '"I love you AND I need time with friends. Those aren\'t opposites — healthy people in healthy relationships have both."',
        explanation: 'The manipulation creates a false either/or: love me OR have your own life. The antidote is AND thinking. Healthy love includes space. Don\'t prove love by giving up autonomy.',
      },
      {
        id: 'md_7',
        provocation: '"I\'m not going to tell you again. This is how we do things here."',
        speaker: 'Senior colleague',
        context: 'You suggested a better process and they shut it down',
        timeLimitMs: 12000,
        strategies: [
          { id: 'md_7_submit', label: 'Submit', description: 'Follow the existing process without question', icon: 'check' },
          { id: 'md_7_question', label: 'Anchor to Outcome', description: 'Redirect from authority to shared goals', icon: 'target' },
          { id: 'md_7_argue', label: 'Argue', description: 'Insist your way is better', icon: 'sword-cross' },
          { id: 'md_7_go_around', label: 'Go Around', description: 'Implement your idea without telling them', icon: 'arrow-u-right-top' },
        ],
        correctStrategyId: 'md_7_question',
        idealResponse: '"I respect the established process. My goal is the same as yours — great outcomes. Can we test both approaches and let the results decide?"',
        explanation: 'Authority-based shutdowns avoid accountability. Anchoring to shared outcomes ("we both want great results") levels the playing field. Proposing a test removes ego from the equation.',
      },
      {
        id: 'md_8',
        provocation: '"I heard you might be job-hunting. Should I be worried about your commitment here?"',
        speaker: 'Manager',
        context: 'You updated your LinkedIn profile and someone noticed',
        timeLimitMs: 12000,
        strategies: [
          { id: 'md_8_deny', label: 'Deny Everything', description: 'Say you have no plans to leave', icon: 'close-circle' },
          { id: 'md_8_redirect', label: 'Redirect to Needs', description: 'Use this as an opening to discuss what would keep you', icon: 'arrow-right' },
          { id: 'md_8_confirm', label: 'Confirm', description: 'Admit you\'re looking to be honest', icon: 'check-bold' },
          { id: 'md_8_deflect', label: 'Deflect', description: 'Say you were just updating your profile', icon: 'arrow-u-right-top' },
        ],
        correctStrategyId: 'md_8_redirect',
        idealResponse: '"I\'m focused on doing great work here. I\'d love to talk about what growth looks like for me in this role — can we schedule time for that?"',
        explanation: 'Don\'t lie (damages trust) or confirm (loses leverage). Redirect the energy into a productive conversation about your future at the company. Their concern about losing you is actually leverage for getting what you want.',
      },
    ],
  },
];

export function getFirstResponseSetById(id: string): FirstResponseSet | undefined {
  return FIRST_RESPONSE_SETS.find((s) => s.id === id);
}

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
  {
    id: 'interests_not_positions',
    name: 'Interests, Not Positions',
    expertSource: 'Roger Fisher & William Ury — Getting to Yes',
    summary: 'Behind every stated position ("I want X") lies an underlying interest ("I need safety/recognition/fairness"). When both parties explore interests instead of defending positions, creative solutions emerge that satisfy everyone.',
    keyTakeaways: [
      'Positions are what people say they want; interests are why they want it',
      'Ask "Why is that important to you?" to uncover interests',
      'Multiple positions can satisfy the same interest — find the overlap',
    ],
    primarySkill: 'close',
    secondarySkills: ['negotiate', 'listen'],
    drillPrompts: [
      'Your coworker insists on working from home every Friday. Identify three possible interests behind this position.',
      'You and a friend disagree on where to eat. Practice exploring interests ("What are you in the mood for?") instead of debating positions.',
    ],
  },
  {
    id: 'batna_awareness',
    name: 'BATNA: Know Your Walk-Away',
    expertSource: 'Roger Fisher & William Ury — Getting to Yes',
    summary: 'Your BATNA (Best Alternative To a Negotiated Agreement) is what you will do if this conversation fails. Knowing your BATNA gives you confidence, prevents desperation, and helps you evaluate any offer objectively.',
    keyTakeaways: [
      'Never enter a negotiation without knowing your alternative',
      'A strong BATNA lets you walk away with confidence',
      'Improve your BATNA before the conversation, not during it',
    ],
    primarySkill: 'close',
    secondarySkills: ['negotiate', 'defend'],
    drillPrompts: [
      'You are negotiating a raise. Write out your BATNA and how it affects your minimum acceptable outcome.',
      'A friend wants you to commit to plans you are unsure about. What is your BATNA and how does it change what you say?',
    ],
  },
  {
    id: 'collaborative_framing',
    name: 'Collaborative Framing',
    expertSource: 'Stuart Diamond — Getting More',
    summary: 'Frame every conversation as a joint problem to solve, not a battle to win. When you signal "us vs. the problem" instead of "me vs. you," the other person shifts from opponent to partner.',
    keyTakeaways: [
      '"How can we figure this out together?" reframes confrontation as collaboration',
      'Use "we" language to create shared ownership of the outcome',
      'Find what they value and connect your proposal to it',
    ],
    primarySkill: 'close',
    secondarySkills: ['connect', 'negotiate'],
    drillPrompts: [
      'Reframe this confrontational statement as collaborative: "You need to lower the price or I am walking."',
      'Your landlord says your lease renewal will include a rent increase. Practice framing the conversation as a joint problem.',
    ],
  },
  {
    id: 'micro_yeses',
    name: 'The Micro-Yes Ladder',
    expertSource: 'Robert Cialdini — Pre-Suasion / Commitment-Consistency Research',
    summary: 'People are more likely to agree to a large request after agreeing to smaller related ones. In ethical conversation, micro-yeses build mutual understanding step-by-step, confirming alignment before asking for commitment.',
    keyTakeaways: [
      'Start with easy agreements: "Do you agree this is worth solving?"',
      'Each yes builds psychological momentum toward larger alignment',
      'Never use this to trap — each step should be genuinely consensual',
    ],
    primarySkill: 'close',
    secondarySkills: ['negotiate', 'assert'],
    drillPrompts: [
      'You want your team to adopt a new process. Write three micro-yes questions that build toward buy-in.',
      'Practice guiding a resistant friend toward trying a new restaurant using small agreement steps.',
    ],
  },
  {
    id: 'gaslighting_detection',
    name: 'Detecting Gaslighting',
    expertSource: 'Robin Stern — The Gaslight Effect',
    summary: 'Gaslighting is a pattern where someone makes you question your own reality, memory, or perceptions. The three stages — disbelief, defense, depression — escalate gradually. Recognizing the pattern early is the best defense.',
    keyTakeaways: [
      'Warning signs: "That never happened," "You are too sensitive," "You are imagining things"',
      'Trust your gut — if you feel confused after every conversation, pay attention',
      'Keep a journal of events to anchor your own reality',
    ],
    primarySkill: 'defend',
    secondarySkills: ['regulate', 'listen'],
    drillPrompts: [
      'Identify which gaslighting tactic is being used: "I never said that. You always twist my words."',
      'Write three grounding statements you can use when someone makes you doubt your own experience.',
    ],
  },
  {
    id: 'sunk_cost_awareness',
    name: 'Sunk Cost Resistance',
    expertSource: 'Richard Thaler & Daniel Kahneman — Behavioral Economics',
    summary: 'The sunk cost fallacy makes us continue investing in something because of what we have already spent, rather than what we will gain. In conversations, this sounds like "But I have already put so much into this." Recognizing this bias frees you to make better decisions.',
    keyTakeaways: [
      'Past investment should not dictate future decisions',
      '"I have already given so much" is an emotional trap, not a logical argument',
      'Ask: "If I were starting fresh today, would I still choose this?"',
    ],
    primarySkill: 'defend',
    secondarySkills: ['negotiate', 'regulate'],
    drillPrompts: [
      'Someone says "After everything I have done for you, how can you say no?" Identify the sunk cost fallacy and write a response.',
      'Think of a commitment you maintain only because of past investment. Practice the "fresh start" test.',
    ],
  },
  {
    id: 'pressure_pause',
    name: 'The Mindful Pause Under Pressure',
    expertSource: 'Ellen Langer — Mindfulness Research / Harvard',
    summary: 'When pressured to decide quickly, your critical thinking shuts down. A mindful pause — even five seconds — reactivates deliberate thought. Anyone who penalizes you for pausing is revealing that speed benefits them, not you.',
    keyTakeaways: [
      '"I need a moment to think" is always acceptable',
      'Urgency is often manufactured — real deadlines can survive a pause',
      'The discomfort of silence is temporary; a bad decision lasts',
    ],
    primarySkill: 'defend',
    secondarySkills: ['regulate', 'assert'],
    drillPrompts: [
      'A salesperson says "This deal expires today." Practice three responses that create space without losing the opportunity.',
      'In your next conversation, deliberately pause for 3 seconds before responding to any request. Notice what changes.',
    ],
  },
  {
    id: 'anchoring_awareness',
    name: 'Anchoring Awareness',
    expertSource: 'Daniel Kahneman & Amos Tversky — Judgment Under Uncertainty',
    summary: 'The first number or frame in a conversation disproportionately influences all subsequent judgments. This anchoring effect is automatic — even experts fall for it. Awareness lets you set anchors deliberately or resist them.',
    keyTakeaways: [
      'Whoever sets the first number shapes the entire negotiation range',
      'Counter an unfavorable anchor immediately — do not let it sit',
      'Prepare your own anchor before the conversation starts',
    ],
    primarySkill: 'negotiate',
    secondarySkills: ['defend', 'close'],
    drillPrompts: [
      'A recruiter offers you a salary 20% below market rate. Practice re-anchoring the conversation without being adversarial.',
      'Identify the anchor in this pitch: "Most clients invest $10,000, but we can do $5,000 for you."',
    ],
  },
  {
    id: 'expanding_the_pie',
    name: 'Expanding the Pie',
    expertSource: 'Max Bazerman & Margaret Neale — Negotiating Rationally',
    summary: 'Most people assume negotiations are zero-sum: if you win, I lose. In reality, parties usually value things differently. By discovering these differences, you can create value — expanding the pie before dividing it.',
    keyTakeaways: [
      'Trade what you value less for what you value more',
      'Ask "What else matters to you?" to discover tradeable differences',
      'A bigger pie means both sides can walk away with more',
    ],
    primarySkill: 'negotiate',
    secondarySkills: ['close', 'listen'],
    drillPrompts: [
      'You and a coworker both want the same conference room time slot. Find three dimensions you could trade on besides time.',
      'Practice asking "What would make this work better for you?" in a low-stakes disagreement today.',
    ],
  },
  {
    id: 'strategic_silence',
    name: 'Strategic Silence',
    expertSource: 'Jim Camp — Start with No / Negotiation Research',
    summary: 'Silence after a question or statement creates productive discomfort that the other person fills with information, concessions, or honest reflection. Most people rush to fill silence — learning to hold it is a superpower.',
    keyTakeaways: [
      'After making your point, stop talking. Let the other person respond.',
      'Silence communicates confidence and gives weight to your words',
      'Count to seven in your head — the urge to fill silence will pass',
    ],
    primarySkill: 'negotiate',
    secondarySkills: ['assert', 'listen'],
    drillPrompts: [
      'In your next negotiation or disagreement, make your key point and then stay silent for a full seven seconds.',
      'Practice asking a question and waiting for the complete answer without interjecting, even if the pause feels long.',
    ],
  },
  {
    id: 'perspective_taking',
    name: 'Imagine-Other Perspective',
    expertSource: 'C. Daniel Batson — Empathy-Altruism Research',
    summary: 'There are two ways to empathize: imagine how YOU would feel in their situation (imagine-self) or imagine how THEY feel given who they are (imagine-other). Imagine-other produces deeper empathy and reduces projection of your own values.',
    keyTakeaways: [
      'Imagine-self: "How would I feel?" — useful but limited by your own experience',
      'Imagine-other: "How do THEY feel, given their life?" — deeper and more accurate',
      'Ask about their experience instead of assuming it matches yours',
    ],
    primarySkill: 'empathize',
    secondarySkills: ['listen', 'connect'],
    drillPrompts: [
      'A colleague is upset about a policy change that does not bother you. Practice imagine-other: what might matter to them that does not matter to you?',
      'Think of someone you disagree with. Spend 60 seconds genuinely imagining their perspective given their background, not yours.',
    ],
  },
  {
    id: 'validation_levels',
    name: 'Six Levels of Validation',
    expertSource: 'Marsha Linehan — Dialectical Behavior Therapy',
    summary: 'Validation is not agreement — it is communicating that someone\'s experience makes sense. Linehan identified six levels, from paying attention (level 1) to radical genuineness (level 6). Higher levels create deeper connection.',
    keyTakeaways: [
      'Level 1: Be present. Level 2: Reflect back accurately.',
      'Level 3: Read the unspoken. Level 4: Validate based on their history.',
      'Level 5: Normalize ("Anyone would feel that way"). Level 6: Be radically genuine.',
    ],
    primarySkill: 'empathize',
    secondarySkills: ['listen', 'connect'],
    drillPrompts: [
      'Someone tells you they are anxious about a job interview. Write a response at validation Level 4 (based on their history) and Level 5 (normalizing).',
      'Practice validating an emotion you do not share: "I can see why you would feel that way because..."',
    ],
  },
  {
    id: 'reflective_listening',
    name: 'Reflective Listening',
    expertSource: 'Carl Rogers — Client-Centered Therapy',
    summary: 'Reflective listening means mirroring back both the content and the feeling of what someone said, showing you truly understood. It is not parroting — it is distilling their meaning and checking if you got it right.',
    keyTakeaways: [
      'Reflect content: "So what happened is..." Reflect feeling: "And that made you feel..."',
      'Use tentative language: "It sounds like..." to invite correction',
      'Reflection slows the conversation down and makes people feel deeply heard',
    ],
    primarySkill: 'listen',
    secondarySkills: ['empathize', 'connect'],
    drillPrompts: [
      'Your friend vents about a bad day at work. Practice reflecting both the content and the feeling without offering advice.',
      'In your next conversation, use "It sounds like..." at least twice and notice how the other person responds.',
    ],
  },
  {
    id: 'cognitive_reappraisal',
    name: 'Cognitive Reappraisal',
    expertSource: 'James Gross — Stanford Emotion Regulation Research',
    summary: 'Cognitive reappraisal means reinterpreting a situation to change its emotional impact. Unlike suppression (pushing feelings down), reappraisal changes what you feel by changing what you think. It is the most effective regulation strategy researchers have found.',
    keyTakeaways: [
      'Reframe threat as challenge: "This is hard" → "This is a chance to grow"',
      'Reappraisal works before the emotion peaks — catch it early',
      'It reduces negative emotion without the costs of suppression',
    ],
    primarySkill: 'regulate',
    secondarySkills: ['defend', 'empathize'],
    drillPrompts: [
      'Reappraise this situation: "My boss criticized my work in front of the whole team." Find two alternative interpretations.',
      'The next time you feel a surge of anger, pause and ask: "What else could this mean?"',
    ],
  },
  {
    id: 'window_of_tolerance',
    name: 'Window of Tolerance',
    expertSource: 'Daniel Siegel — Interpersonal Neurobiology',
    summary: 'Your window of tolerance is the zone of arousal where you can think clearly, feel emotions, and stay present. Above it you become hyperaroused (reactive, anxious); below it you become hypoaroused (numb, shut down). Effective communication requires staying inside your window.',
    keyTakeaways: [
      'Notice when you leave your window: racing heart (hyper) or going blank (hypo)',
      'Grounding techniques bring you back: cold water, 5-4-3-2-1 senses, movement',
      'Your window widens with practice — today\'s overwhelm becomes tomorrow\'s manageable',
    ],
    primarySkill: 'regulate',
    secondarySkills: ['listen', 'defend'],
    drillPrompts: [
      'Describe what your personal signs of leaving the window look like. What happens in your body when you go above? Below?',
      'Practice the 5-4-3-2-1 grounding technique right now: name 5 things you see, 4 you hear, 3 you can touch, 2 you smell, 1 you taste.',
    ],
  },
  {
    id: 'psychological_safety',
    name: 'Creating Psychological Safety',
    expertSource: 'Amy Edmondson — The Fearless Organization',
    summary: 'Psychological safety is the shared belief that it is safe to take interpersonal risks — to speak up, admit mistakes, or disagree. When people feel safe, conversations become honest. When they do not, you get silence and resentment.',
    keyTakeaways: [
      'Frame disagreements as learning: "Help me understand your thinking"',
      'Respond to mistakes with curiosity, not blame',
      'Model vulnerability first — share your own uncertainty to invite theirs',
    ],
    primarySkill: 'connect',
    secondarySkills: ['listen', 'empathize'],
    drillPrompts: [
      'A team member made an error. Practice responding with curiosity ("What can we learn?") instead of blame.',
      'In your next meeting, say "I might be wrong, but..." and notice how it changes the dynamic.',
    ],
  },
  {
    id: 'desc_assertion',
    name: 'The DESC Script',
    expertSource: 'Sharon & Gordon Bower — Asserting Yourself',
    summary: 'DESC is a four-step assertiveness framework: Describe the situation objectively, Express how you feel, Specify what you want, and state the positive Consequences. It gives structure to difficult conversations without aggression.',
    keyTakeaways: [
      'Describe: state facts without judgment. Express: use I-statements.',
      'Specify: make a clear, actionable request. Consequences: explain the positive outcome.',
      'DESC works for everything from workplace feedback to personal boundaries',
    ],
    primarySkill: 'assert',
    secondarySkills: ['close', 'regulate'],
    drillPrompts: [
      'Write a full DESC script for this situation: your coworker regularly takes credit for your ideas in meetings.',
      'Practice DESC for a lower-stakes situation: asking a roommate to do the dishes.',
    ],
  },

  // --- Offensive / Proactive Influence Concepts ---

  {
    id: 'presuasion_priming',
    name: 'Pre-Suasion: Setting the Stage',
    expertSource: 'Robert Cialdini — Pre-Suasion',
    summary: 'What you do before you make your case matters more than the case itself. Pre-suasion is the practice of arranging for recipients to be receptive to a message before they encounter it — by directing attention to concepts that are aligned with your goal.',
    keyTakeaways: [
      'Ask "What do I want them thinking about when I make my ask?"',
      'Prime cooperation by starting with shared goals or past successes together',
      'The question you ask before a request shapes the answer — "Do you consider yourself a helpful person?"',
    ],
    primarySkill: 'close',
    secondarySkills: ['negotiate', 'connect'],
    drillPrompts: [
      'You need to ask your team to work overtime this weekend. Write two pre-suasive openers that prime cooperation before making the ask.',
      'Before asking for a favor, practice opening with a question that activates their identity as generous or helpful.',
    ],
  },
  {
    id: 'strategic_framing',
    name: 'Strategic Framing',
    expertSource: 'George Lakoff — Don\'t Think of an Elephant / Tversky & Kahneman — Prospect Theory',
    summary: 'The same information presented differently leads to different decisions. Framing is choosing which aspects to emphasize: gains vs. losses, opportunity vs. risk, investment vs. cost. The person who sets the frame controls the conversation.',
    keyTakeaways: [
      'Loss framing drives action: "You stand to lose X" is stronger than "You could gain X"',
      'Reframe the other side\'s frame before arguing within it',
      'Name the frame: "Let me offer a different way to look at this..."',
    ],
    primarySkill: 'negotiate',
    secondarySkills: ['close', 'assert'],
    drillPrompts: [
      'Reframe this: "It will cost $5,000" into a gain frame, an investment frame, and a loss-prevention frame.',
      'Your proposal was rejected. Practice reframing the same idea from a different angle that addresses their concerns.',
    ],
  },
  {
    id: 'storytelling_influence',
    name: 'Storytelling for Influence',
    expertSource: 'Chip & Dan Heath — Made to Stick / Nancy Duarte — Resonate',
    summary: 'Stories bypass analytical resistance and embed ideas emotionally. A well-told story creates a shared experience, makes abstract concepts concrete, and is 22x more memorable than facts alone. Structure: context, conflict, resolution.',
    keyTakeaways: [
      'Lead with a specific person and a specific moment, not data',
      'The conflict is the engine — what was at stake and what almost went wrong?',
      'End with a resolution that illustrates your point without stating it explicitly',
    ],
    primarySkill: 'connect',
    secondarySkills: ['close', 'empathize'],
    drillPrompts: [
      'Turn this data point into a story: "Customer satisfaction increased 40% after the change." Who was the customer? What was their experience?',
      'Prepare a 60-second influence story: set the scene, introduce conflict, deliver a resolution that makes your case.',
    ],
  },
  {
    id: 'charisma_presence',
    name: 'Commanding Presence',
    expertSource: 'Olivia Fox Cabane — The Charisma Myth',
    summary: 'Charisma is not innate — it is a set of trainable behaviors: presence (full attention), power (ability to affect the world), and warmth (genuine goodwill). Presence is the foundation: people can tell within seconds whether you are fully there.',
    keyTakeaways: [
      'Presence = focus your mind on this person, this moment. People feel the difference.',
      'Power + warmth = charisma. Power alone is intimidating; warmth alone is passive.',
      'Before an important conversation, adopt a high-power posture for 2 minutes',
    ],
    primarySkill: 'connect',
    secondarySkills: ['close', 'assert'],
    drillPrompts: [
      'In your next conversation, practice full presence: no phone, no mental rehearsal, eyes on them. Notice how they respond differently.',
      'Before a high-stakes conversation, practice a 2-minute power posture and deliberate warmth visualization. Enter the room intentionally.',
    ],
  },
  {
    id: 'socratic_method',
    name: 'Socratic Questioning',
    expertSource: 'Socrates via Plato — Classical Rhetoric / Paul & Elder — Critical Thinking',
    summary: 'Instead of telling people what to think, ask questions that lead them to discover the answer themselves. People are far more committed to conclusions they reach on their own. Socratic questioning guides without dictating.',
    keyTakeaways: [
      'Ask "What would happen if...?" to let them discover consequences',
      '"What makes you say that?" surfaces assumptions without challenging them',
      'Let them arrive at your conclusion through their own reasoning',
    ],
    primarySkill: 'negotiate',
    secondarySkills: ['close', 'listen'],
    drillPrompts: [
      'Your colleague proposes a plan you see flaws in. Instead of saying what is wrong, write three Socratic questions that lead them to discover the issues.',
      'Practice guiding a friend to your restaurant choice using only questions — no statements or suggestions.',
    ],
  },
  {
    id: 'reciprocity_engine',
    name: 'The Reciprocity Engine',
    expertSource: 'Robert Cialdini — Influence / Adam Grant — Give and Take',
    summary: 'Giving first — information, help, concessions — creates a powerful pull for the other person to reciprocate. Strategic generosity is not manipulation when the giving is genuine. The key is to give what costs you little but matters to them.',
    keyTakeaways: [
      'Give first, give often, give what they value — not what you value',
      'Personalized, unexpected, and significant gifts trigger the strongest reciprocity',
      'Make concessions visible: "I moved on X, can you move on Y?"',
    ],
    primarySkill: 'negotiate',
    secondarySkills: ['connect', 'close'],
    drillPrompts: [
      'Before your next negotiation, identify three things you can concede that cost you little but signal generosity.',
      'Practice making your concession visible: "I want to meet you halfway. I am willing to do X — what can you do on Y?"',
    ],
  },
  {
    id: 'objection_handling',
    name: 'Objection Reframing',
    expertSource: 'Neil Rackham — SPIN Selling / Oren Klaff — Pitch Anything',
    summary: 'Objections are not rejections — they are requests for more information or different framing. The best response is not to argue against the objection but to reframe it, agree with the concern, and redirect to what matters.',
    keyTakeaways: [
      'Acknowledge the objection first: "That is a fair concern."',
      'Reframe: "The question is not whether it costs more, but whether it saves more."',
      'Isolate: "If we solved that concern, would you be ready to move forward?"',
    ],
    primarySkill: 'close',
    secondarySkills: ['negotiate', 'assert'],
    drillPrompts: [
      'Handle this objection: "It is too expensive." Acknowledge, reframe as value, and isolate.',
      'A friend says "I don\'t have time for that." Practice treating it as information, not rejection. What are they really telling you?',
    ],
  },
  {
    id: 'motivational_interviewing',
    name: 'Motivational Interviewing',
    expertSource: 'William Miller & Stephen Rollnick — Motivational Interviewing',
    summary: 'When someone is ambivalent about change, arguing for it makes them argue against it. Motivational interviewing uses empathy to draw out their own reasons for change. You become a mirror that reflects their best intentions back to them.',
    keyTakeaways: [
      'OARS: Open questions, Affirm strengths, Reflect their words, Summarize',
      'Listen for "change talk" — their own reasons for wanting to change — and amplify it',
      'Roll with resistance: "You are not sure this would work" instead of pushing back',
    ],
    primarySkill: 'empathize',
    secondarySkills: ['listen', 'close'],
    drillPrompts: [
      'A friend says they want to exercise more but never do. Use OARS to draw out their motivation instead of giving advice.',
      'Practice rolling with resistance: when someone says "I can\'t," respond with a reflection that honors their autonomy.',
    ],
  },
  {
    id: 'power_dynamics',
    name: 'Reading Power Dynamics',
    expertSource: 'Keith Johnstone — Impro / Deborah Gruenfeld — Stanford Power Research',
    summary: 'Every conversation has a power dynamic — who is leading, who is deferring, and why. Reading these signals lets you choose when to take space and when to yield it. Status is not fixed; it shifts with every sentence, gesture, and pause.',
    keyTakeaways: [
      'High-status signals: stillness, slower speech, taking space, holding eye contact',
      'Low-status signals: fidgeting, hedging language ("I just think..."), nervous laughter',
      'Match their status to build rapport; raise yours to lead; lower yours to invite trust',
    ],
    primarySkill: 'assert',
    secondarySkills: ['negotiate', 'defend'],
    drillPrompts: [
      'In your next meeting, observe who takes up the most space and who defers. What specific behaviors create those dynamics?',
      'Practice delivering your next point with high-status signals: slow speech, pause before speaking, still body, direct eye contact.',
    ],
  },
  {
    id: 'rhetorical_structure',
    name: 'The Rhetoric Triad',
    expertSource: 'Aristotle — Rhetoric / Jay Heinrichs — Thank You for Arguing',
    summary: 'Persuasion has three pillars: ethos (credibility), pathos (emotion), and logos (logic). Most people rely only on logos. True persuasion requires all three: they trust you, they feel something, and the logic holds up.',
    keyTakeaways: [
      'Ethos first: establish why you are the right person to speak on this',
      'Pathos moves people to act: data informs but emotion drives decisions',
      'Logos provides the structure that makes the emotional case defensible',
    ],
    primarySkill: 'assert',
    secondarySkills: ['close', 'connect'],
    drillPrompts: [
      'Prepare a 90-second pitch for an idea. Identify where you use ethos, pathos, and logos. Which pillar is weakest?',
      'Rewrite a purely logical argument to include a personal story (pathos) and a credibility signal (ethos).',
    ],
  },
  {
    id: 'contrast_principle',
    name: 'The Contrast Principle',
    expertSource: 'Robert Cialdini — Influence / Daniel Kahneman — Thinking, Fast and Slow',
    summary: 'People evaluate things relative to what came before, not in absolute terms. Present an extreme option first and your real proposal seems reasonable by comparison. This is not deception — it is understanding how the human brain evaluates choices.',
    keyTakeaways: [
      'Present three options: the ambitious, the recommended, and the minimal',
      'The middle option benefits from contrast with both extremes',
      'In concessions: start higher than your target so the final number feels like a win',
    ],
    primarySkill: 'negotiate',
    secondarySkills: ['close', 'assert'],
    drillPrompts: [
      'You want a $5K budget approved. Design three options ($10K, $5K, $2K) that make $5K the obvious sweet spot.',
      'Practice the contrast principle in a casual negotiation: suggest a bigger ask first, then your real request.',
    ],
  },
  {
    id: 'difficult_conversations',
    name: 'Leading Difficult Conversations',
    expertSource: 'Douglas Stone, Bruce Patton & Sheila Heen — Difficult Conversations (Harvard Negotiation Project)',
    summary: 'Every difficult conversation is really three conversations: the "what happened" story, the feelings conversation, and the identity conversation ("what does this say about me?"). Address all three layers or the surface issue will keep recurring.',
    keyTakeaways: [
      'Start from the "third story" — a neutral description both sides would agree on',
      'Share your feelings as data, not accusations: "I felt sidelined" not "You sidelined me"',
      'Identity: separate what happened from what it means about you as a person',
    ],
    primarySkill: 'assert',
    secondarySkills: ['regulate', 'empathize'],
    drillPrompts: [
      'Think of a difficult conversation you are avoiding. Identify all three layers: what happened, what you feel, and what identity is at stake.',
      'Practice opening a tough conversation from the "third story": a neutral, factual description a camera would capture.',
    ],
  },
  {
    id: 'pitch_narrative',
    name: 'The Pitch Narrative Arc',
    expertSource: 'Oren Klaff — Pitch Anything / Daniel Pink — To Sell Is Human',
    summary: 'A compelling pitch follows a narrative arc: establish the world as it is, reveal the tension or problem, then present your idea as the bridge to a better state. The audience should feel the gap before you fill it.',
    keyTakeaways: [
      'Start with the status quo and what is at stake — make them feel the problem',
      'Create intrigue: withhold the solution until the tension peaks',
      'End with a clear next step, not an open question',
    ],
    primarySkill: 'close',
    secondarySkills: ['connect', 'assert'],
    drillPrompts: [
      'Restructure a flat pitch ("Our product does X, Y, Z") into a narrative arc: problem, tension, resolution.',
      'Practice pitching an idea in 60 seconds using the "before/after" structure: here is the world without this, here is the world with it.',
    ],
  },
  {
    id: 'strategic_rapport',
    name: 'Strategic Rapport Building',
    expertSource: 'Robin Dreeke — It\'s Not All About Me (FBI Behavioral Analysis)',
    summary: 'Rapport is not small talk — it is a deliberate skill of making others feel valued, understood, and safe. The FBI\'s top rapport-building technique: seek the other person\'s thoughts and opinions without judging them.',
    keyTakeaways: [
      'Ego suspension: put their story first, ask about their world, park your own agenda',
      'Validate without agreeing: "I can see why you would see it that way"',
      'Time-limit the interaction up front to reduce their guard: "I only have a minute, but..."',
    ],
    primarySkill: 'connect',
    secondarySkills: ['empathize', 'listen'],
    drillPrompts: [
      'In your next conversation with someone new, spend the first 3 minutes asking about their perspective without sharing yours. Notice what shifts.',
      'Practice the time-constraint opener: "I have to run in a sec, but I wanted to ask you about..." and observe how it lowers resistance.',
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

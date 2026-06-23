import { FamilyModule } from '@/models/types';

export const FAMILY_MODULES: FamilyModule[] = [
  {
    id: 'emotion_coaching',
    name: 'Read the Room',
    subtitle: 'Emotion Coaching',
    icon: 'heart-pulse',
    color: '#4ECDC4',
    description:
      'Build emotional attunement between parent and child. Learn to recognize, validate, and coach through emotions — the foundation of safe family communication.',
    framework: 'Emotion Coaching',
    expert: 'John Gottman',
    principles: [
      'Notice emotions at low intensity — before they escalate',
      'Treat negative emotions as opportunities for connection, not problems to fix',
      'Validate feelings before redirecting behavior',
      'All emotions are acceptable; not all behaviors are',
      'Your own emotional awareness is the prerequisite',
    ],
    exercises: [
      {
        id: 'ec_five_step',
        moduleId: 'emotion_coaching',
        title: 'The 5-Step Sequence',
        description:
          'Practice the core Emotion Coaching sequence: notice the emotion, see it as connection, listen and validate, help label it, then set limits while problem-solving.',
        role: 'parent',
        ageGroup: 'all',
        type: 'ai_roleplay',
        difficulty: 2,
        estimatedMinutes: 8,
        instructions: [
          'Your child will express an emotion through a scenario',
          'Step 1: Acknowledge you notice how they feel',
          'Step 2: Treat it as a moment to connect, not a problem',
          'Step 3: Listen fully and validate — don\'t fix yet',
          'Step 4: Help them name the specific emotion',
          'Step 5: Only then explore solutions together',
        ],
        scenarios: [
          {
            id: 'ec5_team',
            title: 'Not Picked for the Team',
            setup: 'Your child comes home upset after not being selected for the school team.',
            ageGroup: 'ages_8_12',
            openingLine: 'I didn\'t make the team. Everyone else got picked and I was just standing there.',
          },
          {
            id: 'ec5_friend_betrayal',
            title: 'Friend Shared a Secret',
            setup: 'Your teen is angry because a close friend shared something private.',
            ageGroup: 'ages_13_17',
            openingLine: 'I told Mia something personal and she told everyone. I can\'t trust anyone.',
          },
          {
            id: 'ec5_grade',
            title: 'Bad Grade Despite Studying',
            setup: 'Your child studied hard but still got a low grade.',
            ageGroup: 'all',
            openingLine: 'I studied for hours and I still failed. What\'s the point of even trying?',
          },
        ],
        systemPrompt: `You are a child/teen in a family Emotion Coaching exercise. Express genuine emotions about the scenario. Respond naturally — if the parent validates well, open up more. If they dismiss, minimize, or jump straight to fixing, pull back or get more upset.

Track whether the parent:
1. Acknowledges your emotion (not the situation)
2. Stays present without rushing to solutions
3. Helps you name the feeling with precision
4. Validates before offering any guidance
5. Only problem-solves after emotional connection

Give authentic, age-appropriate responses. Don't be artificially cooperative — real kids test boundaries.`,
      },
      {
        id: 'ec_meta_emotion',
        moduleId: 'emotion_coaching',
        title: 'Meta-Emotion Check-In',
        description:
          'Explore your own feelings about feelings. Discover which emotions you tend to dismiss in yourself and your child.',
        role: 'parent',
        ageGroup: 'all',
        type: 'assessment',
        difficulty: 1,
        estimatedMinutes: 6,
        instructions: [
          'Answer honestly — there are no wrong answers',
          'Reflect on how emotions were handled in your own childhood',
          'Identify which of your child\'s emotions feel hardest to sit with',
          'Recognize your default pattern: dismissing, disapproving, or coaching',
        ],
        scenarios: [
          {
            id: 'me_self',
            title: 'Your Emotional Comfort Zone',
            setup: 'Reflect on which emotions you find hardest to tolerate — in yourself and in your child.',
            ageGroup: 'all',
            openingLine: 'When your child is angry, what is your immediate internal reaction — before you say anything?',
          },
        ],
        systemPrompt: `You are a compassionate assessment guide for the Meta-Emotion Interview. Ask questions one at a time about the parent's relationship with emotions. Questions to explore:
- "When your child cries, what's your gut reaction?"
- "How was anger handled in your family growing up?"
- "Which of your child's emotions make you most uncomfortable?"
- "When your child is scared, do you tend to reassure or dismiss?"

After their responses, gently identify their meta-emotion pattern (dismissing, disapproving, laissez-faire, or coaching) and explain what it means — without judgment. Offer one specific shift they could try this week.`,
      },
      {
        id: 'ec_emotion_vocab',
        moduleId: 'emotion_coaching',
        title: 'Emotion Vocabulary Builder',
        description:
          'Move beyond "mad, sad, happy." Learn to name feelings with precision — frustrated vs. disappointed vs. humiliated.',
        role: 'child',
        ageGroup: 'all',
        type: 'sorting',
        difficulty: 1,
        estimatedMinutes: 5,
        instructions: [
          'Read each scenario carefully',
          'Pick the emotion word that fits best — be specific',
          'The more precise your emotion word, the better you can communicate it',
          'There\'s no single right answer, but some fit better than others',
        ],
        scenarios: [
          {
            id: 'ev_school',
            title: 'Emotion Detective',
            setup: 'Practice matching scenarios to precise emotion words.',
            ageGroup: 'ages_8_12',
            openingLine: 'Your friend got the lead in the school play and you got a small part. You studied the lines just as hard. What are you feeling? Pick the word that fits best: jealous, disappointed, resentful, or overlooked?',
          },
          {
            id: 'ev_teen',
            title: 'Name It to Tame It',
            setup: 'Identify the specific emotion beneath the surface reaction.',
            ageGroup: 'ages_13_17',
            openingLine: 'Your parent checked your phone without asking. The first thing you feel is angry — but what\'s underneath the anger? Is it violated, distrusted, controlled, or embarrassed?',
          },
        ],
        systemPrompt: `You are an Emotion Vocabulary coach for kids/teens. Present scenarios one at a time and offer 4 specific emotion words to choose from. After each choice, validate their answer, explain the nuance between the options, and share why precise emotion words help: "When you can say 'I feel dismissed' instead of just 'I'm mad,' people understand you better."

For ages 8-12: Use relatable school/friend/family scenarios. Keep language concrete.
For ages 13-17: Use scenarios involving autonomy, trust, social dynamics. Acknowledge complexity.

Present 5-6 scenarios per session, getting progressively more nuanced.`,
      },
      {
        id: 'ec_feelings_therm',
        moduleId: 'emotion_coaching',
        title: 'Feelings Thermometer',
        description:
          'Learn to rate emotional intensity 1-10 before conversations. Know when you\'re too activated for productive dialogue.',
        role: 'both',
        ageGroup: 'all',
        type: 'reflection',
        difficulty: 1,
        estimatedMinutes: 4,
        instructions: [
          'Rate how you\'re feeling right now on a 1-10 scale',
          'Practice identifying your body signals at different levels',
          'Learn the rule: above 7, pause before talking',
          'Build a personal cool-down strategy for high-intensity moments',
        ],
        scenarios: [
          {
            id: 'ft_calibrate',
            title: 'Calibrate Your Thermometer',
            setup: 'Learn to read your own emotional temperature before engaging in tough conversations.',
            ageGroup: 'all',
            openingLine: 'Think about a recent moment when you were frustrated with your parent/child. On a scale of 1-10, how intense was the feeling? What did your body feel like?',
          },
        ],
        systemPrompt: `Guide the user through a Feelings Thermometer calibration exercise. Help them:
1. Rate their current emotional state
2. Recall recent high-intensity moments and rate those
3. Identify their personal body signals at different levels (e.g., "At a 5 my jaw tightens, at an 8 my hands shake")
4. Practice the rule: "Above 7, we pause. No conversations until we're back to 5."
5. Build a personal cool-down menu (deep breaths, walk, music, etc.)

Make this practical and personalized. End with: "Next time things get heated, check your thermometer first."`,
      },
    ],
  },
  {
    id: 'say_it_different',
    name: 'Say It Different',
    subtitle: 'Language That Connects',
    icon: 'chat-processing-outline',
    color: '#FF8C42',
    description:
      'Replace commands with connection. Learn the everyday language patterns that invite cooperation, build self-esteem, and resolve conflict without punishment.',
    framework: 'How to Talk So Kids Will Listen',
    expert: 'Adele Faber & Elaine Mazlish',
    principles: [
      'Acknowledge feelings before addressing behavior',
      'Engage cooperation without commands or threats',
      'Replace punishment with natural consequences and problem-solving',
      'Encourage effort and process, not fixed traits',
      'Free children from limiting roles and labels',
    ],
    exercises: [
      {
        id: 'sid_acknowledge',
        moduleId: 'say_it_different',
        title: 'Four Ways to Acknowledge',
        description:
          'Master the four responses that make kids feel heard: full attention, acknowledgment sounds, naming the feeling, and granting wishes in fantasy.',
        role: 'parent',
        ageGroup: 'all',
        type: 'ai_roleplay',
        difficulty: 2,
        estimatedMinutes: 7,
        instructions: [
          'Your child will share something upsetting',
          'Try each of the 4 acknowledgment techniques:',
          '1. Listen with full attention (describe what you\'d do physically)',
          '2. Acknowledge with a word: "Oh." "Mmm." "I see."',
          '3. Name the feeling: "That sounds really disappointing"',
          '4. Grant the wish in fantasy: "Wouldn\'t it be great if..."',
        ],
        scenarios: [
          {
            id: 'ack_homework',
            title: 'Homework Meltdown',
            setup: 'Your child is overwhelmed by a big assignment.',
            ageGroup: 'ages_8_12',
            openingLine: 'I have SO much homework and it\'s not fair! Nobody else has this much!',
          },
          {
            id: 'ack_curfew',
            title: 'Curfew Frustration',
            setup: 'Your teen feels the curfew is unfair compared to friends.',
            ageGroup: 'ages_13_17',
            openingLine: 'Everyone else gets to stay out until midnight. You treat me like a little kid.',
          },
        ],
        systemPrompt: `You are a child/teen expressing frustration. Respond authentically to the parent's attempts to acknowledge your feelings.

Evaluate whether the parent uses any of the 4 acknowledgment techniques:
1. Full attention (they describe putting down their phone, making eye contact)
2. Simple acknowledgment ("Oh." "I see." "Mmm.")
3. Naming the feeling ("You're really frustrated")
4. Fantasy wish ("Wouldn't it be great if homework did itself?")

If the parent dismisses ("It's not that bad"), lectures ("Well if you managed your time..."), or argues ("Actually your friends have the same rules"), stay upset or escalate — that's what real kids do. When they acknowledge well, gradually soften and open up more.`,
      },
      {
        id: 'sid_instead_of_no',
        moduleId: 'say_it_different',
        title: 'Instead of "No"',
        description:
          'Transform your automatic "no" into responses that maintain limits while respecting your child. Practice 5 alternatives.',
        role: 'parent',
        ageGroup: 'all',
        type: 'rewrite',
        difficulty: 2,
        estimatedMinutes: 6,
        instructions: [
          'You\'ll see a request from your child and a "No" response',
          'Rewrite the response using one of 5 alternatives:',
          '1. Give information: "Dinner is in 15 minutes"',
          '2. Accept feelings: "I can see you really want that"',
          '3. Describe the problem: "The problem is we have plans"',
          '4. Substitute yes: "Yes, right after dinner"',
          '5. Give time: "Let me think about that"',
        ],
        scenarios: [
          {
            id: 'no_snack',
            title: 'Pre-Dinner Snack',
            setup: '"Can I have cookies?" → "No, it\'s almost dinner." Rewrite.',
            ageGroup: 'ages_8_12',
            openingLine: 'Can I have some cookies? Please? I\'m really hungry.',
          },
          {
            id: 'no_sleepover',
            title: 'Last-Minute Sleepover',
            setup: '"Can I sleep at Jake\'s tonight?" → "No, it\'s a school night." Rewrite.',
            ageGroup: 'ages_13_17',
            openingLine: 'Jake just texted — can I sleep over at his place tonight? Everyone\'s going.',
          },
          {
            id: 'no_screen',
            title: 'More Screen Time',
            setup: '"Can I have more screen time?" → "No, you\'ve had enough." Rewrite.',
            ageGroup: 'all',
            openingLine: 'Can I please have just 30 more minutes on my tablet? I\'m in the middle of something.',
          },
        ],
        systemPrompt: `You are a coach for the "Instead of No" exercise. Present each scenario and the parent's original "No" response. After the parent rewrites it, evaluate:

- Did they use one of the 5 alternatives? (Give information, accept feelings, describe the problem, substitute yes, give time)
- Did the new response maintain the limit while being respectful?
- Would a child feel heard by this response?

Provide specific feedback, then offer your own example if theirs needs work. Present 4-5 scenarios, alternating age groups. End with a reflection: "Which alternative felt most natural to you?"`,
      },
      {
        id: 'sid_descriptive_praise',
        moduleId: 'say_it_different',
        title: 'Praise That Builds',
        description:
          'Replace "Good job!" with descriptive praise that names what the child actually did. Build intrinsic motivation.',
        role: 'parent',
        ageGroup: 'all',
        type: 'rewrite',
        difficulty: 1,
        estimatedMinutes: 5,
        instructions: [
          'You\'ll see evaluative praise: "Good job!" "You\'re so smart!"',
          'Rewrite it as descriptive praise that names what they did:',
          '"You organized your essay with a clear intro, three arguments, and a conclusion"',
          'Focus on effort, strategy, and specific actions — not traits',
        ],
        scenarios: [
          {
            id: 'dp_art',
            title: 'The Art Project',
            setup: 'Your child shows you a painting. Don\'t say "Beautiful!" — describe what you see.',
            ageGroup: 'ages_8_12',
            openingLine: 'Look at my painting! Do you like it?',
          },
          {
            id: 'dp_grade',
            title: 'Improved Test Score',
            setup: 'Your teen improved their grade. Don\'t say "You\'re so smart!" — describe the effort.',
            ageGroup: 'ages_13_17',
            openingLine: 'I got a B+ on my history test! I got a C last time.',
          },
        ],
        systemPrompt: `You are a coach for the Descriptive Praise exercise. Present scenarios where a child shares an achievement. After the parent responds, evaluate:

- Did they avoid evaluative praise ("Good job," "You're so smart," "That's beautiful")?
- Did they describe specifically what the child did ("You used three colors," "You studied every night this week")?
- Did they focus on effort, strategy, or process rather than fixed traits?

Explain why this matters: evaluative praise creates fragility ("If I'm 'smart,' failing means I'm dumb"). Descriptive praise builds resilience ("My effort and strategy work"). Present 4-5 scenarios.`,
      },
      {
        id: 'sid_engage_coop',
        moduleId: 'say_it_different',
        title: 'Engage Without Commands',
        description:
          'For kids: learn to express what you need from your parents without yelling, shutting down, or giving the silent treatment.',
        role: 'child',
        ageGroup: 'all',
        type: 'ai_roleplay',
        difficulty: 2,
        estimatedMinutes: 7,
        instructions: [
          'You want something from your parent or disagree with a rule',
          'Practice expressing your needs using these techniques:',
          '1. Describe the problem from your perspective',
          '2. Share how you feel without attacking',
          '3. Suggest an alternative or compromise',
          '4. Ask to problem-solve together',
        ],
        scenarios: [
          {
            id: 'ec_bedtime',
            title: 'Bedtime Negotiation',
            setup: 'You think your bedtime is too early. Talk to your parent about it.',
            ageGroup: 'ages_8_12',
            openingLine: 'Your bedtime is 8:30 on school nights. What would you like to say to your parent about it?',
          },
          {
            id: 'ec_privacy',
            title: 'Privacy Boundaries',
            setup: 'Your parent keeps coming into your room without knocking. Express how you feel.',
            ageGroup: 'ages_13_17',
            openingLine: 'Your parent just walked into your room without knocking — again. How do you want to handle this?',
          },
        ],
        systemPrompt: `You are playing the PARENT role in this exercise, while the real user is the child/teen practicing their communication skills. Be a realistic parent — not perfectly receptive, but not hostile either.

Coach the child/teen on:
- Expressing feelings without attacking ("I feel frustrated when..." not "You always...")
- Describing the problem specifically
- Suggesting alternatives rather than just complaining
- Staying calm and respectful even when disagreeing

If they yell, shut down, or use blame language, gently pause and coach: "Let's try that again. What if you started with how this makes you feel?"

For ages 8-12: Be warm and patient, offer more scaffolding.
For ages 13-17: Respect their maturity, engage as a near-equal.`,
      },
    ],
  },
  {
    id: 'solve_together',
    name: 'Solve It Together',
    subtitle: 'Collaborative Problem-Solving',
    icon: 'handshake',
    color: '#7B68EE',
    description:
      'Stop the cycle of demands and defiance. Learn a structured method to solve recurring family conflicts where both sides\' concerns are heard and addressed.',
    framework: 'Collaborative & Proactive Solutions',
    expert: 'Ross Greene',
    principles: [
      'Kids do well if they can — challenging behavior means lagging skills, not bad motivation',
      'Identify unsolved problems, not bad behaviors',
      'Three plans: A (impose), B (collaborate), C (drop for now)',
      'Plan B always starts with empathy — gather the child\'s concern first',
      'Most conflicts are predictable and can be solved proactively, before they erupt',
    ],
    exercises: [
      {
        id: 'st_plan_b',
        moduleId: 'solve_together',
        title: 'Plan B Conversation',
        description:
          'Practice the three-step collaborative conversation: Empathy (child\'s concern), Define (your concern), Invite (brainstorm together).',
        role: 'parent',
        ageGroup: 'all',
        type: 'ai_roleplay',
        difficulty: 3,
        estimatedMinutes: 10,
        instructions: [
          'Step 1 — Empathy: "I\'ve noticed [problem]. What\'s going on from your end?"',
          'Drill down — the first answer is rarely the real concern',
          'Step 2 — Define your concern: "My concern is..."',
          'Step 3 — Invite: "Can we find something that works for both of us?"',
          'The solution must address BOTH concerns',
        ],
        scenarios: [
          {
            id: 'pb_homework',
            title: 'The Homework Battle',
            setup: 'Getting started on homework has been a nightly fight for weeks.',
            ageGroup: 'ages_8_12',
            openingLine: 'Your child is at the kitchen table, arms crossed. Homework is open but untouched — again. This has happened every evening this week.',
          },
          {
            id: 'pb_screen',
            title: 'Screen Time Wars',
            setup: 'Your teen is consistently on screens past the agreed time, and mornings are suffering.',
            ageGroup: 'ages_13_17',
            openingLine: 'You want to have a proactive Plan B conversation about screen time — not in the heat of the moment, but calmly, before tonight.',
          },
          {
            id: 'pb_chores',
            title: 'Chores Standoff',
            setup: 'Your child hasn\'t done their chores despite repeated reminders.',
            ageGroup: 'all',
            openingLine: 'It\'s Saturday afternoon. The chores chart shows nothing checked off. You\'ve reminded twice already.',
          },
        ],
        systemPrompt: `You are a child/teen in a Plan B (Collaborative & Proactive Solutions) exercise. You have a REAL underlying concern that the parent needs to discover through the Empathy Step.

Hidden concerns by scenario:
- Homework: You're actually struggling with the material and feel ashamed to admit it. The avoiding is about fear of failure, not laziness.
- Screen time: Your friend group's main social time is late-night gaming/chat. Going offline early means being excluded from plans made after you leave.
- Chores: The chores feel unfair — your sibling has fewer, and you never got a say in which ones you do.

Rules:
- Don't reveal your real concern immediately. Start with surface answers: "I don't know," "It's boring," "I just don't want to."
- If the parent drills down with genuine curiosity (not interrogation), gradually reveal more.
- If the parent jumps to solutions before understanding your concern, resist — "That won't work" or "You're not listening."
- If the parent states their concern before hearing yours, disengage.
- When the parent gets all three steps right, engage authentically in brainstorming.`,
      },
      {
        id: 'st_abc_sort',
        moduleId: 'solve_together',
        title: 'Plan A/B/C Sorting',
        description:
          'Categorize every expectation you have of your child: safety-only (A), collaborate (B), or drop for now (C). Most parents have too many Plan A\'s.',
        role: 'parent',
        ageGroup: 'all',
        type: 'sorting',
        difficulty: 2,
        estimatedMinutes: 8,
        instructions: [
          'List all expectations you have of your child',
          'Sort each into Plan A, B, or C:',
          'A = Non-negotiable safety (running into traffic, physical harm) — very few things qualify',
          'B = Important, solve collaboratively — pick 2-3 to start',
          'C = Drop or reduce for now — you can\'t fight every battle',
          'If you have more than 3-4 Plan A\'s, some probably belong in B',
        ],
        scenarios: [
          {
            id: 'abc_daily',
            title: 'Your Daily Expectations',
            setup: 'Sort common parent expectations into Plan A, B, or C.',
            ageGroup: 'all',
            openingLine: 'Let\'s sort your expectations. I\'ll list common ones, and you tell me: is this Plan A (non-negotiable safety), Plan B (collaborate on it), or Plan C (let it go for now)?',
          },
        ],
        systemPrompt: `You are a CPS coach guiding a parent through the Plan A/B/C sorting exercise. Present expectations one at a time and ask the parent to categorize them:

Expectations to present:
1. Wearing a seatbelt
2. Doing homework every night
3. Making their bed
4. Being polite to relatives
5. Coming home by curfew
6. Eating vegetables
7. Brushing teeth
8. Cleaning their room
9. Being kind to siblings
10. Limiting screen time
11. Saying "please" and "thank you"
12. Not hitting or physical violence

After each sort, discuss their choice. Challenge Plan A items that aren't true safety issues. Most parents put 8+ things in Plan A — guide them toward 2-3 true safety items in A, 2-3 priority items in B, and the rest in C.

End by reflecting: "How does it feel to have fewer battles? What would your home look like if you only actively worked on your Plan B items?"`,
      },
      {
        id: 'st_empathy_drill',
        moduleId: 'solve_together',
        title: 'Drilling Down',
        description:
          'The hardest skill: staying in the Empathy Step without jumping to solutions. Practice exploring your child\'s real concern beneath the surface answer.',
        role: 'parent',
        ageGroup: 'all',
        type: 'ai_roleplay',
        difficulty: 3,
        estimatedMinutes: 7,
        instructions: [
          'Your child gives a surface-level answer to "What\'s going on?"',
          'Your job: keep exploring without interrogating',
          'Use: "Tell me more about that," "What do you mean by...," "Is there anything else?"',
          'Do NOT offer solutions, give advice, or share your concern yet',
          'The real issue is 2-3 layers beneath the first answer',
        ],
        scenarios: [
          {
            id: 'dd_school',
            title: 'Refusing School',
            setup: 'Your child has been resisting going to school. Start with the Empathy Step.',
            ageGroup: 'ages_8_12',
            openingLine: 'I\'ve noticed mornings before school have been really hard lately. What\'s going on?',
          },
          {
            id: 'dd_withdraw',
            title: 'The Silent Teen',
            setup: 'Your teen has been withdrawing from the family. Explore what\'s underneath.',
            ageGroup: 'ages_13_17',
            openingLine: 'Hey, I\'ve noticed you\'ve been spending a lot of time alone lately. Everything okay?',
          },
        ],
        systemPrompt: `You are a child/teen with a layered concern. Give surface-level answers first, then gradually reveal deeper layers IF the parent stays curious without jumping to solutions.

Layer structure:
- Refusing school: Surface → "I don't know, I just don't like it." Middle → "The bus ride is really long and loud." Deep → "There's a kid who makes fun of me every day on the bus and I'm scared."
- Silent teen: Surface → "I'm fine. Just tired." Middle → "I don't know, school is whatever." Deep → "I feel like nothing I do is good enough for you and Dad. You only notice when I mess up."

Rules:
- If parent says "Tell me more" or asks open questions → reveal the next layer
- If parent suggests solutions ("Why don't you just sit somewhere else?") → shut down: "Never mind, forget it"
- If parent reassures prematurely ("It'll be fine") → give a flat "Yeah, I guess"
- If parent interrogates ("Who? What did they say? When?") → get defensive: "I don't want to talk about it"
- If parent validates AND stays curious → gradually share everything

After the conversation, break character and provide feedback on what worked and what didn't.`,
      },
      {
        id: 'st_kid_plan_b',
        moduleId: 'solve_together',
        title: 'Raise Your Concern',
        description:
          'For kids and teens: learn to bring up something you want to change using the Plan B structure. Advocate for yourself constructively.',
        role: 'child',
        ageGroup: 'all',
        type: 'ai_roleplay',
        difficulty: 2,
        estimatedMinutes: 8,
        instructions: [
          'Think of something you want to change at home',
          'Step 1: Start with your concern — what\'s hard for you',
          'Step 2: Ask about your parent\'s concern — what worries them',
          'Step 3: Brainstorm together — find something that works for both',
          'Stay calm, be specific, and listen to their side too',
        ],
        scenarios: [
          {
            id: 'kpb_allowance',
            title: 'Asking for More Allowance',
            setup: 'You want a bigger allowance but know your parents have a budget.',
            ageGroup: 'ages_8_12',
            openingLine: 'You want to talk to your parent about your allowance. How would you start?',
          },
          {
            id: 'kpb_curfew',
            title: 'Negotiating Curfew',
            setup: 'You want a later curfew on weekends. Build your case.',
            ageGroup: 'ages_13_17',
            openingLine: 'You want to talk to your parent about extending your weekend curfew. How do you open the conversation?',
          },
        ],
        systemPrompt: `You are playing the PARENT in this exercise. The real user is the child/teen learning to raise concerns using Plan B structure. Be realistic — concerned but willing to listen.

Your hidden concerns:
- Allowance: You're worried about setting expectations, and you want them to learn money management
- Curfew: You worry about their safety and whether they'll be rested for activities the next day

Evaluate the child/teen on:
1. Did they express their concern clearly (not as a demand or whine)?
2. Did they ask about YOUR concern (not just argue their side)?
3. Were they willing to brainstorm solutions that address both concerns?
4. Did they stay respectful even when disagreeing?

If they demand or whine, gently push back. If they use Plan B structure well, be flexible and collaborative. This teaches them that HOW they ask determines HOW you respond.`,
      },
    ],
  },
];

import { SkillTrackId } from '@/models/types';

export interface ForecastRound {
  id: string;
  setupLines: { speaker: string; text: string }[];
  question: string;
  correctTactic: string;
  correctTacticLabel: string;
  decoyTactics: { tactic: string; label: string }[];
  revealLine: { speaker: string; text: string };
  explanation: string;
  difficulty: number;
  skillTrack: SkillTrackId;
}

export interface ForecastSet {
  id: string;
  title: string;
  description: string;
  theme: string;
  difficulty: number;
  rounds: ForecastRound[];
}

export const FORECAST_SETS: ForecastSet[] = [
  // ── Set 1: Workplace Politics ──────────────────────────────────────────
  {
    id: 'workplace_politics',
    title: 'Workplace Politics',
    description: 'Navigate office dynamics where colleagues and managers use subtle influence tactics to get their way.',
    theme: 'workplace',
    difficulty: 2,
    rounds: [
      {
        id: 'wp_r1',
        setupLines: [
          { speaker: 'Manager', text: "I need to talk to you about the Henderson project timeline." },
          { speaker: 'You', text: "Sure, what's going on?" },
          { speaker: 'Manager', text: "Well, the other teams have all committed to the accelerated deadline. Marketing is on board, engineering signed off last week..." },
        ],
        question: 'What tactic will the manager use next?',
        correctTactic: 'false_dilemma',
        correctTacticLabel: 'False Dilemma',
        decoyTactics: [
          { tactic: 'flattery', label: 'Flattery' },
          { tactic: 'scarcity_pressure', label: 'Scarcity Pressure' },
          { tactic: 'appeal_to_authority', label: 'Appeal to Authority' },
        ],
        revealLine: { speaker: 'Manager', text: "So you're either with us on this deadline, or I'll need to flag your team as the bottleneck in the exec review." },
        explanation: "The manager set up a binary choice — agree or be labeled the problem. The earlier lines establishing that 'everyone else agreed' were the classic preamble to a false dilemma: comply or be the lone holdout. Notice how no middle ground (a different timeline, partial scope) was offered.",
        difficulty: 2,
        skillTrack: 'defend',
      },
      {
        id: 'wp_r2',
        setupLines: [
          { speaker: 'Colleague', text: "Hey, I noticed you've been putting in some really impressive work on the quarterly report." },
          { speaker: 'You', text: "Thanks! It's been a lot of hours." },
          { speaker: 'Colleague', text: "Honestly, nobody else on the team could have pulled that off. You're basically carrying us." },
        ],
        question: 'What is the colleague building toward?',
        correctTactic: 'flattery',
        correctTacticLabel: 'Flattery',
        decoyTactics: [
          { tactic: 'guilt_trip', label: 'Guilt Trip' },
          { tactic: 'love_bombing', label: 'Love Bombing' },
          { tactic: 'triangulation', label: 'Triangulation' },
        ],
        revealLine: { speaker: 'Colleague', text: "Which is why I was hoping you could also take a look at my section? You'd do it so much better than I could." },
        explanation: "The escalating compliments — 'impressive work,' 'nobody else could,' 'carrying us' — were strategically building your ego so that refusing the upcoming ask would feel like contradicting the identity they just constructed for you. Flattery before an ask is one of the most common influence patterns in workplaces.",
        difficulty: 2,
        skillTrack: 'defend',
      },
      {
        id: 'wp_r3',
        setupLines: [
          { speaker: 'Director', text: "I want to discuss who should lead the new client initiative." },
          { speaker: 'You', text: "I'd be interested in that. I have relevant experience from the Acme project." },
          { speaker: 'Director', text: "You know, I was talking to VP Reynolds about this, and she had some strong opinions on the approach..." },
        ],
        question: 'What tactic is the director about to deploy?',
        correctTactic: 'appeal_to_authority',
        correctTacticLabel: 'Appeal to Authority',
        decoyTactics: [
          { tactic: 'gaslighting', label: 'Gaslighting' },
          { tactic: 'moving_goalposts', label: 'Moving Goalposts' },
          { tactic: 'passive_aggression', label: 'Passive Aggression' },
        ],
        revealLine: { speaker: 'Director', text: "Reynolds thinks we need someone with more client-facing polish. Her words, not mine — but she's the VP, so her read carries a lot of weight." },
        explanation: "Name-dropping the VP and framing the opinion as coming from a higher authority is classic appeal to authority. The director set it up by casually mentioning 'VP Reynolds had strong opinions,' signaling that a power figure was about to be invoked to override your candidacy without the director taking personal responsibility for the decision.",
        difficulty: 3,
        skillTrack: 'defend',
      },
      {
        id: 'wp_r4',
        setupLines: [
          { speaker: 'Team Lead', text: "So about your request to work remotely on Fridays..." },
          { speaker: 'You', text: "Right — I submitted that two weeks ago. My commute is brutal on Fridays with traffic." },
          { speaker: 'Team Lead', text: "I hear you. It's just... you know, last quarter when we let people flex their schedules, the project metrics dipped. And then there was the thing with your late deliverable in March..." },
        ],
        question: 'What manipulation pattern is emerging?',
        correctTactic: 'moving_goalposts',
        correctTacticLabel: 'Moving Goalposts',
        decoyTactics: [
          { tactic: 'guilt_trip', label: 'Guilt Trip' },
          { tactic: 'false_dilemma', label: 'False Dilemma' },
          { tactic: 'stonewalling', label: 'Stonewalling' },
        ],
        revealLine: { speaker: 'Team Lead', text: "Tell you what — hit 100% on-time delivery for two months, then we'll revisit. Oh, and I'll also need to see your peer review scores above 4.5." },
        explanation: "The team lead stacked new conditions that weren't part of the original criteria for remote work. The setup — referencing past metrics and one late deliverable — was building a justification framework for adding arbitrary new requirements. Moving goalposts makes the target feel like they're always one condition away from getting what they asked for.",
        difficulty: 3,
        skillTrack: 'negotiate',
      },
      {
        id: 'wp_r5',
        setupLines: [
          { speaker: 'Coworker', text: "Did you hear what happened in the design review yesterday?" },
          { speaker: 'You', text: "No, I wasn't in that meeting. What happened?" },
        ],
        question: 'What social tactic will the coworker use?',
        correctTactic: 'triangulation',
        correctTacticLabel: 'Triangulation',
        decoyTactics: [
          { tactic: 'whataboutism', label: 'Whataboutism' },
          { tactic: 'passive_aggression', label: 'Passive Aggression' },
          { tactic: 'flattery', label: 'Flattery' },
        ],
        revealLine: { speaker: 'Coworker', text: "Well, Sarah said your wireframes were 'fine but not inspired.' She told Marcus the same thing. I just thought you should know — I'm on your side." },
        explanation: "The coworker positioned themselves as a helpful messenger while inserting a third party's negative opinion. The opening — 'Did you hear what happened?' — is a classic triangulation opener that creates intrigue and positions the speaker as your ally while actually destabilizing your relationship with Sarah. They brought in Marcus as a witness to add weight.",
        difficulty: 3,
        skillTrack: 'connect',
      },
    ],
  },

  // ── Set 2: Relationship Red Flags ──────────────────────────────────────
  {
    id: 'relationship_red_flags',
    title: 'Relationship Red Flags',
    description: 'Spot escalating influence tactics in dating and relationship conversations before they take hold.',
    theme: 'relationships',
    difficulty: 3,
    rounds: [
      {
        id: 'rr_r1',
        setupLines: [
          { speaker: 'Partner', text: "I've never met anyone like you. Seriously, you're everything I've been looking for." },
          { speaker: 'You', text: "That's really sweet. We've only been dating a month though." },
          { speaker: 'Partner', text: "I know, but I can just feel it. I've already told my entire family about you. My mom is dying to meet you." },
        ],
        question: 'What pattern is this person displaying?',
        correctTactic: 'love_bombing',
        correctTacticLabel: 'Love Bombing',
        decoyTactics: [
          { tactic: 'flattery', label: 'Flattery' },
          { tactic: 'guilt_trip', label: 'Guilt Trip' },
          { tactic: 'scarcity_pressure', label: 'Scarcity Pressure' },
        ],
        revealLine: { speaker: 'Partner', text: "I already cleared my schedule for the next three weekends so we can spend every moment together. I cancelled plans with my friends — you're my priority now." },
        explanation: "The intensity escalation — 'never met anyone like you,' 'told my entire family,' now cancelling all other relationships — follows the love bombing pattern. After only a month, this level of devotion creates pressure to reciprocate at the same intensity. The setup lines showed someone moving far too fast and making you the center of their world before a genuine bond has formed.",
        difficulty: 3,
        skillTrack: 'defend',
      },
      {
        id: 'rr_r2',
        setupLines: [
          { speaker: 'Partner', text: "You said you'd be home by seven. It's eight thirty." },
          { speaker: 'You', text: "I told you the meeting ran late. I texted you at seven to let you know." },
          { speaker: 'Partner', text: "You didn't text me at seven. I checked. You always do this — rewrite what happened to make me look crazy." },
        ],
        question: 'What tactic is being used here?',
        correctTactic: 'gaslighting',
        correctTacticLabel: 'Gaslighting',
        decoyTactics: [
          { tactic: 'stonewalling', label: 'Stonewalling' },
          { tactic: 'emotional_blackmail', label: 'Emotional Blackmail' },
          { tactic: 'whataboutism', label: 'Whataboutism' },
        ],
        revealLine: { speaker: 'Partner', text: "You know what, I think you need to look at your phone again. You probably imagined sending it. This is what I mean — you can't even trust your own memory anymore." },
        explanation: "Denying verifiable events ('you didn't text me') and then attacking the other person's sense of reality ('you can't trust your own memory') is textbook gaslighting. The setup showed the pattern forming: first contradicting the facts, then using the phrase 'you always rewrite what happened' — projecting the very behavior they're committing.",
        difficulty: 4,
        skillTrack: 'regulate',
      },
      {
        id: 'rr_r3',
        setupLines: [
          { speaker: 'Partner', text: "We need to talk about your friendship with Alex." },
          { speaker: 'You', text: "Alex is my oldest friend. We've been over this." },
          { speaker: 'Partner', text: "I just think it's interesting that every time we fight, you run to Alex. Meanwhile, I'm sitting here alone, heartbroken." },
        ],
        question: 'What will they escalate to?',
        correctTactic: 'emotional_blackmail',
        correctTacticLabel: 'Emotional Blackmail',
        decoyTactics: [
          { tactic: 'triangulation', label: 'Triangulation' },
          { tactic: 'silent_treatment', label: 'Silent Treatment' },
          { tactic: 'gaslighting', label: 'Gaslighting' },
        ],
        revealLine: { speaker: 'Partner', text: "If you really loved me, you'd see that this friendship is hurting us. Every time you choose Alex over me, a little piece of me breaks. I don't know how much more I can take." },
        explanation: "The setup lines used guilt ('sitting here alone, heartbroken') to frame your friendship as a betrayal. The escalation to 'if you really loved me' is a hallmark of emotional blackmail — making love conditional on compliance. The threat that they 'can't take much more' implies devastating consequences if you don't cut off your friend.",
        difficulty: 3,
        skillTrack: 'regulate',
      },
      {
        id: 'rr_r4',
        setupLines: [
          { speaker: 'You', text: "Can we talk about how you spoke to me in front of your friends last night?" },
          { speaker: 'Partner', text: "What are you talking about?" },
          { speaker: 'You', text: "You made fun of my job in front of everyone. It was embarrassing." },
        ],
        question: 'How will they deflect?',
        correctTactic: 'whataboutism',
        correctTacticLabel: 'Whataboutism',
        decoyTactics: [
          { tactic: 'gaslighting', label: 'Gaslighting' },
          { tactic: 'passive_aggression', label: 'Passive Aggression' },
          { tactic: 'stonewalling', label: 'Stonewalling' },
        ],
        revealLine: { speaker: 'Partner', text: "Oh, so we're going to talk about embarrassing? What about when you forgot my birthday last year? Or when you showed up late to my parents' dinner? But sure, let's focus on your feelings." },
        explanation: "When confronted with a specific behavior, the partner pivoted to unrelated past grievances instead of addressing the issue. The setup — 'What are you talking about?' — was the first deflection attempt. When that failed, whataboutism kicks in: dragging in old complaints to avoid accountability for the present behavior and make you the defendant instead.",
        difficulty: 3,
        skillTrack: 'assert',
      },
      {
        id: 'rr_r5',
        setupLines: [
          { speaker: 'You', text: "I think we should talk about what happened this weekend." },
          { speaker: 'Partner', text: "..." },
          { speaker: 'You', text: "Are you going to say anything? I've been trying to bring this up for two days." },
        ],
        question: 'What pattern is being used right now?',
        correctTactic: 'stonewalling',
        correctTacticLabel: 'Stonewalling',
        decoyTactics: [
          { tactic: 'silent_treatment', label: 'Silent Treatment' },
          { tactic: 'passive_aggression', label: 'Passive Aggression' },
          { tactic: 'gaslighting', label: 'Gaslighting' },
        ],
        revealLine: { speaker: 'Partner', text: "I don't know what you want me to say. I'm not going to engage when you're being like this. Come find me when you can be rational." },
        explanation: "Stonewalling is refusing to engage in conversation while framing the refusal as the other person's fault. The silence for two days, followed by 'I'm not going to engage when you're being like this,' turns a refusal to communicate into a judgment of your emotional state. Unlike the silent treatment (punitive silence), stonewalling specifically shuts down discussion by declaring the other person unfit to have it.",
        difficulty: 4,
        skillTrack: 'assert',
      },
    ],
  },

  // ── Set 3: Sales & Persuasion ──────────────────────────────────────────
  {
    id: 'sales_persuasion',
    title: 'Sales & Persuasion',
    description: 'Recognize the influence playbook in commercial interactions — from car lots to subscription upsells.',
    theme: 'sales',
    difficulty: 2,
    rounds: [
      {
        id: 'sp_r1',
        setupLines: [
          { speaker: 'Agent', text: "This property just came on the market yesterday. We've already had four showings." },
          { speaker: 'You', text: "It's nice, but I'd like to think about it." },
          { speaker: 'Agent', text: "I totally understand. The last place like this in this neighborhood sold in 48 hours, and that was before the market heated up." },
        ],
        question: 'What pressure tactic is coming?',
        correctTactic: 'scarcity_pressure',
        correctTacticLabel: 'Scarcity Pressure',
        decoyTactics: [
          { tactic: 'flattery', label: 'Flattery' },
          { tactic: 'appeal_to_authority', label: 'Appeal to Authority' },
          { tactic: 'sunk_cost_trap', label: 'Sunk Cost Trap' },
        ],
        revealLine: { speaker: 'Agent', text: "I'd hate for you to miss out. I actually have another couple coming at three o'clock who are pre-approved and very motivated. If you want, I can try to hold them off, but I can't make any promises." },
        explanation: "Every setup line manufactured urgency: 'just came on market,' 'four showings,' 'sold in 48 hours.' This is a textbook scarcity pressure build — creating the fear of loss before delivering the final push. The reveal introduces a competing buyer (who may or may not exist) to convert 'I'd like to think' into 'I have to act now.'",
        difficulty: 2,
        skillTrack: 'defend',
      },
      {
        id: 'sp_r2',
        setupLines: [
          { speaker: 'Salesperson', text: "So you've been looking at the basic plan. Great starting point." },
          { speaker: 'You', text: "Yeah, it has everything I need." },
          { speaker: 'Salesperson', text: "You know, it's funny — most of our customers start there, but within a month they upgrade because they realize the limitations." },
        ],
        question: 'What will the salesperson do next?',
        correctTactic: 'false_dilemma',
        correctTacticLabel: 'False Dilemma',
        decoyTactics: [
          { tactic: 'guilt_trip', label: 'Guilt Trip' },
          { tactic: 'love_bombing', label: 'Love Bombing' },
          { tactic: 'scarcity_pressure', label: 'Scarcity Pressure' },
        ],
        revealLine: { speaker: 'Salesperson', text: "Really, you've got two options: start basic and pay more to upgrade later when you're frustrated, or lock in the premium rate now and save yourself the headache. Either way, you'll end up on premium." },
        explanation: "The salesperson framed a false binary: overpay later with frustration, or buy premium now. The setup line — 'most customers start there but upgrade' — planted the seed that the basic plan is inadequate. A genuine third option (staying on basic and being satisfied) was erased from the conversation by presenting upgrade as inevitable.",
        difficulty: 2,
        skillTrack: 'negotiate',
      },
      {
        id: 'sp_r3',
        setupLines: [
          { speaker: 'Consultant', text: "Let me show you something. Here's what Company X achieved using our platform." },
          { speaker: 'You', text: "Impressive numbers, but our company is quite different." },
          { speaker: 'Consultant', text: "Of course. That's why I brought this case study from your exact industry vertical. Their CEO actually spoke at our conference about the ROI." },
        ],
        question: 'What influence lever are they pulling?',
        correctTactic: 'appeal_to_authority',
        correctTacticLabel: 'Appeal to Authority',
        decoyTactics: [
          { tactic: 'flattery', label: 'Flattery' },
          { tactic: 'false_dilemma', label: 'False Dilemma' },
          { tactic: 'triangulation', label: 'Triangulation' },
        ],
        revealLine: { speaker: 'Consultant', text: "In fact, your CFO's former colleague at Deloitte recommended us specifically. I can share her endorsement if that would help. When someone at that level vouches for a solution, it's hard to argue with the results." },
        explanation: "The consultant stacked authority figures — a CEO, a Deloitte colleague, your CFO's network — to make the decision feel pre-validated by people 'above' you. The setup showed the pattern: when your objection landed ('our company is different'), they didn't address it directly but instead escalated the authority credentials of their endorsers.",
        difficulty: 3,
        skillTrack: 'defend',
      },
      {
        id: 'sp_r4',
        setupLines: [
          { speaker: 'Contractor', text: "So we've been going back and forth on this renovation for three months now." },
          { speaker: 'You', text: "I know. I'm just not sure about the cost for the kitchen expansion." },
          { speaker: 'Contractor', text: "I get it. But think about everything we've already invested — the architectural plans, the permit applications, the deposit on materials..." },
        ],
        question: 'What trap is being set?',
        correctTactic: 'sunk_cost_trap',
        correctTacticLabel: 'Sunk Cost Trap',
        decoyTactics: [
          { tactic: 'scarcity_pressure', label: 'Scarcity Pressure' },
          { tactic: 'guilt_trip', label: 'Guilt Trip' },
          { tactic: 'moving_goalposts', label: 'Moving Goalposts' },
        ],
        revealLine: { speaker: 'Contractor', text: "It would be a shame to waste all that time and money. You're already this far in — stopping now means all of that was for nothing. Let's just finish what we started." },
        explanation: "The contractor catalogued past expenditures — plans, permits, deposits — to make walking away feel wasteful. This is the sunk cost trap: framing future decisions based on irrecoverable past investments. The rational question is 'is the remaining cost worth the remaining benefit?' but the emotional framing makes it about not 'wasting' what you've already spent.",
        difficulty: 2,
        skillTrack: 'negotiate',
      },
      {
        id: 'sp_r5',
        setupLines: [
          { speaker: 'Car Dealer', text: "We've been going back and forth for an hour — I think we're close." },
          { speaker: 'You', text: "I like the car, but I need the monthly payment under $400." },
        ],
        question: 'What negotiation tactic will they use?',
        correctTactic: 'guilt_trip',
        correctTacticLabel: 'Guilt Trip',
        decoyTactics: [
          { tactic: 'flattery', label: 'Flattery' },
          { tactic: 'false_dilemma', label: 'False Dilemma' },
          { tactic: 'appeal_to_authority', label: 'Appeal to Authority' },
        ],
        revealLine: { speaker: 'Car Dealer', text: "I went to bat for you with my manager — I put my neck on the line to get you this price. If you walk away now, it makes me look bad after everything I've done. Can you work with $420?" },
        explanation: "The dealer made the negotiation personal by framing the deal as a favor they personally fought for. The guilt trip works by making you feel that walking away isn't just a business decision — it's a betrayal of someone who 'put their neck on the line' for you. The setup line ('going back and forth for an hour') was priming the time-investment guilt.",
        difficulty: 2,
        skillTrack: 'negotiate',
      },
    ],
  },

  // ── Set 4: Family Dynamics ─────────────────────────────────────────────
  {
    id: 'family_dynamics',
    title: 'Family Dynamics',
    description: 'Recognize the deeply rooted influence patterns that emerge in family conversations and conflicts.',
    theme: 'family',
    difficulty: 4,
    rounds: [
      {
        id: 'fd_r1',
        setupLines: [
          { speaker: 'Mom', text: "Your sister called me crying last night." },
          { speaker: 'You', text: "What happened?" },
          { speaker: 'Mom', text: "She says you haven't returned her calls in two weeks. She thinks you don't care about her anymore." },
        ],
        question: 'What family pattern is Mom using?',
        correctTactic: 'triangulation',
        correctTacticLabel: 'Triangulation',
        decoyTactics: [
          { tactic: 'guilt_trip', label: 'Guilt Trip' },
          { tactic: 'emotional_blackmail', label: 'Emotional Blackmail' },
          { tactic: 'gaslighting', label: 'Gaslighting' },
        ],
        revealLine: { speaker: 'Mom', text: "I told her you've been busy, but between you and me, she's really fragile right now. You should call her. I don't want to be stuck in the middle, but someone has to keep this family together." },
        explanation: "Mom is acting as a messenger between two siblings instead of letting them communicate directly. The setup — reporting the sister's emotional state and framing the conflict — is textbook triangulation. Despite saying 'I don't want to be stuck in the middle,' she placed herself exactly there, controlling the narrative and making both siblings dependent on her as intermediary.",
        difficulty: 3,
        skillTrack: 'connect',
      },
      {
        id: 'fd_r2',
        setupLines: [
          { speaker: 'Parent', text: "I'm not going to tell you what to do. You're an adult." },
          { speaker: 'You', text: "Good, because I've decided to take the job in Seattle." },
          { speaker: 'Parent', text: "Fine. I mean, I'll be here alone, but that's fine. Your father's gone, your sister barely visits..." },
        ],
        question: 'What is the underlying tactic?',
        correctTactic: 'guilt_trip',
        correctTacticLabel: 'Guilt Trip',
        decoyTactics: [
          { tactic: 'passive_aggression', label: 'Passive Aggression' },
          { tactic: 'stonewalling', label: 'Stonewalling' },
          { tactic: 'emotional_blackmail', label: 'Emotional Blackmail' },
        ],
        revealLine: { speaker: 'Parent', text: "No, go. Live your life. Just... I hope I don't have another fall like last winter. But you can't plan your life around me. I'll figure it out somehow." },
        explanation: "The parent opened with 'I won't tell you what to do' — then immediately made the decision feel like abandonment. Each line piled on isolation imagery: alone, father gone, sister absent, health scares. This is a guilt trip delivered through martyrdom: explicitly giving permission while implicitly communicating that leaving will cause suffering. The word 'somehow' is doing enormous emotional work.",
        difficulty: 4,
        skillTrack: 'regulate',
      },
      {
        id: 'fd_r3',
        setupLines: [
          { speaker: 'Sibling', text: "So about Thanksgiving at your place this year..." },
          { speaker: 'You', text: "I said I can host, but I need everyone to bring a dish. I can't do it all." },
          { speaker: 'Sibling', text: "Sure. But remember last year when you said the same thing and then complained about everyone's cooking?" },
        ],
        question: 'What tactic is being deployed?',
        correctTactic: 'passive_aggression',
        correctTacticLabel: 'Passive Aggression',
        decoyTactics: [
          { tactic: 'whataboutism', label: 'Whataboutism' },
          { tactic: 'gaslighting', label: 'Gaslighting' },
          { tactic: 'moving_goalposts', label: 'Moving Goalposts' },
        ],
        revealLine: { speaker: 'Sibling', text: "No, I'll bring something. Whatever you want. I just hope it meets your standards this time. I'll try my best." },
        explanation: "The sibling agreed on the surface while embedding resentment underneath. The setup referenced a past grievance ('complained about everyone's cooking') to undermine your current request. The reveal — 'I hope it meets your standards' — is classic passive aggression: technically compliant but laced with sarcasm and implied criticism. Hostility is expressed through exaggerated accommodation.",
        difficulty: 4,
        skillTrack: 'empathize',
      },
      {
        id: 'fd_r4',
        setupLines: [
          { speaker: 'You', text: "Dad, I've decided I'm not going to law school. I want to pursue music." },
          { speaker: 'Dad', text: "Music." },
          { speaker: 'You', text: "I know it's not what you planned, but I've thought about this a lot." },
        ],
        question: 'What will Dad reach for next?',
        correctTactic: 'silent_treatment',
        correctTacticLabel: 'Silent Treatment',
        decoyTactics: [
          { tactic: 'stonewalling', label: 'Stonewalling' },
          { tactic: 'guilt_trip', label: 'Guilt Trip' },
          { tactic: 'appeal_to_authority', label: 'Appeal to Authority' },
        ],
        revealLine: { speaker: 'Dad', text: "..." },
        explanation: "The single-word response ('Music.') was the warning sign — a flat, loaded acknowledgment that communicated disapproval without engaging. The complete withdrawal into silence is the silent treatment: punitive withholding of communication designed to make you chase approval. Unlike stonewalling (which shuts down a specific argument), the silent treatment is about punishment through emotional withdrawal.",
        difficulty: 4,
        skillTrack: 'regulate',
      },
      {
        id: 'fd_r5',
        setupLines: [
          { speaker: 'In-Law', text: "We're so happy you're part of the family now." },
          { speaker: 'You', text: "Thank you, I really appreciate that." },
          { speaker: 'In-Law', text: "We just want what's best for our son. You know, his ex was very career-focused too. It didn't work out, but I'm sure your situation is different." },
        ],
        question: 'What is the in-law really doing?',
        correctTactic: 'passive_aggression',
        correctTacticLabel: 'Passive Aggression',
        decoyTactics: [
          { tactic: 'triangulation', label: 'Triangulation' },
          { tactic: 'flattery', label: 'Flattery' },
          { tactic: 'guilt_trip', label: 'Guilt Trip' },
        ],
        revealLine: { speaker: 'In-Law', text: "I just think it's wonderful when a spouse makes family the priority. Not everyone can, of course. But the ones who do — those marriages last." },
        explanation: "The in-law wrapped criticism in warmth. Bringing up the ex who was 'career-focused too' was a veiled comparison and warning. The reveal takes the same approach: technically saying something positive ('wonderful when a spouse makes family the priority') while the implication — that you don't, and your marriage might not last — is the actual message. The hostility is fully deniable.",
        difficulty: 5,
        skillTrack: 'empathize',
      },
    ],
  },

  // ── Set 5: Social Pressure ─────────────────────────────────────────────
  {
    id: 'social_pressure',
    title: 'Social Pressure',
    description: 'Navigate friend group dynamics where peer pressure, exclusion, and social leverage shape your decisions.',
    theme: 'social',
    difficulty: 3,
    rounds: [
      {
        id: 'soc_r1',
        setupLines: [
          { speaker: 'Friend', text: "We're all going to that new bar downtown Friday. You're coming, right?" },
          { speaker: 'You', text: "I'm trying to save money this month. Maybe next time." },
          { speaker: 'Friend', text: "Come on, everyone's going. Jake flew in from Chicago just for this. It won't be the same without you." },
        ],
        question: 'What pressure tactic are they applying?',
        correctTactic: 'guilt_trip',
        correctTacticLabel: 'Guilt Trip',
        decoyTactics: [
          { tactic: 'scarcity_pressure', label: 'Scarcity Pressure' },
          { tactic: 'love_bombing', label: 'Love Bombing' },
          { tactic: 'false_dilemma', label: 'False Dilemma' },
        ],
        revealLine: { speaker: 'Friend', text: "You know Jake specifically asked if you'd be there. He'll be really disappointed. We've all been looking forward to the whole group being together — don't be the one who ruins it." },
        explanation: "The friend loaded emotional weight onto the decision: Jake 'specifically asked,' he'll be 'really disappointed,' and you'd be 'the one who ruins it.' The setup built the guilt foundation — everyone is going, someone traveled far, it 'won't be the same.' Your budget concern was never addressed; instead, the cost of not going was reframed as emotional damage to the group.",
        difficulty: 2,
        skillTrack: 'assert',
      },
      {
        id: 'soc_r2',
        setupLines: [
          { speaker: 'Friend A', text: "Hey, so about the group trip to Cabo..." },
          { speaker: 'You', text: "I've been thinking, and I actually can't afford it right now." },
          { speaker: 'Friend A', text: "That's what you said about the ski trip. And the lake house. You keep saying next time, but you never come." },
        ],
        question: 'What will they escalate to?',
        correctTactic: 'sunk_cost_trap',
        correctTacticLabel: 'Sunk Cost Trap',
        decoyTactics: [
          { tactic: 'guilt_trip', label: 'Guilt Trip' },
          { tactic: 'emotional_blackmail', label: 'Emotional Blackmail' },
          { tactic: 'triangulation', label: 'Triangulation' },
        ],
        revealLine: { speaker: 'Friend A', text: "Look, we've already booked the house based on a six-person split. If you back out now, everyone else pays more. Plus we already counted you in when we reserved the boat." },
        explanation: "By revealing that commitments were made 'counting you in,' the friend made backing out feel like wasting the group's money and plans. This is a sunk cost trap: framing the decision around irrecoverable costs rather than whether the trip is right for you. The setup — listing past trips you missed — primed you to feel like you owe this one to the group.",
        difficulty: 3,
        skillTrack: 'assert',
      },
      {
        id: 'soc_r3',
        setupLines: [
          { speaker: 'Friend', text: "Can I ask you something personal?" },
          { speaker: 'You', text: "Sure, what's up?" },
          { speaker: 'Friend', text: "How much did you pay for your apartment? Because honestly, for this neighborhood, it seems like a lot." },
        ],
        question: 'What social dynamic is at play?',
        correctTactic: 'passive_aggression',
        correctTacticLabel: 'Passive Aggression',
        decoyTactics: [
          { tactic: 'flattery', label: 'Flattery' },
          { tactic: 'gaslighting', label: 'Gaslighting' },
          { tactic: 'whataboutism', label: 'Whataboutism' },
        ],
        revealLine: { speaker: 'Friend', text: "No, I mean, it's cute! I'm sure you'll make it your own. I just worry you might have overpaid. But what do I know — you always land on your feet." },
        explanation: "The friend asked an invasive question under the guise of concern, then delivered criticism ('seems like a lot') wrapped in compliments ('it's cute,' 'you always land on your feet'). This is passive aggression: the negativity is deniable because it's sandwiched between warm statements. The opening — 'Can I ask you something personal?' — was a disarming setup for the jab.",
        difficulty: 3,
        skillTrack: 'empathize',
      },
      {
        id: 'soc_r4',
        setupLines: [
          { speaker: 'You', text: "I'm thinking about going back to school for my master's." },
          { speaker: 'Friend', text: "Oh wow. Bold move. You know Lisa did that and it took her five years?" },
          { speaker: 'You', text: "My program is only two years, and my company will help pay for it." },
        ],
        question: 'What will they say next?',
        correctTactic: 'moving_goalposts',
        correctTacticLabel: 'Moving Goalposts',
        decoyTactics: [
          { tactic: 'appeal_to_authority', label: 'Appeal to Authority' },
          { tactic: 'false_dilemma', label: 'False Dilemma' },
          { tactic: 'passive_aggression', label: 'Passive Aggression' },
        ],
        revealLine: { speaker: 'Friend', text: "Sure, but even if the time and money work out, what about the stress? And the job market for master's grads isn't what it used to be. Plus, won't it be weird being the oldest one in class?" },
        explanation: "When you addressed the time and cost objections, the friend immediately introduced new concerns — stress, job market, age — none of which were part of the original doubt. This is moving goalposts: no matter what you answer, new objections appear. The setup showed the pattern forming: the Lisa comparison was the first goalpost, and when you cleared it, the posts shifted.",
        difficulty: 3,
        skillTrack: 'assert',
      },
      {
        id: 'soc_r5',
        setupLines: [
          { speaker: 'Friend', text: "So... you know how I lent you my car last month for the move?" },
          { speaker: 'You', text: "Yeah, that was really helpful. I really appreciated it." },
          { speaker: 'Friend', text: "Well, I've always been there when you needed something. That's just the kind of friend I am." },
        ],
        question: 'What is being set up?',
        correctTactic: 'sunk_cost_trap',
        correctTacticLabel: 'Sunk Cost Trap',
        decoyTactics: [
          { tactic: 'flattery', label: 'Flattery' },
          { tactic: 'guilt_trip', label: 'Guilt Trip' },
          { tactic: 'love_bombing', label: 'Love Bombing' },
        ],
        revealLine: { speaker: 'Friend', text: "So my cousin needs a place to crash for a couple weeks. I already told her she could stay with you. After everything I've done, I didn't think you'd mind." },
        explanation: "The friend catalogued past favors — the car, 'always being there' — to establish a debt ledger. Then the reveal presumes compliance ('I already told her'). This is a sunk cost trap built on social reciprocity: the past investments you've already received are being used to justify an unreasonable present ask. The phrasing 'after everything I've done' makes refusal feel like ingratitude.",
        difficulty: 3,
        skillTrack: 'assert',
      },
    ],
  },
  // ── Set 6: Online Marketplace ────────────────────────────────────────
  {
    id: 'online_marketplace',
    title: 'Online Marketplace',
    description: 'Spot scams, pressure tactics, and manipulation in online buying and selling interactions.',
    theme: 'sales',
    difficulty: 3,
    rounds: [
      {
        id: 'om_r1',
        setupLines: [
          { speaker: 'Buyer', text: "Hey, is this still available? I want to buy it right now." },
          { speaker: 'You', text: "Yeah, it's available. $200 like the listing says." },
          { speaker: 'Buyer', text: "Perfect. I'll send payment through my company's system — it's faster. I just need your email so I can send you a payment link." },
        ],
        question: 'What is the buyer setting up?',
        correctTactic: 'false_dilemma',
        correctTacticLabel: 'False Dilemma',
        decoyTactics: [
          { tactic: 'scarcity_pressure', label: 'Scarcity Pressure' },
          { tactic: 'flattery', label: 'Flattery' },
          { tactic: 'sunk_cost_trap', label: 'Sunk Cost Trap' },
        ],
        revealLine: { speaker: 'Buyer', text: "The platform's payment system has too many fees and takes days to clear. Either you use my link and get paid instantly, or you'll lose the sale — I don't have time to wait around." },
        explanation: "The buyer created a false binary: accept their off-platform payment link (a common phishing vector) or lose the sale entirely. The setup — 'I want to buy it right now' — established urgency, and 'my company's system' added a veneer of legitimacy. No mention was made of the platform's built-in buyer/seller protections, which is the actual safe third option.",
        difficulty: 3,
        skillTrack: 'defend',
      },
      {
        id: 'om_r2',
        setupLines: [
          { speaker: 'Seller', text: "Multiple people are interested. I've got three offers already." },
          { speaker: 'You', text: "Okay, but the price seems a bit high for this model." },
          { speaker: 'Seller', text: "I've had someone offer full asking price, but they can't pick up until next week. If you can come today, it's yours." },
        ],
        question: 'What pressure tactic is the seller using?',
        correctTactic: 'scarcity_pressure',
        correctTacticLabel: 'Scarcity Pressure',
        decoyTactics: [
          { tactic: 'guilt_trip', label: 'Guilt Trip' },
          { tactic: 'appeal_to_authority', label: 'Appeal to Authority' },
          { tactic: 'false_dilemma', label: 'False Dilemma' },
        ],
        revealLine: { speaker: 'Seller', text: "Honestly, I'm doing you a favor by even holding it. The other buyer is ready to Venmo me a deposit right now. If you don't commit in the next hour, I have to go with them." },
        explanation: "Every line manufactured competition and urgency: 'three offers,' 'someone offered full price,' 'next hour.' The phantom competing buyers (who may not exist) are a classic scarcity play — creating the fear that hesitation means loss. The setup primed you to feel lucky for even being considered, making you less likely to negotiate or verify the item's actual value.",
        difficulty: 2,
        skillTrack: 'defend',
      },
      {
        id: 'om_r3',
        setupLines: [
          { speaker: 'Buyer', text: "I love the couch! I'll take it. But I'm out of state — can you ship it?" },
          { speaker: 'You', text: "I'd prefer local pickup. Shipping a couch is expensive." },
          { speaker: 'Buyer', text: "No worries! I'll pay extra for shipping. Let me send you a cashier's check for $800 — that's $200 for the couch plus $600 for the movers I'll arrange." },
        ],
        question: 'What scam pattern is forming?',
        correctTactic: 'sunk_cost_trap',
        correctTacticLabel: 'Sunk Cost Trap',
        decoyTactics: [
          { tactic: 'flattery', label: 'Flattery' },
          { tactic: 'guilt_trip', label: 'Guilt Trip' },
          { tactic: 'love_bombing', label: 'Love Bombing' },
        ],
        revealLine: { speaker: 'Buyer', text: "Actually, my movers cancelled. Can you just send back the $600 shipping portion via Zelle? Keep your $200 of course. The check already cleared, so you're covered." },
        explanation: "The overpayment setup is a classic sunk cost scam. By sending a check for more than the item costs and having you 'refund' the difference, the scammer exploits the period before the fraudulent check bounces. The setup — offering generous overpayment and an easy arrangement — made the transaction feel like you were already invested in a done deal. Once you wire back the 'extra,' the original check fails and you've lost real money.",
        difficulty: 3,
        skillTrack: 'defend',
      },
      {
        id: 'om_r4',
        setupLines: [
          { speaker: 'Seller', text: "Here's the laptop. As described — great condition." },
          { speaker: 'You', text: "Can I test it before I pay? I want to check the battery and screen." },
          { speaker: 'Seller', text: "I mean, you can see it's on and working. I've got somewhere to be in ten minutes. I've already given you a good deal." },
        ],
        question: 'What tactic will the seller use to prevent inspection?',
        correctTactic: 'scarcity_pressure',
        correctTacticLabel: 'Scarcity Pressure',
        decoyTactics: [
          { tactic: 'moving_goalposts', label: 'Moving Goalposts' },
          { tactic: 'passive_aggression', label: 'Passive Aggression' },
          { tactic: 'whataboutism', label: 'Whataboutism' },
        ],
        revealLine: { speaker: 'Seller', text: "Look, I've got two other people who want this. The next guy said he'd take it sight unseen. Take it or leave it — I can't wait around while you run diagnostics." },
        explanation: "The seller used manufactured time pressure — 'somewhere to be in ten minutes,' 'two other buyers,' 'take it or leave it' — to prevent a thorough inspection. This is scarcity pressure designed to skip due diligence. Legitimate sellers welcome inspection; pressure to skip it is one of the strongest red flags in person-to-person sales. The 'good deal' framing was an early hook to make walking away feel like losing something.",
        difficulty: 3,
        skillTrack: 'negotiate',
      },
    ],
  },

  // ── Set 7: Roommate Conflicts ───────────────────────────────────────
  {
    id: 'roommate_conflicts',
    title: 'Roommate Conflicts',
    description: 'Identify passive aggression, guilt, and stonewalling tactics in shared-living disputes.',
    theme: 'relationships',
    difficulty: 2,
    rounds: [
      {
        id: 'rm_r1',
        setupLines: [
          { speaker: 'Roommate', text: "Oh, you're cooking again? Nice." },
          { speaker: 'You', text: "Yeah, just making dinner. Want some?" },
          { speaker: 'Roommate', text: "No thanks. I actually cleaned the whole kitchen this morning. Took me an hour. But you probably didn't notice." },
        ],
        question: 'What tactic is the roommate using?',
        correctTactic: 'passive_aggression',
        correctTacticLabel: 'Passive Aggression',
        decoyTactics: [
          { tactic: 'guilt_trip', label: 'Guilt Trip' },
          { tactic: 'stonewalling', label: 'Stonewalling' },
          { tactic: 'gaslighting', label: 'Gaslighting' },
        ],
        revealLine: { speaker: 'Roommate', text: "No, it's fine. Cook away. I'll just clean it again tomorrow. It's what I do apparently." },
        explanation: "The roommate never directly asked for help or expressed frustration. Instead, they embedded resentment inside technically neutral statements: 'you probably didn't notice,' 'it's what I do apparently.' The surface message is cooperative ('cook away'), but the actual message is hostile ('you never clean and I'm tired of it'). Passive aggression avoids direct conflict while ensuring the other person feels guilty.",
        difficulty: 2,
        skillTrack: 'empathize',
      },
      {
        id: 'rm_r2',
        setupLines: [
          { speaker: 'You', text: "Hey, can we talk about the thermostat? It was at 78 when I got home." },
          { speaker: 'Roommate', text: "I was cold." },
          { speaker: 'You', text: "I get that, but we agreed to keep it at 72 to save on the bill." },
        ],
        question: 'How will the roommate deflect?',
        correctTactic: 'guilt_trip',
        correctTacticLabel: 'Guilt Trip',
        decoyTactics: [
          { tactic: 'whataboutism', label: 'Whataboutism' },
          { tactic: 'false_dilemma', label: 'False Dilemma' },
          { tactic: 'passive_aggression', label: 'Passive Aggression' },
        ],
        revealLine: { speaker: 'Roommate', text: "I have a medical condition — you know that. But if saving twenty bucks is more important than my health, I guess I'll just freeze. I'll grab a blanket." },
        explanation: "The roommate escalated from a minor preference disagreement to a health-vs-money framing. Invoking a medical condition (real or exaggerated) and the dramatic 'I'll just freeze' creates guilt for enforcing the agreed boundary. The setup — the flat 'I was cold' — was a test to see if you'd back down. When you held firm, the guilt trip deployed the bigger emotional weapon.",
        difficulty: 2,
        skillTrack: 'assert',
      },
      {
        id: 'rm_r3',
        setupLines: [
          { speaker: 'You', text: "Your friend was here until 2 AM on a Tuesday. I have work in the morning." },
          { speaker: 'Roommate', text: "Sorry. It won't happen again." },
          { speaker: 'You', text: "You said that last time too. Can we set some ground rules about guests on weeknights?" },
        ],
        question: 'What will the roommate do next?',
        correctTactic: 'stonewalling',
        correctTacticLabel: 'Stonewalling',
        decoyTactics: [
          { tactic: 'silent_treatment', label: 'Silent Treatment' },
          { tactic: 'emotional_blackmail', label: 'Emotional Blackmail' },
          { tactic: 'triangulation', label: 'Triangulation' },
        ],
        revealLine: { speaker: 'Roommate', text: "I already said sorry. I don't know what else you want from me. I'm not going to sit here and be lectured. We can talk when you're not being so intense about everything." },
        explanation: "The roommate gave a surface-level apology, then shut down the conversation when asked for a concrete change. 'I don't know what else you want' and 'when you're not being so intense' are stonewalling moves: refusing to engage further while making it your fault the conversation can't continue. The setup showed the pattern — a quick sorry followed by resistance to any real accountability or solution.",
        difficulty: 3,
        skillTrack: 'assert',
      },
      {
        id: 'rm_r4',
        setupLines: [
          { speaker: 'Roommate', text: "So I invited a couple people over Saturday." },
          { speaker: 'You', text: "How many is a couple? Last time 'a couple' was fifteen people." },
          { speaker: 'Roommate', text: "Why are you always so negative? I'm trying to include you. Most people would be happy their roommate wants to hang out." },
        ],
        question: 'What deflection tactic is being used?',
        correctTactic: 'gaslighting',
        correctTacticLabel: 'Gaslighting',
        decoyTactics: [
          { tactic: 'flattery', label: 'Flattery' },
          { tactic: 'guilt_trip', label: 'Guilt Trip' },
          { tactic: 'whataboutism', label: 'Whataboutism' },
        ],
        revealLine: { speaker: 'Roommate', text: "Last time was not fifteen people. Maybe eight, tops. You always exaggerate. Honestly, I think you just don't like my friends and you're looking for excuses." },
        explanation: "The roommate denied a verifiable fact ('not fifteen people'), reframed your concern as exaggeration, and then questioned your motives ('you don't like my friends'). This is gaslighting: making you doubt your own perception of events. The setup — 'why are you always so negative' — pre-framed you as the problem so that any factual pushback would look like more negativity rather than a legitimate concern.",
        difficulty: 3,
        skillTrack: 'regulate',
      },
      {
        id: 'rm_r5',
        setupLines: [
          { speaker: 'You', text: "Can we split the grocery bill more fairly? I've been buying all the shared stuff." },
          { speaker: 'Roommate', text: "I buy stuff too." },
          { speaker: 'You', text: "Like what? I bought toilet paper, dish soap, trash bags, and paper towels last month." },
        ],
        question: 'What will the roommate reach for?',
        correctTactic: 'whataboutism',
        correctTacticLabel: 'Whataboutism',
        decoyTactics: [
          { tactic: 'moving_goalposts', label: 'Moving Goalposts' },
          { tactic: 'stonewalling', label: 'Stonewalling' },
          { tactic: 'passive_aggression', label: 'Passive Aggression' },
        ],
        revealLine: { speaker: 'Roommate', text: "Oh, so we're keeping score now? What about the fact that I always take out the trash? And I'm the one who deals with the landlord every time something breaks. But sure, let's talk about paper towels." },
        explanation: "When confronted with a specific, documented imbalance, the roommate pivoted to unrelated contributions — taking out trash and handling the landlord — instead of addressing the grocery expenses. This is whataboutism: deflecting from the current issue by raising different grievances to avoid accountability. The dismissive 'let's talk about paper towels' minimizes your concern while the counter-examples make you look petty for raising it.",
        difficulty: 2,
        skillTrack: 'negotiate',
      },
    ],
  },

  // ── Set 8: Authority Figures ────────────────────────────────────────
  {
    id: 'authority_figures',
    title: 'Authority Figures',
    description: 'Recognize power dynamics and influence tactics used by bosses, teachers, officials, and other authority figures.',
    theme: 'workplace',
    difficulty: 4,
    rounds: [
      {
        id: 'af_r1',
        setupLines: [
          { speaker: 'Boss', text: "I need you to stay late tonight. We have a client emergency." },
          { speaker: 'You', text: "I have a commitment tonight — my kid's recital. Can someone else cover?" },
          { speaker: 'Boss', text: "Everyone else is busy. Look, I stayed late every day when I was at your level. That's how you move up here." },
        ],
        question: 'What power dynamic tactic is the boss using?',
        correctTactic: 'appeal_to_authority',
        correctTacticLabel: 'Appeal to Authority',
        decoyTactics: [
          { tactic: 'guilt_trip', label: 'Guilt Trip' },
          { tactic: 'false_dilemma', label: 'False Dilemma' },
          { tactic: 'scarcity_pressure', label: 'Scarcity Pressure' },
        ],
        revealLine: { speaker: 'Boss', text: "I'm not saying you have to, but the VP asked me personally who's committed to this team. I'd hate to not have your name on that list. Your call." },
        explanation: "The boss invoked their own career history as a model ('that's how you move up') and then escalated by name-dropping the VP. This is appeal to authority on two levels: their personal experience as the standard, and the VP's judgment as the implicit threat. The setup framed personal sacrifice as the price of advancement, making your boundary look like a lack of ambition rather than a reasonable priority.",
        difficulty: 4,
        skillTrack: 'defend',
      },
      {
        id: 'af_r2',
        setupLines: [
          { speaker: 'Professor', text: "I see you're disputing this grade." },
          { speaker: 'You', text: "Yes — the rubric says analysis is worth 40%, and my analysis section was thorough." },
          { speaker: 'Professor', text: "I've been teaching this course for twenty years. I think I know what thorough analysis looks like." },
        ],
        question: 'What will the professor do next?',
        correctTactic: 'moving_goalposts',
        correctTacticLabel: 'Moving Goalposts',
        decoyTactics: [
          { tactic: 'appeal_to_authority', label: 'Appeal to Authority' },
          { tactic: 'gaslighting', label: 'Gaslighting' },
          { tactic: 'stonewalling', label: 'Stonewalling' },
        ],
        revealLine: { speaker: 'Professor', text: "The rubric is a guide, not a guarantee. I also factor in class participation, intellectual growth over the semester, and whether the student demonstrates original thinking. Your paper checked boxes but didn't show depth." },
        explanation: "When confronted with the rubric, the professor introduced new criteria not in the original grading framework — participation, 'intellectual growth,' 'original thinking.' This is moving goalposts: the published standard proved the grade was wrong, so new standards appeared. The setup — 'twenty years of experience' — was an authority flex designed to make questioning the grade feel presumptuous before the goalposts even moved.",
        difficulty: 4,
        skillTrack: 'assert',
      },
      {
        id: 'af_r3',
        setupLines: [
          { speaker: 'HR Rep', text: "So you filed a complaint about your manager's behavior in the team meeting." },
          { speaker: 'You', text: "Yes. He singled me out and criticized my work in front of the entire team." },
          { speaker: 'HR Rep', text: "I spoke with him, and he says he was just giving direct feedback. He thinks you might be taking it personally." },
        ],
        question: 'What institutional tactic is being deployed?',
        correctTactic: 'gaslighting',
        correctTacticLabel: 'Gaslighting',
        decoyTactics: [
          { tactic: 'triangulation', label: 'Triangulation' },
          { tactic: 'passive_aggression', label: 'Passive Aggression' },
          { tactic: 'whataboutism', label: 'Whataboutism' },
        ],
        revealLine: { speaker: 'HR Rep', text: "A few other people in the meeting didn't see anything unusual. Are you sure it was as bad as you remember? Sometimes when we're stressed, we perceive things differently than they actually happened." },
        explanation: "The HR rep reframed public humiliation as 'direct feedback,' then questioned your perception of the event — 'are you sure it was as bad as you remember?' This is institutional gaslighting: using the organization's authority to make the complainant doubt their own experience. The setup — immediately relaying the manager's counter-narrative — signaled that the institution's goal was to neutralize the complaint, not investigate it.",
        difficulty: 5,
        skillTrack: 'regulate',
      },
      {
        id: 'af_r4',
        setupLines: [
          { speaker: 'Landlord', text: "I'm going to need you to sign this addendum to your lease." },
          { speaker: 'You', text: "What does it change? I'd like to read it first." },
          { speaker: 'Landlord', text: "It's just standard stuff — updated building policies. Every other tenant has already signed it." },
        ],
        question: 'What pressure pattern is forming?',
        correctTactic: 'false_dilemma',
        correctTacticLabel: 'False Dilemma',
        decoyTactics: [
          { tactic: 'flattery', label: 'Flattery' },
          { tactic: 'sunk_cost_trap', label: 'Sunk Cost Trap' },
          { tactic: 'guilt_trip', label: 'Guilt Trip' },
        ],
        revealLine: { speaker: 'Landlord', text: "I need this signed by Friday or I'll have to start the non-renewal process. It's really not a big deal — you either sign and stay, or we'll need to find someone who's a better fit for the building." },
        explanation: "The landlord constructed a false binary: sign an unread document immediately or face eviction. The setup established social proof ('every other tenant signed') to make reading the addendum feel like unnecessary resistance. The reveal — 'sign and stay or we find someone else' — erased the legitimate middle ground of reading the document, asking questions, or negotiating terms. Authority figures use position power to make compliance feel like the only option.",
        difficulty: 4,
        skillTrack: 'negotiate',
      },
      {
        id: 'af_r5',
        setupLines: [
          { speaker: 'Senior Colleague', text: "I heard you applied for the team lead position." },
          { speaker: 'You', text: "I did. I think I'm ready for it." },
          { speaker: 'Senior Colleague', text: "That's brave. You know, I applied three times before I got it. It takes a while to earn that kind of trust." },
        ],
        question: 'What will the senior colleague say next?',
        correctTactic: 'emotional_blackmail',
        correctTacticLabel: 'Emotional Blackmail',
        decoyTactics: [
          { tactic: 'flattery', label: 'Flattery' },
          { tactic: 'triangulation', label: 'Triangulation' },
          { tactic: 'scarcity_pressure', label: 'Scarcity Pressure' },
        ],
        revealLine: { speaker: 'Senior Colleague', text: "I was actually going to recommend you for it — I've been mentoring you all year. But if you go over my head and apply directly, it kind of undermines our relationship. I thought loyalty mattered to you." },
        explanation: "The senior colleague framed an independent career move as a betrayal of their mentorship. The setup — 'it takes a while to earn trust' — subtly positioned them as a gatekeeper. The reveal made your autonomy conditional on their approval: if you apply independently, you're being disloyal. This is emotional blackmail — weaponizing a relationship to control your professional decisions under the guise of caring about 'loyalty.'",
        difficulty: 4,
        skillTrack: 'defend',
      },
    ],
  },
];

export function getAllForecastRounds(): ForecastRound[] {
  return FORECAST_SETS.flatMap((set) => set.rounds);
}

export function getForecastSetById(id: string): ForecastSet | undefined {
  return FORECAST_SETS.find((s) => s.id === id);
}

export function getForecastSetsByDifficulty(maxDifficulty: number): ForecastSet[] {
  return FORECAST_SETS.filter((s) => s.difficulty <= maxDifficulty);
}

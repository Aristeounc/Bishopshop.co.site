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
  category: 'flattery' | 'pressure' | 'guilt' | 'authority' | 'scarcity' | 'reciprocity' | 'social_proof' | 'anchoring' | 'deflection' | 'none' | 'emotional_blackmail' | 'false_dilemma';
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
  {
    id: 'real_estate_open_house',
    title: 'The Open House',
    context: 'You\'re attending an open house for a home slightly above your budget. The listing agent corners you in the kitchen.',
    difficulty: 2,
    dialogue: [
      {
        id: 'reo_1',
        speaker: 'Agent',
        text: "This is a stunning property, isn't it? I can tell you have great taste. The previous couple who looked at it this morning are already drafting an offer.",
        tactics: [
          { id: 'reo_1a', name: 'Flattery', category: 'flattery', description: 'Complimenting your taste to build rapport and make you feel validated.', startIndex: 39, endIndex: 70 },
          { id: 'reo_1b', name: 'Social Proof + Scarcity', category: 'social_proof', description: 'Citing another buyer to imply competition and create urgency.', startIndex: 72, endIndex: 152 },
        ],
        isClean: false,
      },
      {
        id: 'reo_2',
        speaker: 'Agent',
        text: "The sellers originally listed at $485,000, but between you and me, I think they'd consider something around $460,000 for the right buyer who can close quickly.",
        tactics: [
          { id: 'reo_2a', name: 'Anchoring', category: 'anchoring', description: 'Setting a high reference price to make the lower number feel like a bargain.', startIndex: 12, endIndex: 41 },
          { id: 'reo_2b', name: 'Scarcity Qualifier', category: 'scarcity', description: 'Implying the deal is only available to someone who acts fast.', startIndex: 117, endIndex: 158 },
        ],
        isClean: false,
      },
      {
        id: 'reo_3',
        speaker: 'Agent',
        text: "I'd love to tell you to take your time, but honestly, in this market? Homes in this neighborhood are going under contract within 48 hours. I'd hate for you to miss out.",
        tactics: [
          { id: 'reo_3a', name: 'Scarcity', category: 'scarcity', description: 'Manufacturing urgency by citing fast-moving market conditions.', startIndex: 70, endIndex: 137 },
          { id: 'reo_3b', name: 'Loss Aversion', category: 'pressure', description: 'Framing inaction as a potential loss to push you toward a quick decision.', startIndex: 139, endIndex: 167 },
        ],
        isClean: false,
      },
      {
        id: 'reo_4',
        speaker: 'Agent',
        text: "The kitchen was fully renovated last year, and the school district is one of the top five in the state.",
        tactics: [],
        isClean: true,
      },
      {
        id: 'reo_5',
        speaker: 'You',
        text: "It's a nice place. I want to talk it over with my partner before making any decisions.",
        tactics: [],
        isClean: true,
      },
      {
        id: 'reo_6',
        speaker: 'Agent',
        text: "Look, I'll be honest — I've been doing this for fifteen years. This is one of the best values I've seen at this price point. I wouldn't say that if I didn't mean it.",
        tactics: [
          { id: 'reo_6a', name: 'Authority Appeal', category: 'authority', description: 'Citing years of experience to make their opinion seem like expert fact.', startIndex: 23, endIndex: 61 },
          { id: 'reo_6b', name: 'False Sincerity', category: 'pressure', description: 'Framing a sales pitch as rare personal honesty to bypass skepticism.', startIndex: 63, endIndex: 165 },
        ],
        isClean: false,
      },
    ],
  },
  {
    id: 'gym_membership_pitch',
    title: 'The Gym Sign-Up',
    context: 'You walk into a gym for a free trial workout. After the session, the sales rep sits you down at a desk.',
    difficulty: 3,
    dialogue: [
      {
        id: 'gm_1',
        speaker: 'Sales Rep',
        text: "You look like someone who takes fitness seriously already. I can tell you've been putting in work — most people who walk in here aren't in the shape you're in.",
        tactics: [
          { id: 'gm_1a', name: 'Flattery', category: 'flattery', description: 'Excessive compliments to build rapport and make you feel special.', startIndex: 0, endIndex: 159 },
        ],
        isClean: false,
      },
      {
        id: 'gm_2',
        speaker: 'Sales Rep',
        text: "I'm actually going to waive the enrollment fee for you — that's $200 I'm taking off right now, just because I can see you're committed.",
        tactics: [
          { id: 'gm_2a', name: 'Reciprocity', category: 'reciprocity', description: 'Giving you a "gift" to create a sense of obligation to sign up.', startIndex: 0, endIndex: 93 },
          { id: 'gm_2b', name: 'Flattery', category: 'flattery', description: 'Framing the discount as recognition of your dedication.', startIndex: 95, endIndex: 134 },
        ],
        isClean: false,
      },
      {
        id: 'gm_3',
        speaker: 'Sales Rep',
        text: "Our premium plan is normally $89 a month, but I can lock you in at $59 if you sign up today. That rate goes away at midnight.",
        tactics: [
          { id: 'gm_3a', name: 'Anchoring', category: 'anchoring', description: 'Setting a high "normal" price to make the discounted price seem like a steal.', startIndex: 0, endIndex: 40 },
          { id: 'gm_3b', name: 'Time Pressure', category: 'pressure', description: 'Creating an artificial deadline to prevent you from comparing options.', startIndex: 46, endIndex: 125 },
        ],
        isClean: false,
      },
      {
        id: 'gm_4',
        speaker: 'You',
        text: "I appreciate the offer, but I'd like to think about it first.",
        tactics: [],
        isClean: true,
      },
      {
        id: 'gm_5',
        speaker: 'Sales Rep',
        text: "Totally understand. But I should mention — three people signed up for this exact plan this morning. We only have a few spots left at this rate before the system resets the pricing.",
        tactics: [
          { id: 'gm_5a', name: 'Social Proof', category: 'social_proof', description: 'Citing other sign-ups to make the decision feel normal and validated.', startIndex: 43, endIndex: 98 },
          { id: 'gm_5b', name: 'Scarcity', category: 'scarcity', description: 'Implying limited availability to create fear of missing out.', startIndex: 100, endIndex: 180 },
        ],
        isClean: false,
      },
      {
        id: 'gm_6',
        speaker: 'Sales Rep',
        text: "Your body will thank you six months from now. And honestly? You deserve this investment in yourself.",
        tactics: [
          { id: 'gm_6a', name: 'Flattery', category: 'flattery', description: 'Framing the purchase as self-care you "deserve" to make refusal feel like self-neglect.', startIndex: 60, endIndex: 100 },
        ],
        isClean: false,
      },
    ],
  },
  {
    id: 'toxic_friendship',
    title: 'The Guilt Trip',
    context: 'Your close friend texts you after you spent the weekend with other friends instead of hanging out with them.',
    difficulty: 4,
    dialogue: [
      {
        id: 'tf_1',
        speaker: 'Friend',
        text: "I just think it's funny how you always have time for Jake but never for me. I guess I know where I stand.",
        tactics: [
          { id: 'tf_1a', name: 'Guilt Trip', category: 'guilt', description: 'Using comparison to make you feel guilty about how you spend your time.', startIndex: 28, endIndex: 74 },
          { id: 'tf_1b', name: 'Emotional Blackmail', category: 'emotional_blackmail', description: 'Implying they are being ranked and rejected to provoke guilt.', startIndex: 76, endIndex: 105 },
        ],
        isClean: false,
      },
      {
        id: 'tf_2',
        speaker: 'You',
        text: "That's not what I meant at all. You know you're important to me.",
        tactics: [],
        isClean: true,
      },
      {
        id: 'tf_3',
        speaker: 'Friend',
        text: "Do I though? Because honestly, sometimes I wonder if I'm even your friend or just someone you keep around when it's convenient. Maybe I should just stop trying.",
        tactics: [
          { id: 'tf_3a', name: 'Identity Questioning', category: 'guilt', description: 'Questioning the entire friendship to make you scramble to prove your loyalty.', startIndex: 31, endIndex: 126 },
          { id: 'tf_3b', name: 'Withdrawal Threat', category: 'emotional_blackmail', description: 'Threatening to pull away to force you into reassuring and accommodating them.', startIndex: 128, endIndex: 160 },
        ],
        isClean: false,
      },
      {
        id: 'tf_4',
        speaker: 'Friend',
        text: "You know Megan agrees with me, right? She said she noticed it too — you've been pulling away from everyone. I'm not the only one who sees it.",
        tactics: [
          { id: 'tf_4a', name: 'Triangulation', category: 'social_proof', description: 'Bringing in a third party to validate their claim and isolate you.', startIndex: 9, endIndex: 65 },
          { id: 'tf_4b', name: 'Social Proof Pressure', category: 'social_proof', description: 'Implying multiple people have noticed to make you doubt yourself.', startIndex: 68, endIndex: 141 },
        ],
        isClean: false,
      },
      {
        id: 'tf_5',
        speaker: 'Friend',
        text: "I just care about you so much that it hurts when I feel like I'm losing you. If you really cared, you'd make more of an effort.",
        tactics: [
          { id: 'tf_5a', name: 'Emotional Blackmail', category: 'emotional_blackmail', description: 'Framing their pain as your responsibility to manage.', startIndex: 35, endIndex: 75 },
          { id: 'tf_5b', name: 'Conditional Love', category: 'guilt', description: 'Implying your care is only real if you behave the way they want.', startIndex: 77, endIndex: 127 },
        ],
        isClean: false,
      },
      {
        id: 'tf_6',
        speaker: 'Friend',
        text: "Remember everything I've done for you? I was there when nobody else was. I just expected the same loyalty back.",
        tactics: [
          { id: 'tf_6a', name: 'Reciprocity Guilt', category: 'reciprocity', description: 'Invoking past favors to create a debt you can never fully repay.', startIndex: 39, endIndex: 111 },
        ],
        isClean: false,
      },
    ],
  },
  {
    id: 'job_interview_lowball',
    title: 'The Lowball Offer',
    context: 'After three rounds of interviews, the recruiter calls with an offer that\'s well below market rate.',
    difficulty: 3,
    dialogue: [
      {
        id: 'jl_1',
        speaker: 'Recruiter',
        text: "Great news — the team loved you and we'd like to extend an offer! Everyone was really impressed with your background.",
        tactics: [],
        isClean: true,
      },
      {
        id: 'jl_2',
        speaker: 'Recruiter',
        text: "Based on industry benchmarks and the scope of this role, we've budgeted the position at $72,000. That's actually at the top of the range for someone at your experience level.",
        tactics: [
          { id: 'jl_2a', name: 'Anchoring', category: 'anchoring', description: 'Setting a low anchor to frame the negotiation in their favor.', startIndex: 57, endIndex: 95 },
          { id: 'jl_2b', name: 'Authority Framing', category: 'authority', description: 'Citing benchmarks and ranges to make the number seem objective and non-negotiable.', startIndex: 97, endIndex: 174 },
        ],
        isClean: false,
      },
      {
        id: 'jl_3',
        speaker: 'You',
        text: "I was actually expecting something closer to $90,000 based on my research.",
        tactics: [],
        isClean: true,
      },
      {
        id: 'jl_4',
        speaker: 'Recruiter',
        text: "I hear you, but our VP of Talent has set these bands based on extensive market research. We're very data-driven here.",
        tactics: [
          { id: 'jl_4a', name: 'Authority Appeal', category: 'authority', description: 'Citing a senior executive to shut down negotiation and make the number seem final.', startIndex: 16, endIndex: 117 },
        ],
        isClean: false,
      },
      {
        id: 'jl_5',
        speaker: 'Recruiter',
        text: "The way I see it, you can either take this offer and start building your career with us right away, or you can keep looking — but I should mention we do have two other strong candidates in final rounds.",
        tactics: [
          { id: 'jl_5a', name: 'False Dilemma', category: 'false_dilemma', description: 'Presenting only two options — accept or lose out — to eliminate negotiation.', startIndex: 18, endIndex: 123 },
          { id: 'jl_5b', name: 'Scarcity', category: 'scarcity', description: 'Implying you are replaceable to pressure you into accepting.', startIndex: 147, endIndex: 201 },
        ],
        isClean: false,
      },
      {
        id: 'jl_6',
        speaker: 'Recruiter',
        text: "The benefits package is excellent though — full health, dental, vision, and four weeks PTO from day one.",
        tactics: [],
        isClean: true,
      },
      {
        id: 'jl_7',
        speaker: 'Recruiter',
        text: "Look, I don't want to lose you. Let me see if I can get approval for a $3,000 signing bonus. But I'd need your answer by end of day tomorrow.",
        tactics: [
          { id: 'jl_7a', name: 'Flattery', category: 'flattery', description: 'Expressing personal desire to keep you to make you feel valued and lower resistance.', startIndex: 6, endIndex: 30 },
          { id: 'jl_7b', name: 'Reciprocity', category: 'reciprocity', description: 'Offering a small concession to create obligation and distract from the low base salary.', startIndex: 32, endIndex: 92 },
          { id: 'jl_7c', name: 'Time Pressure', category: 'pressure', description: 'Imposing a tight deadline to prevent you from getting competing offers.', startIndex: 97, endIndex: 140 },
        ],
        isClean: false,
      },
    ],
  },
  {
    id: 'mlm_recruitment',
    title: 'The Business Opportunity',
    context: 'An old high school classmate you haven\'t spoken to in years messages you out of the blue on social media.',
    difficulty: 5,
    dialogue: [
      {
        id: 'mlm_1',
        speaker: 'Classmate',
        text: "I wish someone had told me about this opportunity sooner — it completely changed my family's financial future. You're so smart, you'd be amazing at this.",
        tactics: [
          { id: 'mlm_1a', name: 'Social Proof', category: 'social_proof', description: 'Using personal testimony to imply guaranteed life-changing results.', startIndex: 59, endIndex: 109 },
          { id: 'mlm_1b', name: 'Flattery', category: 'flattery', description: 'Complimenting your intelligence to make you feel chosen and lower skepticism.', startIndex: 111, endIndex: 153 },
        ],
        isClean: false,
      },
      {
        id: 'mlm_2',
        speaker: 'You',
        text: "What exactly does the business involve?",
        tactics: [],
        isClean: true,
      },
      {
        id: 'mlm_3',
        speaker: 'Classmate',
        text: "It's a wellness company backed by doctors and endorsed by professional athletes. We've been featured on Forbes and our CEO was just on the cover of Entrepreneur magazine.",
        tactics: [
          { id: 'mlm_3a', name: 'False Authority', category: 'authority', description: 'Name-dropping doctors and athletes to create an illusion of legitimacy.', startIndex: 24, endIndex: 79 },
          { id: 'mlm_3b', name: 'Authority Appeal', category: 'authority', description: 'Citing media features to make the company seem prestigious and established.', startIndex: 81, endIndex: 170 },
        ],
        isClean: false,
      },
      {
        id: 'mlm_4',
        speaker: 'Classmate',
        text: "The top earners in our team made over $200,000 last year. And the couple who recruited me? They retired at 35. I'm just trying to help people I care about get in early.",
        tactics: [
          { id: 'mlm_4a', name: 'Social Proof', category: 'social_proof', description: 'Citing extreme success stories to imply those results are typical.', startIndex: 0, endIndex: 110 },
          { id: 'mlm_4b', name: 'Love Bombing', category: 'flattery', description: 'Framing the recruitment as a personal favor born from caring to disguise the profit motive.', startIndex: 111, endIndex: 168 },
        ],
        isClean: false,
      },
      {
        id: 'mlm_5',
        speaker: 'Classmate',
        text: "The starter kit is only $499, and honestly, it pays for itself within the first month. Everyone says that. Plus, once you're in, you're in — this is a ground-floor opportunity.",
        tactics: [
          { id: 'mlm_5a', name: 'Sunk Cost Setup', category: 'anchoring', description: 'Minimizing the upfront cost while implying guaranteed fast returns.', startIndex: 44, endIndex: 106 },
          { id: 'mlm_5b', name: 'Scarcity + Sunk Cost', category: 'scarcity', description: 'Framing this as a once-in-a-lifetime window to create fear of missing out.', startIndex: 113, endIndex: 176 },
        ],
        isClean: false,
      },
      {
        id: 'mlm_6',
        speaker: 'Classmate',
        text: "I believe in you so much. I can already see you on stage at our annual conference getting recognized as a top performer. Don't you want that life?",
        tactics: [
          { id: 'mlm_6a', name: 'Love Bombing', category: 'flattery', description: 'Overwhelming affirmation to create emotional investment and bypass rational analysis.', startIndex: 0, endIndex: 120 },
          { id: 'mlm_6b', name: 'Emotional Pressure', category: 'pressure', description: 'Painting a vivid aspirational future to make saying no feel like giving up on your dreams.', startIndex: 121, endIndex: 146 },
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

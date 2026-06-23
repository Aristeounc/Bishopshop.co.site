export interface FlashJudgmentSet {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  questions: FlashQuestion[];
}

export interface FlashQuestion {
  id: string;
  scenario: string;
  context: string;
  options: FlashOption[];
  correctOptionId: string;
  explanation: string;
  skillTrack: string;
}

export interface FlashOption {
  id: string;
  text: string;
  quality: 'best' | 'okay' | 'poor' | 'worst';
}

export const FLASH_JUDGMENT_SETS: FlashJudgmentSet[] = [
  {
    id: 'workplace_basics',
    title: 'Workplace Essentials',
    description: 'Navigate common office conflicts with the best response',
    difficulty: 1,
    questions: [
      {
        id: 'wb_1',
        scenario: 'Your coworker takes credit for your idea in a meeting.',
        context: 'Team meeting with 8 people, your manager is present.',
        options: [
          { id: 'wb_1a', text: '"I appreciate you building on that — I\'d love to walk through the details since I developed the initial concept."', quality: 'best' },
          { id: 'wb_1b', text: '"That was actually MY idea and everyone here knows it."', quality: 'worst' },
          { id: 'wb_1c', text: '"Great point. I had some additional thoughts from when I was working on this earlier..."', quality: 'okay' },
          { id: 'wb_1d', text: 'Say nothing and bring it up with your manager later.', quality: 'poor' },
        ],
        correctOptionId: 'wb_1a',
        explanation: 'Acknowledge the person while clearly establishing ownership. Direct but not aggressive — maintains the relationship while protecting your contribution.',
        skillTrack: 'assert',
      },
      {
        id: 'wb_2',
        scenario: 'Your boss says "We need to talk" with no other context.',
        context: 'Friday afternoon, you haven\'t made any known mistakes recently.',
        options: [
          { id: 'wb_2a', text: 'Immediately start worrying and mentally preparing defenses.', quality: 'worst' },
          { id: 'wb_2b', text: '"Sure, I have time now. What\'s on your mind?"', quality: 'best' },
          { id: 'wb_2c', text: '"Is everything okay? Did I do something wrong?"', quality: 'poor' },
          { id: 'wb_2d', text: '"I\'m available. Want to give me a heads up on the topic so I can prepare?"', quality: 'okay' },
        ],
        correctOptionId: 'wb_2b',
        explanation: 'Stay calm and open. Don\'t assume the worst or pre-apologize — it gives away power and signals anxiety. Meet the moment as it comes.',
        skillTrack: 'regulate',
      },
      {
        id: 'wb_3',
        scenario: 'A colleague constantly interrupts you during discussions.',
        context: 'This has happened in the last 3 meetings. Others have noticed.',
        options: [
          { id: 'wb_3a', text: '"I\'d like to finish my thought — I\'ll make sure you have time to respond after."', quality: 'best' },
          { id: 'wb_3b', text: 'Start interrupting them back to establish dominance.', quality: 'worst' },
          { id: 'wb_3c', text: 'Let them talk and bring it up privately later.', quality: 'okay' },
          { id: 'wb_3d', text: '"Can you please stop interrupting me? It\'s really rude."', quality: 'poor' },
        ],
        correctOptionId: 'wb_3a',
        explanation: 'Firm boundary + collaborative framing. You assert your right to speak while assuring them they\'ll be heard too. No accusation, no doormat.',
        skillTrack: 'assert',
      },
      {
        id: 'wb_4',
        scenario: 'Your teammate misses a deadline that affects your work.',
        context: 'It\'s the second time this quarter. Your deliverable is now late too.',
        options: [
          { id: 'wb_4a', text: '"Hey, I noticed the report isn\'t in yet. What happened, and how can we get back on track?"', quality: 'best' },
          { id: 'wb_4b', text: '"You always miss deadlines and it makes me look bad."', quality: 'worst' },
          { id: 'wb_4c', text: 'Email your manager explaining the situation and CC your teammate.', quality: 'poor' },
          { id: 'wb_4d', text: '"No worries, I\'ll figure it out on my end."', quality: 'poor' },
        ],
        correctOptionId: 'wb_4a',
        explanation: 'Start with observation, not accusation. Ask what happened (curiosity, not blame) and pivot to solutions. This opens dialogue without triggering defensiveness.',
        skillTrack: 'connect',
      },
      {
        id: 'wb_5',
        scenario: 'You disagree with a decision your manager just made.',
        context: 'The decision affects your team\'s workflow. You have relevant data.',
        options: [
          { id: 'wb_5a', text: '"I\'d like to share some data I have that might affect this decision. Can we look at it together?"', quality: 'best' },
          { id: 'wb_5b', text: '"That\'s a bad call and here\'s why..."', quality: 'poor' },
          { id: 'wb_5c', text: 'Comply outwardly but tell your team you disagree.', quality: 'worst' },
          { id: 'wb_5d', text: '"I see where you\'re coming from, but have you considered...?"', quality: 'okay' },
        ],
        correctOptionId: 'wb_5a',
        explanation: 'Lead with new information rather than opposition. "I have data" is more persuasive than "I disagree." Make it collaborative by reviewing together.',
        skillTrack: 'negotiate',
      },
      {
        id: 'wb_6',
        scenario: 'A client yells at you over the phone about a minor issue.',
        context: 'The issue is easily fixable. The client is a long-term account.',
        options: [
          { id: 'wb_6a', text: '"I can hear this is really frustrating. Let me fix this right now — here\'s what I\'m going to do."', quality: 'best' },
          { id: 'wb_6b', text: '"You need to calm down. This isn\'t that big of a deal."', quality: 'worst' },
          { id: 'wb_6c', text: '"I\'m sorry, I\'m so sorry. I\'ll do whatever you need."', quality: 'poor' },
          { id: 'wb_6d', text: '"I understand. Let me look into this and get back to you."', quality: 'okay' },
        ],
        correctOptionId: 'wb_6a',
        explanation: 'Label the emotion ("frustrating"), then immediately pivot to action. Don\'t over-apologize or tell them to calm down. Show competence through swift action.',
        skillTrack: 'empathize',
      },
      {
        id: 'wb_7',
        scenario: 'Someone gossips to you about a colleague\'s personal life.',
        context: 'The person gossiping is friendly with you and expects engagement.',
        options: [
          { id: 'wb_7a', text: '"I\'d rather not get into that — how\'s your project going?"', quality: 'best' },
          { id: 'wb_7b', text: 'Listen politely but don\'t repeat the information.', quality: 'okay' },
          { id: 'wb_7c', text: '"Wow, really? Tell me more..."', quality: 'worst' },
          { id: 'wb_7d', text: '"That\'s none of our business and we shouldn\'t talk about it."', quality: 'poor' },
        ],
        correctOptionId: 'wb_7a',
        explanation: 'Clean redirect without preaching. State your preference, then offer an easy alternative topic. Doesn\'t damage the relationship or make them feel judged.',
        skillTrack: 'defend',
      },
      {
        id: 'wb_8',
        scenario: 'You receive harsh, public criticism on your presentation.',
        context: 'A senior leader criticizes your approach in front of 20 people.',
        options: [
          { id: 'wb_8a', text: '"Thank you for that feedback. Can you help me understand what specifically you\'d change?"', quality: 'best' },
          { id: 'wb_8b', text: '"Well, if you had read the brief, you\'d know why I took this approach."', quality: 'worst' },
          { id: 'wb_8c', text: 'Nod silently and move on to the next slide.', quality: 'poor' },
          { id: 'wb_8d', text: '"That\'s a fair point. Let me think about how to incorporate that."', quality: 'okay' },
        ],
        correctOptionId: 'wb_8a',
        explanation: 'Accept gracefully, then redirect with a calibrated question. Asking "what specifically" puts the burden on them to be constructive, not just critical.',
        skillTrack: 'regulate',
      },
      {
        id: 'wb_9',
        scenario: 'A new hire asks you to do something that\'s clearly their responsibility.',
        context: 'They seem overwhelmed and it would only take you 10 minutes.',
        options: [
          { id: 'wb_9a', text: '"I can walk you through how to do it — that way you\'ll have it for next time."', quality: 'best' },
          { id: 'wb_9b', text: '"That\'s your job, not mine."', quality: 'poor' },
          { id: 'wb_9c', text: 'Just do it for them to be nice.', quality: 'poor' },
          { id: 'wb_9d', text: '"Sure, I\'ll handle it this time."', quality: 'okay' },
        ],
        correctOptionId: 'wb_9a',
        explanation: 'Help without enabling. Teaching them builds capability and sets a healthy precedent — you\'re supportive but not a crutch.',
        skillTrack: 'connect',
      },
      {
        id: 'wb_10',
        scenario: 'You overhear your manager speaking negatively about you to another manager.',
        context: 'They said you "lack initiative" which contradicts your recent performance.',
        options: [
          { id: 'wb_10a', text: 'Schedule a 1-on-1 and say: "I\'d like to understand your expectations for initiative — I want to make sure we\'re aligned."', quality: 'best' },
          { id: 'wb_10b', text: 'Confront them immediately: "I heard what you said about me."', quality: 'poor' },
          { id: 'wb_10c', text: 'Start looking for a new job without addressing it.', quality: 'worst' },
          { id: 'wb_10d', text: 'Document it and bring it up at your next review.', quality: 'okay' },
        ],
        correctOptionId: 'wb_10a',
        explanation: 'Address the substance without revealing the eavesdrop. Frame it as seeking clarity, not confrontation. This opens a productive conversation.',
        skillTrack: 'negotiate',
      },
    ],
  },
  {
    id: 'relationship_rapids',
    title: 'Relationship Rapids',
    description: 'Handle tricky moments in romantic and close relationships',
    difficulty: 2,
    questions: [
      {
        id: 'rr_1',
        scenario: 'Your partner says "Fine, do whatever you want" in a cold tone.',
        context: 'You asked about plans for the weekend. They seem upset.',
        options: [
          { id: 'rr_1a', text: '"It sounds like something is bothering you. I\'d rather talk about it than guess."', quality: 'best' },
          { id: 'rr_1b', text: '"Okay, great!" and proceed with your plans.', quality: 'worst' },
          { id: 'rr_1c', text: '"Why are you being like this?"', quality: 'poor' },
          { id: 'rr_1d', text: '"I can tell you\'re upset. Take your time and let me know when you want to talk."', quality: 'okay' },
        ],
        correctOptionId: 'rr_1a',
        explanation: 'Name what you observe without accusing. "Something is bothering you" validates their emotion. Saying "I\'d rather talk" shows investment without forcing the conversation.',
        skillTrack: 'listen',
      },
      {
        id: 'rr_2',
        scenario: 'Your partner criticizes how you loaded the dishwasher.',
        context: 'You just finished cleaning the entire kitchen. This feels petty.',
        options: [
          { id: 'rr_2a', text: '"I hear you — is the dishwasher what\'s really bugging you, or is something else going on?"', quality: 'best' },
          { id: 'rr_2b', text: '"I just cleaned the ENTIRE kitchen and you\'re focusing on the dishwasher?!"', quality: 'poor' },
          { id: 'rr_2c', text: '"Fine, you do it then."', quality: 'worst' },
          { id: 'rr_2d', text: '"Sorry, I\'ll redo it."', quality: 'poor' },
        ],
        correctOptionId: 'rr_2a',
        explanation: 'Small complaints are often proxies for bigger feelings. Gently checking beneath the surface shows emotional intelligence and often reveals the real issue.',
        skillTrack: 'empathize',
      },
      {
        id: 'rr_3',
        scenario: 'Your partner wants to spend the holidays with their family, but you already told yours you\'d visit.',
        context: 'Both families live far away. This comes up every year.',
        options: [
          { id: 'rr_3a', text: '"This keeps coming up. Can we sit down and create a plan that works for both families long-term?"', quality: 'best' },
          { id: 'rr_3b', text: '"I already committed, so we\'re going to mine this year."', quality: 'poor' },
          { id: 'rr_3c', text: '"Fine, we\'ll go to yours. Whatever."', quality: 'worst' },
          { id: 'rr_3d', text: '"What if we split the time — a few days with each family?"', quality: 'okay' },
        ],
        correctOptionId: 'rr_3a',
        explanation: 'Zoom out from this year\'s conflict to create a systemic solution. Naming the pattern ("keeps coming up") and proposing a framework prevents annual arguments.',
        skillTrack: 'negotiate',
      },
      {
        id: 'rr_4',
        scenario: 'During an argument, your partner says "You\'re just like your mother."',
        context: 'You were discussing finances. This feels like a low blow.',
        options: [
          { id: 'rr_4a', text: '"That hurt. I need us to stay on the topic of finances without personal attacks."', quality: 'best' },
          { id: 'rr_4b', text: '"At least my mother isn\'t [insult]."', quality: 'worst' },
          { id: 'rr_4c', text: 'Walk away without saying anything.', quality: 'poor' },
          { id: 'rr_4d', text: '"That\'s not fair and you know it."', quality: 'okay' },
        ],
        correctOptionId: 'rr_4a',
        explanation: 'Name the impact ("that hurt"), set the boundary (no personal attacks), and redirect to the actual topic. Three moves in one sentence.',
        skillTrack: 'defend',
      },
      {
        id: 'rr_5',
        scenario: 'Your partner has been glued to their phone all evening and you feel ignored.',
        context: 'You\'ve been sitting together for 2 hours but haven\'t really talked.',
        options: [
          { id: 'rr_5a', text: '"I miss connecting with you. Can we put phones away for a bit and just hang out?"', quality: 'best' },
          { id: 'rr_5b', text: '"You\'re always on your phone. You never pay attention to me."', quality: 'worst' },
          { id: 'rr_5c', text: 'Start scrolling your own phone to make a passive-aggressive point.', quality: 'poor' },
          { id: 'rr_5d', text: '"Hey, whatcha looking at?"', quality: 'okay' },
        ],
        correctOptionId: 'rr_5a',
        explanation: 'Lead with what you want (connection), not what they\'re doing wrong (phone). "I miss connecting" is vulnerable and inviting. "You\'re always on your phone" triggers defense.',
        skillTrack: 'connect',
      },
      {
        id: 'rr_6',
        scenario: 'Your partner apologizes but it feels hollow: "Sorry if that bothered you."',
        context: 'They said something hurtful yesterday and you brought it up.',
        options: [
          { id: 'rr_6a', text: '"I appreciate you saying that. What I really need to hear is that you understand why it hurt."', quality: 'best' },
          { id: 'rr_6b', text: '"That\'s not a real apology."', quality: 'poor' },
          { id: 'rr_6c', text: '"Whatever, forget it."', quality: 'worst' },
          { id: 'rr_6d', text: '"It\'s okay, don\'t worry about it."', quality: 'poor' },
        ],
        correctOptionId: 'rr_6a',
        explanation: 'Acknowledge their attempt, then clearly state what a meaningful apology looks like for you. This teaches them how to repair with you without dismissing their effort.',
        skillTrack: 'assert',
      },
      {
        id: 'rr_7',
        scenario: 'Your partner makes a big financial decision without consulting you.',
        context: 'They bought an expensive item you didn\'t discuss. Shared finances.',
        options: [
          { id: 'rr_7a', text: '"I was surprised to see that purchase. Can we talk about how we make financial decisions together?"', quality: 'best' },
          { id: 'rr_7b', text: '"How could you spend that without asking me?!"', quality: 'poor' },
          { id: 'rr_7c', text: 'Go buy something equally expensive to "even the score."', quality: 'worst' },
          { id: 'rr_7d', text: '"I\'m not comfortable with that. Can you return it?"', quality: 'okay' },
        ],
        correctOptionId: 'rr_7a',
        explanation: 'State the observation calmly, then shift to the process issue. The problem isn\'t this one purchase — it\'s the lack of shared decision-making. Address the system.',
        skillTrack: 'negotiate',
      },
      {
        id: 'rr_8',
        scenario: 'Your partner says "We need to talk about our relationship."',
        context: 'You\'re blindsided. Things seemed fine to you.',
        options: [
          { id: 'rr_8a', text: '"I\'m glad you brought it up. I\'m here and I want to hear what\'s on your mind."', quality: 'best' },
          { id: 'rr_8b', text: '"Are you breaking up with me?!"', quality: 'poor' },
          { id: 'rr_8c', text: '"Everything is fine, what are you talking about?"', quality: 'worst' },
          { id: 'rr_8d', text: '"Okay... what about it?"', quality: 'okay' },
        ],
        correctOptionId: 'rr_8a',
        explanation: 'Validate their courage in raising a difficult topic. Show openness and presence. This creates safety for an honest conversation.',
        skillTrack: 'listen',
      },
      {
        id: 'rr_9',
        scenario: 'Your partner cries during an argument and you feel manipulated.',
        context: 'This happens frequently when you try to discuss problems.',
        options: [
          { id: 'rr_9a', text: '"I can see you\'re upset. Let\'s pause, and I\'d like us to come back to this when we\'re both ready."', quality: 'best' },
          { id: 'rr_9b', text: '"You always cry to avoid the conversation."', quality: 'worst' },
          { id: 'rr_9c', text: 'Drop the issue completely and comfort them.', quality: 'poor' },
          { id: 'rr_9d', text: '"I didn\'t mean to make you cry. Let\'s just forget it."', quality: 'poor' },
        ],
        correctOptionId: 'rr_9a',
        explanation: 'Acknowledge their emotion while preserving the conversation. "Let\'s pause" respects their feelings; "come back to this" ensures the topic isn\'t avoided.',
        skillTrack: 'regulate',
      },
      {
        id: 'rr_10',
        scenario: 'Your partner gives you the silent treatment after a disagreement.',
        context: 'It\'s been 6 hours. Your attempts to talk have been met with one-word answers.',
        options: [
          { id: 'rr_10a', text: '"I want to resolve this. I\'ll give you space, but I\'d like us to talk before bed. Would that work?"', quality: 'best' },
          { id: 'rr_10b', text: '"Fine, two can play that game." Give them the silent treatment back.', quality: 'worst' },
          { id: 'rr_10c', text: 'Keep pressing them to talk until they respond.', quality: 'poor' },
          { id: 'rr_10d', text: '"I\'m sorry if I did something wrong. Please talk to me."', quality: 'poor' },
        ],
        correctOptionId: 'rr_10a',
        explanation: 'State your intent (resolve), offer space (respect), and propose a timeline (structure). You\'re not chasing or withdrawing — you\'re creating a bridge.',
        skillTrack: 'connect',
      },
    ],
  },
  {
    id: 'social_pressure',
    title: 'Social Pressure Cooker',
    description: 'Handle peer pressure, pushy people, and awkward social situations',
    difficulty: 3,
    questions: [
      {
        id: 'sp_1',
        scenario: 'Friends pressure you to drink when you\'ve decided not to tonight.',
        context: 'Group dinner, everyone else is drinking. "Come on, just one!"',
        options: [
          { id: 'sp_1a', text: '"I\'m good tonight, but I\'m happy to be the one who remembers everything tomorrow."', quality: 'best' },
          { id: 'sp_1b', text: '"Fine, just one" even though you don\'t want to.', quality: 'worst' },
          { id: 'sp_1c', text: '"I said no. Why can\'t you respect that?"', quality: 'poor' },
          { id: 'sp_1d', text: '"Not tonight, thanks." (Repeat as needed)', quality: 'okay' },
        ],
        correctOptionId: 'sp_1a',
        explanation: 'Confident refusal + humor deflects pressure without creating tension. You hold your boundary while keeping the energy light.',
        skillTrack: 'defend',
      },
      {
        id: 'sp_2',
        scenario: 'Someone you barely know asks to borrow a significant amount of money.',
        context: 'Acquaintance at a social event, asks for $500 "just for a week."',
        options: [
          { id: 'sp_2a', text: '"I have a personal rule about not lending money — it\'s nothing personal. Hope you figure it out."', quality: 'best' },
          { id: 'sp_2b', text: '"Sure, I guess..." even though you\'re uncomfortable.', quality: 'worst' },
          { id: 'sp_2c', text: '"No way, I barely know you."', quality: 'poor' },
          { id: 'sp_2d', text: '"I can\'t right now, sorry."', quality: 'okay' },
        ],
        correctOptionId: 'sp_2a',
        explanation: 'A "personal rule" depersonalizes the refusal — it\'s not about them, it\'s about your policy. Adding "hope you figure it out" shows warmth without caving.',
        skillTrack: 'defend',
      },
      {
        id: 'sp_3',
        scenario: 'Someone makes a racist joke and everyone laughs. You\'re uncomfortable.',
        context: 'Party with mixed company. The joke was clearly offensive.',
        options: [
          { id: 'sp_3a', text: '"I don\'t think that\'s funny. Can we move on?"', quality: 'best' },
          { id: 'sp_3b', text: 'Laugh along to avoid being "that person."', quality: 'worst' },
          { id: 'sp_3c', text: 'Launch into a lecture about why it\'s offensive.', quality: 'poor' },
          { id: 'sp_3d', text: 'Don\'t laugh but say nothing.', quality: 'okay' },
        ],
        correctOptionId: 'sp_3a',
        explanation: 'Brief, clear, and redirecting. You state your position without grandstanding. "Can we move on?" gives the group an exit without a prolonged confrontation.',
        skillTrack: 'assert',
      },
      {
        id: 'sp_4',
        scenario: 'A persistent salesperson won\'t take no for an answer.',
        context: 'You said no twice. They\'re using every tactic in the book.',
        options: [
          { id: 'sp_4a', text: '"I appreciate your persistence, but my answer is no. I\'m going to end this conversation now."', quality: 'best' },
          { id: 'sp_4b', text: '"Maybe, let me think about it..." to escape the conversation.', quality: 'poor' },
          { id: 'sp_4c', text: '"STOP. Leave me alone!"', quality: 'poor' },
          { id: 'sp_4d', text: 'Give in because the pressure is too much.', quality: 'worst' },
        ],
        correctOptionId: 'sp_4a',
        explanation: 'Acknowledge their effort, state a clear final answer, and announce the end. You control the exit. "Maybe" just extends the pressure.',
        skillTrack: 'defend',
      },
      {
        id: 'sp_5',
        scenario: 'A friend constantly one-ups every story you tell.',
        context: 'You shared a vacation story, and they immediately told a "better" one.',
        options: [
          { id: 'sp_5a', text: '"That sounds great! I\'d actually love to finish my story first — then I want to hear all about yours."', quality: 'best' },
          { id: 'sp_5b', text: 'Stop sharing stories with them entirely.', quality: 'poor' },
          { id: 'sp_5c', text: '"Why do you always have to one-up me?"', quality: 'poor' },
          { id: 'sp_5d', text: 'Just let it go, it\'s not worth the conflict.', quality: 'okay' },
        ],
        correctOptionId: 'sp_5a',
        explanation: 'Warm but firm. You validate their story, assert your right to finish yours, and promise to listen. This models good conversation without shaming.',
        skillTrack: 'assert',
      },
      {
        id: 'sp_6',
        scenario: 'Someone asks an invasive personal question at a family gathering.',
        context: '"So when are you two having kids?" In front of everyone.',
        options: [
          { id: 'sp_6a', text: '"That\'s between us for now! So what have YOU been up to lately?"', quality: 'best' },
          { id: 'sp_6b', text: 'Answer honestly even though you\'re uncomfortable.', quality: 'poor' },
          { id: 'sp_6c', text: '"That\'s incredibly rude to ask."', quality: 'poor' },
          { id: 'sp_6d', text: '"Haha, we\'ll see!" with a forced smile.', quality: 'okay' },
        ],
        correctOptionId: 'sp_6a',
        explanation: 'Cheerful boundary + immediate redirect. The exclamation keeps the tone light while the redirect takes pressure off you. No explanation needed.',
        skillTrack: 'defend',
      },
      {
        id: 'sp_7',
        scenario: 'Two friends are fighting and both want you to pick a side.',
        context: 'Each has called you separately to vent. You care about both.',
        options: [
          { id: 'sp_7a', text: '"I care about both of you. I\'m happy to listen, but I\'m not going to pick sides — I think you two should talk directly."', quality: 'best' },
          { id: 'sp_7b', text: 'Agree with whoever you\'re talking to at the moment.', quality: 'worst' },
          { id: 'sp_7c', text: '"I don\'t want to be involved in this."', quality: 'okay' },
          { id: 'sp_7d', text: 'Try to mediate and fix it for them.', quality: 'poor' },
        ],
        correctOptionId: 'sp_7a',
        explanation: 'State your care, set your boundary (won\'t pick sides), and redirect them to the source. You remain supportive without becoming a pawn in their conflict.',
        skillTrack: 'regulate',
      },
      {
        id: 'sp_8',
        scenario: 'Someone at a party keeps touching your arm and standing too close.',
        context: 'You\'ve stepped back twice. They keep closing the gap.',
        options: [
          { id: 'sp_8a', text: '"I need a little more space — thanks for understanding." Take a step back firmly.', quality: 'best' },
          { id: 'sp_8b', text: 'Tolerate it to avoid making a scene.', quality: 'poor' },
          { id: 'sp_8c', text: '"Stop touching me!" loudly.', quality: 'okay' },
          { id: 'sp_8d', text: 'Leave the party without saying anything.', quality: 'poor' },
        ],
        correctOptionId: 'sp_8a',
        explanation: 'Direct verbal boundary with a physical action. "Thanks for understanding" is assertive — it assumes compliance rather than asking for permission.',
        skillTrack: 'defend',
      },
      {
        id: 'sp_9',
        scenario: 'A friend invites themselves on your solo vacation.',
        context: '"That sounds amazing! I\'m totally coming with you!"',
        options: [
          { id: 'sp_9a', text: '"I appreciate the enthusiasm! This one\'s actually a solo trip for me — let\'s plan something together another time though."', quality: 'best' },
          { id: 'sp_9b', text: '"Um, sure... I guess that could work."', quality: 'worst' },
          { id: 'sp_9c', text: '"No, this is MY trip."', quality: 'poor' },
          { id: 'sp_9d', text: '"I\'ll think about it" and then avoid them.', quality: 'poor' },
        ],
        correctOptionId: 'sp_9a',
        explanation: 'Validate their excitement, state your boundary clearly, and offer an alternative. You protect your space without rejecting the person.',
        skillTrack: 'assert',
      },
      {
        id: 'sp_10',
        scenario: 'A friend guilt-trips you for not attending their event.',
        context: '"I guess you just don\'t care about me as much as I care about you."',
        options: [
          { id: 'sp_10a', text: '"I care about you a lot. I can\'t make this one, but that doesn\'t change how I feel about our friendship."', quality: 'best' },
          { id: 'sp_10b', text: '"You\'re being manipulative right now."', quality: 'poor' },
          { id: 'sp_10c', text: 'Go to the event even though you can\'t/don\'t want to.', quality: 'worst' },
          { id: 'sp_10d', text: '"I\'m sorry, I really am. I\'ll make it up to you."', quality: 'okay' },
        ],
        correctOptionId: 'sp_10a',
        explanation: 'Affirm the relationship, hold your position, and separate the event from the friendship. You refuse the guilt frame without attacking them for using it.',
        skillTrack: 'regulate',
      },
    ],
  },
];

export function getFlashSetById(id: string): FlashJudgmentSet | undefined {
  return FLASH_JUDGMENT_SETS.find((s) => s.id === id);
}

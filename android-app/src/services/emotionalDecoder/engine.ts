import {
  DecoderSet,
  DecoderCard,
  DECODER_SETS,
  getDecoderSetById,
} from './scenarios';

export interface DecoderState {
  set: DecoderSet;
  currentIndex: number;
  answers: DecoderAnswer[];
  phase: 'reading' | 'guessing' | 'reveal' | 'results';
  isComplete: boolean;
  score: DecoderScore;
}

export interface DecoderAnswer {
  cardId: string;
  selectedEmotionId: string;
  isCorrect: boolean;
  timeMs: number;
}

export interface DecoderScore {
  totalCards: number;
  correctCount: number;
  accuracy: number;
  averageTimeMs: number;
  streak: number;
  bestStreak: number;
  rating: 'surface_reader' | 'observant' | 'empath' | 'decoder';
}

export function startDecoder(setId?: string): DecoderState {
  const set = setId
    ? getDecoderSetById(setId) ?? DECODER_SETS[0]
    : DECODER_SETS[Math.floor(Math.random() * DECODER_SETS.length)];

  return {
    set,
    currentIndex: 0,
    answers: [],
    phase: 'reading',
    isComplete: false,
    score: emptyScore(set.cards.length),
  };
}

export function beginGuessing(state: DecoderState): DecoderState {
  return { ...state, phase: 'guessing' };
}

export function submitDecoderGuess(
  state: DecoderState,
  emotionId: string,
  timeMs: number,
): { state: DecoderState; answer: DecoderAnswer } {
  const card = state.set.cards[state.currentIndex];
  if (!card) throw new Error('No card at current index');

  const isCorrect = emotionId === card.hiddenEmotionId;

  const answer: DecoderAnswer = {
    cardId: card.id,
    selectedEmotionId: emotionId,
    isCorrect,
    timeMs,
  };

  const updatedAnswers = [...state.answers, answer];

  return {
    state: {
      ...state,
      answers: updatedAnswers,
      phase: 'reveal',
      score: calculateRunningScore(state.set, updatedAnswers),
    },
    answer,
  };
}

export function advanceDecoderCard(state: DecoderState): DecoderState {
  const nextIndex = state.currentIndex + 1;

  if (nextIndex >= state.set.cards.length) {
    return {
      ...state,
      phase: 'results',
      isComplete: true,
      score: calculateRunningScore(state.set, state.answers),
    };
  }

  return {
    ...state,
    currentIndex: nextIndex,
    phase: 'reading',
  };
}

function emptyScore(totalCards: number): DecoderScore {
  return {
    totalCards,
    correctCount: 0,
    accuracy: 0,
    averageTimeMs: 0,
    streak: 0,
    bestStreak: 0,
    rating: 'surface_reader',
  };
}

function calculateRunningScore(set: DecoderSet, answers: DecoderAnswer[]): DecoderScore {
  const totalCards = set.cards.length;

  if (answers.length === 0) return emptyScore(totalCards);

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const accuracy = Math.round((correctCount / answers.length) * 100);

  const totalTime = answers.reduce((sum, a) => sum + a.timeMs, 0);
  const averageTimeMs = Math.round(totalTime / answers.length);

  let streak = 0;
  let bestStreak = 0;
  let currentStreak = 0;
  for (const answer of answers) {
    if (answer.isCorrect) {
      currentStreak++;
      if (currentStreak > bestStreak) bestStreak = currentStreak;
    } else {
      currentStreak = 0;
    }
    streak = currentStreak;
  }

  let rating: DecoderScore['rating'];
  if (accuracy >= 90) {
    rating = 'decoder';
  } else if (accuracy >= 70) {
    rating = 'empath';
  } else if (accuracy >= 50) {
    rating = 'observant';
  } else {
    rating = 'surface_reader';
  }

  return {
    totalCards,
    correctCount,
    accuracy,
    averageTimeMs,
    streak,
    bestStreak,
    rating,
  };
}

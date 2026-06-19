import {
  SubtextPrompt,
  SubtextSet,
  SUBTEXT_SETS,
} from './prompts';

export interface SubtextState {
  set: SubtextSet;
  currentIndex: number;
  responses: SubtextResponse[];
  isComplete: boolean;
  score: SubtextScore;
}

export interface SubtextResponse {
  promptId: string;
  playerTranslation: string;
  accuracyScore: number;
  emotionMatch: boolean;
}

export interface SubtextScore {
  totalPrompts: number;
  completed: number;
  averageAccuracy: number;
  emotionsCorrect: number;
  overallRating: 'novice' | 'perceptive' | 'empath' | 'mind_reader';
}

const STOP_WORDS = new Set([
  'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'she', 'it', 'they',
  'them', 'their', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at',
  'to', 'for', 'of', 'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'can', 'may', 'might', 'shall', 'not', 'no', 'so', 'if', 'then',
  'than', 'that', 'this', 'what', 'which', 'who', 'whom', 'how', 'when',
  'where', 'why', 'all', 'each', 'every', 'both', 'few', 'more', 'most',
  'some', 'any', 'such', 'just', 'about', 'up', 'out', 'with', 'from',
  'into', 'over', 'after', 'before', 'between', 'under', 'above', 'very',
  'too', 'also', 'here', 'there', 'again', 'once', 'don\'t', 'doesn\'t',
  'didn\'t', 'won\'t', 'wouldn\'t', 'couldn\'t', 'shouldn\'t', 'can\'t',
  'im', "i'm", "it's", 'its',
]);

export function startSubtextSession(setId?: string): SubtextState {
  const set = setId
    ? SUBTEXT_SETS.find((s) => s.id === setId) ?? SUBTEXT_SETS[0]
    : SUBTEXT_SETS[Math.floor(Math.random() * SUBTEXT_SETS.length)];

  return {
    set,
    currentIndex: 0,
    responses: [],
    isComplete: false,
    score: {
      totalPrompts: set.prompts.length,
      completed: 0,
      averageAccuracy: 0,
      emotionsCorrect: 0,
      overallRating: 'novice',
    },
  };
}

export function submitTranslation(
  state: SubtextState,
  translation: string,
  emotionGuess: string,
): { state: SubtextState; response: SubtextResponse } {
  const prompt = state.set.prompts[state.currentIndex];
  if (!prompt) throw new Error('No prompt at current index');

  const accuracyScore = scoreTranslation(translation, prompt.actualSubtext);
  const emotionMatch = normalizeWord(emotionGuess) === normalizeWord(prompt.underlyingEmotion);

  const response: SubtextResponse = {
    promptId: prompt.id,
    playerTranslation: translation,
    accuracyScore,
    emotionMatch,
  };

  const updatedResponses = [...state.responses, response];
  const updatedScore = computeRunningScore(state.set, updatedResponses);

  return {
    state: {
      ...state,
      responses: updatedResponses,
      score: updatedScore,
    },
    response,
  };
}

export function advancePrompt(state: SubtextState): SubtextState {
  const nextIndex = state.currentIndex + 1;
  if (nextIndex >= state.set.prompts.length) {
    return {
      ...state,
      isComplete: true,
      score: computeRunningScore(state.set, state.responses),
    };
  }
  return {
    ...state,
    currentIndex: nextIndex,
  };
}

export function calculateSubtextScore(state: SubtextState): SubtextScore {
  return computeRunningScore(state.set, state.responses);
}

function computeRunningScore(set: SubtextSet, responses: SubtextResponse[]): SubtextScore {
  const completed = responses.length;
  const totalPrompts = set.prompts.length;

  if (completed === 0) {
    return {
      totalPrompts,
      completed: 0,
      averageAccuracy: 0,
      emotionsCorrect: 0,
      overallRating: 'novice',
    };
  }

  const totalAccuracy = responses.reduce((sum, r) => sum + r.accuracyScore, 0);
  const averageAccuracy = Math.round(totalAccuracy / completed);
  const emotionsCorrect = responses.filter((r) => r.emotionMatch).length;

  const emotionRate = emotionsCorrect / completed;
  const combinedScore = averageAccuracy * 0.7 + emotionRate * 100 * 0.3;

  let overallRating: SubtextScore['overallRating'];
  if (combinedScore >= 80) {
    overallRating = 'mind_reader';
  } else if (combinedScore >= 60) {
    overallRating = 'empath';
  } else if (combinedScore >= 40) {
    overallRating = 'perceptive';
  } else {
    overallRating = 'novice';
  }

  return {
    totalPrompts,
    completed,
    averageAccuracy,
    emotionsCorrect,
    overallRating,
  };
}

function scoreTranslation(playerTranslation: string, actualSubtext: string): number {
  const playerWords = extractKeyWords(playerTranslation);
  const actualWords = extractKeyWords(actualSubtext);

  if (actualWords.size === 0) return 0;
  if (playerWords.size === 0) return 0;

  let matches = 0;
  for (const word of playerWords) {
    if (actualWords.has(word)) {
      matches++;
    }
  }

  // Also check for stem-like partial matches (e.g., "hurt" matches "hurting")
  for (const playerWord of playerWords) {
    if (playerWord.length < 4) continue;
    for (const actualWord of actualWords) {
      if (actualWord.length < 4) continue;
      if (playerWord === actualWord) continue; // Already counted
      const shorter = playerWord.length < actualWord.length ? playerWord : actualWord;
      const longer = playerWord.length < actualWord.length ? actualWord : playerWord;
      if (longer.startsWith(shorter) && shorter.length >= 4) {
        matches += 0.5;
      }
    }
  }

  const coverage = matches / actualWords.size;
  const score = Math.min(100, Math.round(coverage * 100));

  return score;
}

function extractKeyWords(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/[^a-z\s'-]/g, '')
    .split(/\s+/)
    .map(normalizeWord)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  return new Set(words);
}

function normalizeWord(word: string): string {
  return word.toLowerCase().replace(/[^a-z]/g, '').trim();
}

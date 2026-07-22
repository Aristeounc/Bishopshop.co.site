import {
  ForecastSet,
  ForecastRound,
  FORECAST_SETS,
  getForecastSetById,
} from './scenarios';

export interface ForecastState {
  set: ForecastSet;
  currentRoundIndex: number;
  predictions: ForecastPrediction[];
  phase: 'reading' | 'predicting' | 'reveal' | 'results';
  isComplete: boolean;
  score: ForecastScore;
}

export interface ForecastPrediction {
  roundId: string;
  predictedTactic: string;
  isCorrect: boolean;
  timeToAnswer: number;
}

export interface ForecastScore {
  totalRounds: number;
  correctPredictions: number;
  accuracy: number;
  averageTime: number;
  overallRating: 'blind_spot' | 'aware' | 'anticipator' | 'oracle';
  streakBest: number;
}

function emptyScore(totalRounds: number): ForecastScore {
  return {
    totalRounds,
    correctPredictions: 0,
    accuracy: 0,
    averageTime: 0,
    overallRating: 'blind_spot',
    streakBest: 0,
  };
}

export function startForecast(setId?: string): ForecastState {
  const set = setId
    ? getForecastSetById(setId) ?? FORECAST_SETS[0]
    : FORECAST_SETS[Math.floor(Math.random() * FORECAST_SETS.length)];

  return {
    set,
    currentRoundIndex: 0,
    predictions: [],
    phase: 'reading',
    isComplete: false,
    score: emptyScore(set.rounds.length),
  };
}

export function submitPrediction(
  state: ForecastState,
  tactic: string,
  timeMs: number,
): { state: ForecastState; isCorrect: boolean } {
  const round = state.set.rounds[state.currentRoundIndex];
  if (!round) {
    throw new Error('No active round');
  }

  const isCorrect = tactic === round.correctTactic;

  const prediction: ForecastPrediction = {
    roundId: round.id,
    predictedTactic: tactic,
    isCorrect,
    timeToAnswer: timeMs,
  };

  const updatedPredictions = [...state.predictions, prediction];

  return {
    state: {
      ...state,
      predictions: updatedPredictions,
      phase: 'reveal',
    },
    isCorrect,
  };
}

export function advanceForecastRound(state: ForecastState): ForecastState {
  const nextIndex = state.currentRoundIndex + 1;

  if (nextIndex >= state.set.rounds.length) {
    const finalScore = calculateForecastScore({
      ...state,
      isComplete: true,
    });
    return {
      ...state,
      isComplete: true,
      phase: 'results',
      score: finalScore,
    };
  }

  return {
    ...state,
    currentRoundIndex: nextIndex,
    phase: 'reading',
  };
}

export function calculateForecastScore(state: ForecastState): ForecastScore {
  const { predictions, set } = state;
  const totalRounds = set.rounds.length;

  if (predictions.length === 0) {
    return emptyScore(totalRounds);
  }

  const correctPredictions = predictions.filter((p) => p.isCorrect).length;
  const accuracy = predictions.length > 0 ? Math.round((correctPredictions / predictions.length) * 100) : 0;

  const totalTime = predictions.reduce((sum, p) => sum + p.timeToAnswer, 0);
  const averageTime = predictions.length > 0 ? totalTime / predictions.length : 0;

  // Calculate longest correct streak
  let streakBest = 0;
  let currentStreak = 0;
  for (const prediction of predictions) {
    if (prediction.isCorrect) {
      currentStreak++;
      if (currentStreak > streakBest) {
        streakBest = currentStreak;
      }
    } else {
      currentStreak = 0;
    }
  }

  // Determine overall rating
  let overallRating: ForecastScore['overallRating'];
  if (accuracy >= 90) {
    overallRating = 'oracle';
  } else if (accuracy >= 70) {
    overallRating = 'anticipator';
  } else if (accuracy >= 40) {
    overallRating = 'aware';
  } else {
    overallRating = 'blind_spot';
  }

  return {
    totalRounds,
    correctPredictions,
    accuracy,
    averageTime,
    overallRating,
    streakBest,
  };
}

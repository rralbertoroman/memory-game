export interface Level {
    id: number;
    language: 'python' | 'c' | 'cpp' | 'javascript' | 'typescript' | 'asm';
    code: string;
    displayTime: number; // seconds
    question: string;
    options: string[];
    correctAnswer: number; // index of correct option
    points: number;
}

export interface Answer {
    levelId: number;
    selectedOption: number;
    isCorrect: boolean;
    pointsEarned: number;
}

export interface Participant {
    id: string;
    name: string;
    answers: Answer[];
    totalScore: number;
}

export interface Session {
    id: string;
    timestamp: string;
    participants: Participant[];
    levels: Level[];
    currentLevelIndex: number;
    status: 'setup' | 'playing' | 'finished';
}

export type GamePhase = 'setup' | 'code-display' | 'quiz' | 'results' | 'final';

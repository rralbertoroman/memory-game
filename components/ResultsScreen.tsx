'use client';

import { Level, Participant } from '@/types';

interface ResultsScreenProps {
    level: Level;
    participants: Participant[];
    answers: Record<string, number>;
    onContinue: () => void;
}

export default function ResultsScreen({ level, participants, answers, onContinue }: ResultsScreenProps) {
    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <div className="max-w-5xl w-full animate-fade-in">
                {/* Correct Answer */}
                <div className="card mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-4xl">✅</span>
                        <h2 className="text-3xl font-bold text-green-400">Correct Answer</h2>
                    </div>

                    <div className="p-6 rounded-lg bg-green-500/10 border-2 border-green-400">
                        <div className="text-xl text-gray-300 mb-2">
                            <span className="font-bold text-green-400 mr-3">
                                {String.fromCharCode(65 + level.correctAnswer)}.
                            </span>
                            {level.options[level.correctAnswer]}
                        </div>
                    </div>
                </div>

                {/* Participant Results */}
                <div className="card mb-8">
                    <h3 className="text-2xl font-semibold mb-6 text-blue-300 flex items-center gap-2">
                        <span>📊</span>
                        Results
                    </h3>

                    <div className="space-y-4">
                        {participants.map((participant) => {
                            const answer = answers[participant.id];
                            const isCorrect = answer === level.correctAnswer;
                            const pointsEarned = isCorrect ? level.points : 0;

                            return (
                                <div
                                    key={participant.id}
                                    className={`p-4 rounded-lg border-2 animate-slide-in ${isCorrect
                                            ? 'bg-green-500/10 border-green-400'
                                            : 'bg-red-500/10 border-red-400'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl">
                                                {isCorrect ? '✓' : '✗'}
                                            </span>
                                            <div>
                                                <div className="font-semibold text-lg text-gray-200">
                                                    {participant.name}
                                                </div>
                                                <div className="text-sm text-gray-400">
                                                    Answered: {String.fromCharCode(65 + answer)} - {level.options[answer]}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className={`text-2xl font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                                {isCorrect ? `+${pointsEarned}` : '0'} pts
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <button
                    onClick={onContinue}
                    className="w-full btn btn-primary text-lg py-4"
                >
                    Continue to Next Level →
                </button>
            </div>
        </div>
    );
}

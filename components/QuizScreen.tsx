'use client';

import { useState } from 'react';
import { Level, Participant } from '@/types';

interface QuizScreenProps {
    level: Level;
    participants: Participant[];
    onSubmit: (answers: Record<string, number>) => void;
}

export default function QuizScreen({ level, participants, onSubmit }: QuizScreenProps) {
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

    const handleAnswerSelect = (participantId: string, optionIndex: number) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [participantId]: optionIndex
        });
    };

    const handleSubmit = () => {
        onSubmit(selectedAnswers);
    };

    const allAnswered = participants.every(p => selectedAnswers[p.id] !== undefined);

    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <div className="max-w-5xl w-full animate-fade-in">
                {/* Question */}
                <div className="card mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-4xl">❓</span>
                        <h2 className="text-3xl font-bold text-blue-300">Question</h2>
                    </div>
                    <p className="text-2xl text-gray-200">{level.question}</p>
                </div>

                {/* Options */}
                <div className="card mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-blue-300">Answer Options:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {level.options.map((option, index) => (
                            <div
                                key={index}
                                className="p-4 rounded-lg bg-slate-700 border border-blue-400/30"
                            >
                                <span className="font-bold text-blue-400 mr-3">
                                    {String.fromCharCode(65 + index)}.
                                </span>
                                <span className="text-gray-200">{option}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Participant Answers */}
                <div className="card">
                    <h3 className="text-2xl font-semibold mb-6 text-blue-300 flex items-center gap-2">
                        <span>👥</span>
                        Record Participant Answers
                    </h3>

                    <div className="space-y-4">
                        {participants.map((participant) => (
                            <div key={participant.id} className="animate-slide-in">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-lg font-semibold text-gray-200">
                                        {participant.name}
                                    </span>
                                    {selectedAnswers[participant.id] !== undefined && (
                                        <span className="text-green-400 text-sm">✓ Answered</span>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {level.options.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleAnswerSelect(participant.id, index)}
                                            className={`p-3 rounded-lg font-semibold transition-all ${selectedAnswers[participant.id] === index
                                                    ? 'bg-blue-500 text-white scale-105 shadow-lg shadow-blue-500/50'
                                                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                                }`}
                                        >
                                            {String.fromCharCode(65 + index)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!allAnswered}
                        className={`mt-8 w-full btn text-lg py-4 ${allAnswered
                                ? 'btn-primary'
                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {allAnswered ? 'Submit Answers ✓' : 'Waiting for all answers...'}
                    </button>
                </div>
            </div>
        </div>
    );
}

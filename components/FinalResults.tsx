'use client';

import { Participant } from '@/types';

interface FinalResultsProps {
    participants: Participant[];
    onExport: () => void;
    onReset: () => void;
}

export default function FinalResults({ participants, onExport, onReset }: FinalResultsProps) {
    const sortedParticipants = [...participants].sort((a, b) => b.totalScore - a.totalScore);

    const podiumPositions = [
        { place: 2, emoji: '🥈', color: 'from-gray-400 to-gray-500', height: 'h-32' },
        { place: 1, emoji: '🥇', color: 'from-yellow-400 to-yellow-600', height: 'h-48' },
        { place: 3, emoji: '🥉', color: 'from-orange-400 to-orange-600', height: 'h-24' }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <div className="max-w-6xl w-full animate-fade-in">
                {/* Title */}
                <div className="text-center mb-12">
                    <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                        🎉 Game Complete! 🎉
                    </h1>
                    <p className="text-2xl text-gray-300">Final Results</p>
                </div>

                {/* Winner Declaration */}
                {sortedParticipants.length > 0 && (
                    <div className="text-center mb-12 animate-bounce-in">
                        <div className="text-2xl text-yellow-400 font-bold mb-2">🏆 WINNER 🏆</div>
                        <div className="text-5xl font-bold text-white">
                            {sortedParticipants[0].name}
                        </div>
                        <div className="text-xl text-blue-300 mt-2">
                            with {sortedParticipants[0].totalScore} points
                        </div>
                    </div>
                )}

                {/* Podium */}
                {sortedParticipants.length >= 3 && (
                    <div className="mb-12">
                        <div className="flex items-end justify-center gap-4 mb-8">
                            {[1, 0, 2].map((index) => {
                                const participant = sortedParticipants[index];
                                const podium = podiumPositions[index];

                                if (!participant) return null;

                                return (
                                    <div key={participant.id} className="flex flex-col items-center animate-slide-in">
                                        <div className="text-6xl mb-2">{podium.emoji}</div>
                                        <div className="text-center mb-3">
                                            <div className="font-bold text-xl text-gray-200">{participant.name}</div>
                                            <div className="text-3xl font-bold text-blue-400">{participant.totalScore} pts</div>
                                        </div>
                                        <div className={`w-32 ${podium.height} bg-gradient-to-b ${podium.color} rounded-t-lg flex items-center justify-center`}>
                                            <span className="text-4xl font-bold text-white">{podium.place}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Full Rankings */}
                <div className="card mb-8">
                    <h2 className="text-3xl font-bold mb-6 text-blue-300 flex items-center gap-2">
                        <span>📊</span>
                        Complete Rankings
                    </h2>

                    <div className="space-y-3">
                        {sortedParticipants.map((participant, index) => (
                            <div
                                key={participant.id}
                                className={`p-5 rounded-lg border-2 animate-slide-in ${index === 0
                                    ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-400'
                                    : index === 1
                                        ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400'
                                        : index === 2
                                            ? 'bg-gradient-to-r from-orange-400/20 to-orange-600/20 border-orange-400'
                                            : 'bg-slate-700/50 border-blue-400/30'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className="text-3xl font-bold text-gray-300 w-12">
                                            #{index + 1}
                                        </span>
                                        <div>
                                            <div className="text-2xl font-semibold text-gray-200">
                                                {participant.name}
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                {participant.answers.filter(a => a.isCorrect).length} / {participant.answers.length} correct
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-4xl font-bold text-blue-400">
                                            {participant.totalScore}
                                        </div>
                                        <div className="text-sm text-gray-400">points</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={onExport}
                        className="btn btn-secondary text-lg py-4"
                    >
                        📥 Export Session Data
                    </button>

                    <button
                        onClick={onReset}
                        className="btn btn-primary text-lg py-4"
                    >
                        🔄 Play Again
                    </button>
                </div>
            </div>
        </div>
    );
}

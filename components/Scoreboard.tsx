'use client';

import { Participant } from '@/types';

interface ScoreboardProps {
    participants: Participant[];
}

export default function Scoreboard({ participants }: ScoreboardProps) {
    const sortedParticipants = [...participants].sort((a, b) => b.totalScore - a.totalScore);
    const maxScore = sortedParticipants[0]?.totalScore || 0;

    return (
        <div className="fixed top-4 right-4 w-80 glass-effect rounded-2xl p-6 shadow-2xl animate-slide-in">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🏆</span>
                <h3 className="text-2xl font-bold text-blue-300">Scoreboard</h3>
            </div>

            <div className="space-y-3">
                {sortedParticipants.map((participant, index) => {
                    const isLeader = index === 0 && maxScore > 0;

                    return (
                        <div
                            key={participant.id}
                            className={`p-3 rounded-lg transition-all ${isLeader
                                    ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-400'
                                    : 'bg-slate-700/50'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl font-bold text-gray-400">
                                        #{index + 1}
                                    </span>
                                    <div>
                                        <div className="font-semibold text-gray-200 flex items-center gap-2">
                                            {participant.name}
                                            {isLeader && <span className="text-yellow-400">👑</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-2xl font-bold text-blue-400">
                                        {participant.totalScore}
                                    </div>
                                    <div className="text-xs text-gray-400">points</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

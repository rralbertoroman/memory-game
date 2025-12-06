'use client';

import { useState } from 'react';
import { Participant } from '@/types';

interface SetupScreenProps {
    onStart: (participants: Participant[]) => void;
}

export default function SetupScreen({ onStart }: SetupScreenProps) {
    const [participantNames, setParticipantNames] = useState<string[]>(['']);
    const [error, setError] = useState<string>('');

    const addParticipant = () => {
        setParticipantNames([...participantNames, '']);
    };

    const removeParticipant = (index: number) => {
        if (participantNames.length > 1) {
            setParticipantNames(participantNames.filter((_, i) => i !== index));
        }
    };

    const updateParticipantName = (index: number, name: string) => {
        const updated = [...participantNames];
        updated[index] = name;
        setParticipantNames(updated);
    };

    const handleStart = () => {
        const validNames = participantNames.filter(name => name.trim() !== '');

        if (validNames.length === 0) {
            setError('Please add at least one participant');
            return;
        }

        const participants: Participant[] = validNames.map((name, index) => ({
            id: `participant-${Date.now()}-${index}`,
            name: name.trim(),
            answers: [],
            totalScore: 0
        }));

        onStart(participants);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <div className="card max-w-2xl w-full animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                        Memory Game
                    </h1>
                    <p className="text-xl text-gray-300">
                        Test your code memory skills!
                    </p>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                        <span className="text-blue-400">👥</span>
                        Add Participants
                    </h2>

                    <div className="space-y-3">
                        {participantNames.map((name, index) => (
                            <div key={index} className="flex gap-3 animate-slide-in">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => updateParticipantName(index, e.target.value)}
                                    placeholder={`Participant ${index + 1}`}
                                    className="flex-1 px-4 py-3 rounded-lg bg-slate-700 border border-blue-400/30 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                                />
                                {participantNames.length > 1 && (
                                    <button
                                        onClick={() => removeParticipant(index)}
                                        className="px-4 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={addParticipant}
                        className="mt-4 w-full btn btn-secondary"
                    >
                        + Add Another Participant
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleStart}
                    className="w-full btn btn-primary text-lg py-4"
                >
                    Start Game 🚀
                </button>
            </div>
        </div>
    );
}

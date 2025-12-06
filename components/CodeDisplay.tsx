'use client';

import { useEffect, useState } from 'react';
import { Level } from '@/types';

interface CodeDisplayProps {
    level: Level;
    onTimeUp: () => void;
}

const languageColors: Record<string, string> = {
    python: 'bg-yellow-500',
    javascript: 'bg-yellow-400',
    typescript: 'bg-blue-500',
    c: 'bg-gray-500',
    cpp: 'bg-blue-600',
    asm: 'bg-red-500'
};

const languageLabels: Record<string, string> = {
    python: 'Python',
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    c: 'C',
    cpp: 'C++',
    asm: 'Assembly'
};

export default function CodeDisplay({ level, onTimeUp }: CodeDisplayProps) {
    const [timeLeft, setTimeLeft] = useState(level.displayTime);

    useEffect(() => {
        setTimeLeft(level.displayTime);

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setTimeout(onTimeUp, 500);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [level.id, level.displayTime, onTimeUp]);

    const progress = (timeLeft / level.displayTime) * 100;

    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <div className="max-w-4xl w-full animate-fade-in">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <span className={`px-4 py-2 rounded-full text-white font-semibold ${languageColors[level.language]}`}>
                            {languageLabels[level.language]}
                        </span>
                        <span className="text-2xl font-bold text-gray-300">
                            Level {level.id}
                        </span>
                    </div>

                    <div className="text-right">
                        <div className="text-5xl font-bold text-blue-400 animate-pulse">
                            {timeLeft}s
                        </div>
                        <div className="text-sm text-gray-400">Time remaining</div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mb-6 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-1000 ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Code block */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-blue-300">
                            📝 Memorize this code
                        </h2>
                    </div>

                    <pre className="code-block">
                        <code className="text-gray-100">{level.code}</code>
                    </pre>
                </div>

                {/* Instruction */}
                <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-400/30">
                    <p className="text-center text-lg text-blue-300">
                        💡 Study the code carefully. You'll be quizzed on it next!
                    </p>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { Level } from '@/types';

interface CodeDisplayProps {
    level: Level;
    onTimeUp: () => void;
    currentIndex: number;
    totalLevels: number;
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

export default function CodeDisplay({ level, onTimeUp, currentIndex, totalLevels }: CodeDisplayProps) {
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
    const globalProgress = ((currentIndex - 1) / totalLevels) * 100;

    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <div className="max-w-4xl w-full animate-fade-in">
                {/* Global Progress */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Progress</span>
                        <span>{Math.round(globalProgress)}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 transition-all duration-500"
                            style={{ width: `${globalProgress}%` }}
                        />
                    </div>
                </div>

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-8">
                        <span className={`flex px-8 py-4 rounded-full items-center justify-center w-fit h-fit text-white font-bold text-4xl tracking-wider shadow-lg ${languageColors[level.language]}`}>
                            {languageLabels[level.language]}
                        </span>
                        <span className="text-3xl font-bold text-gray-300">
                            Level {currentIndex} <span className="text-gray-500 text-xl">of {totalLevels}</span>
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

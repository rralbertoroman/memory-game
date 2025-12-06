'use client';

import { useState } from 'react';

interface ResetButtonProps {
    onReset: () => void;
    disabled?: boolean;
}

export default function ResetButton({ onReset, disabled = false }: ResetButtonProps) {
    const [showConfirm, setShowConfirm] = useState(false);

    const handleResetClick = () => {
        setShowConfirm(true);
    };

    const handleConfirm = () => {
        setShowConfirm(false);
        onReset();
    };

    const handleCancel = () => {
        setShowConfirm(false);
    };

    return (
        <>
            <button
                onClick={handleResetClick}
                disabled={disabled}
                className={`fixed top-4 left-4 z-50 px-6 py-3 rounded-lg font-semibold transition-all ${disabled
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-red-500/20 text-red-400 border-2 border-red-400 hover:bg-red-500/30 hover:scale-105'
                    }`}
            >
                🔄 Reset Game
            </button>

            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
                    <div className="card max-w-md w-full mx-4 animate-slide-in">
                        <div className="text-center mb-6">
                            <div className="text-6xl mb-4">⚠️</div>
                            <h2 className="text-2xl font-bold text-red-400 mb-2">
                                Reset Game?
                            </h2>
                            <p className="text-gray-300">
                                This will clear all current progress and participant data. This action cannot be undone.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={handleCancel}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="btn bg-red-500 hover:bg-red-600 text-white"
                            >
                                Yes, Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

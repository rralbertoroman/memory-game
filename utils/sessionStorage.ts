import { Session, GamePhase } from '@/types';

interface StoredSessionData {
    session: Session;
    gamePhase: GamePhase;
    currentAnswers: Record<string, number>;
}

export function saveSessionToFile(
    session: Session,
    gamePhase: GamePhase = 'code-display',
    currentAnswers: Record<string, number> = {}
): void {
    const sessionData: StoredSessionData = {
        session: {
            id: session.id,
            timestamp: session.timestamp,
            currentLevelIndex: session.currentLevelIndex,
            status: session.status,
            participants: session.participants.map(p => ({
                id: p.id,
                name: p.name,
                totalScore: p.totalScore,
                answers: p.answers.map(a => ({
                    levelId: a.levelId,
                    selectedOption: a.selectedOption,
                    isCorrect: a.isCorrect,
                    pointsEarned: a.pointsEarned
                }))
            })),
            levels: session.levels
        },
        gamePhase,
        currentAnswers
    };

    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
        localStorage.setItem('memory-game-session', JSON.stringify(sessionData));
    }
}

export function loadSessionFromFile(): StoredSessionData | null {
    if (typeof window !== 'undefined') {
        const data = localStorage.getItem('memory-game-session');
        return data ? JSON.parse(data) : null;
    }
    return null;
}

export function clearSessionFile(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('memory-game-session');
    }
}

export function downloadCurrentSession(): void {
    const storedData = loadSessionFromFile();

    if (!storedData) {
        alert('No session data to download');
        return;
    }

    const exportData = {
        id: storedData.session.id,
        timestamp: storedData.session.timestamp,
        currentLevel: storedData.session.currentLevelIndex + 1,
        totalLevels: storedData.session.levels.length,
        status: storedData.session.status,
        participants: storedData.session.participants.map(p => ({
            id: p.id,
            name: p.name,
            totalScore: p.totalScore,
            answersCount: p.answers.length,
            correctAnswers: p.answers.filter(a => a.isCorrect).length,
            answers: p.answers
        })),
        exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `memory-game-session-${storedData.session.id}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

import { Session } from '@/types';

export function exportSession(session: Session): void {
    const sessionData = {
        id: session.id,
        timestamp: session.timestamp,
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
        levels: session.levels.map(l => ({
            id: l.id,
            language: l.language,
            question: l.question,
            correctAnswer: l.correctAnswer,
            points: l.points
        }))
    };

    const dataStr = JSON.stringify(sessionData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `memory-game-session-${session.id}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

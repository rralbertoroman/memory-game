'use client';

import { useState, useEffect } from 'react';
import { Level, Participant, Session, GamePhase, Answer } from '@/types';
import SetupScreen from '@/components/SetupScreen';
import CodeDisplay from '@/components/CodeDisplay';
import QuizScreen from '@/components/QuizScreen';
import ResultsScreen from '@/components/ResultsScreen';
import FinalResults from '@/components/FinalResults';
import Scoreboard from '@/components/Scoreboard';
import { exportSession } from '@/utils/sessionExport';
import levelsData from '@/data/levels.json';

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, number>>({});

  const levels: Level[] = levelsData as Level[];

  const handleStartGame = (participants: Participant[]) => {
    const newSession: Session = {
      id: `session-${Date.now()}`,
      timestamp: new Date().toISOString(),
      participants,
      levels,
      currentLevelIndex: 0,
      status: 'playing'
    };

    setSession(newSession);
    setGamePhase('code-display');
  };

  const handleCodeTimeUp = () => {
    setGamePhase('quiz');
  };

  const handleQuizSubmit = (answers: Record<string, number>) => {
    if (!session) return;

    setCurrentAnswers(answers);

    // Update participant scores
    const currentLevel = levels[session.currentLevelIndex];
    const updatedParticipants = session.participants.map(participant => {
      const selectedOption = answers[participant.id];
      const isCorrect = selectedOption === currentLevel.correctAnswer;
      const pointsEarned = isCorrect ? currentLevel.points : 0;

      const answer: Answer = {
        levelId: currentLevel.id,
        selectedOption,
        isCorrect,
        pointsEarned
      };

      return {
        ...participant,
        answers: [...participant.answers, answer],
        totalScore: participant.totalScore + pointsEarned
      };
    });

    setSession({
      ...session,
      participants: updatedParticipants
    });

    setGamePhase('results');
  };

  const handleContinue = () => {
    if (!session) return;

    if (session.currentLevelIndex < levels.length - 1) {
      setSession({
        ...session,
        currentLevelIndex: session.currentLevelIndex + 1
      });
      setCurrentAnswers({});
      setGamePhase('code-display');
    } else {
      setSession({
        ...session,
        status: 'finished'
      });
      setGamePhase('final');
    }
  };

  const handleExport = () => {
    if (session) {
      exportSession(session);
    }
  };

  const handleReset = () => {
    setSession(null);
    setGamePhase('setup');
    setCurrentAnswers({});
  };

  const currentLevel = session ? levels[session.currentLevelIndex] : null;

  return (
    <main className="relative">
      {gamePhase === 'setup' && (
        <SetupScreen onStart={handleStartGame} />
      )}

      {gamePhase === 'code-display' && currentLevel && (
        <>
          <CodeDisplay level={currentLevel} onTimeUp={handleCodeTimeUp} />
          {session && <Scoreboard participants={session.participants} />}
        </>
      )}

      {gamePhase === 'quiz' && currentLevel && session && (
        <>
          <QuizScreen
            level={currentLevel}
            participants={session.participants}
            onSubmit={handleQuizSubmit}
          />
          <Scoreboard participants={session.participants} />
        </>
      )}

      {gamePhase === 'results' && currentLevel && session && (
        <>
          <ResultsScreen
            level={currentLevel}
            participants={session.participants}
            answers={currentAnswers}
            onContinue={handleContinue}
          />
          <Scoreboard participants={session.participants} />
        </>
      )}

      {gamePhase === 'final' && session && (
        <FinalResults
          participants={session.participants}
          onExport={handleExport}
          onReset={handleReset}
        />
      )}
    </main>
  );
}

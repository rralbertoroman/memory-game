'use client';

import { useState, useEffect } from 'react';
import { Level, Participant, Session, GamePhase, Answer } from '@/types';
import SetupScreen from '@/components/SetupScreen';
import CodeDisplay from '@/components/CodeDisplay';
import QuizScreen from '@/components/QuizScreen';
import ResultsScreen from '@/components/ResultsScreen';
import FinalResults from '@/components/FinalResults';
import Scoreboard from '@/components/Scoreboard';
import ResetButton from '@/components/ResetButton';
import { exportSession } from '@/utils/sessionExport';
import { saveSessionToFile, clearSessionFile, downloadCurrentSession, loadSessionFromFile } from '@/utils/sessionStorage';
import { selectRandomLevels } from '@/utils/levelSelection';
import levelsData from '@/data/levels.json';

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  const allLevels: Level[] = levelsData as Level[];

  // Restore session on mount
  useEffect(() => {
    const savedData = loadSessionFromFile();
    if (savedData) {
      setSession(savedData.session);
      setGamePhase(savedData.gamePhase);
      setCurrentAnswers(savedData.currentAnswers);
    }
    setIsLoading(false);
  }, []);

  const handleStartGame = (participants: Participant[]) => {
    // Select 5 random levels from each difficulty tier (15 total)
    const selectedLevels = selectRandomLevels(allLevels);

    const newSession: Session = {
      id: `session-${Date.now()}`,
      timestamp: new Date().toISOString(),
      participants,
      levels: selectedLevels,
      currentLevelIndex: 0,
      status: 'playing'
    };

    setSession(newSession);
    saveSessionToFile(newSession, 'code-display');
    setGamePhase('code-display');
  };

  const handleCodeTimeUp = () => {
    setGamePhase('quiz');
  };

  const handleQuizSubmit = (answers: Record<string, number>) => {
    if (!session) return;

    setCurrentAnswers(answers);

    // Update participant scores
    const currentLevel = session.levels[session.currentLevelIndex];
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

    const updatedSession = {
      ...session,
      participants: updatedParticipants
    };

    setSession(updatedSession);
    saveSessionToFile(updatedSession, 'results', answers);
    setGamePhase('results');
  };

  const handleContinue = () => {
    if (!session) return;

    if (session.currentLevelIndex < session.levels.length - 1) {
      const updatedSession = {
        ...session,
        currentLevelIndex: session.currentLevelIndex + 1
      };
      setSession(updatedSession);
      saveSessionToFile(updatedSession, 'code-display');
      setCurrentAnswers({});
      setGamePhase('code-display');
    } else {
      const finishedSession = {
        ...session,
        status: 'finished' as const
      };
      setSession(finishedSession);
      saveSessionToFile(finishedSession, 'final');
      setGamePhase('final');
    }
  };

  const handleExport = () => {
    downloadCurrentSession();
  };

  const handleReset = () => {
    clearSessionFile();
    setSession(null);
    setGamePhase('setup');
    setCurrentAnswers({});
  };

  const currentLevel = session ? session.levels[session.currentLevelIndex] : null;

  return (
    <main className="relative">
      {/* Reset button - always visible except on setup screen */}
      {gamePhase !== 'setup' && (
        <ResetButton onReset={handleReset} />
      )}

      {gamePhase === 'setup' && (
        <SetupScreen onStart={handleStartGame} />
      )}

      {gamePhase === 'code-display' && currentLevel && (
        <>
          <CodeDisplay
            level={currentLevel}
            onTimeUp={handleCodeTimeUp}
            currentIndex={session!.currentLevelIndex + 1}
            totalLevels={session!.levels.length}
          />
          {session && <Scoreboard participants={session.participants} />}
        </>
      )}

      {gamePhase === 'quiz' && currentLevel && session && (
        <>
          <QuizScreen
            level={currentLevel}
            participants={session.participants}
            onSubmit={handleQuizSubmit}
            currentIndex={session!.currentLevelIndex + 1}
            totalLevels={session!.levels.length}
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
            currentIndex={session!.currentLevelIndex + 1}
            totalLevels={session!.levels.length}
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

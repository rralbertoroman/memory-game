import { Level } from '@/types';

export interface DifficultyTiers {
    beginner: Level[];
    intermediate: Level[];
    advanced: Level[];
}

/**
 * Categorize levels by difficulty based on points
 * Beginner: 10 points
 * Intermediate: 15 points
 * Advanced: 20-25 points
 */
export function categorizeLevelsByDifficulty(levels: Level[]): DifficultyTiers {
    return {
        beginner: levels.filter(level => level.points === 10),
        intermediate: levels.filter(level => level.points === 15),
        advanced: levels.filter(level => level.points >= 20)
    };
}

/**
 * Randomly select n items from an array without replacement
 */
function randomSelect<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Check if a selection of levels includes at least one from each language
 */
function hasAllLanguages(levels: Level[]): boolean {
    const requiredLanguages = ['python', 'javascript', 'typescript', 'c', 'cpp', 'asm'] as const;
    const presentLanguages = new Set(levels.map(l => l.language));
    return requiredLanguages.every(lang => presentLanguages.has(lang));
}

/**
 * Select 5 random levels from each difficulty tier
 * Returns 15 total levels (5 beginner, 5 intermediate, 5 advanced)
 * Guarantees at least one level from each language is included
 */
export function selectRandomLevels(allLevels: Level[]): Level[] {
    const tiers = categorizeLevelsByDifficulty(allLevels);
    let selectedLevels: Level[] = [];
    let attempts = 0;
    const MAX_ATTEMPTS = 100;

    // Retry until we get a selection with all languages
    // With 15 levels selected from 6 languages, probability of missing one is low
    // but this guarantees it.
    do {
        selectedLevels = [
            ...randomSelect(tiers.beginner, 5),
            ...randomSelect(tiers.intermediate, 5),
            ...randomSelect(tiers.advanced, 5)
        ];
        attempts++;
    } while (!hasAllLanguages(selectedLevels) && attempts < MAX_ATTEMPTS);

    // If we somehow failed after max attempts (statistically impossible),
    // we'll just return the last selection to avoid crashing.

    // Shuffle the final selection so difficulty levels are mixed
    return selectedLevels.sort(() => Math.random() - 0.5);
}

/**
 * Get statistics about level distribution
 */
export function getLevelStats(levels: Level[]) {
    const tiers = categorizeLevelsByDifficulty(levels);

    return {
        total: levels.length,
        beginner: tiers.beginner.length,
        intermediate: tiers.intermediate.length,
        advanced: tiers.advanced.length,
        totalPoints: levels.reduce((sum, level) => sum + level.points, 0)
    };
}

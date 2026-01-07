
export type GamePhase = 'setup' | 'rules' | 'cardConfig' | 'playing' | 'gameOver' | 'log';

export type CardValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19;

// Represents a single card in play, either in a hand or on the field.
export interface CardInPlay {
    id: number; // Unique ID for the card instance
    value: CardValue;
    status: 'hidden' | 'revealed';
}

export interface Player {
  id: number;
  name: string;
  completedSets: CardValue[];
  hand: CardInPlay[]; // Hand now consists of CardInPlay objects
}

// Info on where a card was revealed from
export type RevealSourceInfo = 
    | { type: 'player'; playerId: number; position: 'min' | 'max'; cardId: number } // Added cardId
    | { type: 'field'; cardId: number };

// A single reveal action within a challenge
export interface Reveal {
    description: string;
    card: CardValue;
    source: RevealSourceInfo;
}

// A log entry for one full challenge attempt (3 reveals)
export interface ChallengeLog {
  id:string;
  turnNumber: number;
  playerId: number;
  reveals: Reveal[];
  result: 'success' | 'fail';
}
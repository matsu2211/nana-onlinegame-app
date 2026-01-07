
import React, { useState, useCallback } from 'react';
import { GamePhase, Player, ChallengeLog, CardValue, Reveal, RevealSourceInfo, CardInPlay } from './types';
import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import RulesScreen from './components/RulesScreen';
import CardConfigScreen from './components/CardConfigScreen';
import LogScreen from './components/LogScreen';

// A user's intent to reveal a card
export type RevealIntent =
  | { source: 'player_min'; targetPlayerId: number }
  | { source: 'player_max'; targetPlayerId: number }
  | { source: 'field'; cardId: number };

const DECK_CONFIG: { [key: number]: { cards: CardValue[], hand: number, field: number } } = {
    2: { cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], hand: 10, field: 10 },
    3: { cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], hand: 8, field: 9 },
    4: { cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], hand: 7, field: 8 },
    5: { cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], hand: 6, field: 6 },
    6: { cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], hand: 5, field: 12 },
    7: { cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], hand: 5, field: 10 },
    8: { cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], hand: 5, field: 10 },
    9: { cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], hand: 5, field: 9 },
    10: { cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], hand: 5, field: 7 },
};

const shuffle = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const App: React.FC = () => {
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [phaseBeforeRules, setPhaseBeforeRules] = useState<GamePhase>('setup');
  const [players, setPlayers] = useState<Player[]>([]);
  const [log, setLog] = useState<ChallengeLog[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [turnNumber, setTurnNumber] = useState<number>(1);
  const [currentChallenge, setCurrentChallenge] = useState<Reveal[]>([]);
  const [winner, setWinner] = useState<{ player: Player; reason: string } | null>(null);
  const [isGmMode, setIsGmMode] = useState<boolean>(false);
  const [awaitingNextTurnClick, setAwaitingNextTurnClick] = useState<boolean>(false);
  
  const [fieldCards, setFieldCards] = useState<CardInPlay[]>([]);

  const handleStartGame = useCallback((playerNames: string[]) => {
    const playerCount = playerNames.length;
    const config = DECK_CONFIG[playerCount];
    
    let cardIdCounter = 0;
    const fullDeck = config.cards.reduce((acc, cardValue) => {
        for (let i = 0; i < 3; i++) {
            acc.push({ id: cardIdCounter++, value: cardValue, status: 'hidden' });
        }
        return acc;
    }, [] as CardInPlay[]);

    const shuffledDeck = shuffle(fullDeck);

    const newPlayers: Player[] = playerNames.map((name, index) => {
      const hand = shuffledDeck.splice(0, config.hand).sort((a, b) => a.value - b.value);
      return { id: index, name, completedSets: [], hand };
    });

    const finalFieldCards = shuffledDeck.slice(0, config.field);

    const firstPlayerIndex = Math.floor(Math.random() * playerCount);

    setPlayers(newPlayers);
    setFieldCards(finalFieldCards);
    setGamePhase('playing');
    setLog([]);
    setCurrentPlayerIndex(firstPlayerIndex);
    setTurnNumber(1);
    setCurrentChallenge([]);
    setWinner(null);
    setIsGmMode(false);
    setAwaitingNextTurnClick(false);
  }, []);

  const checkWinCondition = useCallback((player: Player): { isWin: boolean; reason: string } => {
    if (player.completedSets.includes(7)) {
      return { isWin: true, reason: '「7（ナナ）」のチャレンジを成功させました！' };
    }
    if (player.completedSets.length >= 3) {
      return { isWin: true, reason: 'チャレンジを3回成功させました！' };
    }
    if (player.completedSets.length >= 2) {
      const sets = [...player.completedSets].sort((a,b)=> a-b);
      for (let i = 0; i < sets.length; i++) {
        for (let j = i + 1; j < sets.length; j++) {
          if (sets[j] - sets[i] === 7 || sets[i] + sets[j] === 7) {
            return { isWin: true, reason: `成功したセット (${sets[i]}と${sets[j]}) の和または差が7になりました！` };
          }
        }
      }
    }
    return { isWin: false, reason: '' };
  }, []);

  const handleReveal = useCallback((intent: RevealIntent) => {
    if (currentChallenge.length >= 3 || awaitingNextTurnClick) return;

    let cardValue: CardValue | undefined;
    let description = '';
    let source: RevealSourceInfo | undefined;

    if (intent.source === 'field') {
      const fieldCard = fieldCards.find(c => c.id === intent.cardId);
      const cardIndex = fieldCards.findIndex(c => c.id === intent.cardId);
      const isAlreadyRevealedInChallenge = currentChallenge.some(r => {
        const sourceInfo = r.source;
        return sourceInfo.type === 'field' && sourceInfo.cardId === intent.cardId;
      });

      if (fieldCard && fieldCard.status !== 'revealed' && !isAlreadyRevealedInChallenge && cardIndex !== -1) {
        cardValue = fieldCard.value;
        description = `場のカード ${String.fromCharCode(65 + cardIndex)}`;
        source = { type: 'field', cardId: intent.cardId };
      }
    } else { // player_min or player_max
      const targetPlayer = players.find(p => p.id === intent.targetPlayerId);
      if (targetPlayer) {
          if (intent.source === 'player_min') {
              const alreadyUsedMin = currentChallenge.some(r => r.source.type === 'player' && r.source.playerId === intent.targetPlayerId && r.source.position === 'min');
              if (alreadyUsedMin) {
                  alert('同じターンに同じプレイヤーの最小カードを2回選択することはできません。');
                  return;
              }
          }
          if (intent.source === 'player_max') {
              const alreadyUsedMax = currentChallenge.some(r => r.source.type === 'player' && r.source.playerId === intent.targetPlayerId && r.source.position === 'max');
              if (alreadyUsedMax) {
                  alert('同じターンに同じプレイヤーの最大カードを2回選択することはできません。');
                  return;
              }
          }

          const hiddenHand = targetPlayer.hand.filter(c => c.status === 'hidden');
          if (hiddenHand.length > 0) {
              let targetCard: CardInPlay;
              if (intent.source === 'player_min') {
                  targetCard = hiddenHand[0]; // Assumes hiddenHand is sorted by value
                  description = `${targetPlayer.name}の最小カード`;
                  source = { type: 'player', playerId: targetPlayer.id, position: 'min', cardId: targetCard.id };
              } else { // player_max
                  targetCard = hiddenHand[hiddenHand.length - 1];
                  description = `${targetPlayer.name}の最大カード`;
                  source = { type: 'player', playerId: targetPlayer.id, position: 'max', cardId: targetCard.id };
              }
              cardValue = targetCard.value;
              
              const isAlreadyRevealedInChallenge = currentChallenge.some(r => r.source.type === 'player' && r.source.cardId === targetCard.id);
              if(isAlreadyRevealedInChallenge) {
                  cardValue = undefined;
                  source = undefined;
              }
          }
      }
    }

    if (cardValue === undefined || source === undefined) {
      alert('そのアクションは実行できません（カードがないか、既にチャレンジで公開済みです）。');
      return;
    }

    const newReveal: Reveal = { description, card: cardValue, source };
    const newChallenge = [...currentChallenge, newReveal];
    setCurrentChallenge(newChallenge);

    // Process the result only when exactly 3 cards are revealed.
    if (newChallenge.length === 3) {
      const currentPlayer = players[currentPlayerIndex];
      const isSuccess = newChallenge.every(r => r.card === newChallenge[0].card);

      if (isSuccess) {
        // SUCCESS
        const newLogEntry: ChallengeLog = {
          id: `${Date.now()}-${turnNumber}`,
          turnNumber,
          playerId: currentPlayer.id,
          reveals: newChallenge,
          result: 'success',
        };
        setLog(prev => [newLogEntry, ...prev]);

        const completedCard = newChallenge[0].card;
        const revealedCardIds = newChallenge.map(r => r.source.cardId);

        const finalPlayers = players.map(p => {
          const newHand: CardInPlay[] = p.hand.map(card =>
            revealedCardIds.includes(card.id) ? { ...card, status: 'revealed' } : card
          );
          if (p.id === currentPlayer.id) {
            return {
              ...p,
              hand: newHand,
              completedSets: [...p.completedSets, completedCard].sort((a, b) => a - b)
            };
          }
          return { ...p, hand: newHand };
        });

        const finalFieldCards: CardInPlay[] = fieldCards.map(card => {
          if (revealedCardIds.includes(card.id)) {
            return { ...card, status: 'revealed' };
          }
          return card;
        });

        setPlayers(finalPlayers);
        setFieldCards(finalFieldCards);

        const winningPlayer = finalPlayers.find(p => p.id === currentPlayer.id)!;
        const { isWin, reason } = checkWinCondition(winningPlayer);

        if (isWin) {
          setWinner({ player: winningPlayer, reason });
          setGamePhase('gameOver');
          return;
        }

        // Success, but no win, so advance turn immediately.
        setCurrentChallenge([]);
        setTurnNumber(prev => prev + 1);
        setCurrentPlayerIndex(prev => (prev + 1) % players.length);
      } else {
        // FAILURE
        const newLogEntry: ChallengeLog = {
          id: `${Date.now()}-${turnNumber}`,
          turnNumber,
          playerId: currentPlayer.id,
          reveals: newChallenge,
          result: 'fail',
        };
        setLog(prev => [newLogEntry, ...prev]);
        setAwaitingNextTurnClick(true);
      }
    }
  }, [currentChallenge, players, currentPlayerIndex, turnNumber, fieldCards, checkWinCondition, awaitingNextTurnClick]);

  const handleNextTurn = useCallback(() => {
    if (!awaitingNextTurnClick) return;
    
    setAwaitingNextTurnClick(false);
    setCurrentChallenge([]);
    setTurnNumber(prev => prev + 1);
    setCurrentPlayerIndex(prev => (prev + 1) % players.length);
  }, [awaitingNextTurnClick, players.length]);

  const handleResetGame = useCallback(() => {
    setGamePhase('setup');
  }, []);
  
  const handleToggleGmMode = () => setIsGmMode(prev => !prev);

  const handleShowRules = () => {
    setPhaseBeforeRules(gamePhase);
    setGamePhase('rules');
  };
  
  const handleShowLog = () => {
    setGamePhase('log');
  }

  const handleShowCardConfig = () => {
    setGamePhase('cardConfig');
  };

  const renderContent = () => {
    switch(gamePhase) {
      case 'log':
        return <LogScreen log={log} players={players} onBack={() => setGamePhase('playing')} />;
      case 'cardConfig':
        return <CardConfigScreen onBack={() => setGamePhase('setup')} />;
      case 'rules':
        return <RulesScreen onBack={() => setGamePhase(phaseBeforeRules)} />;
      case 'setup':
        return <SetupScreen onStartGame={handleStartGame} onShowRules={handleShowRules} onShowCardConfig={handleShowCardConfig} />;
      case 'gameOver':
        return winner && <GameOverScreen winner={winner.player} reason={winner.reason} onReset={handleResetGame} />;
      case 'playing':
      default:
        return (
          <GameScreen
            players={players}
            currentPlayer={players[currentPlayerIndex]}
            onReveal={handleReveal}
            turnNumber={turnNumber}
            currentChallenge={currentChallenge}
            fieldCards={fieldCards}
            isGmMode={isGmMode}
            awaitingNextTurnClick={awaitingNextTurnClick}
            onNextTurn={handleNextTurn}
          />
        );
    }
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-amber-700 font-mplus">
                ナナ <span className="text-xl text-gray-500 font-normal">心理戦神経衰弱</span>
            </h1>
            {(gamePhase === 'playing' || gamePhase === 'gameOver') && (
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <button
                        onClick={handleShowLog}
                        className="px-3 sm:px-4 py-2 rounded-lg transition-colors shadow text-sm font-bold bg-blue-100 text-blue-800 hover:bg-blue-200"
                    >
                        ゲーム記録
                    </button>
                    <button
                        onClick={handleShowRules}
                        className="px-3 sm:px-4 py-2 rounded-lg transition-colors shadow text-sm font-bold bg-gray-100 text-gray-800 hover:bg-gray-200"
                    >
                        ルール
                    </button>
                    {gamePhase === 'playing' && (
                        <button
                            onClick={handleToggleGmMode}
                            className={`px-3 sm:px-4 py-2 rounded-lg transition-colors shadow text-sm font-bold ${isGmMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'}`}
                        >
                            GM
                        </button>
                    )}
                    <button 
                        onClick={handleResetGame}
                        className="bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-600 transition-colors shadow"
                    >
                        リセット
                    </button>
                </div>
            )}
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;

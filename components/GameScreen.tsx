import React from 'react';
import { Player, Reveal, CardInPlay } from '../types';
import { RevealIntent } from '../App';
import { PLAYER_COLORS } from '../constants';
import PlayerStatus from './PlayerStatus';
import FieldDisplay from './FieldDisplay';

interface GameScreenProps {
  players: Player[];
  currentPlayer: Player;
  onReveal: (intent: RevealIntent) => void;
  turnNumber: number;
  currentChallenge: Reveal[];
  fieldCards: CardInPlay[];
  isGmMode: boolean;
  awaitingNextTurnClick: boolean;
  onNextTurn: () => void;
}

const ChallengeTracker: React.FC<{challenge: Reveal[], turn: number}> = ({ challenge, turn }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-amber-200">
            <h3 className="font-mplus text-2xl font-bold mb-4 text-amber-800">
                チャレンジ (ターン {turn})
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
                {[0, 1, 2].map(index => {
                    const reveal = challenge[index];
                    return (
                        <div key={index} className={`aspect-w-3 aspect-h-4 rounded-lg flex flex-col justify-center items-center p-2 transition-all duration-300 ${reveal ? 'bg-amber-100 border-2 border-amber-300' : 'bg-gray-100 border-2 border-dashed border-gray-300'}`}>
                            {reveal ? (
                                <>
                                    <span className="text-xs text-amber-700 break-words">{reveal.description}</span>
                                    <span className={`font-mplus font-extrabold text-5xl ${reveal.card === 7 ? 'text-red-600' : 'text-amber-800'}`}>{reveal.card}</span>
                                </>
                            ) : (
                                <span className="text-gray-400 text-lg font-bold">?</span>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

// --- START: Game Flow/Victory Guide ---
const InfoCard: React.FC<{ title: string; subtitle?: string; children: React.ReactNode, className?: string }> = ({ title, subtitle, children, className = '' }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-lg border border-amber-200 ${className}`}>
        <h3 className="font-mplus text-2xl font-bold mb-1 text-amber-800">{title}</h3>
        {subtitle && <p className="text-gray-600 mb-4">{subtitle}</p>}
        <div className="mt-4">
            {children}
        </div>
    </div>
);
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.28a.75.75 0 0 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" /></svg>;

const TrophyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.5 2h-13A2.5 2.5 0 0 0 3 4.5V10h3.58a7.5 7.5 0 0 1 10.84 0H21V4.5A2.5 2.5 0 0 0 18.5 2Z M21 12h-3a5.51 5.51 0 0 0-3.5-5.07a5.5 5.5 0 0 0-5 0A5.51 5.51 0 0 0 6 12H3v7.5A2.5 2.5 0 0 0 5.5 22h13a2.5 2.5 0 0 0 2.5-2.5V12Z" />
    </svg>
);
const SevenCardIcon = () => (
    <div className="relative h-8 w-8 flex items-center justify-center">
        <div className="absolute w-6 h-8 bg-white border-2 border-red-400 rounded-md shadow-sm flex items-center justify-center">
            <span className="font-mplus font-extrabold text-xl text-red-600">7</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute -top-1 -right-1 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z" />
        </svg>
    </div>
);
const SumIcon = () => (
    <div className="h-8 w-8 flex items-center justify-center space-x-0.5">
        <div className="font-bold text-sm text-blue-600">[2]</div>
        <div className="font-bold text-sm text-blue-600">+</div>
        <div className="font-bold text-sm text-blue-600">[5]</div>
    </div>
);
// --- END: Game Flow/Victory Guide ---


const GameScreen: React.FC<GameScreenProps> = (props) => {
  const { players, currentPlayer, onReveal, turnNumber, currentChallenge, fieldCards, isGmMode, awaitingNextTurnClick, onNextTurn } = props;
  
  const currentPlayerColor = PLAYER_COLORS[currentPlayer.id % PLAYER_COLORS.length];
  const actionsDisabled = currentChallenge.length >= 3 || awaitingNextTurnClick;
  
  const revealedFieldCardIds = currentChallenge
      .map(r => r.source)
      .filter(s => s.type === 'field')
      .map(s => (s as { type: 'field', cardId: number }).cardId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Left Column: Main Game Area */}
      <div className="space-y-6">
        {/* 1. Current Turn */}
        <div className="bg-white p-4 rounded-xl shadow-md text-center">
            <h2 className="text-xl font-bold text-gray-700">
                現在のターン: <span className={`font-mplus text-3xl font-extrabold ${currentPlayerColor.text}`}>{currentPlayer.name}</span>
            </h2>
            <p className="text-gray-500 mt-1">
                アクション {awaitingNextTurnClick ? 3 : currentChallenge.length + 1} / 3
            </p>
        </div>

        {/* 2. Challenge */}
        <ChallengeTracker challenge={currentChallenge} turn={turnNumber} />

        {awaitingNextTurnClick && (
            <div className="text-center p-6 bg-red-100 border-2 border-red-300 rounded-2xl shadow-lg">
                <h3 className="font-mplus text-2xl font-bold text-red-700">チャレンジ失敗！</h3>
                <p className="text-red-600 mt-1">公開されたカードを確認してください。</p>
                <button
                    onClick={onNextTurn}
                    className="mt-4 bg-amber-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all duration-300 transform hover:scale-105 shadow-md"
                >
                    次のターンへ
                </button>
            </div>
        )}
      
        {/* 3. Field Cards */}
        <FieldDisplay 
            fieldCards={fieldCards}
            onRevealCard={(cardId) => onReveal({ source: 'field', cardId })}
            revealedCardIds={revealedFieldCardIds}
            disabled={actionsDisabled}
        />
        
        {/* 4. Game Flow Guide */}
        <InfoCard title="ゲームの流れ">
            <>
                <div className="relative flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8 p-4">

                    {/* Step 1 */}
                    <div className="w-full lg:w-1/3 text-center">
                        <div className="flex-shrink-0 mx-auto bg-amber-600 text-white font-bold rounded-full h-10 w-10 flex items-center justify-center text-lg mb-2">1</div>
                        <h4 className="font-bold text-lg text-amber-900">カードを選ぶ</h4>
                        <p className="text-gray-600 text-sm mb-3">↓のどちらかを選ぶ</p>
                        <div className="space-y-3">
                            <div className="p-3 rounded-lg bg-amber-100 border border-amber-200 text-center">
                                <p className="font-bold text-amber-800">他の人or自分の手札</p>
                                <p className="text-sm text-amber-700">(一番小さい or 一番大きい)</p>
                            </div>
                            <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-center">
                                <p className="font-bold text-indigo-800">場のカード</p>
                                <p className="text-sm text-indigo-700">(好きな1枚)</p>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:block"><ArrowRightIcon/></div>

                    {/* Step 2: Victory Conditions */}
                    <div className="w-full lg:w-2/3">
                        <div className="flex items-center justify-center mb-2">
                            <div className="flex-shrink-0 bg-amber-600 text-white font-bold rounded-full h-10 w-10 flex items-center justify-center text-lg">2</div>
                            <div className="ml-3 text-center">
                                <h4 className="font-bold text-lg text-amber-900">勝利条件を満たす</h4>
                                <p className="text-gray-600 text-sm">チャレンジを成功させ、以下の条件を達成しよう！</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center mt-2">
                            <div className="bg-amber-50 p-2 rounded-lg border border-amber-200 flex flex-col items-center justify-start h-full">
                                <TrophyIcon />
                                <h5 className="font-bold text-amber-900 text-sm mt-1">3回成功</h5>
                                <p className="text-xs text-gray-600 mt-0.5">チャレンジを3回成功させる。</p>
                            </div>
                            <div className="bg-amber-50 p-2 rounded-lg border border-amber-200 flex flex-col items-center justify-start h-full">
                                <SevenCardIcon/>
                                <h5 className="font-bold text-amber-900 text-sm mt-1">「7」で成功</h5>
                                <p className="text-xs text-gray-600 mt-0.5">「7」のカードでチャレンジ成功。</p>
                            </div>
                            <div className="bg-amber-50 p-2 rounded-lg border border-amber-200 flex flex-col items-center justify-start h-full">
                                <SumIcon />
                                <h5 className="font-bold text-amber-900 text-sm mt-1">和か差が「7」</h5>
                                <p className="text-xs text-gray-600 mt-0.5">成功した数字の和か差が7になる。</p>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </InfoCard>

      </div>

      {/* Right Column: Player Info */}
      <div className="space-y-6 lg:sticky lg:top-6">
         {/* 4. Player Status */}
        <PlayerStatus 
            players={players} 
            onReveal={onReveal}
            disabled={actionsDisabled}
            isGmMode={isGmMode}
        />
      </div>
    </div>
  );
};

export default GameScreen;
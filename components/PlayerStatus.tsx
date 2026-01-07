import React, { useState } from 'react';
import { Player } from '../types';
import { PLAYER_COLORS } from '../constants';
import { RevealIntent } from '../App';

interface PlayerStatusProps {
  players: Player[];
  onReveal: (intent: RevealIntent) => void;
  disabled: boolean;
  isGmMode: boolean;
}

const PlayerCard: React.FC<{ player: Player; onReveal: (intent: RevealIntent) => void; disabled: boolean; isGmMode: boolean; }> = ({ player, onReveal, disabled, isGmMode }) => {
    const color = PLAYER_COLORS[player.id % PLAYER_COLORS.length];
    const hasHiddenCards = player.hand.some(card => card.status === 'hidden');
    const [copied, setCopied] = useState(false);

    const handleCopyHand = () => {
        if (player.hand.length === 0) return;
        const handString = player.hand.map(card => card.value).join(', ');
        navigator.clipboard.writeText(handString).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className={`${color.bg} p-1.5 rounded-lg shadow-md border ${color.border} flex items-center space-x-2`}>
    
            {/* Player Info (Name + Stats + Actions) */}
            <div className={`w-36 flex-shrink-0 flex flex-col justify-between p-1.5 rounded-md bg-white bg-opacity-30 self-stretch`}>
                <div>
                    <h4 className={`text-base font-bold ${color.text} break-words`}>
                        {player.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-1 mt-0.5">
                        <span className={`font-bold px-1.5 py-0.5 rounded-full text-xs ${color.text} bg-white bg-opacity-70`}>
                            成功: {player.completedSets.length}
                        </span>
                        <span className={`font-bold px-1.5 py-0.5 rounded-full text-xs ${color.text} bg-white bg-opacity-70`}>
                            手札: {player.hand.length}
                        </span>
                    </div>
                </div>
                <div className="mt-1.5 space-y-1">
                     <div className="grid grid-cols-2 gap-1 text-xs">
                        <button 
                            onClick={() => onReveal({ source: 'player_min', targetPlayerId: player.id })}
                            disabled={disabled || !hasHiddenCards}
                            className={`font-bold py-1.5 px-1 rounded-md transition-colors ${color.text} bg-white bg-opacity-70 hover:bg-opacity-100 shadow-sm disabled:bg-opacity-50 disabled:cursor-not-allowed`}
                        >
                            最小
                        </button>
                        <button 
                            onClick={() => onReveal({ source: 'player_max', targetPlayerId: player.id })}
                            disabled={disabled || !hasHiddenCards}
                            className={`font-bold py-1.5 px-1 rounded-md transition-colors ${color.text} bg-white bg-opacity-70 hover:bg-opacity-100 shadow-sm disabled:bg-opacity-50 disabled:cursor-not-allowed`}
                        >
                            最大
                        </button>
                    </div>
                    {isGmMode && (
                        <button
                            onClick={handleCopyHand}
                            disabled={copied || player.hand.length === 0}
                            className={`w-full font-bold py-1 px-2 rounded-md transition-colors text-xs shadow-sm disabled:cursor-not-allowed
                                ${copied 
                                    ? 'bg-green-500 text-white' 
                                    : `${color.text} bg-white bg-opacity-70 hover:bg-opacity-100 disabled:bg-opacity-50`
                                }`
                            }
                        >
                            {copied ? 'コピー済' : '手札コピー'}
                        </button>
                    )}
                </div>
            </div>
            
            {/* Cards Area (Hand + Completed) */}
            <div className="flex-grow grid grid-cols-1 gap-1">
                {/* Hand */}
                <div className="flex items-center gap-1">
                    <span className={`flex-shrink-0 text-xs font-bold ${color.text} w-8 text-center`}>手札</span>
                     {player.hand.length > 0 ? (
                        <div className="flex flex-grow flex-wrap gap-1 bg-white bg-opacity-40 p-1 rounded-md min-h-[36px] items-center">
                             {player.hand.map((card) => {
                                const isRevealed = card.status === 'revealed';
                                const showGmCard = isGmMode && card.status === 'hidden';
                                
                                return (
                                    <div 
                                        key={card.id} 
                                        className={`
                                            rounded shadow-sm w-6 h-8 flex items-center justify-center font-mplus font-extrabold text-base
                                            transition-all duration-300
                                            ${isRevealed
                                                ? `bg-white ${color.text}`
                                                : `bg-gray-400 text-white`
                                            }
                                            ${showGmCard ? 'opacity-70' : ''}
                                        `}
                                    >
                                        {isRevealed || showGmCard 
                                            ? (card.value === 7 ? <span className="text-red-600">7</span> : card.value)
                                            : '?'
                                        }
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className={`flex-grow text-center text-xs ${color.text} h-[36px] flex items-center justify-center bg-white bg-opacity-40 p-1 rounded-md`}>-</div>
                    )}
                </div>
                
                {/* Completed Sets */}
                <div className="flex items-center gap-1">
                     <span className={`flex-shrink-0 text-xs font-bold ${color.text} w-8 text-center`}>成功</span>
                    <div className="flex flex-grow flex-wrap gap-1 bg-white bg-opacity-40 p-1 rounded-md min-h-[32px] items-center">
                        {player.completedSets.length > 0 ? (
                            player.completedSets.map((value, index) => (
                                <div 
                                    key={index} 
                                    className={`
                                        rounded-sm shadow-sm w-5 h-7 flex items-center justify-center font-mplus font-extrabold text-sm
                                        bg-white ${color.text}
                                    `}
                                >
                                    {value === 7 ? <span className="text-red-600">7</span> : value}
                                </div>
                            ))
                        ) : (
                            <p className={`w-full text-center text-xs ${color.text} opacity-70`}>-</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


const PlayerStatus: React.FC<PlayerStatusProps> = ({ players, onReveal, disabled, isGmMode }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-amber-200">
      <h3 className="font-mplus text-2xl font-bold mb-4 text-amber-800">プレイヤーの状況</h3>
      <div className="space-y-3">
        {players.map(player => (
          <PlayerCard key={player.id} player={player} onReveal={onReveal} disabled={disabled} isGmMode={isGmMode} />
        ))}
      </div>
    </div>
  );
};

export default PlayerStatus;

import React from 'react';
import { Player, ChallengeLog } from '../types';
import { PLAYER_COLORS } from '../constants';

const SuccessIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4Z" clipRule="evenodd" />
    </svg>
);

const FailIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.707-10.707a1 1 0 0 0-1.414-1.414L10 8.586 7.707 6.293a1 1 0 0 0-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 1 0 1.414 1.414L10 11.414l2.293 2.293a1 1 0 0 0 1.414-1.414L11.414 10l2.293-2.293Z" clipRule="evenodd" />
    </svg>
);


interface LogScreenProps {
  log: ChallengeLog[];
  players: Player[];
  onBack: () => void;
}

const LogScreen: React.FC<LogScreenProps> = ({ log, players, onBack }) => {
    const getPlayerName = (id: number) => players.find(p => p.id === id)?.name || '不明';
    const getPlayerColor = (id: number) => PLAYER_COLORS[id % PLAYER_COLORS.length];

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-amber-200">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-amber-800 font-mplus">ゲームの記録</h2>
        <p className="text-gray-600 mt-2">これまでの全ターンのチャレンジ履歴です。</p>
      </div>

      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 border-t border-b border-amber-200 py-4">
        {log.length === 0 ? (
          <div className="flex items-center justify-center text-gray-500 min-h-[10rem]">
            <p>まだチャレンジがありません。</p>
          </div>
        ) : (
          log.map(entry => {
            const playerColor = getPlayerColor(entry.playerId);
            return (
                <div key={entry.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    {entry.result === 'success' ? 
                        <SuccessIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" /> : 
                        <FailIcon className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                    }
                    <div className="flex-grow">
                        <p className="text-sm text-gray-500">ターン {entry.turnNumber}</p>
                        <p className="font-bold text-gray-800">
                            <span className={playerColor.text}>{getPlayerName(entry.playerId)}</span>
                            <span> のチャレンジ</span>
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                            {entry.reveals.map((reveal, index) => (
                                <li key={index}>
                                    {reveal.description}: <span className={`font-bold ${reveal.card === 7 ? 'text-red-600' : 'text-amber-700'}`}>{reveal.card}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-2 text-right">
                            {entry.result === 'success' ? 
                                <span className="font-bold text-green-600">成功</span> :
                                <span className="font-bold text-red-600">失敗</span>
                            }
                        </p>
                    </div>
                </div>
            );
          })
        )}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onBack}
          className="bg-amber-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          ゲームに戻る
        </button>
      </div>
    </div>
  );
};

export default LogScreen;
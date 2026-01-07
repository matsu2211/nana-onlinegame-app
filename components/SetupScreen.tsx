
import React, { useState, useCallback } from 'react';
import { PLAYER_COLORS } from '../constants';

interface SetupScreenProps {
  onStartGame: (playerNames: string[]) => void;
  onShowRules: () => void;
  onShowCardConfig: () => void;
}

const PlayerIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 12c-3.31 0-6 2.69-6 6v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1c0-3.31-2.69-6-6-6Z" />
    </svg>
);


const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame, onShowRules, onShowCardConfig }) => {
  const [playerCount, setPlayerCount] = useState<number>(3);
  const [playerNames, setPlayerNames] = useState<string[]>(['プレイヤー1', 'プレイヤー2', 'プレイヤー3']);
  const [error, setError] = useState<string | null>(null);

  const handlePlayerCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const count = parseInt(e.target.value, 10);
    setPlayerCount(count);
    setPlayerNames(prevNames => {
      const newNames = [...prevNames];
      while (newNames.length < count) {
        newNames.push(`プレイヤー${newNames.length + 1}`);
      }
      return newNames.slice(0, count);
    });
  };

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerNames.some(name => name.trim() === '')) {
      setError('すべてのプレイヤーの名前を入力してください。');
      return;
    }
    setError(null);
    onStartGame(playerNames.map(name => name.trim()));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-amber-200">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-amber-800 font-mplus">ゲームの準備</h2>
        <p className="text-gray-600 mt-2">プレイヤーの人数と名前を設定してください。最初のプレイヤーはランダムで決まります。</p>
        <div className="mt-6 flex justify-center items-center space-x-4">
          <button
            onClick={onShowRules}
            className="font-bold py-2 px-5 rounded-lg border-2 transition-colors text-amber-600 border-amber-500 hover:bg-amber-100"
          >
            遊び方を見る
          </button>
          <button
            onClick={onShowCardConfig}
            className="font-bold py-2 px-5 rounded-lg border-2 transition-colors text-indigo-600 border-indigo-500 hover:bg-indigo-100"
          >
            カード構成を確認
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="playerCount" className="block text-lg font-medium text-gray-700 mb-2">
            プレイヤーの人数
          </label>
          <select
            id="playerCount"
            value={playerCount}
            onChange={handlePlayerCountChange}
            className="w-full p-3 bg-amber-50 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
          >
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>{num}人</option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {playerNames.map((name, index) => (
            <div key={index} className="flex items-center space-x-3">
              <PlayerIcon className={`w-8 h-8 ${PLAYER_COLORS[index % PLAYER_COLORS.length].text}`} />
              <input
                type="text"
                value={name}
                onChange={e => handleNameChange(index, e.target.value)}
                placeholder={`プレイヤー ${index + 1}`}
                className={`flex-grow p-3 border rounded-lg transition focus:ring-2 ${PLAYER_COLORS[index % PLAYER_COLORS.length].border} ${PLAYER_COLORS[index % PLAYER_COLORS.length].ring}`}
              />
            </div>
          ))}
        </div>

        {error && <p className="text-red-600 text-center">{error}</p>}

        <button
          type="submit"
          className="w-full bg-amber-600 text-white font-bold py-4 px-4 rounded-xl hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          ゲームを開始する
        </button>
      </form>
    </div>
  );
};

export default SetupScreen;
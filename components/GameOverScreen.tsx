
import React from 'react';
import { Player } from '../types';
import { PLAYER_COLORS } from '../constants';

interface GameOverScreenProps {
    winner: Player;
    reason: string;
    onReset: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ winner, reason, onReset }) => {
    const winnerColor = PLAYER_COLORS[winner.id % PLAYER_COLORS.length];

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border-2 border-amber-400 text-center">
            <h2 className="text-2xl font-bold text-gray-500 font-mplus">ゲーム終了！</h2>
            <div className="my-6">
                <p className="text-lg text-gray-600">勝者</p>
                <p className={`font-mplus font-extrabold text-6xl my-2 ${winnerColor.text}`}>{winner.name}</p>
            </div>
            <div className={`p-4 rounded-lg ${winnerColor.bg} ${winnerColor.text}`}>
                <p className="font-bold text-lg">{reason}</p>
            </div>
            <button
                onClick={onReset}
                className="mt-8 w-full bg-amber-600 text-white font-bold py-4 px-4 rounded-xl hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
                もう一度遊ぶ
            </button>
        </div>
    );
};

export default GameOverScreen;
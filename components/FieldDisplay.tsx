import React from 'react';
import { CardInPlay } from '../types';

interface FieldDisplayProps {
  fieldCards: CardInPlay[];
  onRevealCard: (cardId: number) => void;
  revealedCardIds: number[];
  disabled: boolean;
}

const FieldDisplay: React.FC<FieldDisplayProps> = ({ fieldCards, onRevealCard, revealedCardIds, disabled }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-amber-200">
      <h3 className="font-mplus text-2xl font-bold mb-4 text-amber-800">場のカード</h3>
      {fieldCards.length > 0 ? (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
          {fieldCards.map((card, index) => {
            const isPermanentlyRevealed = card.status === 'revealed';
            const isTemporarilyRevealed = revealedCardIds.includes(card.id);
            const isShown = isPermanentlyRevealed || isTemporarilyRevealed;
            const isClickable = !disabled && !isPermanentlyRevealed && !isTemporarilyRevealed;

            return (
              <button
                key={card.id}
                onClick={() => isClickable && onRevealCard(card.id)}
                disabled={!isClickable}
                className={`
                  aspect-w-3 aspect-h-4 rounded-lg flex items-center justify-center font-mplus font-extrabold text-2xl
                  transition-all duration-200 transform
                  disabled:transform-none disabled:cursor-not-allowed
                  ${isShown
                    ? 'bg-amber-100 text-amber-800 border-2 border-amber-300'
                    : `bg-amber-500 text-white shadow-md hover:scale-105 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400`
                  }
                  ${isPermanentlyRevealed ? 'opacity-70' : ''}
                `}
              >
                {isShown 
                    ? (card.value === 7 ? <span className="text-red-600">7</span> : card.value) 
                    : String.fromCharCode(65 + index)}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center h-24 text-gray-500">
          <p>場のカードはありません。</p>
        </div>
      )}
    </div>
  );
};

export default FieldDisplay;

import React from 'react';

interface CardConfigScreenProps {
  onBack: () => void;
}

const CardConfigScreen: React.FC<CardConfigScreenProps> = ({ onBack }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-amber-200">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-amber-800 font-mplus">カード構成</h2>
        <p className="text-gray-600 mt-2">プレイ人数によって使用するカードの枚数が変わります。</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center text-sm sm:text-base">
          <thead className="border-b-2 border-amber-200">
            <tr className="text-amber-800">
              <th className="py-2 px-1 font-semibold">プレイ人数</th>
              <th className="py-2 px-1 font-semibold">使用カード</th>
              <th className="py-2 px-1 font-semibold">手札(1人)</th>
              <th className="py-2 px-1 font-semibold">場札</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-amber-100">
              <td className="py-2 px-1 font-mplus font-bold">2人</td>
              <td className="py-2 px-1">1～10</td>
              <td className="py-2 px-1">10枚</td>
              <td className="py-2 px-1">10枚</td>
            </tr>
            <tr className="border-b border-amber-100">
              <td className="py-2 px-1 font-mplus font-bold">3人</td>
              <td className="py-2 px-1">1～11</td>
              <td className="py-2 px-1">8枚</td>
              <td className="py-2 px-1">9枚</td>
            </tr>
            <tr className="border-b border-amber-100">
              <td className="py-2 px-1 font-mplus font-bold">4人</td>
              <td className="py-2 px-1">1～12</td>
              <td className="py-2 px-1">7枚</td>
              <td className="py-2 px-1">8枚</td>
            </tr>
            <tr className="border-b border-amber-100">
              <td className="py-2 px-1 font-mplus font-bold">5人</td>
              <td className="py-2 px-1">1～12</td>
              <td className="py-2 px-1">6枚</td>
              <td className="py-2 px-1">6枚</td>
            </tr>
            <tr className="border-b border-amber-100">
              <td className="py-2 px-1 font-mplus font-bold">6人</td>
              <td className="py-2 px-1">1～14</td>
              <td className="py-2 px-1">5枚</td>
              <td className="py-2 px-1">12枚</td>
            </tr>
            <tr className="border-b border-amber-100">
              <td className="py-2 px-1 font-mplus font-bold">7人</td>
              <td className="py-2 px-1">1～15</td>
              <td className="py-2 px-1">5枚</td>
              <td className="py-2 px-1">10枚</td>
            </tr>
            <tr className="border-b border-amber-100">
              <td className="py-2 px-1 font-mplus font-bold">8人</td>
              <td className="py-2 px-1">1～17</td>
              <td className="py-2 px-1">5枚</td>
              <td className="py-2 px-1">10枚</td>
            </tr>
            <tr className="border-b border-amber-100">
              <td className="py-2 px-1 font-mplus font-bold">9人</td>
              <td className="py-2 px-1">1～18</td>
              <td className="py-2 px-1">5枚</td>
              <td className="py-2 px-1">9枚</td>
            </tr>
            <tr>
              <td className="py-2 px-1 font-mplus font-bold">10人</td>
              <td className="py-2 px-1">1～19</td>
              <td className="py-2 px-1">5枚</td>
              <td className="py-2 px-1">7枚</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={onBack}
          className="bg-amber-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          戻る
        </button>
      </div>
    </div>
  );
};

export default CardConfigScreen;

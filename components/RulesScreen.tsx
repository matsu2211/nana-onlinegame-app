
import React from 'react';

interface RulesScreenProps {
  onBack: () => void;
}

const InfoCard: React.FC<{ title: string; subtitle?: string; children: React.ReactNode, className?: string }> = ({ title, subtitle, children, className = '' }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-lg border border-amber-200 ${className}`}>
        <h3 className="font-mplus text-2xl font-bold mb-1 text-amber-800">{title}</h3>
        {subtitle && <p className="text-gray-600 mb-4">{subtitle}</p>}
        <div className="mt-4">
            {children}
        </div>
    </div>
);

// --- SVG Icons ---
const TrophyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.5 2h-13A2.5 2.5 0 0 0 3 4.5V10h3.58a7.5 7.5 0 0 1 10.84 0H21V4.5A2.5 2.5 0 0 0 18.5 2Z M21 12h-3a5.51 5.51 0 0 0-3.5-5.07a5.5 5.5 0 0 0-5 0A5.51 5.51 0 0 0 6 12H3v7.5A2.5 2.5 0 0 0 5.5 22h13a2.5 2.5 0 0 0 2.5-2.5V12Z" />
    </svg>
);
const SevenCardIcon = () => (
    <div className="relative h-12 w-12 flex items-center justify-center">
        {/* The card itself */}
        <div className="absolute w-9 h-12 bg-white border-2 border-red-400 rounded-lg shadow-md flex items-center justify-center">
            <span className="font-mplus font-extrabold text-2xl text-red-600">7</span>
        </div>
        {/* The star icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute -top-1 -right-1 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z" />
        </svg>
    </div>
);
const SumIcon = () => (
    <div className="h-12 w-12 flex items-center justify-center space-x-1">
        <div className="font-bold text-lg text-blue-600">[2]</div>
        <div className="font-bold text-lg text-blue-600">+</div>
        <div className="font-bold text-lg text-blue-600">[5]</div>
    </div>
);

const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z" clipRule="evenodd" /></svg>;
const XCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM8.707 7.293a1 1 0 0 0-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 1 0 1.414 1.414L10 11.414l1.293 1.293a1 1 0 0 0 1.414-1.414L11.414 10l1.293-1.293a1 1 0 0 0-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;

const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.28a.75.75 0 0 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" /></svg>;

const RulesScreen: React.FC<RulesScreenProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto bg-amber-50 p-4 sm:p-8 rounded-2xl">
        <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-amber-800 font-mplus">遊び方</h2>
            <p className="text-gray-600 mt-2">「ナナ」のルールをかんたん解説！</p>
        </div>

        <div className="space-y-6">
            {/* --- Goal --- */}
            <InfoCard title="ゲームの目的" subtitle="3つの勝利条件のうち、どれか1つを最初に達成したら勝利！">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-200 flex flex-col items-center justify-center min-h-[160px]">
                        <TrophyIcon />
                        <h4 className="font-bold text-amber-900 mt-2">チャレンジ3回成功</h4>
                        <p className="text-sm text-gray-600 mt-1">数字を3つそろえる「チャレンジ」を3回成功させる。</p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-200 flex flex-col items-center justify-center min-h-[160px]">
                        <SevenCardIcon/>
                        <h4 className="font-bold text-amber-900 mt-2">「7」でチャレンジ成功</h4>
                        <p className="text-sm text-gray-600 mt-1">ラッキーナンバー「7」のカードでチャレンジを成功させる。</p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-200 flex flex-col items-center justify-center min-h-[160px]">
                        <SumIcon />
                        <h4 className="font-bold text-amber-900 mt-2">和か差が「7」</h4>
                        <p className="text-sm text-gray-600 mt-1">それまでに自分がチャレンジ成功したカードの数字の和か差で「７」を作る。（例：２と５）</p>
                    </div>
                </div>
            </InfoCard>

            {/* --- Flow --- */}
            <InfoCard title="ゲームの流れ">
                <>
                    <p className="text-sm text-center text-gray-700 bg-amber-50 p-3 rounded-lg border border-amber-200 mb-4">
                        各プレイヤーに手札が配られ、プレイ人数に合わせた場札が設定されます。
                    </p>
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

                        {/* Step 2 */}
                         <div className="w-full lg:w-2/3">
                            <div className="flex items-center justify-center mb-2">
                                 <div className="flex-shrink-0 bg-amber-600 text-white font-bold rounded-full h-10 w-10 flex items-center justify-center text-lg">2</div>
                                 <div className="ml-3 text-center">
                                    <h4 className="font-bold text-lg text-amber-900">チャレンジする</h4>
                                    <p className="text-gray-600 text-sm">3回くりかえし、同じ数字をそろえよう！</p>
                                 </div>
                            </div>
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                                    <div className="flex items-center space-x-2">
                                        <CheckCircleIcon/>
                                        <p className="font-bold text-green-700">チャレンジ成功！</p>
                                    </div>
                                    <div className="flex justify-center items-center space-x-2 mt-2">
                                        <div className="w-10 h-14 bg-white border-2 border-green-300 rounded-md flex items-center justify-center text-2xl font-bold font-mplus text-green-700">5</div>
                                        <div className="w-10 h-14 bg-white border-2 border-green-300 rounded-md flex items-center justify-center text-2xl font-bold font-mplus text-green-700">5</div>
                                        <div className="w-10 h-14 bg-white border-2 border-green-300 rounded-md flex items-center justify-center text-2xl font-bold font-mplus text-green-700">5</div>
                                    </div>
                                    <p className="text-xs text-center text-gray-500 mt-2">成功！次の人のターンへ</p>
                                </div>
                                 <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                                    <div className="flex items-center space-x-2">
                                        <XCircleIcon/>
                                        <p className="font-bold text-red-700">チャレンジ失敗...</p>
                                    </div>
                                    <div className="flex justify-center items-center space-x-2 mt-2">
                                        <div className="w-10 h-14 bg-white border-2 border-red-300 rounded-md flex items-center justify-center text-2xl font-bold font-mplus text-red-700">5</div>
                                        <div className="w-10 h-14 bg-white border-2 border-red-300 rounded-md flex items-center justify-center text-2xl font-bold font-mplus text-red-700">5</div>
                                        <div className="w-10 h-14 bg-white border-2 border-red-300 rounded-md flex items-center justify-center text-2xl font-bold font-mplus text-red-700">8</div>
                                    </div>
                                    <p className="text-xs text-center text-gray-500 mt-2">失敗... 次の人のターンへ</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="text-red-600 font-bold text-center mt-4 px-4">
                        ※同じターンに連続で特定の人の最大or最小のカードをオープンすることはできません！
                        <br />
                        （最大１回、最小１回は可能）
                    </p>
                </>
            </InfoCard>

            {/* --- Card Config --- */}
            <InfoCard title="人数ごとのカード構成">
                <div className="overflow-x-auto">
                    <table className="w-full text-center text-sm sm:text-base">
                        <thead className="border-b-2 border-amber-300">
                            <tr className="text-amber-800">
                                <th className="py-2 px-2 font-semibold">人数</th>
                                <th className="py-2 px-2 font-semibold">使用カード</th>
                                <th className="py-2 px-2 font-semibold">手札(1人)</th>
                                <th className="py-2 px-2 font-semibold">場札</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {[
                                {p:2,c:"1-10",h:10,f:10}, {p:3,c:"1-11",h:8,f:9},
                                {p:4,c:"1-12",h:7,f:8}, {p:5,c:"1-12",h:6,f:6},
                                {p:6,c:"1-14",h:5,f:12}, {p:7,c:"1-15",h:5,f:10},
                                {p:8,c:"1-17",h:5,f:10}, {p:9,c:"1-18",h:5,f:9},
                                {p:10,c:"1-19",h:5,f:7}
                            ].map((row, i) => (
                                <tr key={row.p} className={`${i % 2 === 0 ? 'bg-amber-50' : ''}`}>
                                    <td className="py-2 px-2 font-mplus font-bold">{row.p}人</td>
                                    <td className="py-2 px-2">{row.c}</td>
                                    <td className="py-2 px-2">{row.h}枚</td>
                                    <td className="py-2 px-2">{row.f}枚</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </InfoCard>
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

export default RulesScreen;

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MarketCard = ({ item }) => {
  const isUp = item.trend === 'up';
  const isDown = item.trend === 'down';

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex justify-between items-center mb-3 hover:border-gray-200 transition-colors">
      <div>
        <h4 className="font-bold text-gray-800 text-lg">{item.crop}</h4>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mt-1">
          Per Quintal
        </p>
      </div>
      <div className="text-right">
        <div className="flex items-center justify-end gap-2 font-mono font-bold text-2xl text-gray-900">
          ₹{item.price.toLocaleString()}
          <span className={`p-1 rounded-full text-xs ${isUp ? 'bg-green-100 text-green-700' : isDown ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
            {isUp ? <TrendingUp size={14} /> : isDown ? <TrendingDown size={14} /> : '-'}
          </span>
        </div>
        <p className={`text-xs font-bold mt-1 ${isUp ? 'text-green-600' : isDown ? 'text-red-600' : 'text-gray-500'}`}>
          {item.prediction.toUpperCase()}
        </p>
      </div>
    </div>
  );
};

export default MarketCard;
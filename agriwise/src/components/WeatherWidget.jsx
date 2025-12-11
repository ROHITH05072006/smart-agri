import React, { useState } from 'react';
import { CloudRain, Sun, Droplets, Wind, Cloud, ChevronDown, ChevronUp } from 'lucide-react';

const WeatherWidget = ({ weather }) => {
  const [expanded, setExpanded] = useState(false);

  if (!weather) return <div className="p-4 text-white">Loading Weather...</div>;

  // 1. Helper to pick the right icon
  const getIcon = (type, size = 18, className = "") => {
    switch (type) {
      case 'rain': return <CloudRain size={size} className={`text-blue-200 ${className}`} />;
      case 'cloud': return <Cloud size={size} className={`text-gray-200 ${className}`} />;
      default: return <Sun size={size} className={`text-yellow-300 ${className}`} />;
    }
  };

  return (
    <div 
      onClick={() => setExpanded(!expanded)}
      className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 rounded-3xl text-white shadow-xl shadow-blue-200 mb-8 relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-95 group"
    >
      {/* Background decorations */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      
      <div className="p-6 relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2 opacity-80 group-hover:opacity-100 transition-opacity">
              <h3 className="text-blue-100 text-xs font-bold uppercase tracking-wider">WEATHER</h3>
              {expanded ? <ChevronUp size={14} className="text-white" /> : <ChevronDown size={14} className="text-blue-200" />}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-5xl font-bold tracking-tighter">{weather.temp}°</span>
              
              {/* 2. MAIN ICON: Uses the real condition now */}
              {getIcon(weather.condition, 40, "drop-shadow-lg")}
            
            </div>
            <div className="flex gap-4 mt-4 text-sm text-blue-50 font-medium">
              <span className="flex items-center gap-1"><Droplets size={14} /> {weather.humidity}%</span>
              <span className="flex items-center gap-1"><Wind size={14} /> {weather.windSpeed} km/h</span>
            </div>
          </div>
          
          {weather.rainForecast && (
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 text-xs text-center border border-white/10 animate-pulse">
              <p className="opacity-80 mb-1">Rain Alert</p>
              <p className="font-bold text-lg">Yes</p>
            </div>
          )}
        </div>
      </div>

      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expanded ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-black/10 backdrop-blur-sm p-4 mt-2 border-t border-white/10">
          <p className="text-[10px] uppercase font-bold text-blue-100 mb-3 tracking-wider opacity-80">
            WEEKLY FORECAST
          </p>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {weather.weekly && weather.weekly.map((day, index) => (
              <div key={index} className="flex flex-col items-center min-w-[3.5rem] bg-white/10 rounded-xl p-2 border border-white/5 hover:bg-white/20 transition-colors">
                <span className="text-xs font-medium text-blue-50 mb-1">{day.day}</span>
                {/* 3. WEEKLY ICONS */}
                <div className="mb-1">{getIcon(day.icon, 18)}</div>
                <span className="text-sm font-bold">{day.temp}°</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
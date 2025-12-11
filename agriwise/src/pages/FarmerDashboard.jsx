import React, { useState, useEffect } from 'react';
import { Sprout, Sun, PlusCircle, BarChart3, MapPin, CheckCircle2, CloudRain, ArrowLeft, AlertTriangle, Bug, Droplets, TrendingUp, Share2, RefreshCw } from 'lucide-react';
import { TRANSLATIONS, MOCK_MARKET_PRICES } from '../data/mockData';
import LanguageToggle from '../components/LanguageToggle';
import WeatherWidget from '../components/WeatherWidget';
import AdvisoryCard from '../components/AdvisoryCard';
import MarketCard from '../components/MarketCard';
import AddFarmForm from '../components/AddFarmForm';

const FarmerDashboard = ({ lang, setLang, setUserRole }) => {
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState('weather'); 
  const [selectedAdvisory, setSelectedAdvisory] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  
  // State to store the AI's response
  const [aiAdvisory, setAiAdvisory] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  // 1. NEW: State for market prices
  const [marketPrices, setMarketPrices] = useState([]); // Initialize empty
  const [loadingMarket, setLoadingMarket] = useState(false);

  const [farms, setFarms] = useState([
    { id: 1, crop: 'Wheat', soil: 'Loamy', date: '2023-11-01', location: 'Rampur Village' }
  ]);

  const getWeatherType = (code) => {
    if (code <= 3) return 'sun';
    if (code >= 45 && code <= 48) return 'cloud';
    if (code >= 51) return 'rain';
    return 'sun';
  };

  // Function to ask Server (Gemini) for advice
  const fetchAIAdvisory = async (weatherData) => {
    try {
      const response = await fetch('http://localhost:5000/api/generate-advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weather: {
            temp: weatherData.temp,
            humidity: weatherData.humidity,
            condition: weatherData.condition
          },
          crop: farms[0]?.crop || "Wheat" 
        })
      });
      
      const data = await response.json();
      if (data && data.title) {
        setAiAdvisory(data);
      }
    } catch (error) {
      console.error("AI Fetch Error:", error);
    }
  };

  // 2. NEW: Function to fetch prices from API
  const fetchMarketPrices = async () => {
    setLoadingMarket(true);
    try {
      const response = await fetch('http://localhost:5000/api/market-prices');
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        setMarketPrices(data);
      } else {
        // Fallback if array is empty
        setMarketPrices(MOCK_MARKET_PRICES);
      }
    } catch (error) {
      console.error("Error fetching market prices:", error);
      // Fallback to mock data if API fails
      setMarketPrices(MOCK_MARKET_PRICES); 
    } finally {
      setLoadingMarket(false);
    }
  };

  // --- FETCH REAL WEATHER & TRIGGER AI ---
  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        setLoadingWeather(true);
        
        const response = await fetch(`http://localhost:5000/api/weather?lat=${lat}&lon=${lon}`);
        const data = await response.json();
        const current = data.current;
        const forecast = data.forecast;

        const mapIcon = (apiIcon) => {
          if (apiIcon.includes('01')) return 'sun';
          if (apiIcon.includes('02') || apiIcon.includes('03') || apiIcon.includes('04') || apiIcon.includes('50')) return 'cloud';
          return 'rain'; 
        };

        const nextDays = forecast.list
          .filter((item) => item.dt_txt.includes("12:00:00"))
          .map((day) => ({
            day: new Date(day.dt * 1000).toLocaleDateString(lang === 'en' ? 'en-US' : 'hi-IN', { weekday: 'short' }),
            icon: mapIcon(day.weather[0].icon),
            temp: Math.round(day.main.temp)
          }));

        const formattedWeather = {
          temp: Math.round(current.main.temp),
          condition: mapIcon(current.weather[0].icon),
          humidity: current.main.humidity,
          windSpeed: Math.round(current.wind.speed * 3.6),
          rainForecast: forecast.list.slice(0, 8).some(i => i.weather[0].main.toLowerCase().includes('rain')),
          weekly: nextDays
        };

        setWeatherData(formattedWeather);
        fetchAIAdvisory(formattedWeather);

      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoadingWeather(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.log("Location denied, using default.");
          fetchWeather(22.9734, 78.6569); 
        }
      );
    } else {
      fetchWeather(22.9734, 78.6569);
    }
  }, [lang]); 

  // 3. NEW: Fetch market prices on load (separate useEffect)
  useEffect(() => {
    fetchMarketPrices();
  }, [lang]);

  const generateAdvisories = () => {
    const advisories = [];
    
    if (aiAdvisory) {
      advisories.push({
        id: 'ai-smart-1',
        type: aiAdvisory.type || 'info', 
        title: aiAdvisory.title,
        why: aiAdvisory.why,
        how: aiAdvisory.how
      });
    }

    // Static Rules
    if (weatherData && weatherData.rainForecast) {
      advisories.push({
        id: 'w-1', type: 'critical',
        title: lang === 'en' ? 'Rain Alert: Postpone Irrigation' : 'बारिश की चेतावनी: सिंचाई टालें',
        why: lang === 'en' ? 'Heavy rain detected in forecast.' : 'पूर्वानुमान में भारी बारिश का पता चला है।',
        how: lang === 'en' ? 'Stop water pumps immediately.' : 'पंप बंद करें और जल निकासी सुनिश्चित करें।'
      });
    } 
    
    // Updated to use marketPrices state instead of MOCK_MARKET_PRICES directly
    const profitableCrop = marketPrices.find(m => m.trend === 'up');
    if (profitableCrop) {
      advisories.push({
        id: 'm-1', type: 'opportunity',
        title: lang === 'en' ? `Sell ${profitableCrop.crop}` : `${profitableCrop.crop} बेचें`,
        why: lang === 'en' ? 'Market demand peaking.' : 'मांग चरम पर है।',
        how: lang === 'en' ? 'Harvest or sell stock now.' : 'स्टॉक बेचने पर विचार करें।'
      });
    }
    return advisories;
  };

  const advisories = generateAdvisories();

  const getTheme = (type) => {
    const styles = {
      critical: { bg: "bg-red-50", text: "text-red-700", border: "border-red-100", icon: <AlertTriangle size={48} className="text-red-600" /> },
      warning: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-100", icon: <Bug size={48} className="text-orange-600" /> },
      info: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-100", icon: <Droplets size={48} className="text-blue-600" /> },
      opportunity: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100", icon: <TrendingUp size={48} className="text-emerald-600" /> },
      important: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-100", icon: <Droplets size={48} className="text-blue-600" /> }
    };
    return styles[type] || styles.info;
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-28 font-sans">
      <header className="bg-gradient-to-r from-green-700 to-emerald-600 text-white px-5 py-4 sticky top-0 z-30 shadow-lg">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <h1 className="text-lg font-bold flex items-center gap-2 tracking-tight">
            <Sprout size={20} className="text-green-200" /> {t.appTitle}
          </h1>
          <LanguageToggle lang={lang} setLang={setLang} />
        </div>
      </header>

      <div className="p-5 max-w-md mx-auto">
        
        {/* --- WEATHER TAB --- */}
        {activeTab === 'weather' && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{t.weather}</h2>
                {loadingWeather && <RefreshCw className="animate-spin text-green-600" size={20} />}
            </div>
            
            {loadingWeather ? (
                <div className="h-64 bg-gray-200 rounded-3xl animate-pulse flex items-center justify-center text-gray-400">
                    Loading Forecast...
                </div>
             ) : (
                <WeatherWidget weather={weatherData} lang={lang} />
             )}

             <div className="mt-6 bg-blue-50 p-4 rounded-2xl border border-blue-100 text-sm text-blue-900 leading-relaxed">
                <p className="font-medium">Live Insight:</p>
                <p className="opacity-80 mt-1">
                  {weatherData?.rainForecast 
                    ? (lang === 'en' ? "Rain expected. Avoid spraying chemicals today." : "बारिश की संभावना है। आज रसायनों का छिड़काव न करें।")
                    : (lang === 'en' ? "Weather is clear. Good day for harvesting." : "मौसम साफ है। कटाई के लिए अच्छा दिन है।")
                  }
                </p>
             </div>
          </div>
        )}

        {/* --- FIELDS TAB --- */}
        {activeTab === 'fields' && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-bold text-gray-800">{t.tabFields}</h2>
            <div className="space-y-4">
              {farms.map((farm) => (
                <div key={farm.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group hover:border-green-300 transition-colors">
                  <div>
                    <h4 className="font-bold text-xl text-gray-800 mb-1">{farm.crop}</h4>
                    <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      {farm.soil} • {farm.date}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      <MapPin size={12} />
                      {farm.location || "No Location Set"}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all shadow-sm">
                    <Sprout size={24} />
                  </div>
                </div>
              ))}
            </div>
            <AddFarmForm lang={lang} onAdd={(newFarm) => { setFarms([...farms, newFarm]); setActiveTab('home'); }} />
          </div>
        )}

        {/* --- ADVISORIES TAB (HOME) --- */}
        {activeTab === 'home' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {!selectedAdvisory ? (
              <>
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 leading-tight">{t.welcome}</h2>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                      {new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'hi-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">{t.tabHome}</h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">{advisories.length} New</span>
                </div>
                
                {/* LIST OF ADVISORIES */}
                {advisories.length > 0 ? (
                  advisories.map((adv) => (
                    <AdvisoryCard 
                      key={adv.id} 
                      {...adv} 
                      lang={lang} 
                      onClick={() => setSelectedAdvisory(adv)} 
                    />
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-300">
                    <CheckCircle2 className="mx-auto text-green-500 mb-3 opacity-80" size={48} />
                    <p className="text-gray-500 font-medium">{t.advisoryEmpty}</p>
                  </div>
                )}
              </>
            ) : (
              // DETAIL VIEW OF ONE ADVISORY
              <div className="bg-white min-h-[70vh] rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <button 
                    onClick={() => setSelectedAdvisory(null)}
                    className="flex items-center gap-2 text-gray-600 font-bold hover:bg-gray-200 px-3 py-2 rounded-xl transition-colors"
                  >
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Share2 size={18} />
                  </button>
                </div>

                <div className="p-8">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${getTheme(selectedAdvisory.type).bg}`}>
                    {getTheme(selectedAdvisory.type).icon}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 leading-snug">
                    {selectedAdvisory.title}
                  </h2>

                  <div className="space-y-6">
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                      <span className="text-xs font-bold uppercase text-gray-400 tracking-wider block mb-2">SITUATION (WHY)</span>
                      <p className="text-lg text-gray-700 leading-relaxed">
                        {selectedAdvisory.why}
                      </p>
                    </div>

                    <div className={`p-5 rounded-2xl border ${getTheme(selectedAdvisory.type).bg} ${getTheme(selectedAdvisory.type).border}`}>
                      <span className={`text-xs font-bold uppercase tracking-wider block mb-2 ${getTheme(selectedAdvisory.type).text}`}>RECOMMENDED ACTION</span>
                      <p className="text-lg font-medium text-gray-900 leading-relaxed flex items-start gap-3">
                        <CheckCircle2 className={`mt-1 shrink-0 ${getTheme(selectedAdvisory.type).text}`} size={20} />
                        {selectedAdvisory.how}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 mt-4 border-t border-gray-50 text-center">
                   <button 
                     onClick={() => setSelectedAdvisory(null)}
                     className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-gray-200 hover:bg-black transition-all"
                   >
                     I Understand
                   </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- 4. NEW: UPDATED MARKET TAB --- */}
        {activeTab === 'market' && (
          <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{t.marketUpdate}</h2>
                <button 
                  onClick={fetchMarketPrices} 
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <RefreshCw size={18} className={`${loadingMarket ? 'animate-spin' : ''} text-gray-600`} />
                </button>
            </div>

            {loadingMarket ? (
                <div className="text-center py-10 text-gray-400 font-medium">Updating Live Prices...</div>
            ) : (
                marketPrices.map((item, idx) => <MarketCard key={idx} item={item} lang={lang} />)
            )}
            
            <div className="mt-6 bg-gradient-to-r from-indigo-50 to-blue-50 p-5 rounded-2xl border border-indigo-100 text-sm text-indigo-900 leading-relaxed shadow-sm">
              <span className="font-bold bg-white text-indigo-600 px-2 py-0.5 rounded text-xs mr-2 border border-indigo-100">INSIGHT</span>
              Prices for Wheat are trending up. If you have stock, consider holding for 3-4 more days for max profit.
            </div>
          </div>
        )}
      </div>

      <nav className="fixed bottom-4 left-4 right-4 bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl flex justify-around py-3 px-2 z-40 max-w-md mx-auto">
        {[
          { id: 'weather', icon: CloudRain, label: t.weather }, 
          { id: 'fields', icon: PlusCircle, label: t.tabFields },
          { id: 'home', icon: Sun, label: t.tabHome }, 
          { id: 'market', icon: BarChart3, label: t.tabMarket }, 
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSelectedAdvisory(null); }}
            className={`flex flex-col items-center gap-1 min-w-[64px] transition-all duration-300 ${activeTab === tab.id ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
          >
            <div className={`p-2 rounded-xl transition-all ${activeTab === tab.id ? 'bg-green-100 text-green-700 shadow-sm' : 'text-gray-500'}`}>
              <tab.icon size={22} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] font-bold ${activeTab === tab.id ? 'text-green-700' : 'text-gray-500'}`}>
              {tab.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default FarmerDashboard;
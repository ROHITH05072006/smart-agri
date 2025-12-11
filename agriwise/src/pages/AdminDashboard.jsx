import React, { useState } from 'react';
import { Settings, User, AlertTriangle, Megaphone } from 'lucide-react';
import { TRANSLATIONS } from '../data/mockData';
import LanguageToggle from '../components/LanguageToggle';

const AdminDashboard = ({ lang, setLang, setUserRole }) => {
const t = TRANSLATIONS[lang];
const [msg, setMsg] = useState('');

const sendBroadcast = () => {
    alert(t.broadcastSent);
    setMsg('');
};

return (
    <div className="min-h-screen bg-gray-50 pb-24">
    <header className="bg-gray-900 text-white p-5 sticky top-0 z-30 shadow-lg">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
        <h1 className="text-lg font-bold flex items-center gap-2">
            <div className="p-1.5 bg-gray-800 rounded-lg"><Settings size={18} /></div>
            {t.adminDashboard}
        </h1>
        <LanguageToggle lang={lang} setLang={setLang} />
        </div>
    </header>

    <div className="p-5 max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
            <User size={16} /> <span className="text-[10px] uppercase font-bold tracking-wider">{t.totalFarmers}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">1,240</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
            <AlertTriangle size={16} /> <span className="text-[10px] uppercase font-bold tracking-wider">{t.activeAlerts}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">3</p>
        </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-md border border-blue-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 relative z-10">
            <Megaphone className="text-blue-500" /> {t.broadcast}
        </h3>
        <textarea 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none mb-4 transition-all"
            rows="3"
            placeholder={lang === 'en' ? "Type alert message here..." : "चेतावनी संदेश यहाँ लिखें..."}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
        ></textarea>
        <button 
            onClick={sendBroadcast}
            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-[0.98]"
        >
            Broadcast to Region
        </button>
        </div>

        <button onClick={() => setUserRole(null)} className="w-full text-gray-400 text-sm font-medium py-4 hover:text-gray-600">
        Log Out
        </button>
    </div>
    </div>
);
};

export default AdminDashboard;
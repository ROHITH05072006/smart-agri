import React from 'react';
import { Sprout, User, Settings } from 'lucide-react';
import { TRANSLATIONS } from '../data/mockData';

const LoginScreen = ({ setUserRole }) => (
<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-600 to-teal-700 p-6 relative overflow-hidden">
    <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center relative z-10">
    <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
        <Sprout className="text-green-600" size={40} />
    </div>
    <h1 className="text-3xl font-extrabold text-gray-800 mb-2 tracking-tight">{TRANSLATIONS.en.appTitle}</h1>
    <p className="text-gray-500 mb-10 font-medium">Digital Advisory Platform</p>
    
    <div className="space-y-4">
        <button onClick={() => setUserRole('farmer')} className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-3">
        <User size={22} /> Farmer Login
        </button>
        <button onClick={() => setUserRole('admin')} className="w-full bg-white border-2 border-green-100 text-green-700 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition-all flex items-center justify-center gap-3">
        <Settings size={22} /> Expert Login
        </button>
    </div>
    </div>
</div>
);

export default LoginScreen;
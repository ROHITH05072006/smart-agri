import React from 'react';
import { AlertTriangle, Bug, Droplets, TrendingUp, ChevronRight } from 'lucide-react';

const AdvisoryCard = ({ type, title, why, how, onClick }) => {
  const styles = {
    critical: { border: "border-red-100", bg: "bg-red-50", iconBg: "bg-red-100", iconColor: "text-red-600" },
    warning: { border: "border-orange-100", bg: "bg-orange-50", iconBg: "bg-orange-100", iconColor: "text-orange-600" },
    info: { border: "border-blue-100", bg: "bg-blue-50", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
    opportunity: { border: "border-emerald-100", bg: "bg-emerald-50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
  };

  const theme = styles[type] || styles.info;
  const icons = {
    critical: <AlertTriangle size={20} />,
    warning: <Bug size={20} />,
    info: <Droplets size={20} />,
    opportunity: <TrendingUp size={20} />,
  };

  return (
    <div 
      onClick={onClick}
      className={`group bg-white rounded-2xl p-5 mb-4 shadow-sm hover:shadow-md transition-all border ${theme.border} relative overflow-hidden cursor-pointer active:scale-[0.98]`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${theme.bg.replace('50', '500')}`}></div>
      <div className="flex items-start gap-4">
        <div className={`mt-1 p-2.5 rounded-xl ${theme.iconBg} ${theme.iconColor} shrink-0`}>
          {icons[type]}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-800 text-lg leading-tight mb-3">{title}</h4>
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 group-hover:bg-white group-hover:border-gray-200 transition-colors">
              <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block mb-1">WHY</span>
              <p className="text-sm text-gray-700 leading-relaxed">{why}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block mb-1">HOW</span>
              <p className="text-sm font-medium text-gray-800 flex items-start gap-2">
                <ChevronRight size={14} className={`mt-1 ${theme.iconColor}`} />
                {how}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisoryCard;
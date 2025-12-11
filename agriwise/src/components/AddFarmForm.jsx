import React, { useState } from 'react';
import { PlusCircle, Crosshair } from 'lucide-react';

const AddFarmForm = ({ onAdd }) => {
  const [crop, setCrop] = useState('Wheat');
  const [soil, setSoil] = useState('Loamy');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState(''); 
  const [isGettingLoc, setIsGettingLoc] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location) {
      alert("Please enter a location");
      return;
    }
    onAdd({ id: Date.now(), crop, soil, date, location });
    
    // Reset Form
    setCrop('Wheat');
    setSoil('Loamy');
    setDate('');
    setLocation('');
  };

  // --- UPDATED GPS FUNCTION ---
  const getGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLoc(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          // Call Free Geocoding API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const data = await response.json();
          
          if (data && data.address) {
             const address = data.address;
             // Try to find the most specific local name
             const village = address.village || address.town || address.hamlet || address.city || address.suburb;
             const state = address.state;
             
             if (village && state) {
                setLocation(`${village}, ${state}`);
             } else {
                setLocation("Location Detected (Name not found)");
             }
          } else {
             setLocation(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
          }

        } catch (error) {
          console.error("Address Error:", error);
          alert("Could not fetch address name.");
        } finally {
          setIsGettingLoc(false);
        }
      },
      (error) => {
        alert("Unable to retrieve your location");
        setIsGettingLoc(false);
      }
    );
  };

  const inputClass = "w-full p-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-700 font-medium";

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-20">
      <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center gap-2">
        <PlusCircle className="text-green-600" size={20} />
        Add New Farm
      </h3>
      
      <div className="space-y-5">
        
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
            Farm Location
          </label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Village Name"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={inputClass} 
            />
            <button 
              type="button"
              onClick={getGPS}
              className="bg-green-100 text-green-700 p-3.5 rounded-xl hover:bg-green-200 transition-colors min-w-[60px] flex justify-center items-center"
              title="Detect Location"
            >
              {isGettingLoc ? (
                <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Crosshair size={24} />
              )}
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-1 ml-1">
            {isGettingLoc 
              ? "Finding exact village..." 
              : "Type name or click target to detect"}
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Select Crop</label>
          <select value={crop} onChange={(e) => setCrop(e.target.value)} className={inputClass}>
            <option value="Wheat">Wheat</option>
            <option value="Rice">Rice</option>
            <option value="Corn">Corn</option>
            <option value="Cotton">Cotton</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Soil Type</label>
          <select value={soil} onChange={(e) => setSoil(e.target.value)} className={inputClass}>
            <option value="Loamy">Loamy</option>
            <option value="Clay">Clay</option>
            <option value="Sandy">Sandy</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Sowing Date</label>
          <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
        </div>

        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white font-bold py-4 rounded-xl mt-4 transition-all shadow-lg shadow-green-200">
          Add Farm
        </button>
      </div>
    </form>
  );
};

export default AddFarmForm;
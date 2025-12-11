export const TRANSLATIONS = {
  en: {
    appTitle: "AgriWise",
    welcome: "Welcome back",
    tabHome: "Advisories",
    tabFields: "Fields",
    tabMarket: "Market",
    tabAdmin: "Admin",
    weather: "Farm Weather",
    forecastLabel: "7-Day Forecast",
    addField: "Register New Field",
    crop: "Select Crop",
    soil: "Soil Type",
    sowingDate: "Sowing Date",
    submit: "Save Field Record",
    why: "Why is this needed?",
    how: "Recommended Action",
    advisoryEmpty: "No urgent actions required today.",
    marketUpdate: "Mandi Prices",
    adminDashboard: "Expert Console",
    broadcast: "Broadcast Alert",
    totalFarmers: "Farmers",
    activeAlerts: "Active Alerts",
    broadcastSent: "Advisory Broadcasted Successfully!",
    langName: "Hindi"
  },
  hi: {
    appTitle: "कृषि सलाह",
    welcome: "नमस्ते",
    tabHome: "सलाह",
    tabFields: "खेत",
    tabMarket: "बाज़ार",
    tabAdmin: "एडमिन",
    weather: "खेत का मौसम",
    forecastLabel: "7 दिनों का पूर्वानुमान",
    addField: "नया खेत जोड़ें",
    crop: "फसल चुनें",
    soil: "मिट्टी का प्रकार",
    sowingDate: "बुवाई की तारीख",
    submit: "सहेजें",
    why: "इसकी आवश्यकता क्यों है?",
    how: "सुझाव / उपाय",
    advisoryEmpty: "आज कोई तत्काल कार्य नहीं है।",
    marketUpdate: "मंडी भाव",
    adminDashboard: "विशेषज्ञ कंसोल",
    broadcast: "संदेश भेजें",
    totalFarmers: "कुल किसान",
    activeAlerts: "सक्रिय चेतावनी",
    broadcastSent: "संदेश सफलतापूर्वक भेजा गया!",
    langName: "telugu"
  },
  te: {
    appTitle: "అగ్రివైజ్",
    welcome: "స్వాగతం",
    tabHome: "సలహాలు",
    tabFields: "పొలాలు",
    tabMarket: "మార్కెట్",
    tabAdmin: "అడ్మిన్",
    weather: "పొలం వాతావరణం",
    forecastLabel: "7 రోజుల అంచనా",
    addField: "కొత్త పొలాన్ని నమోదు చేయండి",
    crop: "పంటను ఎంచుకోండి",
    soil: "నేల రకం",
    sowingDate: "విత్తిన తేదీ",
    submit: "సేవ్ చేయండి",
    why: "ఇది ఎందుకు అవసరం?",
    how: "సూచించిన చర్య",
    advisoryEmpty: "ఈ రోజు ఎటువంటి అత్యవసర చర్యలు అవసరం లేదు.",
    marketUpdate: "మండి ధరలు",
    adminDashboard: "ఎక్స్‌పర్ట్ కన్సోల్",
    broadcast: "అలర్ట్ పంపండి",
    totalFarmers: "రైతులు",
    activeAlerts: "యాక్టివ్ అలర్ట్స్",
    broadcastSent: "సలహా విజయవంతంగా పంపబడింది!",
    langName: "English"
  }
};

export const MOCK_WEATHER = {
  // Current Day Data (Keep this for backward compatibility)
  temp: 28,
  condition: 'Cloudy',
  humidity: 75,
  windSpeed: 12,
  rainForecast: true,
  
  // New 7-Day Forecast Data
  weekly: [
    { day: 'Tue', temp: 29, icon: 'sun' },
    { day: 'Wed', temp: 27, icon: 'cloud' },
    { day: 'Thu', temp: 24, icon: 'rain' },
    { day: 'Fri', temp: 25, icon: 'rain' },
    { day: 'Sat', temp: 28, icon: 'cloud' },
    { day: 'Sun', temp: 30, icon: 'sun' },
    { day: 'Mon', temp: 31, icon: 'sun' },
  ]
};

export const MOCK_MARKET_PRICES = [
  { crop: 'Wheat', price: 2150, trend: 'up', prediction: 'stable' },
  { crop: 'Rice', price: 1950, trend: 'down', prediction: 'falling' },
  { crop: 'Corn', price: 1800, trend: 'stable', prediction: 'rising' },
];
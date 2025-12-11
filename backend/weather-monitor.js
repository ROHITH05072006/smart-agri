const axios = require('axios');
const admin = require('firebase-admin'); // For sending notifications
const cron = require('node-cron');

// 1. Initialize Firebase Admin (Download serviceAccountKey.json from Firebase Console)
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Mock Database of Users (In reality, fetch this from MongoDB/SQL)
const users = [
  { id: 1, fcmToken: "DEVICE_TOKEN_1", location: { lat: 16.5062, lon: 80.6480 }, lang: 'te' }, // Vijayawada
  { id: 2, fcmToken: "DEVICE_TOKEN_2", location: { lat: 28.7041, lon: 77.1025 }, lang: 'hi' }  // Delhi
];

const WEATHER_API_KEY = "YOUR_OPENWEATHER_API_KEY";

// 2. The Logic Function
async function checkWeatherAndNotify() {
  console.log("Checking weather for all users...");

  for (const user of users) {
    try {
      // Fetch Forecast for User's Location
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${user.location.lat}&lon=${user.location.lon}&appid=${WEATHER_API_KEY}&units=metric`;
      const response = await axios.get(url);
      const forecast = response.data.list[0]; // Get immediate next forecast

      // --- RULE 1: RAIN ALERT ---
      if (forecast.weather[0].main.toLowerCase().includes('rain')) {
        const title = user.lang === 'te' ? "వర్ష సూచన" : "बारिश की चेतावनी";
        const body = user.lang === 'te' ? "భారీ వర్షం పడే అవకాశం ఉంది. నీటిపారుదల ఆపండి." : "भारी बारिश की संभावना है। सिंचाई रोक दें।";
        
        await sendNotification(user.fcmToken, title, body, "critical");
      }

      // --- RULE 2: HEATWAVE ---
      else if (forecast.main.temp > 40) {
        const title = user.lang === 'te' ? "వడగాల్పుల హెచ్చరిక" : "लू की चेतावनी";
        const body = user.lang === 'te' ? "అధిక ఉష్ణోగ్రతలు నమోదు కావచ్చు. జాగ్రత్త వహించండి." : "तापमान बहुत अधिक है। अपनी फसलों को बचाएं।";
        
        await sendNotification(user.fcmToken, title, body, "warning");
      }

    } catch (error) {
      console.error(`Error processing user ${user.id}:`, error.message);
    }
  }
}

// 3. Helper to send Push Notification
async function sendNotification(token, title, body, type) {
  const message = {
    notification: { title, body },
    data: { type }, // "critical", "warning", etc.
    token: token
  };

  try {
    await admin.messaging().send(message);
    console.log(`Sent alert to token: ${token.substring(0, 10)}...`);
  } catch (err) {
    console.error("FCM Error:", err);
  }
}

// 4. Schedule it to run every 4 hours
// "0 */4 * * *" means "At minute 0 past every 4th hour"
cron.schedule('0 */4 * * *', () => {
  checkWeatherAndNotify();
});

// Run immediately for testing
checkWeatherAndNotify();
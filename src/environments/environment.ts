export const environment = {
  production: false,

  // 🔥 Firebase config
  firebase: {
    apiKey: "AIzaSyDa-EKpodRB09RK2cPCDKRBW5PzwiQx7b4",
    authDomain: "smartspend-eb53c.firebaseapp.com",
    projectId: "smartspend-eb53c",
    storageBucket: "smartspend-eb53c.firebasestorage.app",
    messagingSenderId: "94273996683",
    appId: "1:94273996683:web:0526e6ed951803980cd18e"
  },

  // ⚠️ KEEP ONLY IF NEEDED (optional now)
  apiUrl:
    window.location.hostname === 'localhost'
      ? 'http://localhost:5000/api'
      : 'https://expense-tracker-api-app.vercel.app/api',

  trackingApiUrl: 'https://visitor-tracking-api.vercel.app/api/visit',
} as const;
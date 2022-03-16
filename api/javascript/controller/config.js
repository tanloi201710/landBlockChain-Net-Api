
const { initializeApp } = require("firebase/app")
const firebaseConfig = {
  apiKey: "AIzaSyAzN538O3htCPmet1s4PmYvq5v_rVsxViY",
  authDomain: "manage-land-blockchain.firebaseapp.com",
  projectId: "manage-land-blockchain",
  storageBucket: "manage-land-blockchain.appspot.com",
  messagingSenderId: "23686906618",
  appId: "1:23686906618:web:9414105782b9fbf05d3f43",
  measurementId: "G-Y27127TGF2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


module.exports = app;

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyA9LQgiwcnyNOGzWRJphL3tQ1w2QMQUWVA",
    authDomain: "pomozoo-39e1f.firebaseapp.com",
    projectId: "pomozoo-39e1f",
    databaseURL: "https://pomozoo-39e1f-default-rtdb.asia-southeast1.firebasedatabase.app/",
    storageBucket: "pomozoo-39e1f.appspot.com",
    messagingSenderId: "723569216297",
    appId: "1:723569216297:web:4c3ad72d3b508c95fa4538",
    measurementId: "G-1NFG06FY21"
  };

const firebaseApp = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

export default firebaseApp;
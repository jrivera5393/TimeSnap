import Rebase from "re-base";
import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyB4wNfgIIQ8bTGOSAJ12yl7u_L-WQ30T60",
  authDomain: "catch-of-the-day-jan-4c41f.firebaseapp.com",
  databaseURL: "https://catch-of-the-day-jan-4c41f.firebaseio.com"
});

const base = Rebase.createClass(firebaseApp.database());

export { firebaseApp };

export default base;

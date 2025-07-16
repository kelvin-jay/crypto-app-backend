import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

const firebaseConfig = {
  apiKey: "AIzaSyCluxIpI7qrnm5gbe86OqD2n-QSwYopgVE",
  authDomain: "crypto-app-9d98f.firebaseapp.com",
  databaseURL: "https://crypto-app-9d98f-default-rtdb.firebaseio.com",
  projectId: "crypto-app-9d98f",
  storageBucket: "crypto-app-9d98f.firebasestorage.app",
  messagingSenderId: "600024425493",
  appId: "1:600024425493:web:b1609e8019928cd746da1c",
  measurementId: "G-8PW8SJ4CY9"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();
const provider = new firebase.auth.GoogleAuthProvider();

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("User is signed in");
  } else {
    console.log("User is signed out");
  }
});

const login = async (email, password) => {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

const signup = async (email, password) => {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

const logout = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    throw error;
  }
};

const googleSignIn = async () => {
  try {
    const result = await auth.signInWithPopup(provider);
    return result.user;
  } catch (error) {
    throw error;
  }
};
try {
  // Firebase authentication code
} catch (error) {
  console.error('Error:', error.code, error.message);
  // Handle specific error codes, such as 'auth/user-not-found' or 'auth/wrong-password'
}


export { db, auth, login, signup, logout, googleSignIn };

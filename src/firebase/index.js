// Import the required Firebase SDK functions
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc 
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Firebase Authentication
const db = getFirestore(app); // Initialize Firestore

/**
 * Google Sign-In function
 * Handles user sign-in with Google and initializes Firestore access testing.
 */
const googleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  try {
    // Trigger Google sign-in popup
    const result = await signInWithPopup(auth, provider);
    const user = result.user; // Get signed-in user information

    console.log("User signed in:", user);

    // Optional: Test Firestore write access
    await testFirestoreAccess(user);

    return user;
  } catch (error) {
    console.error("Error during Google Sign-In:", error.message);
    console.error("Error Code:", error.code);
    console.error("Email in Error (if available):", error.customData?.email);
    throw error;
  }
};

/**
 * Test Firestore access by writing a test document.
 */
const testFirestoreAccess = async (user) => {
  try {
    const testDocRef = doc(db, "testCollection", "testDoc");
    await setDoc(testDocRef, { testField: "testValue", userId: user.uid });
    console.log("Firestore access verified successfully.");
  } catch (error) {
    console.error("Error testing Firestore access:", error.message);
    throw error;
  }
};

/**
 * Monitor authentication state changes.
 * Logs whether a user is signed in or signed out.
 */
const monitorAuthState = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is signed in:", user);
    } else {
      console.log("No user is signed in.");
    }
  });
};

/**
 * Fetch user data from Firestore.
 * Retrieves the data for a specific user ID.
 * 
 * @param {string} userId - The ID of the user to retrieve data for.
 */
const getUserData = async (userId) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("User data retrieved successfully:", docSnap.data());
      return docSnap.data();
    } else {
      console.warn("No user data found for user ID:", userId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data from Firestore:", error.message);
    throw error;
  }
};

/**
 * Debugging helper: Enable detailed Firebase logs in the browser console.
 */
import { setLogLevel } from "firebase/app";
setLogLevel("debug");

// Export Firebase services and utility functions
export { auth, db, googleSignIn, monitorAuthState, getUserData };

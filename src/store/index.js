import { createStore } from 'vuex';
import router from '../router';
import { auth, googleSignIn } from '../firebase'; // Import googleSignIn function
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../firebase'; // Make sure to import the Firestore db instance

export default createStore({
  state: {
    user: null,
    userName: null, // Store user's name
  },
  getters: {
    getUserName(state) {
      return state.userName; // Getter to access the user's name
    },
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    CLEAR_USER(state) {
      state.user = null;
      state.userName = null; // Clear user's name
    },
    SET_USER_NAME(state, name) {
      state.userName = name; // Mutation to set user's name
    },
  },
  actions: {
    async login({ commit }, details) {
      const { email, password } = details;

      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.log('Error code:', error.code);
        console.log('Error message:', error.message);

        if (error.code === 'auth/user-not-found') {
          alert("User not found");
        } else if (error.code === 'auth/wrong-password') {
          alert("Wrong password");
        } else if (error.code === 'auth/invalid-credential') {
          alert("Invalid credentials");
        } else {
          alert(`Something went wrong: ${error.message}`);
        }
        return;
      }

      // Fetch user details from Firestore after login
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        commit('SET_USER_NAME', userData.name); // Set user's name from Firestore
      }

      commit('SET_USER', auth.currentUser);
      router.push('/');
    },
    
    async googleLogin({ commit }) {
      try {
        const user = await googleSignIn();
        commit('SET_USER', user);
        
        // Fetch user details from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          commit('SET_USER_NAME', userData.name); // Set user's name from Firestore
        }
        
        router.push('/');
      } catch (error) {
        console.error("Google Sign-In error: ", error);
        alert(`Something went wrong: ${error.message}`);
      }
    },

    async register({ commit }, details) {
      const { email, password, name } = details;

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Store additional user information in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          name: name, // Store the user's name
          email: email,
        });

        commit('SET_USER_NAME', name); // Set user's name in the store
      } catch (error) {
        console.log(error);
        switch (error.code) {
          case 'auth/email-already-in-use':
            alert("Email already in use");
            break;
          case 'auth/invalid-email':
            alert("Invalid email");
            break;
          case 'auth/operation-not-allowed':
            alert("Operation not allowed");
            break;
          case 'auth/weak-password':
            alert("Weak Password");
            break;
          default:
            alert(`Something went wrong: ${error.message}`);
        }
        return;
      }

      commit('SET_USER', auth.currentUser);
      router.push('/');
    },
    
    async logout({ commit }) {
      await signOut(auth);
      commit('CLEAR_USER');
      router.push('/login');
    },
    
    fetchUser({ commit }) {
      auth.onAuthStateChanged(async user => {
        if (user === null) {
          commit('CLEAR_USER');
        } else {
          commit('SET_USER', user);
          
          // Fetch user details from Firestore after login
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            commit('SET_USER_NAME', userData.name); // Set user's name from Firestore
          }

          if (router.isReady() && router.currentRoute.value.path === '/login') {
            router.push('/');
          }
        }
      });
    },
  },
});

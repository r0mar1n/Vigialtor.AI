<template>
  <div class="profile-content" :class="selectedTheme">
    <div class="current-page">
      <h1>Nest Overview</h1>
    </div>
    <div class="profile-details">
      <!-- User Info Section -->
      <div class="user-info">
        <img src="@/assets/user-placeholder.png" alt="User Profile" class="profile-img" />
        <p class="user-text">Username: {{ username || "Loading..." }}</p>
        <p class="user-text">Email: {{ email || "Loading..." }}</p>
        <button class="change-password-btn" @click="changePassword">Change Password</button>
        <button class="delete-account-btn" @click="deleteAccount">Delete Account</button>
      </div>

      <!-- Settings Section -->
      <div class="settings">
        <div class="setting-item">
          <label for="phishing-alerts">Phishing Alerts</label>
          <input type="checkbox" id="phishing-alerts" v-model="phishingAlerts" />
        </div>
        <div class="setting-item">
          <label for="email-notifications">Email Notifications</label>
          <input type="checkbox" id="email-notifications" v-model="emailNotifications" />
        </div>
        <div class="setting-item">
          <label for="theme">Theme</label>
          <select id="theme" v-model="tempTheme">
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
        <div class="settings-container">
          <button id="view-log-btn" @click="viewLog">View Log</button>
          <button id="save-settings-btn" @click="saveSettings">Save Settings</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default {
  name: "ProfileView",
  data() {
    return {
      phishingAlerts: true,
      emailNotifications: true,
      selectedTheme: "dark",
      tempTheme: "dark",
      username: "", // User's name
      email: "", // User's email
    };
  },
  mounted() {
    this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          console.error("No user is currently signed in.");
          return;
        }

        this.email = user.email; // Set email from authenticated user

        const userDoc = doc(db, "users", user.uid); // Adjust Firestore collection name if needed
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          this.username = userData.name || "Unknown User"; // Set username
        } else {
          console.warn("User document does not exist.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    changePassword() {
      console.log("Change Password functionality triggered.");
    },
    viewLog() {
      console.log("Viewing activity log...");
    },
    saveSettings() {
      this.selectedTheme = this.tempTheme; // Apply the theme
      console.log("Settings saved:", {
        phishingAlerts: this.phishingAlerts,
        emailNotifications: this.emailNotifications,
        selectedTheme: this.selectedTheme,
      });
    },
    async deleteAccount() {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          console.error("No user is currently signed in.");
          return;
        }

        // Delete user data from Firestore
        await deleteDoc(doc(db, "users", user.uid));

        // Delete user account
        await user.delete();

        console.log("Account deleted successfully.");
        this.$router.push({ name: "LoginView" });
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    },
  },
};
</script>

<style scoped>
/* General Theme Styles */
html, body {
  margin: 0;
  padding: 0;
  background: black; /* Use a clean black background */
  color: #fff;
  height: 100%;
  width: 100%;
}

.profile-content {
  width: 100%;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.profile-content.dark {
  background: linear-gradient(135deg, #1a1a1a, #333333);
}
.profile-content.light {
  background: linear-gradient(135deg, #f5f5f5, #dddddd);
  color: #333;
}

/* Header Styles */
.current-page {
  background-color: #000;
  padding: 10px;
  border-radius: 8px;
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
}
.current-page h1 {
  color: #ffffff;
  font-family: "Jersey 10", sans-serif;
}

/* Profile Details */
.profile-details {
  display: flex;
  gap: 20px;
  width: 100%;
}
.user-info, .settings {
  background-color: #000;
  color: #fff;
  padding: 20px;
  border-radius: 8px;
  flex: 1;
  text-align: center;
}
.profile-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
}
.user-text {
  margin: 5px 0;
}

/* Buttons */
button {
  background-color: #ff00ff;
  border: none;
  border-radius: 4px;
  padding: 10px;
  color: #fff;
  font-size: 16px;
  margin-top: 10px;
  cursor: pointer;
}
button:hover {
  opacity: 0.9;
}

/* Dropdown */
select {
  padding: 10px;
  background-color: #222;
  color: #ccc;
  border: 1px solid #888;
  border-radius: 4px;
}
select:focus {
  outline: none;
  box-shadow: 0 0 5px #ff00ff;
}
</style>

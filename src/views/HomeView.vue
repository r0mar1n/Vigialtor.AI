<template>
  <div class="home-content">
    <div class="current-page">
      <h1>Dashboard</h1>
    </div>
    <div class="dashboard-cards">
      <!-- Hoo's on Watch Card -->
      <div class="card">
        <h2>Hoo's on Watch</h2>
        <img src="@/assets/image-removebg-preview.png" alt="Hoo's on Watch Icon" class="card-image" />
        <p>{{ scannedSitesCount }} sites scanned</p>
      </div>

      <!-- Fowl Play Detected Card -->
      <div class="card">
        <h2>Fowl Play Detected</h2>
        <img src="@/assets/image-removebg-preview.png" alt="Phishing Sites Icon" class="card-image" />
        <p>{{ phishingSitesDetected }} phishing sites detected</p>
      </div>

      <!-- Owlfense Shield Card -->
      <div class="card">
        <h2>Owlfense Shield</h2>
        <img src="@/assets/image-removebg-preview.png" alt="Blocked Sites Icon" class="card-image" />
        <p>{{ blockedSitesCount }} sites blocked</p>
      </div>

      <!-- Visited Websites Card -->
      <div class="card">
        <h2>Visited Websites</h2>
        <img src="@/assets/image-removebg-preview.png" alt="Visited Websites Icon" class="card-image" />
        <p>{{ scannedSitesCount }} sites visited</p>
        <ul v-if="visitedUrls.length">
          <li v-for="(url, index) in visitedUrls" :key="index">{{ url }}</li>
        </ul>
        <p v-else>No websites visited yet.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  data() {
    return {
      visitedUrls: [], // Store visited URLs
      phishingSitesDetected: 0, // Placeholder for phishing sites count
      blockedSitesCount: 0, // Placeholder for blocked sites count
    };
  },
  computed: {
    scannedSitesCount() {
      return this.visitedUrls.length; // Return the number of scanned sites
    },
  },
  methods: {
    loadVisitedUrls() {
      // Check if the visited URLs exist in localStorage
      const storedUrls = localStorage.getItem('visitedUrls');
      if (storedUrls) {
        this.visitedUrls = JSON.parse(storedUrls); // Load visited URLs from localStorage
      } else {
        console.log("No visited URLs found in localStorage.");
      }
    },
    updateVisitedUrls(url) {
      // Avoid adding duplicate URLs
      if (!this.visitedUrls.includes(url)) {
        this.visitedUrls.push(url);
        // Save updated visited URLs in localStorage
        localStorage.setItem('visitedUrls', JSON.stringify(this.visitedUrls));
        console.log("Visited URL saved:", url); // Log for debugging
      }
    },
  },
  mounted() {
    this.loadVisitedUrls(); // Load visited URLs when the component mounts
  },
};
</script>

<style scoped>
.home-content {
  padding: 20px;
  flex-grow: 1;
  background: linear-gradient(135deg, #1a1a1a, #333333);
  min-height: 100vh;
}

.current-page {
  background-color: #000000;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.current-page h1 {
  color: #ffffff;
  font-weight: normal;
  font-family: "Jersey 10", sans-serif;
  margin-left: 30px;
}

.dashboard-cards {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.card {
  background-color: #000000;
  color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  flex: 1;
  min-width: 200px;
  max-width: calc(33.33% - 20px);
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.card h2 {
  color: #ffffff;
  font-family: "Jersey 10", sans-serif;
  font-weight: normal;
  font-size: 30px;
}

.card-image {
  margin: 10px 0;
  width: 100%;
  height: auto;
  max-width: 200px;
  object-fit: contain;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

li {
  color: #fff;
  font-size: 14px;
}
</style>

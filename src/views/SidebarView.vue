<template>
    <div class="sidebar">
      <div class="logo">
        <img src="@/assets/logo.png" alt="Logo" height="250px" width="250px" />
      </div>
      <nav>
        <ul>
          <li>
            <router-link to="/">Dashboard</router-link>
          </li>
          <li>
            <router-link to="/profile">Profile</router-link>
          </li>
          <li>
            <router-link to="/blocklist">Blocklist</router-link>
          </li>
          <li>
            <button @click="$store.dispatch('logout')">Logout</button>
          </li>
        </ul>
      </nav>
    </div>
  </template>
  

  
  
  <script>
  export default {
    name: "SidebarView",
  };
  </script>
  
  <style scoped>
  .sidebar {
    width: 250px;
    background-color: #000000; /* Changed to pitch black */
    color: #ffffff;
    height: 100vh;
    padding: 20px;
  }
  
  .logo {
    height: 250px;
    width: 250px;
    margin-bottom: 20px;
  }
  
  nav ul {
    list-style: none;
    padding: 0;
  }
  
  nav ul li {
    margin: 15px 0;
  }
  
  nav ul li a,
  nav ul li button {
    color: #ffffff;
    font-family: 'Jersey 10', sans-serif;
    font-size: 30px; /* Keep the increased font size */
    font-weight: normal; /* Changed from bold to normal */
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }
  
  nav ul li button:hover,
  nav ul li a:hover {
    text-decoration: underline;
  }
  </style>
  
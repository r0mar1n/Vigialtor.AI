<!-- src/layouts/AuthenticatedLayout.vue -->
<template>
    <div class="layout">
      <SidebarView />
      <router-view />
    </div>
  </template>
  
  <script>
  import SidebarView from '../views/SidebarView.vue';
  
  export default {
    components: {
      SidebarView
    }
  };
  </script>
  
  <style scoped>
  .layout {
    display: flex;
  }
  </style>
  
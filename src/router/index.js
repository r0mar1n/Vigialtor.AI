import { createRouter, createWebHistory } from 'vue-router';
import AuthenticatedLayout from '../layouts/AuthenticatedLayout.vue';
import HomeView from '../views/HomeView.vue';
import ProfileView from '../views/ProfileView.vue'; // Import ProfileView
import ForgotPassword from '../views/ForgotPassword.vue';
import { auth } from '../firebase';

const routes = [
  {
    path: '/',
    component: AuthenticatedLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView,
      },
      {
        path: 'profile',
        name: 'profile',
        component: ProfileView, // Define ProfileView route
      },
      {
        path: 'blocklist',
        name: 'blocklist',
        component: () => import('../views/BlocklistView.vue'),
      },
      {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: ForgotPassword,
      },
    ],
  },
  {
    path: '/login',
    name: 'LoginView',
    component: () => import('../views/LoginView.vue'), // Ensure this route is accessible
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  // Redirect authenticated users away from login page
  if (to.path === '/login' && auth.currentUser) {
    return next('/'); // Redirect to home if already logged in
  }

  // Redirect unauthenticated users to login if the route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (auth.currentUser) {
      next(); // User is authenticated, proceed
    } else {
      next('/login'); // Not authenticated, redirect to login
    }
  } else {
    next(); // Proceed for routes not requiring authentication
  }
});

export default router;

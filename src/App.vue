<template>
  <div id="app">
    <nav v-if="isAuthenticated && !isLoginPage" class="main-nav">
      <div class="nav-container container">
        <div class="nav-brand">
          <span class="brand-icon">❤️</span>
          <span class="brand-text">Together</span>
        </div>
        
        <div class="nav-links">
          <router-link to="/" class="nav-link">
            <span class="nav-icon">🏠</span>
            <span>Home</span>
          </router-link>
          <router-link to="/events" class="nav-link">
            <span class="nav-icon">📅</span>
            <span>Events</span>
          </router-link>
          <router-link to="/settings" class="nav-link">
            <span class="nav-icon">⚙️</span>
            <span>Settings</span>
          </router-link>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from './composables/useAuth';

const router = useRouter();
const route = useRoute();
const { isAuthenticated } = useAuth();

const isLoginPage = computed(() => route.path === '/login');
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: radial-gradient(circle at top right, #1e1e24 0%, #121212 100%);
}

.main-nav {
  position: fixed;
  bottom: var(--spacing-lg);
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 500px; /* Pill shape max width */
  z-index: 100;
  border-radius: var(--radius-full);
  padding: var(--spacing-xs);
  
  /* Glassmorphism */
  background: rgba(30, 30, 36, 0.8);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--spacing-sm);
  height: 60px;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
}

/* Hide Brand Text on Mobile to save space for pill nav */
.brand-text {
  display: none; 
}

.brand-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 0 10px rgba(255, 0, 85, 0.5));
}

.nav-links {
  display: flex;
  gap: var(--spacing-xs);
  width: 100%;
  justify-content: space-around;
}

.nav-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xs);
  border-radius: var(--radius-full);
  text-decoration: none;
  color: var(--color-text-muted);
  font-weight: 500;
  transition: all var(--transition-fast);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
  width: 60px;
  height: 60px;
}

.nav-link:hover {
  color: white;
}

.nav-link.router-link-active {
  color: var(--color-primary);
  background: transparent;
}

.nav-icon {
  font-size: 1.4rem;
  margin-bottom: 2px;
  transition: var(--transition-normal);
}

.nav-link.router-link-active .nav-icon {
  transform: translateY(-2px);
  filter: drop-shadow(0 0 8px rgba(0, 242, 234, 0.6));
}

.logout-btn {
  color: var(--color-secondary);
}

.main-content {
  flex: 1;
  padding-bottom: 120px; /* Space for fixed bottom nav */
}

/* Desktop styles */
@media (min-width: 769px) {
  .main-nav {
    top: var(--spacing-md);
    bottom: auto;
    width: 95%;
    max-width: 1200px;
    padding: var(--spacing-xs) var(--spacing-md);
  }
  
  .nav-container {
    padding: 0;
  }

  .nav-links {
    width: auto;
    gap: var(--spacing-sm);
    justify-content: flex-end;
  }
  
  .nav-link {
    flex-direction: row;
    width: auto;
    height: auto;
    padding: var(--spacing-xs) var(--spacing-md);
    gap: var(--spacing-xs);
  }
  
  .nav-icon {
    margin-bottom: 0;
    font-size: 1.2rem;
  }
  
  .brand-text {
    display: block;
    background: var(--gradient-glow);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .main-content {
    padding-bottom: var(--spacing-xl);
    padding-top: 100px;
  }
}
</style>

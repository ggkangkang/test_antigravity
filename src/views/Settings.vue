<template>
  <div class="settings-page">
    <div class="settings-container container">
      <div class="page-header">
        <h1>Settings ⚙️</h1>
      </div>

      <div class="settings-content fade-in">
        <!-- Account Section -->
        <div class="settings-section card-glass">
          <h2>Account</h2>
          <div class="user-info">
            <div class="info-row">
              <span class="label">Email</span>
              <span class="value">{{ user?.email }}</span>
            </div>
            <div class="info-row">
              <span class="label">User ID</span>
              <span class="value code">{{ user?.uid.slice(0, 8) }}...</span>
            </div>
          </div>
        </div>

        <!-- App Settings -->
        <div class="settings-section card-glass">
          <h2>App Preferences</h2>
          <div class="setting-item">
            <span class="setting-label">Dark Mode</span>
            <div class="toggle-switch active">
              <div class="toggle-thumb"></div>
            </div>
          </div>
          <p class="setting-hint">Dark mode is currently enforced by the theme.</p>
        </div>

        <!-- Danger Zone -->
        <div class="settings-section danger-zone card-glass">
          <h2>Session</h2>
          <p>Sign out of your account on this device.</p>
          <button @click="handleLogout" class="btn btn-danger">
            <span class="icon">👋</span>
            Sign Out
          </button>
        </div>

        <div class="app-version">
            Version 1.0.0 • Together Forever
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { user, logout } = useAuth();

const handleLogout = async () => {
  try {
    await logout();
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  padding: 0 var(--spacing-md) 100px var(--spacing-md);
  overflow-x: hidden;
}

.settings-container {
  max-width: 600px;
  margin: 0 auto;
  padding-top: var(--spacing-xl);
}

.page-header {
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

.page-header h1 {
  background: var(--gradient-glow);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: white;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.settings-section {
  padding: var(--spacing-lg);
  background: rgba(30, 30, 36, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
}

.settings-section h2 {
  font-size: 1.2rem;
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xs) 0;
}

.label {
  color: var(--color-text-muted);
  font-weight: 500;
}

.value {
  color: var(--color-text);
  font-weight: 600;
}

.value.code {
  font-family: monospace;
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  color: var(--color-primary);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xs);
}

.setting-hint {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  font-style: italic;
}

/* Toggle Switch Mockup */
.toggle-switch {
  width: 50px;
  height: 28px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  position: relative;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.toggle-switch.active {
  background: rgba(0, 242, 234, 0.2);
  border: 1px solid rgba(0, 242, 234, 0.5);
}

.toggle-thumb {
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: all var(--transition-fast);
}

.toggle-switch.active .toggle-thumb {
  transform: translateX(22px);
  background: var(--color-primary);
  box-shadow: 0 0 10px rgba(0, 242, 234, 0.5);
}

.danger-zone {
  border-color: rgba(255, 0, 85, 0.2);
  background: rgba(255, 0, 85, 0.05);
}

.danger-zone h2 {
  color: #ff4757;
  border-color: rgba(255, 0, 85, 0.2);
}

.btn-danger {
  width: 100%;
  margin-top: var(--spacing-md);
  background: rgba(255, 0, 85, 0.1);
  color: #ff4757;
  border: 1px solid rgba(255, 0, 85, 0.3);
  padding: var(--spacing-sm);
  border-radius: var(--radius-full);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
}

.btn-danger:hover {
  background: rgba(255, 0, 85, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 0 15px rgba(255, 0, 85, 0.2);
}

.app-version {
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.8rem;
  margin-top: var(--spacing-lg);
  opacity: 0.5;
}

@media (max-width: 768px) {
  .settings-container {
    padding-top: var(--spacing-lg);
  }
}
</style>

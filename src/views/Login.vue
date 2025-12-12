<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card card-glass fade-in">
        <div class="logo-section">
          <img 
            src="/images/login_illustration.png" 
            alt="Couple sitting together" 
            class="login-illustration fade-in"
          />
          <h1>Keching</h1>
          <p class="subtitle">Track your love story</p>
        </div>

        <div class="login-form">
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          
          <button 
            type="button"
            class="btn btn-primary google-btn"
            @click="handleGoogleLogin"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner"></span>
            <template v-else>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </template>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { loginWithGoogle, error, loading } = useAuth();

const handleGoogleLogin = async () => {
  try {
    await loginWithGoogle();
    
    // Check for saved redirect path
    const redirectPath = sessionStorage.getItem('redirectAfterLogin');
    if (redirectPath) {
      sessionStorage.removeItem('redirectAfterLogin');
      router.push(redirectPath);
    } else {
      router.push('/');
    }
  } catch (err) {
    console.error('Google login error:', err);
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  background: var(--app-background);
}

.login-container {
  width: 100%;
  max-width: 450px;
}

.login-card {
  padding: var(--spacing-2xl);
  background: var(--glass-background);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
}

.logo-section {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.login-illustration {
  width: 200px;
  height: auto;
  border-radius: 20px;
  margin-bottom: var(--spacing-md);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transition: transform 0.3s ease;
}

.login-illustration:hover {
  transform: scale(1.02);
}

.logo-section h1 {
  background: var(--gradient-warm);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-top: var(--spacing-xs);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.error-message {
  padding: var(--spacing-sm);
  background: rgba(255, 0, 64, 0.1);
  border: 1px solid rgba(255, 0, 64, 0.2);
  border-radius: var(--radius-sm);
  color: #d63031;
  font-size: 0.9rem;
}

.google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-size: 1rem;
  font-weight: 600;
  padding: var(--spacing-md);
}

.btn svg {
  width: 20px;
  height: 20px;
}
</style>

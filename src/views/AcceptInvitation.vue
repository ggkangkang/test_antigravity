<template>
  <div class="accept-invitation-page">
    <div class="accept-container container">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state flex-center">
        <div class="spinner"></div>
        <p>Loading invitation...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state card text-center fade-in">
        <div class="error-icon">❌</div>
        <h2>Invitation Error</h2>
        <p>{{ error }}</p>
        <button @click="$router.push('/')" class="btn btn-primary mt-3">
          Go to Home
        </button>
      </div>

      <!-- Invitation Details -->
      <div v-else-if="invitation" class="invitation-card card fade-in">
        <div class="invitation-header">
          <div class="heart-icon pulse">💕</div>
          <h1>You're Invited!</h1>
        </div>

        <div class="invitation-body">
          <p class="invitation-message">
            <strong>{{ invitation.fromUserName }}</strong> has invited you to join your couple profile on Together Forever!
          </p>

          <div class="invitation-details">
            <div class="detail-item">
              <span class="detail-label">From:</span>
              <span class="detail-value">{{ invitation.fromUserName }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">To:</span>
              <span class="detail-value">{{ invitation.toEmail }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Sent:</span>
              <span class="detail-value">{{ formatDate(invitation.createdAt) }}</span>
            </div>
          </div>

          <div class="features-list">
            <h3>What you'll get:</h3>
            <ul>
              <li>✅ Shared couple profile</li>
              <li>✅ Real-time sync across devices</li>
              <li>✅ Track days together</li>
              <li>✅ Manage events and milestones</li>
              <li>✅ Upload photos together</li>
            </ul>
          </div>
        </div>

        <div class="invitation-actions">
          <button 
            @click="handleAccept" 
            class="btn btn-primary"
            :disabled="accepting"
          >
            <span v-if="accepting" class="spinner"></span>
            <span v-else>💕 Accept Invitation</span>
          </button>
          <button 
            @click="handleReject" 
            class="btn btn-secondary"
            :disabled="accepting"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useInvitations } from '../composables/useInvitations';

const route = useRoute();
const router = useRouter();
const { user } = useAuth();
const { getInvitationByCode, acceptInvitation, rejectInvitation, loading } = useInvitations();

const invitation = ref(null);
const error = ref(null);
const accepting = ref(false);

onMounted(async () => {
  const inviteCode = route.params.inviteCode;
  
  if (!inviteCode) {
    error.value = 'Invalid invitation link';
    return;
  }

  try {
    invitation.value = await getInvitationByCode(inviteCode);
  } catch (err) {
    error.value = err.message || 'Failed to load invitation';
  }
});

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = timestamp.toDate();
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const handleAccept = async () => {
  if (!user.value) {
    error.value = 'Please log in to accept this invitation';
    return;
  }

  try {
    accepting.value = true;
    await acceptInvitation(invitation.value.id, user.value.uid);
    
    // Show success message and redirect
    alert('🎉 Invitation accepted! Welcome to your couple profile!');
    router.push('/');
  } catch (err) {
    error.value = err.message || 'Failed to accept invitation';
  } finally {
    accepting.value = false;
  }
};

const handleReject = async () => {
  if (confirm('Are you sure you want to decline this invitation?')) {
    try {
      accepting.value = true;
      await rejectInvitation(invitation.value.id);
      alert('Invitation declined');
      router.push('/');
    } catch (err) {
      error.value = err.message || 'Failed to reject invitation';
    } finally {
      accepting.value = false;
    }
  }
};
</script>

<style scoped>
.accept-invitation-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
}

.accept-container {
  max-width: 600px;
}

.loading-state {
  min-height: 40vh;
  flex-direction: column;
  gap: var(--spacing-md);
  color: var(--color-text-muted);
}

.error-state {
  padding: var(--spacing-2xl);
  background: rgba(30, 30, 36, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 0, 64, 0.2);
  border-radius: var(--radius-lg);
}

.error-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-md);
}

.invitation-card {
  padding: var(--spacing-2xl);
  background: rgba(30, 30, 36, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

.invitation-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.heart-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-md);
  display: inline-block;
  filter: drop-shadow(0 0 20px rgba(255, 0, 85, 0.4));
}

.invitation-body {
  margin-bottom: var(--spacing-xl);
}

.invitation-message {
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: var(--spacing-lg);
  line-height: 1.6;
  color: var(--color-text);
}

.invitation-details {
  background: rgba(0, 0, 0, 0.3);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-xs) 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 500;
  color: var(--color-text-muted);
}

.detail-value {
  color: var(--color-text);
  font-weight: 600;
}

.features-list {
  background: linear-gradient(135deg, rgba(255, 0, 85, 0.1) 0%, rgba(0, 242, 234, 0.05) 100%);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.features-list h3 {
  margin-bottom: var(--spacing-md);
  color: var(--color-primary);
}

.features-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features-list li {
  padding: var(--spacing-xs) 0;
  font-size: 1rem;
  color: var(--color-text-muted);
}

.invitation-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.invitation-actions button {
  width: 100%;
}

@media (max-width: 768px) {
  .invitation-card {
    padding: var(--spacing-lg);
  }
}
</style>

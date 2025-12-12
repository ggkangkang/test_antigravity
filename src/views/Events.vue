<template>
  <div class="events-page">
    <div class="events-container container">
      <div class="page-header">
        <div class="header-content">
          <h1>Our Special Moments 🎉</h1>
          <span v-if="coupleData?.userId2" class="sync-badge">🔄 Live Sync</span>
        </div>
        <button @click="showAddModal = true" class="btn btn-primary">
          + Add Event
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading && events.length === 0" class="loading-state flex-center">
        <div class="spinner"></div>
      </div>

      <!-- No Events -->
      <div v-else-if="events.length === 0" class="no-events card text-center fade-in">
        <div class="empty-icon">📅</div>
        <h3>No events yet</h3>
        <p>Start adding your special moments and milestones!</p>
        <button @click="showAddModal = true" class="btn btn-primary mt-3">
          Add Your First Event
        </button>
      </div>

      <!-- Events List -->
      <div v-else class="events-list fade-in">
        <div 
          v-for="event in sortedEvents" 
          :key="event.id"
          class="event-card card"
        >
          <div class="event-icon">{{ getEventIcon(event.type) }}</div>
          <div class="event-content">
            <h3>{{ event.title }}</h3>
            <p v-if="event.description" class="event-description">
              {{ event.description }}
            </p>
            <div class="event-meta">
              <span class="event-date">{{ formatEventDate(event.date) }}</span>
              <span class="event-countdown">{{ getCountdown(event.date) }}</span>
            </div>
          </div>
          <button 
            @click="handleDeleteEvent(event.id)" 
            class="delete-button"
            title="Delete event"
          >
            🗑️
          </button>
        </div>
      </div>

      <!-- Add Event Modal -->
      <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
        <div class="modal-content card fade-in">
          <h2>Add New Event</h2>
          <form @submit.prevent="handleAddEvent" class="event-form">
            <div class="form-group">
              <label>Event Title</label>
              <input
                v-model="newEvent.title"
                type="text"
                class="input"
                placeholder="e.g., Our Anniversary"
                required
              />
            </div>

            <div class="form-group">
              <label>Event Type</label>
              <select v-model="newEvent.type" class="input" required>
                <option value="anniversary">Anniversary</option>
                <option value="holiday">Holiday</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div class="form-group">
              <label>Date</label>
              <input
                v-model="newEvent.date"
                type="date"
                class="input"
                required
              />
            </div>

            <div class="form-group">
              <label>Description (Optional)</label>
              <textarea
                v-model="newEvent.description"
                class="input"
                rows="3"
                placeholder="Add a note about this event..."
              ></textarea>
            </div>

            <div class="modal-actions">
              <button 
                type="button" 
                @click="showAddModal = false" 
                class="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="loading"
              >
                <span v-if="loading" class="spinner"></span>
                <span v-else>Add Event</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuth } from '../composables/useAuth';
import { useCoupleData } from '../composables/useCoupleData';

const { user } = useAuth();
const { 
  coupleData,
  events, 
  loading,
  getCoupleData,
  getEvents,
  addEvent,
  deleteEvent,
  subscribeToEvents
} = useCoupleData();

const showAddModal = ref(false);
const newEvent = ref({
  title: '',
  type: 'custom',
  date: '',
  description: ''
});

let unsubscribeEvents = null;

onMounted(async () => {
  if (user.value) {
    await getCoupleData(user.value.uid);
    if (coupleData.value) {
      // Set up real-time sync for events
      unsubscribeEvents = subscribeToEvents(coupleData.value.id);
    }
  }
});

onUnmounted(() => {
  // Clean up subscription
  if (unsubscribeEvents) unsubscribeEvents();
});

const sortedEvents = computed(() => {
  return [...events.value].sort((a, b) => {
    return a.date.toMillis() - b.date.toMillis();
  });
});

const getEventIcon = (type) => {
  const icons = {
    anniversary: '💕',
    holiday: '🎄',
    custom: '⭐'
  };
  return icons[type] || '📅';
};

const formatEventDate = (timestamp) => {
  if (!timestamp) return '';
  const date = timestamp.toDate();
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const getCountdown = (timestamp) => {
  if (!timestamp) return '';
  
  const eventDate = timestamp.toDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);
  
  const diffTime = eventDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return `${Math.abs(diffDays)} days ago`;
  } else if (diffDays === 0) {
    return 'Today! 🎉';
  } else if (diffDays === 1) {
    return 'Tomorrow!';
  } else {
    return `In ${diffDays} days`;
  }
};

const handleAddEvent = async () => {
  try {
    await addEvent(coupleData.value.id, newEvent.value);
    showAddModal.value = false;
    newEvent.value = {
      title: '',
      type: 'custom',
      date: '',
      description: ''
    };
  } catch (error) {
    console.error('Error adding event:', error);
    alert('Failed to add event. Please try again.');
  }
};

const handleDeleteEvent = async (eventId) => {
  if (confirm('Are you sure you want to delete this event?')) {
    try {
      await deleteEvent(eventId);
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  }
};
</script>

<style scoped>
.events-page {
  min-height: 100vh;
  padding: 0 var(--spacing-md) 100px var(--spacing-md);
  overflow-x: hidden;
}

.events-container {
  max-width: 900px;
  margin: 0 auto;
  padding-top: var(--spacing-xl);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.page-header h1 {
  background: var(--gradient-glow);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: white; /* fallback */
}

.sync-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-md);
  background: rgba(0, 242, 234, 0.1);
  border: 1px solid rgba(0, 242, 234, 0.2);
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-primary);
  animation: pulse-glow 3s infinite;
}

.loading-state,
.no-events {
  min-height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-events {
  flex-direction: column;
  background: rgba(30, 30, 36, 0.4);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  padding: var(--spacing-2xl);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-md);
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.5));
}

.no-events h3 {
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
}

.no-events p {
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-lg);
}

/* Events List */
.events-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.event-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--spacing-lg);
  align-items: center;
  padding: var(--spacing-lg);
  background: rgba(30, 30, 36, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.event-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--gradient-glow);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.event-card:hover {
  transform: translateX(4px);
  background: rgba(30, 30, 36, 0.8);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.event-card:hover::before {
  opacity: 1;
}

.event-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.event-content {
  flex: 1;
}

.event-content h3 {
  margin-bottom: var(--spacing-xs);
  color: var(--color-text);
  font-size: 1.2rem;
}

.event-description {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  margin-bottom: var(--spacing-sm);
  line-height: 1.5;
}

.event-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  font-size: 0.9rem;
}

.event-date {
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.event-date::before {
  content: '📅';
  font-size: 0.8em;
  opacity: 0.7;
}

.event-countdown {
  color: var(--color-primary);
  font-weight: 600;
  background: rgba(0, 242, 234, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

.delete-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.3;
  transition: all var(--transition-fast);
  padding: var(--spacing-xs);
  color: var(--color-text);
}

.delete-button:hover {
  opacity: 1;
  color: #ff4757;
  transform: scale(1.1);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-md);
}

.modal-content {
  max-width: 500px;
  width: 100%;
  padding: var(--spacing-xl);
  max-height: 90vh;
  overflow-y: auto;
  background: #1e1e24;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

.modal-content h2 {
  font-size: 1.8rem;
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.event-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-group label {
  font-weight: 500;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  margin-left: 2px;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
  font-family: var(--font-primary);
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  color: var(--color-text);
  padding: var(--spacing-sm);
}

.form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.modal-actions {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.modal-actions button {
  flex: 1;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: flex-start;
  }
  
  .event-card {
    grid-template-columns: auto 1fr;
    gap: var(--spacing-md);
  }
  
  .delete-button {
    grid-column: 2;
    justify-self: end;
    grid-row: 1;
    position: absolute;
    top: var(--spacing-md);
    right: var(--spacing-md);
  }

  .event-icon {
    width: 50px;
    height: 50px;
    font-size: 2rem;
  }
  
  .event-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    margin-top: var(--spacing-xs);
  }
}
</style>

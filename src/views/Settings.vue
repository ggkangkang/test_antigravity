<template>
  <div class="settings-page">
    <div class="settings-container container">
      <div class="page-header">
        <h1>Settings</h1>
      </div>

      <div class="settings-content fade-in">
        <!-- Profile Photos Section -->
        <div class="settings-section card-glass">
          <h2>Profile Photos</h2>
          <p class="section-description">Upload photos for both partners</p>
          
          <div class="photo-grid">
            <!-- Partner 1 Photo -->
            <div class="photo-item">
              <label class="photo-label">
                {{ coupleData?.partner1Name || 'Partner 1' }}
                <button @click="openEditModal('partner1')" class="edit-icon-btn" title="Edit Name">✏️</button>
              </label>
              <div class="photo-wrapper">
                <img 
                  :src="coupleData?.partner1Photo || '/images/boy_avatar.png'" 
                  :alt="coupleData?.partner1Name || 'Partner 1'"
                  class="profile-photo"
                />
                <div class="photo-overlay">
                  <label for="partner1-upload" class="upload-label">
                    <span class="upload-icon">📷</span>
                    <span>Change</span>
                  </label>
                </div>
              </div>
              <input
                id="partner1-upload"
                type="file"
                accept="image/*"
                @change="handlePhotoUpload($event, 'partner1')"
                class="file-input"
              />
              <div v-if="uploadingPartner1" class="upload-progress">
                <div class="spinner small"></div>
                <span>Uploading...</span>
              </div>
            </div>

            <!-- Partner 2 Photo -->
            <div class="photo-item">
              <label class="photo-label">
                {{ coupleData?.partner2Name || 'Partner 2' }}
                <button @click="openEditModal('partner2')" class="edit-icon-btn" title="Edit Name">✏️</button>
              </label>
              <div class="photo-wrapper">
                <img 
                  :src="coupleData?.partner2Photo || '/images/girl_avatar.png'" 
                  :alt="coupleData?.partner2Name || 'Partner 2'"
                  class="profile-photo"
                />
                <div class="photo-overlay">
                  <label for="partner2-upload" class="upload-label">
                    <span class="upload-icon">📷</span>
                    <span>Change</span>
                  </label>
                </div>
              </div>
              <input
                id="partner2-upload"
                type="file"
                accept="image/*"
                @change="handlePhotoUpload($event, 'partner2')"
                class="file-input"
              />
              <div v-if="uploadingPartner2" class="upload-progress">
                <div class="spinner small"></div>
                <span>Uploading...</span>
              </div>
            </div>
          </div>
        </div>

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
            Version 1.2.0 • Keching
        </div>
      </div>
    </div>

    <!-- Edit Name Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
      <div class="modal-content card fade-in">
        <h2>Edit {{ editingPartner === 'partner1' ? coupleData?.partner1Name : coupleData?.partner2Name }}</h2>
        <form @submit.prevent="handleSaveProfile" class="edit-form">
          <div class="form-group">
            <label>Name</label>
            <input v-model="editForm.name" type="text" class="input" required />
          </div>
          <div class="form-group">
            <label>Birthday (Optional)</label>
            <input v-model="editForm.birthday" type="date" class="input" />
          </div>
          <div class="modal-actions">
            <button type="button" @click="showEditModal = false" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="spinner small"></span>
              <span v-else>Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useCoupleData } from '../composables/useCoupleData';

const router = useRouter();
const { user, logout } = useAuth();
const { coupleData, getCoupleData, uploadProfilePicture, updateCoupleProfile } = useCoupleData();

const uploadingPartner1 = ref(false);
const uploadingPartner2 = ref(false);

// Modal editing state
const showEditModal = ref(false);
const editingPartner = ref(null); // 'partner1' or 'partner2'
const editForm = ref({
  name: '',
  birthday: ''
});

// Load couple data on mount
onMounted(async () => {
  if (user.value) {
    await getCoupleData(user.value.uid);
  }
});

const handlePhotoUpload = async (event, partner) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Check if user is logged in
  if (!user.value || !user.value.uid) {
    alert('You must be logged in to upload photos');
    return;
  }

  // Check if couple data is loaded
  if (!coupleData.value) {
    alert('Please set up your couple profile first before uploading photos');
    return;
  }

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('File size must be less than 5MB');
    return;
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file');
    return;
  }

  try {
    if (partner === 'partner1') {
      uploadingPartner1.value = true;
    } else {
      uploadingPartner2.value = true;
    }

    // Upload to Firebase Storage
    console.log('=== UPLOAD DEBUG INFO ===');
    console.log('Partner:', partner);
    console.log('User object:', user.value);
    console.log('User UID:', user.value?.uid);
    console.log('Couple Data:', coupleData.value);
    console.log('File:', file.name, file.size, file.type);
    console.log('Starting upload for user:', user.value.uid);
    
    const photoURL = await uploadProfilePicture(file, user.value.uid);
    console.log('Upload successful, URL:', photoURL);

    // Update Firestore with the new photo URL
    if (coupleData.value) {
      const updateData = partner === 'partner1' 
        ? { partner1Photo: photoURL }
        : { partner2Photo: photoURL };
      
      console.log('Updating Firestore with:', updateData);
      await updateCoupleProfile(coupleData.value.id, updateData);
      console.log('Firestore updated successfully');
    } else {
      console.warn('No couple data found, cannot update Firestore');
      alert('Photo uploaded to storage, but no couple profile found to update.');
    }

    // Clear the file input
    event.target.value = '';
  } catch (error) {
    console.error('Error uploading photo:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Show more specific error messages
    let errorMessage = 'Failed to upload photo. ';
    if (error.code === 'storage/unauthorized') {
      errorMessage += 'Permission denied. Please check Firebase Storage rules.';
    } else if (error.code === 'storage/canceled') {
      errorMessage += 'Upload was cancelled.';
    } else if (error.code === 'storage/unknown') {
      errorMessage += 'Unknown error occurred. Check console for details.';
    } else {
      errorMessage += error.message || 'Please try again.';
    }
    
    alert(errorMessage);
  } finally {
    if (partner === 'partner1') {
      uploadingPartner1.value = false;
    } else {
      uploadingPartner2.value = false;
    }
  }
};

// Open edit modal
const openEditModal = (partner) => {
  editingPartner.value = partner;
  if (partner === 'partner1') {
    editForm.value = {
      name: coupleData.value.partner1Name || '',
      birthday: coupleData.value.partner1Birthday || ''
    };
  } else {
    editForm.value = {
      name: coupleData.value.partner2Name || '',
      birthday: coupleData.value.partner2Birthday || ''
    };
  }
  showEditModal.value = true;
};

// Save profile from modal
const handleSaveProfile = async () => {
  try {
    if (!coupleData.value?.id) {
      alert('No couple profile found');
      return;
    }

    const updates = {};
    if (editingPartner.value === 'partner1') {
      updates.partner1Name = editForm.value.name;
      updates.partner1Birthday = editForm.value.birthday;
    } else {
      updates.partner2Name = editForm.value.name;
      updates.partner2Birthday = editForm.value.birthday;
    }

    await updateCoupleProfile(coupleData.value.id, updates);
    showEditModal.value = false;
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('Failed to update profile');
  }
};

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
  background: var(--gradient-warm);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.settings-section {
  padding: var(--spacing-lg);
  background: var(--glass-background);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.settings-section h2 {
  font-size: 1.2rem;
  color: var(--primary-accent);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--glass-border);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

/* Profile Photos Styles */
.section-description {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: var(--spacing-md);
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--spacing-lg);
}

.photo-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.photo-label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.edit-icon-btn {
  background: transparent;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  border-radius: 50%;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-icon-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: scale(1.1);
}

.edit-icon-btn:active {
  transform: scale(0.95);
}

.photo-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--primary-accent);
  box-shadow: 0 4px 12px rgba(242, 166, 121, 0.3);
  transition: all var(--transition-fast);
}

.photo-wrapper:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(242, 166, 121, 0.4);
}

.profile-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-fast);
  cursor: pointer;
}

.photo-wrapper:hover .photo-overlay {
  opacity: 1;
}

/* Names Grid */
.names-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.name-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.name-label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--primary-accent);
  margin-bottom: var(--spacing-xs);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.save-btn {
  width: 100%;
  margin-top: var(--spacing-sm);
}

.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: white;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
}

.upload-icon {
  font-size: 1.5rem;
}

.file-input {
  display: none;
}

.upload-progress {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--primary-accent);
  font-size: 0.85rem;
  font-weight: 500;
}

.spinner.small {
  width: 16px;
  height: 16px;
  border-width: 2px;
}


.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xs) 0;
}

.label {
  color: var(--text-secondary);
  font-weight: 500;
}

.value {
  color: var(--text-primary);
  font-weight: 600;
}

.value.code {
  font-family: monospace;
  background: rgba(255, 255, 255, 0.5);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  color: var(--primary-accent);
  border: 1px solid var(--glass-border);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xs);
}

.setting-label {
  color: var(--text-primary);
  font-weight: 500;
}

.setting-hint {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-style: italic;
}

/* Toggle Switch Mockup */
.toggle-switch {
  width: 50px;
  height: 28px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 14px;
  position: relative;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.toggle-switch.active {
  background: var(--primary-accent);
  border: 1px solid var(--primary-accent);
}

.toggle-thumb {
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 1px;
  left: 2px;
  transition: all var(--transition-fast);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch.active .toggle-thumb {
  transform: translateX(22px);
  background: white;
  box-shadow: none;
}

.danger-zone {
  border-color: rgba(255, 0, 85, 0.2);
  background: rgba(255, 0, 85, 0.05);
}

.danger-zone h2 {
  color: #ff4757;
  border-color: rgba(255, 0, 85, 0.2);
}

.danger-zone p {
  color: var(--text-secondary);
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
  box-shadow: 0 4px 12px rgba(255, 0, 85, 0.2);
}

.app-version {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.8rem;
  margin-top: var(--spacing-lg);
  opacity: 0.7;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
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
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  backdrop-filter: blur(20px);
}

.modal-content h2 {
  margin-bottom: var(--spacing-lg);
  color: var(--text-primary);
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.modal-actions {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.modal-actions button {
  flex: 1;
}

@media (max-width: 768px) {
  .settings-container {
    padding-top: var(--spacing-lg);
  }
}
</style>

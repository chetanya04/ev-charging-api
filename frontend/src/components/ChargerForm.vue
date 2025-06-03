<template>
  <div class="form-overlay">
    <div class="form-container">
      <h2>{{ isEditing ? 'Edit Charger' : 'Add Charger' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Name:</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            placeholder="Enter station name"
          />
        </div>

        <div class="form-group">
          <label for="latitude">Latitude:</label>
          <input
            id="latitude"
            v-model.number="form.latitude"
            type="number"
            step="any"
            min="-90"
            max="90"
            required
            placeholder="Enter latitude"
          />
        </div>

        <div class="form-group">
          <label for="longitude">Longitude:</label>
          <input
            id="longitude"
            v-model.number="form.longitude"
            type="number"
            step="any"
            min="-180"
            max="180"
            required
            placeholder="Enter longitude"
          />
        </div>

        <div class="form-group">
          <label for="status">Status:</label>
          <select id="status" v-model="form.status" required>
            <option value="">Select status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>

        <div class="form-group">
          <label for="powerOutput">Power Output (kW):</label>
          <input
            id="powerOutput"
            v-model.number="form.powerOutput"
            type="number"
            min="0"
            max="1000"
            required
            placeholder="Enter power output"
          />
        </div>

        <div class="form-group">
          <label for="connectorType">Connector Type:</label>
          <select id="connectorType" v-model="form.connectorType" required>
            <option value="">Select connector type</option>
            <option value="Type 1">Type 1</option>
            <option value="Type 2">Type 2</option>
            <option value="CCS">CCS</option>
            <option value="CHAdeMO">CHAdeMO</option>
            <option value="Tesla">Tesla</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="submit" :disabled="loading">
            {{ loading ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
          </button>
          <button type="button" @click="$emit('close')">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import axios from '@/components/services/api.js';

const props = defineProps({
  charger: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'saved']);

const loading = ref(false);

const form = reactive({
  name: '',
  latitude: '',
  longitude: '',
  status: '',
  powerOutput: '',
  connectorType: ''
});

const isEditing = computed(() => props.charger && props.charger._id);

const resetForm = () => {
  form.name = '';
  form.latitude = '';
  form.longitude = '';
  form.status = '';
  form.powerOutput = '';
  form.connectorType = '';
};

// Fill form when editing existing charger
watch(() => props.charger, (newCharger) => {
  if (newCharger) {
    form.name = newCharger.name || '';
    form.latitude = newCharger.latitude || '';
    form.longitude = newCharger.longitude || '';
    form.status = newCharger.status || '';
    form.powerOutput = newCharger.powerOutput || '';
    form.connectorType = newCharger.connectorType || '';
  } else {
    resetForm();
  }
}, { immediate: true });

const handleSubmit = async () => {
  loading.value = true;
  
  const formData = {
    name: form.name,
    latitude: Number(form.latitude),
    longitude: Number(form.longitude),
    status: form.status,
    powerOutput: Number(form.powerOutput),
    connectorType: form.connectorType
  };

  if (isEditing.value) {
    // Update existing charger
    await axios.put(`/stations/${props.charger._id}`, formData);
  } else {
    // Create new charger
    await axios.post('/stations', formData);
  }
  
  loading.value = false;
  emit('saved');
};
</script>

<style scoped>
.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.form-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.form-actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.form-actions button[type="submit"] {
  background: #007bff;
  color: white;
}

.form-actions button[type="submit"]:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.form-actions button[type="button"] {
  background: #6c757d;
  color: white;
}

h2 {
  margin-bottom: 1.5rem;
  color: #333;
}
</style>
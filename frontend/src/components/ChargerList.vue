<template>
  <div class="charger-list">
    <div v-if="chargers.length === 0" class="no-chargers">
      No chargers found.
    </div>
    <div v-else>
      <div v-for="charger in chargers" :key="charger._id" class="charger-item">
        <div class="charger-info">
          <div class="charger-name">
            <strong>{{ charger.name }}</strong>
          </div>
          <div class="charger-details">
            Status: <span :class="`status-${charger.status.toLowerCase()}`">{{ charger.status }}</span> | 
            Power: {{ charger.powerOutput }}kW | 
            Type: {{ charger.connectorType }}
          </div>
          <div class="charger-location">
            Location: {{ charger.latitude }}, {{ charger.longitude }}
          </div>
        </div>
        <div class="charger-actions">
          <button @click="handleEdit(charger)" class="edit-btn">
            Edit
          </button>
          <button @click="handleDelete(charger._id)" class="delete-btn">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  chargers: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['edit', 'delete']);

const handleEdit = (charger) => {
  emit('edit', charger);
};

const handleDelete = (chargerId) => {
  emit('delete', chargerId);
};
</script>

<style scoped>
.charger-list {
  margin-top: 1rem;
}

.no-chargers {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 2rem;
}

.charger-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  background: #f9f9f9;
}

.charger-info {
  flex: 1;
}

.charger-name {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.charger-details {
  color: #666;
  margin-bottom: 0.25rem;
}

.charger-location {
  color: #888;
  font-size: 0.9rem;
}

.status-active {
  color: #28a745;
  font-weight: bold;
}

.status-inactive {
  color: #dc3545;
  font-weight: bold;
}

.status-maintenance {
  color: #ffc107;
  font-weight: bold;
}

.charger-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn, .delete-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.edit-btn {
  background: #007bff;
  color: white;
}

.edit-btn:hover {
  background: #0056b3;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover {
  background: #c82333;
}
</style>
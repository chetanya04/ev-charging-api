<template>
  <div class="dashboard">
    <div class="header">
      <h1>Charging Stations Management</h1>
      <button @click="showAddForm" class="add-btn">
        Add New Charger
      </button>
    </div>

    <ChargerList
      :chargers="chargers"
      @edit="onEdit"
      @delete="onDelete"
    />

    <!-- Form Modal -->
    <ChargerForm
      v-if="showForm"
      :charger="editingCharger"
      @close="closeForm"
      @saved="onSaved"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/components/services/api.js';
import ChargerList from '@/components/ChargerList.vue';
import ChargerForm from '@/components/ChargerForm.vue';

const chargers = ref([]);
const showForm = ref(false);
const editingCharger = ref(null);

const fetchChargers = async () => {
  const res = await axios.get('/stations');
  chargers.value = res.data;
};

const showAddForm = () => {
  editingCharger.value = null;
  showForm.value = true;
};

const onEdit = (charger) => {
  editingCharger.value = { ...charger };
  showForm.value = true;
};

const onDelete = async (id) => {
  if (confirm('Are you sure you want to delete this charger?')) {
    await axios.delete(`/stations/${id}`);
    await fetchChargers();
  }
};

const closeForm = () => {
  showForm.value = false;
  editingCharger.value = null;
};

const onSaved = () => {
  closeForm();
  fetchChargers();
};

onMounted(() => {
  fetchChargers();
});
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  color: #333;
  margin: 0;
}

.add-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
}

.add-btn:hover {
  background: #218838;
}
</style>
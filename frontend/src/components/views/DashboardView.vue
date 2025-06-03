<template>
  <div class="dashboard">
    <div class="header">
      <h1>Charging Stations Management</h1>
      <div class="header-actions">
        <button @click="showAddForm" class="add-btn">
          Add New Charger
        </button>
        <button @click="goToMap" class="map-btn">
          View Map
        </button>
        <button @click="handleLogout" class="logout-btn">
          Logout
        </button>
      </div>
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
import { useRouter } from 'vue-router';
import axios from '@/components/services/api.js';
import ChargerList from '@/components/ChargerList.vue';
import ChargerForm from '@/components/ChargerForm.vue';

const router = useRouter();
const chargers = ref([]);
const showForm = ref(false);
const editingCharger = ref(null);


const props = defineProps({
  setIsAuthenticated: {
    type: Function,
    required: false 
  }
});

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

const goToMap = () => {
  router.push('/map');
};

const handleLogout = () => {
  // Remove token from localStorage
  localStorage.removeItem('token');
  
  // Update authentication state
  if (props.setIsAuthenticated) {
    props.setIsAuthenticated(false);
  }
  
  // If using composable approach, uncomment this:
  // logout();
  
  // Redirect to login page
  router.push('/');
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

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
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

.map-btn {
  background: #17a2b8;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
}

.map-btn:hover {
  background: #138496;
}

.logout-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
}

.logout-btn:hover {
  background: #c82333;
}
</style>
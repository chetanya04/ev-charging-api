<template>
  <div class="map-container">
    <div class="map-header">
      <h2>Charging Stations Map</h2>
      <div class="map-controls">
        <select v-model="statusFilter" @change="filterMarkers" class="filter-select">
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Maintenance">Maintenance</option>
        </select>
        <select v-model="connectorFilter" @change="filterMarkers" class="filter-select">
          <option value="">All Connectors</option>
          <option value="Type 1">Type 1</option>
          <option value="Type 2">Type 2</option>
          <option value="CCS">CCS</option>
          <option value="CHAdeMO">CHAdeMO</option>
          <option value="Tesla">Tesla</option>
        </select>
        <button @click="refreshMap" class="refresh-btn">Refresh</button>
        <button @click="goToDashboard" class="dashboard-btn">Dashboard</button>
      </div>
    </div>

    <div class="map-stats">
      <div class="stat-item">
        <span class="stat-label">Total:</span>
        <span class="stat-value">{{ chargers.length }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Active:</span>
        <span class="stat-value active">{{ activeCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Inactive:</span>
        <span class="stat-value inactive">{{ inactiveCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Maintenance:</span>
        <span class="stat-value maintenance">{{ maintenanceCount }}</span>
      </div>
    </div>

    <div class="map-wrapper">
      <div id="map" class="map-element"></div>
      <div v-if="loading" class="loading-overlay">
        <div class="loading-text">Loading stations...</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from '../services/api.js';

const router = useRouter();
const map = ref(null);
const chargers = ref([]);
const markers = ref([]);
const loading = ref(true);
const statusFilter = ref('');
const connectorFilter = ref('');

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Count stations by status
const activeCount = computed(() => chargers.value.filter(c => c.status === 'Active').length);
const inactiveCount = computed(() => chargers.value.filter(c => c.status === 'Inactive').length);
const maintenanceCount = computed(() => chargers.value.filter(c => c.status === 'Maintenance').length);

// Create colored markers for different statuses
const getMarkerColor = (status) => {
  const colors = {
    'Active': '#28a745',
    'Inactive': '#dc3545',
    'Maintenance': '#ffc107'
  };
  return colors[status] || '#6c757d';
};

const fetchChargers = async () => {
  loading.value = true;
  const res = await axios.get('https://ev-charging-api-j4kg.onrender.com/stations');
  chargers.value = res.data;
  loading.value = false;
  return res.data;
};

const clearMarkers = () => {
  markers.value.forEach(marker => {
    map.value.removeLayer(marker);
  });
  markers.value = [];
};

const addMarkers = (chargersToShow = chargers.value) => {
  clearMarkers();
  
  chargersToShow.forEach(charger => {
    if (charger.latitude && charger.longitude) {
      const marker = L.circleMarker([charger.latitude, charger.longitude], {
        radius: 8,
        fillColor: getMarkerColor(charger.status),
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map.value);
      
      const popupContent = `
        <div>
          <h4>${charger.name}</h4>
          <p><strong>Status:</strong> ${charger.status}</p>
          <p><strong>Power:</strong> ${charger.powerOutput} kW</p>
          <p><strong>Connector:</strong> ${charger.connectorType}</p>
        </div>
      `;
      
      marker.bindPopup(popupContent);
      markers.value.push(marker);
    }
  });
};

const filterMarkers = () => {
  let filteredChargers = chargers.value;
  
  if (statusFilter.value) {
    filteredChargers = filteredChargers.filter(c => c.status === statusFilter.value);
  }
  
  if (connectorFilter.value) {
    filteredChargers = filteredChargers.filter(c => c.connectorType === connectorFilter.value);
  }
  
  addMarkers(filteredChargers);
};

const refreshMap = async () => {
  await fetchChargers();
  addMarkers();
};

const goToDashboard = () => {
  router.push('/dashboard');
};

onMounted(async () => {
  // Initialize map
  map.value = L.map('map').setView([20, 0], 2);

  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map.value);

  // Fetch and display chargers
  const fetchedChargers = await fetchChargers();
  
  if (fetchedChargers.length > 0) {
    addMarkers();
    // Fit map to show all markers
    const group = new L.featureGroup(markers.value);
    map.value.fitBounds(group.getBounds().pad(0.1));
  }
});

onUnmounted(() => {
  if (map.value) {
    map.value.remove();
  }
});
</script>

<style scoped>
.map-container {
  padding: 1.5rem;
  background: #f8f9fa;
  min-height: 100vh;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.map-header h2 {
  margin: 0;
  color: #333;
}

.map-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.refresh-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
}

.refresh-btn:hover {
  background: #0056b3;
}

.dashboard-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #28a745;
  color: white;
  cursor: pointer;
}

.dashboard-btn:hover {
  background: #1e7e34;
}

.map-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat-item {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-label {
  font-weight: 500;
  color: #666;
}

.stat-value {
  font-weight: bold;
  font-size: 1.1rem;
}

.stat-value.active {
  color: #28a745;
}

.stat-value.inactive {
  color: #dc3545;
}

.stat-value.maintenance {
  color: #ffc107;
}

.map-wrapper {
  position: relative;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.map-element {
  width: 100%;
  height: 600px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-text {
  background: #007bff;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .map-header {
    flex-direction: column;
    gap: 1rem;
  }

  .map-controls {
    flex-direction: column;
    width: 100%;
  }

  .filter-select, .refresh-btn, .dashboard-btn {
    width: 100%;
  }

  .map-stats {
    flex-wrap: wrap;
  }

  .stat-item {
    flex: 1;
    min-width: 120px;
  }

  .map-element {
    height: 400px;
  }
}
</style>
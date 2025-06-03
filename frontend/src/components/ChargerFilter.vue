<template>
  <div class="filter-container">
    <label>
      Status:
      <select v-model="localFilters.status" @change="updateFilters">
        <option value="">All</option>
        <option>Active</option>
        <option>Inactive</option>
      </select>
    </label>
    <label>
      Connector Type:
      <select v-model="localFilters.connectorType" @change="updateFilters">
        <option value="">All</option>
        <option>Type1</option>
        <option>Type2</option>
        <option>CHAdeMO</option>
        <option>CCS</option>
      </select>
    </label>
    <label>
      Min Power Output (kW):
      <input
        type="number"
        v-model.number="localFilters.minPowerOutput"
        @input="updateFilters"
        min="0"
      />
    </label>
  </div>
</template>

<script setup>
import { reactive, toRefs, watch, ref } from 'vue';

const props = defineProps({
  filters: Object,
});
const emit = defineEmits(['filter-chargers']);

const localFilters = reactive({ ...props.filters });

const updateFilters = () => {
  emit('filter-chargers', { ...localFilters });
};
</script>

<style scoped>
.filter-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
label {
  display: flex;
  flex-direction: column;
  font-weight: 600;
}
</style>

<template>
  <div id="app">
    <!-- RefreshHandler should be placed here to run on every route change -->
    <RefreshHandler :set-is-authenticated="setIsAuthenticated" />
    
    <!-- Your app content - pass auth state to child components -->
    <router-view :is-authenticated="isAuthenticated" :set-is-authenticated="setIsAuthenticated" />
  </div>
</template>

<script>
import { ref } from 'vue'
import RefreshHandler from './RefreshHandler.vue'

export default {
  name: 'App',
  components: {
    RefreshHandler
  },
  setup() {
    const isAuthenticated = ref(!!localStorage.getItem('token')) // Initialize from localStorage

    const setIsAuthenticated = (value) => {
      isAuthenticated.value = value
    }

    return {
      isAuthenticated,
      setIsAuthenticated
    }
  }
}
</script>
<template>
  <!-- This component doesn't render anything -->
</template>

<script>
import { watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'RefreshHandler',
  props: {
    setIsAuthenticated: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const route = useRoute()
    const router = useRouter()

    const handleRefresh = () => {
      const token = localStorage.getItem('token')
      console.log('RefreshHandler - Token exists:', !!token)
      console.log('RefreshHandler - Current path:', route.path)
      
      if (token) {
        props.setIsAuthenticated(true)
        console.log('RefreshHandler - User authenticated')
        
        // If authenticated user is on login page (/), redirect to dashboard
        if (route.path === '/') {
          console.log('RefreshHandler - Redirecting authenticated user to /dashboard')
          router.push('/dashboard')
        }
      } else {
        console.log('RefreshHandler - No token, user not authenticated')
        props.setIsAuthenticated(false)
        
        // If not authenticated and trying to access protected routes, redirect to login
        if (route.path === '/dashboard' || route.path === '/map') {
          console.log('RefreshHandler - Redirecting unauthenticated user to /')
          router.push('/')
        }
      }
    }

    // Run on component mount
    onMounted(() => {
      handleRefresh()
    })

    // Watch for route changes
    watch(() => route.path, () => {
      handleRefresh()
    })

    return {}
  }
}
</script>
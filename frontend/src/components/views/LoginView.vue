<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email:</label>
        <input 
          id="email"
          v-model="email" 
          type="email" 
          required 
          class="form-input"
        />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input 
          id="password"
          v-model="password" 
          type="password" 
          required 
          class="form-input"
        />
      </div>
      <button type="submit" :disabled="loading" class="submit-btn">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
    
    <div class="register-link">
      <p>Don't have an account? <router-link to="/register" class="link">Register here</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from '../services/api.js'
import { useRouter } from 'vue-router'

// Add props to receive authentication state functions from parent
const props = defineProps({
  setIsAuthenticated: {
    type: Function,
    required: true
  }
})

const email = ref('')
const password = ref('')
const error = ref(null)
const loading = ref(false)
const router = useRouter()

const handleLogin = async () => {
  error.value = null
  loading.value = true
  
  try {
    console.log('Attempting login for:', email.value)
    
    const response = await axios.post('https://ev-charging-api-j4kg.onrender.com/auth/login', {
      email: email.value,
      password: password.value,
    })
    
    console.log('Login successful:', response.data)
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      
      // Update the global authentication state
      props.setIsAuthenticated(true)
      
      router.push('/dashboard')
    } else {
      error.value = 'Login failed: No token received'
    }
    
  } catch (err) {
    console.error('Login error:', err)
    
    if (err.response) {
      error.value = err.response.data?.message || `Server error (${err.response.status})`
    } else if (err.request) {
      error.value = 'Cannot connect to server. Please check if the backend is running.'
    } else {
      error.value = 'An unexpected error occurred'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  margin-top: 1rem;
  font-size: 0.9rem;
  text-align: center;
}

.register-link {
  margin-top: 1.5rem;
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.register-link p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.link {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.link:hover {
  color: #0056b3;
  text-decoration: underline;
}
</style>
<template>
  <div class="auth-wrapper">
    <div class="card auth-card">
      <h1 class="auth-title">Bienvenido</h1>
      <p class="auth-sub">Inicia sesión para acceder a tu agenda</p>

      <div v-if="error" class="alert alert-error">{{ error }}</div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label">Usuario</label>
          <input
            v-model="form.nombre_de_usuario"
            type="text"
            class="form-input"
            placeholder="Tu nombre de usuario"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">Contraseña</label>
          <input
            v-model="form.password"
            type="password"
            class="form-input"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          class="btn btn-primary btn-block"
          :disabled="cargando"
        >
          {{ cargando ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <p class="auth-footer">
        ¿No tienes cuenta? <RouterLink to="/registro">Regístrate</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const auth    = useAuthStore()
const router  = useRouter()
const cargando = ref(false)
const error    = ref('')

const form = ref({
  nombre_de_usuario: '',
  password: ''
})

async function handleLogin() {
  error.value   = ''
  cargando.value = true

  try {
    const data = await auth.login(form.value.nombre_de_usuario, form.value.password)
    if (data.success) {
      router.push('/agenda')
    } else {
      error.value = data.message || 'Error al iniciar sesión'
    }
  } catch {
    error.value = 'Error de conexión con el servidor'
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <div class="auth-wrapper">
    <div class="card auth-card">
      <h1 class="auth-title">Crear Cuenta</h1>
      <p class="auth-sub">Regístrate para empezar a usar la agenda</p>

      <div v-if="error"   class="alert alert-error">{{ error }}</div>
      <div v-if="exito"   class="alert alert-success">{{ exito }}</div>

      <form @submit.prevent="handleRegistro">
        <div class="form-group">
          <label class="form-label">Nombre de usuario</label>
          <input
            v-model="form.nombre_de_usuario"
            type="text"
            class="form-input"
            placeholder="Elige un usuario único"
            required
            minlength="3"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Contraseña</label>
          <input
            v-model="form.password"
            type="password"
            class="form-input"
            placeholder="Mínimo 6 caracteres"
            required
            minlength="6"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Confirmar contraseña</label>
          <input
            v-model="form.confirmar"
            type="password"
            class="form-input"
            placeholder="Repite tu contraseña"
            required
          />
        </div>

        <button
          type="submit"
          class="btn btn-primary btn-block"
          :disabled="cargando"
        >
          {{ cargando ? 'Registrando...' : 'Crear Cuenta' }}
        </button>
      </form>

      <p class="auth-footer">
        ¿Ya tienes cuenta? <RouterLink to="/login">Inicia sesión</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const auth     = useAuthStore()
const router   = useRouter()
const cargando  = ref(false)
const error     = ref('')
const exito     = ref('')

const form = ref({
  nombre_de_usuario: '',
  password:   '',
  confirmar:  ''
})

async function handleRegistro() {
  error.value = ''
  exito.value = ''

  // Validación Front-End
  if (form.value.nombre_de_usuario.trim().length < 3) {
    error.value = 'El usuario debe tener al menos 3 caracteres'
    return
  }
  if (form.value.password.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }
  if (form.value.password !== form.value.confirmar) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  cargando.value = true
  try {
    const data = await auth.registrar(form.value.nombre_de_usuario, form.value.password)
    if (data.success) {
      exito.value = 'Cuenta creada correctamente. Redirigiendo...'
      setTimeout(() => router.push('/login'), 1500)
    } else {
      error.value = data.message || 'Error al registrar'
    }
  } catch {
    error.value = 'Error de conexión con el servidor'
  } finally {
    cargando.value = false
  }
}
</script>

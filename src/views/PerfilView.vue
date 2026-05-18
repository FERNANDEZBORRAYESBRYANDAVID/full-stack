<template>
  <div class="container">
    <h1 class="page-title">Mi Perfil</h1>

    <div class="card" style="max-width:500px; margin:0 auto;">
      <div v-if="error"  class="alert alert-error">{{ error }}</div>
      <div v-if="exito"  class="alert alert-success">{{ exito }}</div>

      <form @submit.prevent="handleEditar">
        <!-- Foto de perfil -->
        <div class="form-group" style="text-align:center;">
          <img
            v-if="previewFoto || auth.usuario?.foto"
            :src="previewFoto || auth.usuario?.foto"
            class="foto-preview"
            style="width:100px;height:100px;"
            alt="Foto de perfil"
          />
          <div v-else class="avatar-placeholder" style="width:100px;height:100px;font-size:2.5rem;margin:0 auto .5rem;">👤</div>

          <label class="form-label" style="cursor:pointer; color:var(--primary); display:block; margin-top:.5rem;">
            📷 Cambiar foto de perfil
            <input type="file" accept=".jpg,.jpeg,.png,.webp" @change="onFoto" style="display:none;" />
          </label>
        </div>

        <div class="form-group">
          <label class="form-label">Nombre de usuario</label>
          <input
            v-model="nuevoNombre"
            type="text"
            class="form-input"
            required
            minlength="3"
          />
        </div>

        <button type="submit" class="btn btn-primary btn-block" :disabled="cargando">
          {{ cargando ? 'Guardando...' : '💾 Guardar Cambios' }}
        </button>
      </form>

      <hr style="margin:1.5rem 0; border:none; border-top:1px solid var(--border);" />

      <div style="text-align:center; color:var(--text-muted); font-size:.9rem;">
        <p>Miembro desde: {{ fechaRegistro }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import { getApiUrl } from '@/config/api.js'

const auth         = useAuthStore()
const cargando     = ref(false)
const error        = ref('')
const exito        = ref('')
const previewFoto  = ref(null)
const nuevoNombre  = ref(auth.usuario?.nombre_de_usuario || '')
let archivoFoto    = null

const fechaRegistro = computed(() => {
  return new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
})

function onFoto(e) {
  const file = e.target.files[0]
  if (!file) return
  archivoFoto = file
  previewFoto.value = URL.createObjectURL(file)
}

async function handleEditar() {
  error.value = ''
  exito.value = ''

  if (nuevoNombre.value.trim().length < 3) {
    error.value = 'El usuario debe tener al menos 3 caracteres'
    return
  }

  cargando.value = true
  try {
    const API_URL = await getApiUrl()
    const fd = new FormData()
    fd.append('nombre_de_usuario', nuevoNombre.value)
    if (archivoFoto) fd.append('foto', archivoFoto)

    const headers = { 'Authorization': `Bearer ${auth.token}` }
    const res  = await fetch(`${API_URL}/auth/editar.php`, { method: 'POST', headers, body: fd })
    const data = await res.json()

    if (data.success) {
      auth.usuario = data.usuario
      localStorage.setItem('usuario', JSON.stringify(data.usuario))
      exito.value = '¡Perfil actualizado correctamente!'
    } else {
      error.value = data.message || 'Error al actualizar perfil'
    }
  } catch {
    error.value = 'Error de conexión con el servidor'
  } finally {
    cargando.value = false
  }
}
</script>

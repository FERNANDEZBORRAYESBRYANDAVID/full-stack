<template>
  <div class="container">
    <div class="section-header">
      <h1 class="page-title" style="margin:0">Nuevo Contacto</h1>
      <RouterLink to="/agenda" class="btn btn-outline">← Volver</RouterLink>
    </div>

    <div class="card">
      <div v-if="error"  class="alert alert-error">{{ error }}</div>
      <div v-if="exito"  class="alert alert-success">{{ exito }}</div>

      <form @submit.prevent="handleCrear" enctype="multipart/form-data">
        <!-- Foto -->
        <div class="form-group" style="text-align:center;">
          <img v-if="previewFoto" :src="previewFoto" class="foto-preview" alt="Vista previa" />
          <div v-else class="avatar-placeholder" style="margin:0 auto .5rem;">👤</div>
          <label class="form-label" style="cursor:pointer; color:var(--primary);">
            📷 Seleccionar foto
            <input type="file" accept=".jpg,.jpeg,.png,.webp" @change="onFoto" style="display:none;" required />
          </label>
          <p style="font-size:.8rem; color:var(--text-muted);">JPG, PNG o WEBP</p>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
          <div class="form-group">
            <label class="form-label">Nombre *</label>
            <input v-model="form.nombre" type="text" class="form-input" required placeholder="Nombre" />
          </div>
          <div class="form-group">
            <label class="form-label">Apellido</label>
            <input v-model="form.apellido" type="text" class="form-input" placeholder="Apellido" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Teléfono *</label>
          <input v-model="form.telefono" type="tel" class="form-input" required placeholder="Ej: 9611234567" />
        </div>

        <div class="form-group">
          <label class="form-label">Correo electrónico</label>
          <input v-model="form.email" type="email" class="form-input" placeholder="correo@ejemplo.com" />
        </div>

        <div class="form-group">
          <label class="form-label">Dirección</label>
          <input v-model="form.direccion" type="text" class="form-input" placeholder="Calle, colonia, ciudad" />
        </div>

        <div class="form-group">
          <label class="form-label">Notas</label>
          <textarea v-model="form.notas" class="form-input" placeholder="Información adicional..."></textarea>
        </div>

        <button type="submit" class="btn btn-primary btn-block" :disabled="cargando">
          {{ cargando ? 'Guardando...' : '💾 Guardar Contacto' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { getApiUrl } from '@/config/api.js'

const auth      = useAuthStore()
const router    = useRouter()
const cargando  = ref(false)
const error     = ref('')
const exito     = ref('')
const previewFoto = ref(null)
let archivoFoto = null

const form = ref({
  nombre: '', apellido: '', telefono: '',
  email: '', direccion: '', notas: ''
})

function onFoto(e) {
  const file = e.target.files[0]
  if (!file) return
  archivoFoto = file
  previewFoto.value = URL.createObjectURL(file)
}

async function handleCrear() {
  error.value = ''
  exito.value = ''

  // Validaciones Front-End
  if (!form.value.nombre.trim()) { error.value = 'El nombre es obligatorio'; return }
  if (!form.value.telefono.trim()) { error.value = 'El teléfono es obligatorio'; return }
  if (!archivoFoto) { error.value = 'La foto es obligatoria'; return }

  cargando.value = true
  try {
    const API_URL = await getApiUrl()
    const fd = new FormData()
    Object.entries(form.value).forEach(([k, v]) => fd.append(k, v))
    fd.append('foto', archivoFoto)

    // Nota: NO incluir Content-Type en headers para FormData
    const headers = { 'Authorization': `Bearer ${auth.token}` }
    const res  = await fetch(`${API_URL}/contactos/crear.php`, { method: 'POST', headers, body: fd })
    const data = await res.json()

    if (data.success) {
      exito.value = 'Contacto creado correctamente. Redirigiendo...'
      setTimeout(() => router.push('/agenda'), 1500)
    } else {
      error.value = data.message || 'Error al crear contacto'
    }
  } catch {
    error.value = 'Error de conexión con el servidor'
  } finally {
    cargando.value = false
  }
}
</script>

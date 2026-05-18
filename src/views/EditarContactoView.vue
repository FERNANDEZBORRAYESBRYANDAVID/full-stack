<template>
  <div class="container">
    <div class="section-header">
      <h1 class="page-title" style="margin:0">Editar Contacto</h1>
      <RouterLink to="/agenda" class="btn btn-outline">← Volver</RouterLink>
    </div>

    <div v-if="cargandoDatos" class="loading">Cargando contacto...</div>

    <div v-else class="card">
      <div v-if="error"  class="alert alert-error">{{ error }}</div>
      <div v-if="exito"  class="alert alert-success">{{ exito }}</div>

      <form @submit.prevent="handleActualizar">
        <!-- Foto -->
        <div class="form-group" style="text-align:center;">
          <img v-if="previewFoto || form.foto" :src="previewFoto || form.foto" class="foto-preview" alt="Foto" />
          <div v-else class="avatar-placeholder" style="margin:0 auto .5rem;">👤</div>
          <label class="form-label" style="cursor:pointer; color:var(--primary);">
            📷 Cambiar foto
            <input type="file" accept=".jpg,.jpeg,.png,.webp" @change="onFoto" style="display:none;" />
          </label>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
          <div class="form-group">
            <label class="form-label">Nombre *</label>
            <input v-model="form.nombre" type="text" class="form-input" required />
          </div>
          <div class="form-group">
            <label class="form-label">Apellido</label>
            <input v-model="form.apellido" type="text" class="form-input" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Teléfono *</label>
          <input v-model="form.telefono" type="tel" class="form-input" required />
        </div>

        <div class="form-group">
          <label class="form-label">Correo electrónico</label>
          <input v-model="form.email" type="email" class="form-input" />
        </div>

        <div class="form-group">
          <label class="form-label">Dirección</label>
          <input v-model="form.direccion" type="text" class="form-input" />
        </div>

        <div class="form-group">
          <label class="form-label">Notas</label>
          <textarea v-model="form.notas" class="form-input"></textarea>
        </div>

        <button type="submit" class="btn btn-primary btn-block" :disabled="cargando">
          {{ cargando ? 'Guardando...' : '💾 Guardar Cambios' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { getApiUrl } from '@/config/api.js'

const auth         = useAuthStore()
const route        = useRoute()
const router       = useRouter()
const cargandoDatos = ref(true)
const cargando     = ref(false)
const error        = ref('')
const exito        = ref('')
const previewFoto  = ref(null)
let archivoFoto    = null

const form = ref({
  id: '', nombre: '', apellido: '', telefono: '',
  email: '', direccion: '', notas: '', foto: ''
})

function onFoto(e) {
  const file = e.target.files[0]
  if (!file) return
  archivoFoto = file
  previewFoto.value = URL.createObjectURL(file)
}

async function cargarContacto() {
  try {
    const API_URL = await getApiUrl()
    const res  = await fetch(`${API_URL}/contactos/detalle.php?id=${route.params.id}`, {
      headers: auth.headersAuth()
    })
    const data = await res.json()
    if (data.success) {
      Object.assign(form.value, data.contacto)
    } else {
      error.value = data.message
    }
  } catch {
    error.value = 'Error al cargar contacto'
  } finally {
    cargandoDatos.value = false
  }
}

async function handleActualizar() {
  error.value = ''
  exito.value = ''

  if (!form.value.nombre.trim()) { error.value = 'El nombre es obligatorio'; return }
  if (!form.value.telefono.trim()) { error.value = 'El teléfono es obligatorio'; return }

  cargando.value = true
  try {
    const API_URL = await getApiUrl()
    const fd = new FormData()
    fd.append('id',        form.value.id)
    fd.append('nombre',    form.value.nombre)
    fd.append('apellido',  form.value.apellido || '')
    fd.append('telefono',  form.value.telefono)
    fd.append('email',     form.value.email    || '')
    fd.append('direccion', form.value.direccion || '')
    fd.append('notas',     form.value.notas    || '')
    if (archivoFoto) fd.append('foto', archivoFoto)

    const headers = { 'Authorization': `Bearer ${auth.token}` }
    const res  = await fetch(`${API_URL}/contactos/actualizar.php`, { method: 'POST', headers, body: fd })
    const data = await res.json()

    if (data.success) {
      exito.value = 'Contacto actualizado. Redirigiendo...'
      setTimeout(() => router.push('/agenda'), 1500)
    } else {
      error.value = data.message || 'Error al actualizar'
    }
  } catch {
    error.value = 'Error de conexión con el servidor'
  } finally {
    cargando.value = false
  }
}

onMounted(cargarContacto)
</script>

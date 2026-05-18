<template>
  <div class="container">
    <div class="section-header">
      <h1 class="page-title" style="margin:0">Mis Contactos</h1>
      <div style="display:flex; gap:.8rem; flex-wrap:wrap; align-items:center;">
        <input
          v-model="busqueda"
          type="text"
          class="search-input"
          placeholder="🔍 Buscar contacto..."
        />
        <RouterLink to="/agenda/crear" class="btn btn-primary">+ Nuevo</RouterLink>
      </div>
    </div>

    <!-- Cargando -->
    <div v-if="cargando" class="loading">Cargando contactos...</div>

    <!-- Error -->
    <div v-else-if="errorMsg" class="alert alert-error">{{ errorMsg }}</div>

    <!-- Sin resultados -->
    <div v-else-if="contactosFiltrados.length === 0" class="empty-state">
      <div style="font-size:3rem;">📭</div>
      <p>{{ busqueda ? 'Sin resultados para tu búsqueda' : 'Aún no tienes contactos' }}</p>
      <RouterLink v-if="!busqueda" to="/agenda/crear" class="btn btn-primary">
        Crear primer contacto
      </RouterLink>
    </div>

    <!-- Grid de contactos -->
    <div v-else class="contactos-grid">
      <div
        v-for="c in contactosFiltrados"
        :key="c.id"
        class="contacto-card"
      >
        <img v-if="c.foto" :src="c.foto" :alt="c.nombre" />
        <div v-else class="avatar-placeholder">👤</div>

        <div>
          <div class="contacto-nombre">{{ c.nombre }} {{ c.apellido }}</div>
          <div class="contacto-tel">📞 {{ c.telefono }}</div>
          <div v-if="c.email" class="contacto-tel">✉️ {{ c.email }}</div>
        </div>

        <div class="contacto-actions">
          <RouterLink
            :to="`/agenda/${c.id}`"
            class="btn btn-outline btn-sm"
          >✏️ Editar</RouterLink>
          <button
            class="btn btn-danger btn-sm"
            @click="confirmarEliminar(c)"
          >🗑️ Eliminar</button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <div v-if="contactoAEliminar" class="modal-overlay" @click.self="contactoAEliminar = null">
      <div class="card modal-card">
        <h2 style="margin-bottom:1rem;">¿Eliminar contacto?</h2>
        <p style="color:var(--text-muted); margin-bottom:1.5rem;">
          Se eliminará a <strong>{{ contactoAEliminar.nombre }}</strong> permanentemente.
        </p>
        <div style="display:flex; gap:1rem; justify-content:flex-end;">
          <button class="btn btn-outline" @click="contactoAEliminar = null">Cancelar</button>
          <button class="btn btn-danger" :disabled="eliminando" @click="eliminar">
            {{ eliminando ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import { getApiUrl } from '@/config/api.js'

const auth     = useAuthStore()
const cargando = ref(true)
const errorMsg = ref('')
const contactos = ref([])
const busqueda  = ref('')
const contactoAEliminar = ref(null)
const eliminando = ref(false)

const contactosFiltrados = computed(() => {
  const q = busqueda.value.toLowerCase()
  if (!q) return contactos.value
  return contactos.value.filter(c =>
    c.nombre.toLowerCase().includes(q) ||
    (c.apellido || '').toLowerCase().includes(q) ||
    c.telefono.includes(q)
  )
})

async function cargarContactos() {
  cargando.value = true
  errorMsg.value = ''
  try {
    const API_URL = await getApiUrl()
    const res  = await fetch(`${API_URL}/contactos/index.php`, {
      headers: auth.headersAuth()
    })
    const data = await res.json()
    if (data.success) {
      contactos.value = data.contactos
    } else {
      errorMsg.value = data.message
    }
  } catch {
    errorMsg.value = 'Error al cargar contactos'
  } finally {
    cargando.value = false
  }
}

function confirmarEliminar(c) {
  contactoAEliminar.value = c
}

async function eliminar() {
  eliminando.value = true
  try {
    const API_URL = await getApiUrl()
    const res = await fetch(`${API_URL}/contactos/eliminar.php`, {
      method: 'POST',
      headers: auth.headersAuth(),
      body: JSON.stringify({ id: contactoAEliminar.value.id })
    })
    const data = await res.json()
    if (data.success) {
      contactos.value = contactos.value.filter(c => c.id !== contactoAEliminar.value.id)
      contactoAEliminar.value = null
    }
  } catch {
    errorMsg.value = 'Error al eliminar contacto'
  } finally {
    eliminando.value = false
  }
}

onMounted(cargarContactos)
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.45);
  display: flex; align-items: center; justify-content: center;
  z-index: 200;
  padding: 1rem;
}
.modal-card { max-width: 400px; width: 100%; }
</style>

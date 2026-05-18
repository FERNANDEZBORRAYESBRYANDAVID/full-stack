<template>
  <div id="app-wrapper">
    <!-- Navbar (solo cuando está autenticado) -->
    <nav v-if="auth.estaAutenticado" class="navbar">
      <div class="nav-brand">
        <span class="nav-icon">📖</span>
        <span>Agenda</span>
      </div>
      <div class="nav-links">
        <RouterLink to="/agenda" class="nav-link">Contactos</RouterLink>
        <RouterLink to="/perfil" class="nav-link">Perfil</RouterLink>
        <button class="btn-logout" @click="cerrarSesion">Salir</button>
      </div>
    </nav>

    <RouterView />
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.js'
import { useRouter } from 'vue-router'

const auth   = useAuthStore()
const router = useRouter()

async function cerrarSesion() {
  await auth.logout()
  router.push('/login')
}
</script>

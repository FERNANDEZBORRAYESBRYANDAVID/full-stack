// src/stores/auth.js
// Store de Pinia para manejar autenticación y token

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getApiUrl } from '@/config/api.js'

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const token   = ref(localStorage.getItem('token') || null)
  const usuario = ref(JSON.parse(localStorage.getItem('usuario') || 'null'))

  // Getters
  const estaAutenticado = computed(() => !!token.value)

  // Headers para peticiones protegidas
  function headersAuth() {
    return {
      'Authorization': `Bearer ${token.value}`,
      'Content-Type': 'application/json'
    }
  }

  // Iniciar sesión
  async function login(nombreUsuario, password) {
    const API_URL = await getApiUrl()
    const res = await fetch(`${API_URL}/auth/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre_de_usuario: nombreUsuario, password })
    })
    const data = await res.json()

    if (data.success) {
      token.value   = data.token
      usuario.value = data.usuario
      localStorage.setItem('token', data.token)
      localStorage.setItem('usuario', JSON.stringify(data.usuario))
    }
    return data
  }

  // Registrar usuario
  async function registrar(nombreUsuario, password) {
    const API_URL = await getApiUrl()
    const res = await fetch(`${API_URL}/auth/registrar.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre_de_usuario: nombreUsuario, password })
    })
    return await res.json()
  }

  // Cerrar sesión
  async function logout() {
    try {
      const API_URL = await getApiUrl()
      await fetch(`${API_URL}/auth/logout.php`, {
        method: 'POST',
        headers: headersAuth()
      })
    } catch (_) {}

    token.value   = null
    usuario.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
  }

  // Obtener perfil actualizado
  async function obtenerPerfil() {
    const API_URL = await getApiUrl()
    const res = await fetch(`${API_URL}/auth/perfil.php`, {
      headers: headersAuth()
    })
    const data = await res.json()
    if (data.success) {
      usuario.value = data.usuario
      localStorage.setItem('usuario', JSON.stringify(data.usuario))
    }
    return data
  }

  return {
    token,
    usuario,
    estaAutenticado,
    headersAuth,
    login,
    registrar,
    logout,
    obtenerPerfil
  }
})

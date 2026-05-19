// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getApiUrl } from '@/config/api.js'

export const useAuthStore = defineStore('auth', () => {
  const token   = ref(localStorage.getItem('token') || null)
  const usuario = ref(JSON.parse(localStorage.getItem('usuario') || 'null'))

  const estaAutenticado = computed(() => !!token.value)

  function headersAuth() {
    return {
      'Authorization': `Bearer ${token.value}`
    }
  }

  async function login(nombreUsuario, password) {
    const API_URL = await getApiUrl()
    const fd = new FormData()
    fd.append('nombre_de_usuario', nombreUsuario)
    fd.append('password', password)
    const res = await fetch(`${API_URL}/auth/login.php`, { method: 'POST', body: fd })
    const data = await res.json()
    if (data.success) {
      token.value   = data.token
      usuario.value = data.usuario
      localStorage.setItem('token', data.token)
      localStorage.setItem('usuario', JSON.stringify(data.usuario))
    }
    return data
  }

  async function registrar(nombreUsuario, password) {
    const API_URL = await getApiUrl()
    const fd = new FormData()
    fd.append('nombre_de_usuario', nombreUsuario)
    fd.append('password', password)
    const res = await fetch(`${API_URL}/auth/registrar.php`, { method: 'POST', body: fd })
    return await res.json()
  }

  async function logout() {
    try {
      const API_URL = await getApiUrl()
      const fd = new FormData()
      await fetch(`${API_URL}/auth/logout.php`, { method: 'POST', headers: headersAuth(), body: fd })
    } catch (_) {}
    token.value   = null
    usuario.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
  }

  async function obtenerPerfil() {
    const API_URL = await getApiUrl()
    const res = await fetch(`${API_URL}/auth/perfil.php`, { headers: headersAuth() })
    const data = await res.json()
    if (data.success) {
      usuario.value = data.usuario
      localStorage.setItem('usuario', JSON.stringify(data.usuario))
    }
    return data
  }

  return { token, usuario, estaAutenticado, headersAuth, login, registrar, logout, obtenerPerfil }
})
// src/config/api.js
// Lee la URL del API desde /public/config.json
// Esto permite cambiar el backend sin recompilar el proyecto

let cachedUrl = null

export async function getApiUrl() {
  if (cachedUrl) return cachedUrl

  const response = await fetch('/agenda-contactos/config.json')
  const config = await response.json()
  cachedUrl = config.API_URL
  return cachedUrl
}

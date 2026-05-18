let cachedUrl = null

export async function getApiUrl() {
  if (cachedUrl) return cachedUrl

  const response = await fetch('/full-stack/config.json')
  const config = await response.json()
  cachedUrl = config.API_URL
  return cachedUrl
}

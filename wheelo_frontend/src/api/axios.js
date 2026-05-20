import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const publicApi = axios.create({
  baseURL: `${BASE_URL}/api/public`,
  headers: { 'Content-Type': 'application/json' },
})

export const adminApi = axios.create({
  baseURL: `${BASE_URL}/api/admin`,
  headers: { 'Content-Type': 'application/json' },
})

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('wheelo_access')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

adminApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refresh = localStorage.getItem('wheelo_refresh')
        const { data } = await axios.post(`${BASE_URL}/api/admin/auth/refresh/`, { refresh })
        localStorage.setItem('wheelo_access', data.access)
        original.headers.Authorization = `Bearer ${data.access}`
        return adminApi(original)
      } catch {
        localStorage.removeItem('wheelo_access')
        localStorage.removeItem('wheelo_refresh')
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)

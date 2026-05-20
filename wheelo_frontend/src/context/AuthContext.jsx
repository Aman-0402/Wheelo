import { createContext, useContext, useState, useCallback } from 'react'
import { adminLogin, adminLogout } from '@/api/admin'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('wheelo_access')
  )

  const login = useCallback(async (credentials) => {
    const { data } = await adminLogin(credentials)
    localStorage.setItem('wheelo_access', data.access)
    localStorage.setItem('wheelo_refresh', data.refresh)
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(async () => {
    try { await adminLogout() } catch { /* ignore */ }
    localStorage.removeItem('wheelo_access')
    localStorage.removeItem('wheelo_refresh')
    setIsAuthenticated(false)
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

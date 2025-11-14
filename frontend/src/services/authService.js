import api from './api'

export const authService = {
  async signup(userData) {
    const response = await api.post('/api/auth/signup', userData)
    return response.data
  },

  async login(username, password) {
    const response = await api.post('/api/auth/login', { username, password })
    return response.data
  },

  async refresh(refreshToken) {
    const response = await api.post('/api/auth/refresh', { token: refreshToken })
    return response.data
  },

  async logout(refreshToken) {
    const response = await api.post('/api/auth/logout', { refreshToken })
    return response.data
  },
}


import api from './api'

export const userService = {
  async getProfile() {
    const response = await api.get('/api/user/profile')
    return response.data
  },

  async getDashboard() {
    const response = await api.get('/api/user/dashboard')
    return response.data
  },

  async updateProfile(profileData) {
    const response = await api.post('/api/user/settings/update-profile', profileData)
    return response.data
  },

  async changePassword(oldPassword, newPassword) {
    const response = await api.post('/api/user/settings/change-password', {
      oldPassword,
      newPassword,
    })
    return response.data
  },

  async deleteAccount() {
    const response = await api.post('/api/user/settings/delete-account')
    return response.data
  },
}


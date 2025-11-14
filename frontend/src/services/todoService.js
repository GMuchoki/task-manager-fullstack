import api from './api'

export const todoService = {
  async getAllTodos() {
    const response = await api.get('/api/todos')
    return response.data
  },

  async addTodo(task, completed = 0) {
    const response = await api.post('/api/todos', { task, completed })
    return response.data
  },

  async updateTodo(id, task, completed) {
    const response = await api.put(`/api/todos/${id}`, { task, completed })
    return response.data
  },

  async patchTodo(id, updates) {
    const response = await api.patch(`/api/todos/${id}`, updates)
    return response.data
  },

  async deleteTodo(id) {
    const response = await api.delete(`/api/todos/${id}`)
    return response.data
  },
}


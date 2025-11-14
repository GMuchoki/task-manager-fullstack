import { useState, useEffect } from 'react'
import { todoService } from '../services/todoService'
import './Todos.css'

const Todos = () => {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [newTask, setNewTask] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTask, setEditTask] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await todoService.getAllTodos()
      setTodos(response.todos || [])
    } catch (error) {
      setError('Failed to fetch todos')
      console.error('Error fetching todos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newTask.trim()) return

    try {
      await todoService.addTodo(newTask.trim(), 0)
      setNewTask('')
      await fetchTodos()
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to add todo')
    }
  }

  const handleToggle = async (id, currentCompleted) => {
    try {
      await todoService.patchTodo(id, { completed: currentCompleted === 1 ? 0 : 1 })
      await fetchTodos()
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update todo')
    }
  }

  const handleEdit = (todo) => {
    setEditingId(todo.id)
    setEditTask(todo.task)
  }

  const handleUpdate = async (id) => {
    if (!editTask.trim()) return

    try {
      const todo = todos.find((t) => t.id === id)
      await todoService.updateTodo(id, editTask.trim(), todo.completed)
      setEditingId(null)
      setEditTask('')
      await fetchTodos()
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update todo')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditTask('')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return

    try {
      await todoService.deleteTodo(id)
      await fetchTodos()
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete todo')
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="todos-page">
        <h1>My Todos</h1>

        {error && (
          <div className="error-message" onClick={() => setError('')}>
            {error} (click to dismiss)
          </div>
        )}

        <form onSubmit={handleAdd} className="add-todo-form">
          <input
            type="text"
            className="input"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Add Todo
          </button>
        </form>

        {todos.length === 0 ? (
          <div className="empty-state">
            <p>No todos yet. Add one above to get started!</p>
          </div>
        ) : (
          <div className="todos-list">
            {todos.map((todo) => (
              <div key={todo.id} className={`todo-card ${todo.completed === 1 ? 'completed' : ''}`}>
                {editingId === todo.id ? (
                  <div className="todo-edit">
                    <input
                      type="text"
                      className="input"
                      value={editTask}
                      onChange={(e) => setEditTask(e.target.value)}
                      autoFocus
                    />
                    <div className="todo-actions">
                      <button
                        onClick={() => handleUpdate(todo.id)}
                        className="btn btn-primary"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="btn btn-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="todo-content">
                      <input
                        type="checkbox"
                        checked={todo.completed === 1}
                        onChange={() => handleToggle(todo.id, todo.completed)}
                        className="todo-checkbox"
                      />
                      <span className="todo-text">{todo.task}</span>
                    </div>
                    <div className="todo-actions">
                      <button
                        onClick={() => handleEdit(todo)}
                        className="btn btn-outline"
                        disabled={todo.completed === 1}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {todos.length > 0 && (
          <div className="todos-summary">
            <p>
              {todos.filter((t) => t.completed === 1).length} of {todos.length} tasks completed
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Todos


import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { userService } from '../services/userService'
import { todoService } from '../services/todoService'
import './Dashboard.css'

const Dashboard = () => {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, todosRes] = await Promise.all([
          userService.getDashboard(),
          todoService.getAllTodos(),
        ])
        setDashboardData(dashboardRes)
        setTodos(todosRes.todos || [])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  const completedTodos = todos.filter((todo) => todo.completed === 1).length
  const pendingTodos = todos.length - completedTodos

  return (
    <div className="container">
      <div className="dashboard">
        <h1>Dashboard</h1>
        <p className="welcome-message">
          {dashboardData?.message || `Welcome back, ${user?.username || 'User'}!`}
        </p>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <p className="stat-number">{todos.length}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p className="stat-number stat-success">{completedTodos}</p>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <p className="stat-number stat-warning">{pendingTodos}</p>
          </div>
        </div>

        <div className="dashboard-actions">
          <Link to="/todos" className="btn btn-primary">
            Manage Todos
          </Link>
          <Link to="/profile" className="btn btn-outline">
            View Profile
          </Link>
        </div>

        {todos.length > 0 && (
          <div className="recent-todos">
            <h2>Recent Todos</h2>
            <div className="todo-list">
              {todos.slice(0, 5).map((todo) => (
                <div key={todo.id} className="todo-item">
                  <span className={todo.completed === 1 ? 'completed' : ''}>
                    {todo.task}
                  </span>
                  <span className={`todo-status ${todo.completed === 1 ? 'completed' : 'pending'}`}>
                    {todo.completed === 1 ? '✓ Done' : '○ Pending'}
                  </span>
                </div>
              ))}
            </div>
            {todos.length > 5 && (
              <Link to="/todos" className="view-all-link">
                View all todos →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard


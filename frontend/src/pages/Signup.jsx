import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { validateSignup } from '../utils/validation'
import './Auth.css'

const Signup = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const { signup, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
    setApiError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')

    const validationErrors = validateSignup(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    const { confirmPassword, ...signupData } = formData
    const result = await signup(signupData)
    setLoading(false)

    if (result.success) {
      setSuccessMessage('Account created successfully! Redirecting to login...')
      // Show success message for 2 seconds before redirecting
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 2000)
    } else {
      setApiError(result.error || 'Signup failed')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          {successMessage && <div className="success-message">{successMessage}</div>}
          {apiError && <div className="error-message">{apiError}</div>}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name" className="label">
                First Name *
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                className="input"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
              {errors.first_name && <div className="error">{errors.first_name}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="middle_name" className="label">
                Middle Name
              </label>
              <input
                type="text"
                id="middle_name"
                name="middle_name"
                className="input"
                value={formData.middle_name}
                onChange={handleChange}
              />
              {errors.middle_name && <div className="error">{errors.middle_name}</div>}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="last_name" className="label">
              Last Name *
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              className="input"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
            {errors.last_name && <div className="error">{errors.last_name}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="username" className="label">
              Username *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="input"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {errors.username && <div className="error">{errors.username}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="email" className="label">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="input"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="password" className="label">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="input"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <div className="error">{errors.password}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword" className="label">
              Confirm Password *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
          <p className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Signup


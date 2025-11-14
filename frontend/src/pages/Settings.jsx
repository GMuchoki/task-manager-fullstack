import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { userService } from '../services/userService'
import { isValidName, isValidEmail, isValidPassword } from '../utils/validation'
import './Settings.css'

const Settings = () => {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [profileForm, setProfileForm] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
  })

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await userService.getProfile()
      const profile = response.user
      setProfileForm({
        first_name: profile.first_name || '',
        middle_name: profile.middle_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
      })
    } catch (error) {
      setError('Failed to fetch profile')
      console.error('Error fetching profile:', error)
    }
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
    setError('')
    setSuccess('')
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))
    setError('')
    setSuccess('')
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!isValidName(profileForm.first_name) || !isValidName(profileForm.last_name)) {
      setError('Invalid name format')
      return
    }

    if (profileForm.middle_name && !isValidName(profileForm.middle_name)) {
      setError('Invalid middle name format')
      return
    }

    if (!isValidEmail(profileForm.email)) {
      setError('Invalid email format')
      return
    }

    setLoading(true)
    try {
      const response = await userService.updateProfile(profileForm)
      updateUser({ ...user, ...response.user })
      setSuccess('Profile updated successfully')
      await fetchProfile()
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!isValidPassword(passwordForm.newPassword)) {
      setError(
        'New password must be at least 8 characters with uppercase, lowercase, number, and special character'
      )
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await userService.changePassword(passwordForm.oldPassword, passwordForm.newPassword)
      setSuccess('Password changed successfully. Please login again.')
      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setTimeout(() => {
        logout()
        navigate('/login')
      }, 2000)
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    if (!window.confirm('This will permanently delete your account and all your data. Are you absolutely sure?')) {
      return
    }

    setLoading(true)
    try {
      await userService.deleteAccount()
      await logout()
      navigate('/login')
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete account')
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="settings-page">
        <h1>Settings</h1>

        <div className="settings-tabs">
          <button
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            Password
          </button>
          <button
            className={`tab-button ${activeTab === 'danger' ? 'active' : ''}`}
            onClick={() => setActiveTab('danger')}
          >
            Danger Zone
          </button>
        </div>

        {error && (
          <div className="error-message" onClick={() => setError('')}>
            {error} (click to dismiss)
          </div>
        )}

        {success && (
          <div className="success-message" onClick={() => setSuccess('')}>
            {success} (click to dismiss)
          </div>
        )}

        <div className="settings-content">
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="settings-form">
              <div className="form-group">
                <label htmlFor="first_name" className="label">
                  First Name *
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  className="input"
                  value={profileForm.first_name}
                  onChange={handleProfileChange}
                  required
                />
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
                  value={profileForm.middle_name}
                  onChange={handleProfileChange}
                />
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
                  value={profileForm.last_name}
                  onChange={handleProfileChange}
                  required
                />
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
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword} className="settings-form">
              <div className="form-group">
                <label htmlFor="oldPassword" className="label">
                  Current Password *
                </label>
                <input
                  type="password"
                  id="oldPassword"
                  name="oldPassword"
                  className="input"
                  value={passwordForm.oldPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword" className="label">
                  New Password *
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  className="input"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword" className="label">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="input"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          )}

          {activeTab === 'danger' && (
            <div className="danger-zone">
              <h2>Delete Account</h2>
              <p>Once you delete your account, there is no going back. Please be certain.</p>
              <button
                onClick={handleDeleteAccount}
                className="btn btn-danger"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete My Account'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings


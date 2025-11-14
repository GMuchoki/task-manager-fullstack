import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { userService } from '../services/userService'
import './Profile.css'

const Profile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await userService.getProfile()
      setProfile(response.user)
    } catch (error) {
      setError('Failed to fetch profile')
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFullName = () => {
    if (!profile) return ''
    const parts = [profile.first_name]
    if (profile.middle_name) parts.push(profile.middle_name)
    parts.push(profile.last_name)
    return parts.join(' ')
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="container">
        <div className="error-message">{error || 'Profile not found'}</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="profile-page">
        <h1>Profile</h1>
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {getFullName()
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div className="profile-info">
              <h2>{getFullName()}</h2>
              <p className="profile-username">@{profile.username}</p>
            </div>
          </div>
          <div className="profile-details">
            <div className="detail-item">
              <span className="detail-label">First Name:</span>
              <span className="detail-value">{profile.first_name}</span>
            </div>
            {profile.middle_name && (
              <div className="detail-item">
                <span className="detail-label">Middle Name:</span>
                <span className="detail-value">{profile.middle_name}</span>
              </div>
            )}
            <div className="detail-item">
              <span className="detail-label">Last Name:</span>
              <span className="detail-value">{profile.last_name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Username:</span>
              <span className="detail-value">{profile.username}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{profile.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile


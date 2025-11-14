export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*.\-_]).{8,}$/
export const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
export const nameRegex = /^[A-Za-z\s-]{2,50}$/
export const emailRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,10}$/

export const isValidPassword = (password) => passwordRegex.test(password)
export const isValidUsername = (username) => usernameRegex.test(username)
export const isValidName = (name) => nameRegex.test(name)
export const isValidEmail = (email) => emailRegex.test(email)

export const validateSignup = (formData) => {
  const errors = {}

  if (!formData.first_name || !isValidName(formData.first_name)) {
    errors.first_name = 'First name must be 2-50 characters (letters, spaces, or hyphens)'
  }

  if (formData.middle_name && !isValidName(formData.middle_name)) {
    errors.middle_name = 'Middle name must be 2-50 characters (letters, spaces, or hyphens)'
  }

  if (!formData.last_name || !isValidName(formData.last_name)) {
    errors.last_name = 'Last name must be 2-50 characters (letters, spaces, or hyphens)'
  }

  if (!formData.username || !isValidUsername(formData.username)) {
    errors.username = 'Username must be 3-20 characters (letters, numbers, or underscores)'
  }

  if (!formData.email || !isValidEmail(formData.email)) {
    errors.email = 'Invalid email format'
  }

  if (!formData.password || !isValidPassword(formData.password)) {
    errors.password =
      'Password must be at least 8 characters with uppercase, lowercase, number, and special character (#?!@$%^&*.-_)'
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  return errors
}


import { useState } from 'react'
import './LoginPage.css'

const LoginPage = ({ onLogin, onBack }) => {
  const [activeTab, setActiveTab] = useState('signin')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (activeTab === 'signup') {
      if (!formData.name) {
        newErrors.name = 'Name is required'
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check hardcoded credentials
      if (formData.email === 'hacker@gmail.com' && formData.password === 'hackmit') {
        const userData = {
          email: formData.email,
          name: formData.name || 'Hacker'
        }
        onLogin(userData)
      } else {
        setErrors({ general: 'Invalid credentials. Please use hacker@gmail.com with password hackmit.' })
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const switchTab = (tab) => {
    setActiveTab(tab)
    setErrors({})
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    })
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <button className="back-button" onClick={onBack}>
            ← Back to Synthra
          </button>
          <h1 className="login-title">Welcome to Synthra</h1>
          <p className="login-subtitle">
            {activeTab === 'signin' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        <div className="login-form-container">
          <div className="tab-switcher">
            <button 
              className={`tab-button ${activeTab === 'signin' ? 'active' : ''}`}
              onClick={() => switchTab('signin')}
            >
              Sign In
            </button>
            <button 
              className={`tab-button ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => switchTab('signup')}
            >
              Sign Up
            </button>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="error-message general-error">
                {errors.general}
              </div>
            )}

            {activeTab === 'signup' && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? 'error' : ''}
                  placeholder="Enter your full name"
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                placeholder="Enter your email"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
                placeholder="Enter your password"
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            {activeTab === 'signup' && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={errors.confirmPassword ? 'error' : ''}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
            )}

            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner-small"></span>
              ) : (
                activeTab === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              {activeTab === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <button 
                className="link-button"
                onClick={() => switchTab(activeTab === 'signin' ? 'signup' : 'signin')}
              >
                {activeTab === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

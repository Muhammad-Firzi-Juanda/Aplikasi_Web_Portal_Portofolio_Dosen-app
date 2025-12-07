import { useState, useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { User, Mail, Phone, Globe, Save, Lock, Trash2, Image as ImageIcon } from 'lucide-react'
import { userApi, authApi } from '../utils/api'
import { useNavigate } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog'

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuthStore()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null)
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      bio: user?.bio || '',
      phone: user?.phone || '',
      website: user?.website || '',
      location: user?.location || '',
      university: user?.university || '',
      department: user?.department || '',
      position: user?.position || ''
    }
  })

  useEffect(() => {
    // Update form when user data changes
    reset({
      fullName: user?.fullName || '',
      email: user?.email || '',
      bio: user?.bio || '',
      phone: user?.phone || '',
      website: user?.website || '',
      location: user?.location || '',
      university: user?.university || '',
      department: user?.department || '',
      position: user?.position || ''
    })
  }, [user, reset])

  const handleAvatarSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      toast.error('Please select a valid image file')
    }
  }

  const uploadAvatar = async (file) => {
    if (!file) return null
    
    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', user?.id || user?.userId)
    
    try {
      const response = await userApi.post('/api/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      if (response.data && response.data.success) {
        return response.data.data.url
      }
    } catch (error) {
      console.error('Avatar upload error:', error)
      toast.error('Failed to upload avatar')
    }
    return null
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    try {
      const response = await authApi.post('/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })

      if (response.data && response.data.success) {
        toast.success('Password changed successfully! Please login again with your new password.')
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setShowPasswordForm(false)
        
        // Logout user and redirect to login
        setTimeout(() => {
          logout()
          navigate('/login')
        }, 1500)
      } else {
        toast.error(response.data?.message || 'Failed to change password')
      }
    } catch (error) {
      console.error('Password change error:', error)
      toast.error(error.response?.data?.message || 'Failed to change password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsLoading(true)
    try {
      const response = await userApi.delete(`/api/users/${user?.id || user?.userId}`)

      if (response.data && response.data.success) {
        toast.success('Account deleted successfully')
        logout()
        navigate('/')
      } else {
        toast.error('Failed to delete account')
      }
    } catch (error) {
      console.error('Delete account error:', error)
      toast.error(error.response?.data?.message || 'Failed to delete account')
    } finally {
      setIsLoading(false)
      setDeleteConfirm(false)
    }
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      if (!user || !user.id) {
        toast.error('User ID not found')
        setIsLoading(false)
        return
      }

      let avatarUrl = user.avatar
      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile)
        if (!avatarUrl && avatarFile) {
          toast.error('Failed to upload avatar')
          setIsLoading(false)
          return
        }
      }

      // Split fullName into firstName and lastName
      const nameParts = data.fullName.trim().split(' ')
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(' ') || ''

      const updateData = {
        firstName,
        lastName,
        bio: data.bio,
        phone: data.phone,
        website: data.website,
        location: data.location,
        university: data.university,
        department: data.department,
        position: data.position,
        email: user.email,
        username: user.username,
        avatar: avatarUrl
      }

      console.log('Updating user:', user.id, updateData)
      const response = await userApi.put(`/api/users/${user.id}`, updateData)
      
      if (response.data && response.data.success) {
        // Update auth store with new user data
        updateUser({
          ...user,
          fullName: data.fullName,
          bio: data.bio,
          phone: data.phone,
          website: data.website,
          location: data.location,
          university: data.university,
          department: data.department,
          position: data.position,
          avatar: avatarUrl
        })
        
        setAvatarFile(null)
        
        // Trigger refresh of public profile if avatar was updated
        if (avatarFile) {
          // Invalidate cache by reloading the public profile
          window.dispatchEvent(new CustomEvent('profileUpdated', { detail: { username: user.username } }))
        }
        
        toast.success('Profile updated successfully!')
      } else {
        toast.error('Failed to update profile')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gh-text">Profile Settings</h1>
        <p className="text-gray-600 dark:text-gh-text-secondary mt-2">
          Manage your profile information and preferences
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Avatar Upload */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gh-text mb-6 flex items-center">
            <ImageIcon className="h-5 w-5 mr-2" />
            Profile Photo
          </h2>
          
          <div className="flex flex-col items-center space-y-4">
            {avatarPreview ? (
              <>
                <img 
                  src={avatarPreview} 
                  alt="Avatar preview" 
                  className="w-32 h-32 rounded-full object-contain border-4 border-primary-200 dark:border-gh-border"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('avatar-input').click()}
                  className="btn btn-outline btn-compact"
                >
                  Change Photo
                </button>
              </>
            ) : (
              <div 
                className="w-32 h-32 rounded-full bg-primary-100 dark:bg-gh-bg-tertiary border-2 border-dashed border-primary-300 dark:border-gh-border flex items-center justify-center cursor-pointer hover:bg-primary-50 dark:hover:bg-gh-bg-hover transition-colors"
                onClick={() => document.getElementById('avatar-input').click()}
              >
                <ImageIcon className="h-12 w-12 text-primary-400 dark:text-gh-text-tertiary" />
              </div>
            )}
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleAvatarSelect(e.target.files?.[0])}
            />
            <p className="text-sm text-gray-500 dark:text-gh-text-tertiary">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gh-text mb-6 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gh-text mb-2">
                Full Name
              </label>
              <input
                {...register('fullName', { required: 'Full name is required' })}
                type="text"
                className="input"
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gh-text mb-2">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                className="input"
                disabled
                placeholder="Email address"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gh-text mb-2">
                Bio
              </label>
              <textarea
                {...register('bio')}
                rows={4}
                className="input"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gh-text mb-6 flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Contact Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gh-text mb-2">
                Phone
              </label>
              <input
                {...register('phone')}
                type="tel"
                className="input"
                placeholder="Phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gh-text mb-2">
                Website
              </label>
              <input
                {...register('website')}
                type="url"
                className="input"
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gh-text mb-2">
                Location
              </label>
              <input
                {...register('location')}
                type="text"
                className="input"
                placeholder="City, Country"
              />
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gh-text mb-6 flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Academic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gh-text mb-2">
                University
              </label>
              <input
                {...register('university')}
                type="text"
                className="input"
                placeholder="University name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gh-text mb-2">
                Department
              </label>
              <input
                {...register('department')}
                type="text"
                className="input"
                placeholder="Department name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gh-text mb-2">
                Position
              </label>
              <input
                {...register('position')}
                type="text"
                className="input"
                placeholder="e.g., Professor, Lecturer"
              />
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gh-text flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              Security
            </h2>
            {!showPasswordForm && (
              <button
                type="button"
                onClick={() => setShowPasswordForm(true)}
                className="btn btn-outline btn-compact"
              >
                Change Password
              </button>
            )}
          </div>

          {showPasswordForm && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gh-text mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="input"
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gh-text mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="input"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gh-text mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="input"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary btn-compact disabled:opacity-50"
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false)
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                  }}
                  className="btn btn-outline btn-compact"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Delete Account */}
        <div className="card p-6 border-red-200 dark:border-red-500/40">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 flex items-center">
                <Trash2 className="h-5 w-5 mr-2" />
                Delete Account
              </h2>
              <p className="text-sm text-gray-600 dark:text-gh-text-secondary mt-2">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDeleteConfirm(true)}
              className="btn btn-outline btn-compact border-red-200 text-red-500 hover:bg-red-50 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10"
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>

      {/* Delete Account Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={handleDeleteAccount}
        onCancel={() => setDeleteConfirm(false)}
      />
    </div>
  )
}

<template>
  <div class="space-y-6 max-w-3xl">
    <!-- Page Header -->
    <div>
      <h2 class="text-2xl font-bold text-slate-800">Profile Settings</h2>
      <p class="text-sm text-slate-500 mt-1">Manage your personal information and account settings</p>
    </div>

    <!-- Profile Card -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <!-- Avatar Section -->
      <div class="p-6 sm:p-8 border-b border-gray-100">
        <div class="flex flex-col sm:flex-row items-center gap-6">
          <!-- Avatar Preview -->
          <div class="relative group">
            <div class="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ring-4 ring-white shadow-lg">
              <img 
                v-if="avatarPreview || profile.avatar_url" 
                :src="(avatarPreview || profile.avatar_url) as string" 
                alt="Avatar"
                class="w-full h-full object-cover"
              />
              <svg v-else class="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <label class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
              <input 
                type="file" 
                accept="image/*" 
                class="hidden" 
                @change="handleAvatarUpload"
              />
            </label>
          </div>
          
          <div class="text-center sm:text-left">
            <h3 class="text-lg font-semibold text-slate-800">{{ profile.name || 'Administrator' }}</h3>
            <p class="text-sm text-slate-500">{{ profile.email }}</p>
            <div class="flex gap-2 mt-3 justify-center sm:justify-start">
              <label class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
                {{ profile.avatar ? 'Change Photo' : 'Upload Photo' }}
                <input 
                  type="file" 
                  accept="image/*" 
                  class="hidden" 
                  @change="handleAvatarUpload"
                />
              </label>
              <button 
                v-if="profile.avatar"
                @click="removeAvatar"
                class="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Profile Form -->
      <div class="p-6 sm:p-8">
        <h3 class="text-lg font-semibold text-slate-800 mb-4">Personal Information</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              v-model="form.name" 
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              v-model="form.email" 
              type="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <input 
              :value="profile.role" 
              type="text" 
              readonly
              class="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>

          <div class="pt-2">
            <button 
              @click="updateProfile"
              :disabled="saving"
              class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg v-if="saving" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Password -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 sm:p-8">
        <h3 class="text-lg font-semibold text-slate-800 mb-4">Change Password</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input 
              v-model="passwordForm.current_password" 
              type="password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input 
              v-model="passwordForm.password" 
              type="password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter new password (min 6 characters)"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input 
              v-model="passwordForm.password_confirmation" 
              type="password"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="passwordMismatch ? 'border-red-300' : 'border-gray-300'"
              placeholder="Confirm new password"
            />
            <p v-if="passwordMismatch" class="text-xs text-red-500 mt-1">Passwords do not match</p>
          </div>

          <div class="pt-2">
            <button 
              @click="changePassword"
              :disabled="changingPassword || passwordMismatch"
              class="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg v-if="changingPassword" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              {{ changingPassword ? 'Changing...' : 'Change Password' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Swal from 'sweetalert2'
import api from '@/api'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

interface Profile {
  id: number
  name: string
  email: string
  role: string
  avatar?: string | null
  avatar_url?: string | null
}

const profile = ref<Profile>({
  id: 0,
  name: '',
  email: '',
  role: 'admin',
  avatar: null,
  avatar_url: null,
})

const form = ref({
  name: '',
  email: '',
})

const passwordForm = ref({
  current_password: '',
  password: '',
  password_confirmation: '',
})

const avatarPreview = ref<string | null>(null)
const saving = ref(false)
const changingPassword = ref(false)

const passwordMismatch = computed<boolean>(() => {
  return !!(passwordForm.value.password && 
         passwordForm.value.password_confirmation && 
         passwordForm.value.password !== passwordForm.value.password_confirmation)
})

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
})

const fetchProfile = async () => {
  try {
    const { data } = await api.get('/admin/profile')
    const userData: Profile = data.data
    profile.value = userData
    form.value.name = userData.name || ''
    form.value.email = userData.email || ''
  } catch (error) {
    console.error('Failed to fetch profile:', error)
  }
}

const updateProfile = async () => {
  saving.value = true
  try {
    const { data } = await api.put('/admin/profile', form.value)
    profile.value = data.data as Profile
    
    // Update auth store
    authStore.updateUser({
      name: form.value.name,
      email: form.value.email,
    })
    
    Toast.fire({ icon: 'success', title: 'Profile updated successfully' })
  } catch (e: any) {
    Toast.fire({ 
      icon: 'error', 
      title: e.response?.data?.message || 'Failed to update profile' 
    })
  } finally {
    saving.value = false
  }
}

const handleAvatarUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = (e.target?.result as string) || null
  }
  reader.readAsDataURL(file)

  const formData = new FormData()
  formData.append('avatar', file)

  try {
    const { data } = await api.post('/admin/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    profile.value.avatar_url = data.avatar_url || null
    profile.value.avatar = data.avatar || null
    
    // Update auth store so sidebar shows new avatar immediately
    authStore.updateUser({
      avatar: data.avatar || null,
      avatar_url: data.avatar_url || null,
    })
    
    Toast.fire({ icon: 'success', title: 'Avatar updated successfully' })
  } catch (e: any) {
    avatarPreview.value = null
    Toast.fire({ 
      icon: 'error', 
      title: e.response?.data?.message || 'Failed to upload avatar' 
    })
  }
}

const removeAvatar = async () => {
  const result = await Swal.fire({
    title: 'Remove Avatar?',
    text: 'Are you sure you want to remove your profile photo?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, remove',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#dc2626',
  })

  if (result.isConfirmed) {
    try {
      await api.delete('/admin/profile/avatar')
      profile.value.avatar = null
      profile.value.avatar_url = null
      avatarPreview.value = null
      
      // Update auth store
      authStore.updateUser({
        avatar: null,
        avatar_url: null,
      })
      
      Toast.fire({ icon: 'success', title: 'Avatar removed' })
    } catch (e: any) {
      Toast.fire({ icon: 'error', title: 'Failed to remove avatar' })
    }
  }
}

const changePassword = async () => {
  if (passwordMismatch.value) return
  
  changingPassword.value = true
  try {
    await api.put('/admin/profile/password', passwordForm.value)
    passwordForm.value = {
      current_password: '',
      password: '',
      password_confirmation: '',
    }
    Toast.fire({ icon: 'success', title: 'Password changed successfully' })
  } catch (e: any) {
    Toast.fire({ 
      icon: 'error', 
      title: e.response?.data?.message || 'Failed to change password' 
    })
  } finally {
    changingPassword.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>
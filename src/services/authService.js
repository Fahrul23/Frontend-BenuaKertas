import api from './axios'

/**
 * Login user dengan email dan password.
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ token: string, user: object }>}
 */
export const loginUser = async (credentials) => {
  const response = await api.post('auth/login', credentials)
  return response.data.data
}

/**
 * Register user baru.
 * @param {{ name: string, email: string, password: string }} userData
 * @returns {Promise<{ user: object }>}
 */
export const registerUser = async (userData) => {
  const response = await api.post('auth/register', userData)
  return response.data.data
}

/**
 * Mendapatkan profile user yang sedang login.
 * @returns {Promise<{ id: string, name: string, email: string, role: string }>}
 */
export const getMe = async () => {
  const response = await api.get('auth/me')
  return response.data.data
}

/**
 * Logout — hapus token dari storage.
 */
export const logoutUser = () => {
  localStorage.removeItem('token')
}

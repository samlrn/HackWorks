import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

export const getAirQuality = async (zipCode) => {
  try {
    const response = await apiClient.get(`/api/air-quality/${zipCode}`)
    return response.data
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`No air quality data found for zip code ${zipCode}`)
    } else if (error.response?.status === 429) {
      throw new Error('API rate limit exceeded. Please try again later.')
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please check your connection.')
    } else if (error.message === 'Network Error') {
      throw new Error('Unable to connect to server. Is the backend running?')
    }
    throw error
  }
}

export const signupSubscriber = async (name, phone, zipCode, role) => {
  try {
    const response = await apiClient.post('/api/subscribers/signup', {
      name,
      phone_number: phone,
      zip_code: zipCode,
      role,
    })
    return response.data
  } catch (error) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail)
    }
    throw error
  }
}

export const triggerAlert = async (zipCode, overrideAqi = null) => {
  try {
    const payload = { zip_code: zipCode }
    if (overrideAqi !== null) {
      payload.override_aqi = overrideAqi
    }
    const response = await apiClient.post('/api/alerts/trigger', payload)
    return response.data
  } catch (error) {
    throw error
  }
}

export const getSubscriberCount = async (zipCode) => {
  try {
    const response = await apiClient.get(`/api/subscribers/count/${zipCode}`)
    return response.data
  } catch (error) {
    throw error
  }
}

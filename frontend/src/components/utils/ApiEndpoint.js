// libs
import axios from 'axios'

const apiEndpoint = axios.create({
    baseURL: 'http://localhost:1331/api',
})

// Add a request interceptor
apiEndpoint.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Add a response interceptor to handle token refresh
apiEndpoint.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // If the error is 401 and we haven't retried yet
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                // Try to refresh the token
                const refreshToken = localStorage.getItem('refreshToken')
                const response = await apiEndpoint.post('/token/refresh/', {
                    refresh: refreshToken,
                })

                const { access } = response.data

                // Save the new token
                localStorage.setItem('accessToken', access)

                // Retry the original request with new token
                originalRequest.headers.Authorization = `Bearer ${access}`
                return axios(originalRequest)
            } catch (error) {
                // If refresh token fails, redirect to login
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default apiEndpoint

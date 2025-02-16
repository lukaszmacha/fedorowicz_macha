// local components
import apiEndpoint from './ApiEndpoint'

const handleLogout = async (navigate) => {
    try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
            await apiEndpoint.post('/token/blacklist/', {
                refresh: refreshToken,
            })
        }
    } catch (error) {
        console.error('Logout error:', error)
    } finally {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('username')
        if (navigate) navigate('/')
    }
}

export default handleLogout

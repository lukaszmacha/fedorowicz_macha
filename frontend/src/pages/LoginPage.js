// libs
import React, { useState, useEffect } from 'react'

// local components
import NavbarComponent from '../components/utils/NavbarComponent'
import handleLogout from '../components/utils/LogoutAction'
import apiEndpoint from '../components/utils/ApiEndpoint'

// assets
import 'bootstrap/dist/css/bootstrap.min.css'

const LoginPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    useEffect(() => {
        const isAuth = localStorage.getItem('accessToken') !== null

        if (isAuth) {
            handleLogout()
        }
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const response = await apiEndpoint.post('/token/', {
                username,
                password,
            })
            const { refresh, access } = response.data
            localStorage.setItem('refreshToken', refresh)
            localStorage.setItem('accessToken', access)
            setMessage('Login successful!')
            window.location.href = '/'
        } catch (error) {
            setMessage(
                'Login failed. Please check your credentials and try again.'
            )
        }
    }

    return (
        <div className='App'>
            <NavbarComponent />
            <header className='App-header'>
                <h1>Login</h1>
                <div
                    className='form-container'
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '50vw',
                    }}>
                    <form onSubmit={handleSubmit} style={{ width: '75%' }}>
                        <div className='mb-3'>
                            <label
                                htmlFor='username'
                                className='form-label fs-4'>
                                Username
                            </label>
                            <input
                                type='text'
                                className='form-control'
                                id='username'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div className='mb-3'>
                            <label
                                htmlFor='password'
                                className='form-label fs-4'>
                                Password
                            </label>
                            <input
                                type='password'
                                className='form-control'
                                id='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ width: '100%' }}
                            />
                        </div>
                        <button type='submit' className='btn btn-primary'>
                            Submit
                        </button>
                    </form>
                </div>
                {message && <p>{message}</p>}
            </header>
        </div>
    )
}

export default LoginPage

// libs
import React, { useState } from 'react'

// local components
import NavbarComponent from '../components/utils/NavbarComponent'
import apiEndpoint from '../components/utils/ApiEndpoint'

// assets
import 'bootstrap/dist/css/bootstrap.min.css'

const SignUpPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const response = await apiEndpoint.post('/register/', {
                username,
                password,
                email,
            })
            if (response.data.email) {
                setMessage('Sign-up successful! You can now log in.')
                window.location.href = '/login'
            } else {
                setMessage(
                    'Sign-up failed. Please check your details and try again.'
                )
            }
        } catch (error) {
            // other errors
            setMessage(
                'Sign-up failed. Please check your details and try again.'
            )
        }
    }

    return (
        <div className='App'>
            <NavbarComponent />
            <header className='App-header'>
                <h1>Sign Up</h1>
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
                        <div className='mb-3'>
                            <label htmlFor='email' className='form-label fs-4'>
                                Email
                            </label>
                            <input
                                type='email'
                                className='form-control'
                                id='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ width: '100%' }}
                            />
                        </div>
                        <button type='submit' className='btn btn-primary'>
                            Sign Up
                        </button>
                    </form>
                </div>
                {message && <p>{message}</p>}
            </header>
        </div>
    )
}

export default SignUpPage

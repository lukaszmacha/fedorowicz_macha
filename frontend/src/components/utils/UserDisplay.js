import React from 'react'
import { Nav } from 'react-bootstrap'
import { FaUser } from 'react-icons/fa'

const UserDisplay = ({ username }) => {
    return (
        <Nav.Item className='mx-2 text-light d-flex align-items-center'>
            <FaUser className='me-2' />
            {username ? username : 'Guest'}
        </Nav.Item>
    )
}

export default UserDisplay

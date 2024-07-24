/* eslint-disable react/prop-types */
import { createContext, useState, useContext, useEffect } from 'react'
import { login, register, logout } from '../services/auth'
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
    }, [])

    const loginUser = async (email, password) => {
        const data = await login(email, password)
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data))
        return data.user
    }

    const registerUser = async (name, email, password) => {
        const data = await register(name, email, password)
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data))
        return data.user
    }

    const logoutUser = () => {
        logout()
        setUser(null)
        navigate("/login")
    }

    return (
        <AuthContext.Provider value={{ user, loginUser, registerUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
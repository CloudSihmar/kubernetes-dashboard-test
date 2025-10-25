"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import axios from "axios"

interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: string
  force_password_change: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000"

axios.defaults.baseURL = API_URL

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      refreshUser()
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username: string, password: string) => {
    const response = await axios.post("/api/auth/login/", { username, password })
    const { access, refresh, user: userData } = response.data

    localStorage.setItem("access_token", access)
    localStorage.setItem("refresh_token", refresh)
    axios.defaults.headers.common["Authorization"] = `Bearer ${access}`

    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    delete axios.defaults.headers.common["Authorization"]
    setUser(null)
  }

  const refreshUser = async () => {
    try {
      const response = await axios.get("/api/auth/users/me/")
      setUser(response.data)
    } catch (error) {
      logout()
    } finally {
      setLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

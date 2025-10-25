"use client"
import { Routes, Route, Navigate } from "react-router-dom"
import { Box } from "@mui/material"
import { useAuth } from "./contexts/AuthContext"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import MainLayout from "./components/layout/MainLayout"
import Users from "./pages/Users"
import AuditLogs from "./pages/AuditLogs"
import Credentials from "./pages/Credentials"

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Loading...</Box>
    )
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/audit" element={<AuditLogs />} />
        <Route path="/credentials" element={<Credentials />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  )
}

export default App

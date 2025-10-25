"use client"

import type React from "react"
import { useState } from "react"
import { Box, Card, TextField, Button, Typography, Alert } from "@mui/material"
import { useAuth } from "../contexts/AuthContext"

const Login: React.FC = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(username, password)
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%", p: 4 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
          DevOps Control
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Sign in to your account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
            autoFocus
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button fullWidth type="submit" variant="contained" size="large" disabled={loading} sx={{ mt: 3 }}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <Box sx={{ mt: 3, p: 2, bgcolor: "background.default", borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Default credentials: admin / admin
          </Typography>
        </Box>
      </Card>
    </Box>
  )
}

export default Login

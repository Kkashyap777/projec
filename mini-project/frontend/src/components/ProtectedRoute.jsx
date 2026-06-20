import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../data/AuthContext'
import { Box, CircularProgress } from '@mui/material'

export function ProtectedRoute({ children, requiredRole = null }) {
  const { isAuthenticated, loading, user } = useContext(AuthContext)

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
}

export function AdminRoute({ children }) {
  const { isAdmin, loading } = useContext(AuthContext)
  const { isAuthenticated } = useContext(AuthContext)

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}

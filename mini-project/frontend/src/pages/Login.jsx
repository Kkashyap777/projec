import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../data/AuthContext'
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material'
import '../styles/Login.css'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const success = await login(username, password)
    if (success) {
      navigate('/')
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center' }}>
        <Paper elevation={3} sx={{ padding: '40px', borderRadius: '10px' }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ marginBottom: '30px', fontWeight: 'bold' }}>
            GCU Mentoring System
          </Typography>
          
          <Typography variant="h6" align="center" sx={{ marginBottom: '30px', color: '#666' }}>
            Login
          </Typography>

          {error && <Alert severity="error" sx={{ marginBottom: '20px' }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              disabled={loading}
              required
            />
            
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              disabled={loading}
              required
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              disabled={loading}
              sx={{ marginTop: '30px' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
          </form>

          <Box sx={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
            <Typography variant="body2" align="center" sx={{ marginBottom: '10px', fontWeight: 'bold' }}>
              Demo Credentials:
            </Typography>
            <Typography variant="caption" display="block" align="center">
              Admin: username = admin, password = admin123
            </Typography>
            <Typography variant="caption" display="block" align="center">
              Faculty: Use created faculty fact_id and mobile number
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

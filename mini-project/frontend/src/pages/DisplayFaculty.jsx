import { useState, useEffect } from 'react'
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material'

export default function DisplayFaculty() {
  const [faculty, setFaculty] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:8000/api/faculty/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch faculty')
        }

        const data = await response.json()
        setFaculty(data.results || data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchFaculty()
  }, [])

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">{error}</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ paddingY: '40px' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Faculty List
        </Typography>

        {faculty.length === 0 ? (
          <Alert severity="info">No faculty members found</Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell><strong>Faculty ID</strong></TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Mobile</strong></TableCell>
                  <TableCell><strong>Department</strong></TableCell>
                  <TableCell><strong>Designation</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {faculty.map(f => (
                  <TableRow key={f.id}>
                    <TableCell>{f.fact_id}</TableCell>
                    <TableCell>{f.fact_name}</TableCell>
                    <TableCell>{f.email}</TableCell>
                    <TableCell>{f.mobile}</TableCell>
                    <TableCell>{f.department}</TableCell>
                    <TableCell>{f.designation}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  )
}

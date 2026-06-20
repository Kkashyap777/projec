import { useState } from 'react'
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Grid,
  MenuItem,
} from '@mui/material'

const DEPARTMENTS = [
  'CSE', 'ME', 'MBA', 'Physics'
]

const DESIGNATIONS = [
  'Professor', 'Associate Professor', 'Assistant Professor', 'Lab Instructor'
]

export default function AddFaculty() {
  const [formData, setFormData] = useState({
    fact_id: '',
    fact_name: '',
    date_of_joining: '',
    mobile: '',
    email: '',
    department: '',
    designation: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8000/api/faculty/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to add faculty')
      }

      setSuccess(true)
      setFormData({
        fact_id: '',
        fact_name: '',
        date_of_joining: '',
        mobile: '',
        email: '',
        department: '',
        designation: '',
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ paddingY: '40px' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Add Faculty
        </Typography>

        {error && <Alert severity="error" sx={{ marginBottom: '20px' }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ marginBottom: '20px' }}>Faculty added successfully!</Alert>}

        <Paper elevation={2} sx={{ padding: '30px', borderRadius: '10px' }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Faculty ID"
                  name="fact_id"
                  value={formData.fact_id}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Faculty Name"
                  name="fact_name"
                  value={formData.fact_name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Date of Joining"
                  name="date_of_joining"
                  type="date"
                  value={formData.date_of_joining}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  {DEPARTMENTS.map(dept => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                >
                  {DESIGNATIONS.map(des => (
                    <MenuItem key={des} value={des}>{des}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  type="submit"
                  disabled={loading}
                >
                  Add Faculty
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  )
}

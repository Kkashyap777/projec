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

const PROGRAMS = [
  'B.Tech CSE', 'B.Tech ME', 'MBA', 'BSc. Physics'
]

const SEMESTERS = [
  '1', '2', '3', '4', '5', '6', '7', '8'
]

export default function AddStudent() {
  const [formData, setFormData] = useState({
    enrolment_no: '',
    name: '',
    mobile: '',
    email: '',
    department: '',
    program: '',
    semester: '',
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
      const response = await fetch('http://localhost:8000/api/students/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to add student')
      }

      setSuccess(true)
      setFormData({
        enrolment_no: '',
        name: '',
        mobile: '',
        email: '',
        department: '',
        program: '',
        semester: '',
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
          Add Student
        </Typography>

        {error && <Alert severity="error" sx={{ marginBottom: '20px' }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ marginBottom: '20px' }}>Student added successfully!</Alert>}

        <Paper elevation={2} sx={{ padding: '30px', borderRadius: '10px' }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Enrolment No"
                  name="enrolment_no"
                  value={formData.enrolment_no}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
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
                  label="Program"
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  required
                >
                  {PROGRAMS.map(prog => (
                    <MenuItem key={prog} value={prog}>{prog}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  required
                >
                  {SEMESTERS.map(sem => (
                    <MenuItem key={sem} value={sem}>{sem}</MenuItem>
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
                  Add Student
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  )
}

import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../data/AuthContext'
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Stack,
  MenuItem,
} from '@mui/material'
import { Download as DownloadIcon } from '@mui/icons-material'

export default function StudentReport() {
  const { user, isAdmin } = useContext(AuthContext)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState('')
  const [studentDetails, setStudentDetails] = useState(null)
  const [generating, setGenerating] = useState(false)

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token')
        const params = new URLSearchParams()
        
        if (!isAdmin && user?.faculty_id) {
          params.append('role', 'faculty')
          params.append('faculty_id', user.faculty_id)
        }

        const response = await fetch(`http://localhost:8000/api/students/?${params}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch students')
        }

        const data = await response.json()
        setStudents(data.results || data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [user, isAdmin])

  const handleSelectStudent = (e) => {
    const studentId = e.target.value
    setSelectedStudent(studentId)
    
    const student = students.find(s => s.id === parseInt(studentId))
    if (student) {
      setStudentDetails(student)
    }
  }

  const generatePDF = async () => {
    if (!studentDetails) {
      setError('Please select a student')
      return
    }

    setGenerating(true)
    try {
      // In a real scenario, you would call a backend endpoint to generate PDF
      // For now, we'll create a simple HTML representation
      const htmlContent = `
        <html>
          <head>
            <title>Student Profile Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              .report-title { text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 40px; }
              .section-title { font-size: 16px; font-weight: bold; margin-top: 20px; margin-bottom: 10px; border-bottom: 2px solid #333; padding-bottom: 5px; }
              .field { margin-bottom: 10px; }
              .label { font-weight: bold; display: inline-block; width: 150px; }
              .value { display: inline-block; }
            </style>
          </head>
          <body>
            <div class="report-title">STUDENT PROFILE REPORT</div>
            
            <div class="section-title">Basic Student Information</div>
            <div class="field">
              <span class="label">Name:</span>
              <span class="value">${studentDetails.name}</span>
            </div>
            <div class="field">
              <span class="label">Enrolment No:</span>
              <span class="value">${studentDetails.enrolment_no}</span>
            </div>
            <div class="field">
              <span class="label">Email:</span>
              <span class="value">${studentDetails.email}</span>
            </div>
            <div class="field">
              <span class="label">Mobile:</span>
              <span class="value">${studentDetails.mobile}</span>
            </div>
            
            <div class="section-title">Academic Details</div>
            <div class="field">
              <span class="label">Program:</span>
              <span class="value">${studentDetails.program}</span>
            </div>
            <div class="field">
              <span class="label">Department:</span>
              <span class="value">${studentDetails.department}</span>
            </div>
            <div class="field">
              <span class="label">Semester:</span>
              <span class="value">${studentDetails.semester}</span>
            </div>
          </body>
        </html>
      `

      // Open PDF generation
      const newWindow = window.open('', '', 'width=800,height=600')
      newWindow.document.write(htmlContent)
      newWindow.document.close()
      newWindow.print()
    } catch (err) {
      setError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ paddingY: '40px' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Student Report
      </Typography>

      {error && <Alert severity="error" sx={{ marginBottom: '20px' }}>{error}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ padding: '20px', borderRadius: '10px' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Select Student
            </Typography>

            <Stack spacing={2}>
              <TextField
                select
                label="Student"
                value={selectedStudent}
                onChange={handleSelectStudent}
                fullWidth
              >
                {students.map(s => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name} ({s.enrolment_no})
                  </MenuItem>
                ))}
              </TextField>

              <Button
                variant="contained"
                color="primary"
                startIcon={<DownloadIcon />}
                onClick={generatePDF}
                disabled={!studentDetails || generating}
              >
                {generating ? 'Generating...' : 'Generate PDF'}
              </Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {studentDetails && (
            <Paper elevation={2} sx={{ padding: '30px', borderRadius: '10px' }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                STUDENT PROFILE REPORT
              </Typography>

              <Box sx={{ marginTop: '30px' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '15px', borderBottom: '2px solid #333', paddingBottom: '10px' }}>
                  Basic Student Information
                </Typography>
                <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2"><strong>Name:</strong> {studentDetails.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2"><strong>Enrolment No:</strong> {studentDetails.enrolment_no}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2"><strong>Email:</strong> {studentDetails.email}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2"><strong>Mobile:</strong> {studentDetails.mobile}</Typography>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ marginTop: '30px' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '15px', borderBottom: '2px solid #333', paddingBottom: '10px' }}>
                  Academic Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2"><strong>Program:</strong> {studentDetails.program}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2"><strong>Department:</strong> {studentDetails.department}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2"><strong>Semester:</strong> {studentDetails.semester}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  )
}

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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  MenuItem,
  Divider,
} from '@mui/material'
import { Download as DownloadIcon } from '@mui/icons-material'

export default function MentoringActivityReport() {
  const { user, isAdmin } = useContext(AuthContext)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState('')
  const [studentData, setStudentData] = useState(null)
  const [mentorData, setMentorData] = useState(null)
  const [activities, setActivities] = useState([])
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

  const handleSelectStudent = async (e) => {
    const studentId = e.target.value
    setSelectedStudent(studentId)
    
    const student = students.find(s => s.id === parseInt(studentId))
    if (student) {
      setStudentData(student)
      
      // Fetch mentoring activities for this student
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(
          `http://localhost:8000/api/mentoring-activities/?student=${studentId}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        )
        
        if (response.ok) {
          const data = await response.json()
          setActivities(data.results || data)
        }
      } catch (err) {
        console.error('Failed to fetch activities:', err)
      }
    }
  }

  const generatePDF = async () => {
    if (!studentData) {
      setError('Please select a student')
      return
    }

    setGenerating(true)
    try {
      const htmlContent = `
        <html>
          <head>
            <title>Mentoring Activity Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              .report-title { text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 40px; }
              .section-title { font-size: 16px; font-weight: bold; margin-top: 30px; margin-bottom: 15px; border-bottom: 2px solid #333; padding-bottom: 5px; }
              .field { margin-bottom: 10px; }
              .label { font-weight: bold; display: inline-block; width: 150px; }
              .value { display: inline-block; }
              table { width: 100%; border-collapse: collapse; margin-top: 15px; }
              th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
              th { background-color: #f5f5f5; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="report-title">MENTORING ACTIVITY REPORT</div>
            
            <div class="section-title">Section 1: Student Information</div>
            <div class="field">
              <span class="label">Name:</span>
              <span class="value">${studentData.name}</span>
            </div>
            <div class="field">
              <span class="label">Enrolment No:</span>
              <span class="value">${studentData.enrolment_no}</span>
            </div>
            <div class="field">
              <span class="label">Program:</span>
              <span class="value">${studentData.program}</span>
            </div>
            <div class="field">
              <span class="label">Semester:</span>
              <span class="value">${studentData.semester}</span>
            </div>
            <div class="field">
              <span class="label">Email:</span>
              <span class="value">${studentData.email}</span>
            </div>
            <div class="field">
              <span class="label">Mobile:</span>
              <span class="value">${studentData.mobile}</span>
            </div>
            
            <div class="section-title">Section 3: Mentoring Sessions</div>
            <table>
              <tr>
                <th>Date</th>
                <th>Interacted With</th>
                <th>Issue</th>
                <th>Interaction Type</th>
                <th>Remarks</th>
              </tr>
              ${activities.map(a => `
                <tr>
                  <td>${new Date(a.date_interacted).toLocaleDateString()}</td>
                  <td>${a.interacted_with}</td>
                  <td>${a.issue}</td>
                  <td>${a.interaction_type}</td>
                  <td>${a.remarks || '-'}</td>
                </tr>
              `).join('')}
            </table>
            
            <div class="section-title">Section 4: Summary</div>
            <div class="field">
              <span class="label">Total Sessions Recorded:</span>
              <span class="value">${activities.length}</span>
            </div>
          </body>
        </html>
      `

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
        Mentoring Activity Report
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
                disabled={!studentData || generating}
              >
                {generating ? 'Generating...' : 'Generate PDF'}
              </Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {studentData && (
            <Paper elevation={2} sx={{ padding: '30px', borderRadius: '10px' }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                MENTORING ACTIVITY REPORT
              </Typography>

              <Box sx={{ marginTop: '30px' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '15px', borderBottom: '2px solid #333', paddingBottom: '10px' }}>
                  Section 1: Student Information
                </Typography>
                <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2"><strong>Name:</strong> {studentData.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2"><strong>Enrolment No:</strong> {studentData.enrolment_no}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2"><strong>Program:</strong> {studentData.program}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2"><strong>Semester:</strong> {studentData.semester}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2"><strong>Email:</strong> {studentData.email}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2"><strong>Mobile:</strong> {studentData.mobile}</Typography>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ marginTop: '30px' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '15px', borderBottom: '2px solid #333', paddingBottom: '10px' }}>
                  Section 3: Mentoring Sessions
                </Typography>
                {activities.length === 0 ? (
                  <Alert severity="info">No mentoring activities found for this student</Alert>
                ) : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                          <TableCell><strong>Date</strong></TableCell>
                          <TableCell><strong>Interacted With</strong></TableCell>
                          <TableCell><strong>Issue</strong></TableCell>
                          <TableCell><strong>Interaction Type</strong></TableCell>
                          <TableCell><strong>Remarks</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {activities.map(activity => (
                          <TableRow key={activity.id}>
                            <TableCell>{new Date(activity.date_interacted).toLocaleDateString()}</TableCell>
                            <TableCell>{activity.interacted_with}</TableCell>
                            <TableCell>{activity.issue}</TableCell>
                            <TableCell>{activity.interaction_type}</TableCell>
                            <TableCell>{activity.remarks || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>

              <Box sx={{ marginTop: '30px' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '15px', borderBottom: '2px solid #333', paddingBottom: '10px' }}>
                  Section 4: Summary
                </Typography>
                <Typography variant="body2">
                  <strong>Total Sessions Recorded:</strong> {activities.length}
                </Typography>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  )
}

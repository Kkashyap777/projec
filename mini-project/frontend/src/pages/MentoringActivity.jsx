import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../data/AuthContext'
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Alert,
  CircularProgress,
  Stack,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'

const INTERACTED_WITH_OPTIONS = [
  'Student', 'Parent', 'Father', 'Mother', 'Sibling', 'Guardian', 'Other'
]

const ISSUE_OPTIONS = [
  'General', 'Less Attendance', 'ERP Issue', 'Results', 'Class Not Attending',
  'Extra Class Required For Maths', 'Exam Result', 'Backlog', 'Other'
]

const INTERACTION_TYPE_OPTIONS = [
  'Call', 'Physical Meet', 'Whatsapp', 'SMS', 'Other'
]

function TabPanel(props) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function MentoringActivity() {
  const { user, isAdmin } = useContext(AuthContext)
  const [tabValue, setTabValue] = useState(0)
  const [students, setStudents] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    student: '',
    date_interacted: new Date().toISOString().split('T')[0],
    interacted_with: 'Student',
    issue: 'General',
    interaction_type: 'Call',
    remarks: '',
  })

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingActivityId, setDeletingActivityId] = useState(null)

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const params = new URLSearchParams()
        
        if (!isAdmin && user?.faculty_id) {
          params.append('role', 'faculty')
          params.append('faculty_id', user.faculty_id)
        }

        const [studentsRes, activitiesRes] = await Promise.all([
          fetch(`http://localhost:8000/api/students/?${params}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
          fetch(`http://localhost:8000/api/mentoring-activities/?${params}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
        ])

        if (!studentsRes.ok || !activitiesRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const studentsData = await studentsRes.json()
        const activitiesData = await activitiesRes.json()

        setStudents(studentsData.results || studentsData)
        setActivities(activitiesData.results || activitiesData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, isAdmin])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveActivity = async () => {
    if (!formData.student) {
      setError('Please select a student')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8000/api/mentoring-activities/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to save activity')
      }

      const newActivity = await response.json()
      setActivities([...activities, newActivity])
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      
      // Reset form
      setFormData({
        student: '',
        date_interacted: new Date().toISOString().split('T')[0],
        interacted_with: 'Student',
        issue: 'General',
        interaction_type: 'Call',
        remarks: '',
      })
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleClearForm = () => {
    setFormData({
      student: '',
      date_interacted: new Date().toISOString().split('T')[0],
      interacted_with: 'Student',
      issue: 'General',
      interaction_type: 'Call',
      remarks: '',
    })
    setError(null)
  }

  const handleDeleteActivity = async () => {
    if (!deletingActivityId) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8000/api/mentoring-activities/${deletingActivityId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete activity')
      }

      setActivities(activities.filter(a => a.id !== deletingActivityId))
      setDeleteDialogOpen(false)
      setDeletingActivityId(null)
    } catch (err) {
      setError(err.message)
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
        Mentoring Activity
      </Typography>

      {error && <Alert severity="error" sx={{ marginBottom: '20px' }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ marginBottom: '20px' }}>Activity saved successfully!</Alert>}

      <Paper elevation={2} sx={{ marginBottom: '30px' }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Mentor Mapping" />
          <Tab label="Mentoring Activity" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ textAlign: 'center', padding: '40px' }}>
            <Typography variant="body1">
              Navigate to the Mentor Mapping section from the sidebar to manage mentor assignments.
            </Typography>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ padding: '20px' }}>
            {/* Form Section */}
            <Box sx={{ marginBottom: '40px' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Record Mentoring Activity
              </Typography>

              <Stack spacing={2} sx={{ maxWidth: '600px' }}>
                <TextField
                  type="date"
                  label="Date *"
                  name="date_interacted"
                  value={formData.date_interacted}
                  onChange={handleFormChange}
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  select
                  label="Student Name *"
                  name="student"
                  value={formData.student}
                  onChange={handleFormChange}
                >
                  {students.map(s => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.name} ({s.enrolment_no})
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Interacted With *"
                  name="interacted_with"
                  value={formData.interacted_with}
                  onChange={handleFormChange}
                >
                  {INTERACTED_WITH_OPTIONS.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Issue *"
                  name="issue"
                  value={formData.issue}
                  onChange={handleFormChange}
                >
                  {ISSUE_OPTIONS.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Type Of Interaction *"
                  name="interaction_type"
                  value={formData.interaction_type}
                  onChange={handleFormChange}
                >
                  {INTERACTION_TYPE_OPTIONS.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleFormChange}
                  multiline
                  rows={3}
                />

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveActivity}
                  >
                    Save Activity
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleClearForm}
                  >
                    Clear Form
                  </Button>
                </Stack>
              </Stack>
            </Box>

            {/* Activities Table */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Mentoring Activities
              </Typography>

              {activities.length === 0 ? (
                <Alert severity="info">No activities found</Alert>
              ) : (
                <TableContainer sx={{ overflowX: 'auto' }}>
                  <Table size="small">
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell><strong>Date</strong></TableCell>
                        <TableCell><strong>Student Name</strong></TableCell>
                        <TableCell><strong>Interacted With</strong></TableCell>
                        <TableCell><strong>Issue</strong></TableCell>
                        <TableCell><strong>Type</strong></TableCell>
                        <TableCell><strong>Remarks</strong></TableCell>
                        <TableCell><strong>Actions</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {activities.map(activity => (
                        <TableRow key={activity.id}>
                          <TableCell>{new Date(activity.date_interacted).toLocaleDateString()}</TableCell>
                          <TableCell>{activity.student_name}</TableCell>
                          <TableCell>{activity.interacted_with}</TableCell>
                          <TableCell>{activity.issue}</TableCell>
                          <TableCell>{activity.interaction_type}</TableCell>
                          <TableCell>{activity.remarks || '-'}</TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => {
                                setDeletingActivityId(activity.id)
                                setDeleteDialogOpen(true)
                              }}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Box>
        </TabPanel>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this activity?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteActivity} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

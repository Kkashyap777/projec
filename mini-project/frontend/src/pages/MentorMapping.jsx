import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../data/AuthContext'
import {
  Container,
  Grid,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material'
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material'

const STATUS_CHOICES = [
  { value: 'Active', label: 'Active' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Paused', label: 'Paused' },
]

export default function MentorMapping() {
  const { user, isAdmin } = useContext(AuthContext)
  const [students, setStudents] = useState([])
  const [faculty, setFaculty] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState('')
  const [selectedFaculty, setSelectedFaculty] = useState('')
  const [notes, setNotes] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('Active')
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState(null)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [statusEditingAssignment, setStatusEditingAssignment] = useState(null)
  const [newStatus, setNewStatus] = useState('Active')

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

        const [studentsRes, facultyRes, assignmentsRes] = await Promise.all([
          fetch(`http://localhost:8000/api/students/?${params}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
          fetch('http://localhost:8000/api/faculty/', {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
          fetch(`http://localhost:8000/api/mentor-assignments/?${params}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
        ])

        if (!studentsRes.ok || !facultyRes.ok || !assignmentsRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const studentsData = await studentsRes.json()
        const facultyData = await facultyRes.json()
        const assignmentsData = await assignmentsRes.json()

        setStudents(studentsData.results || studentsData)
        setFaculty(facultyData.results || facultyData)
        setAssignments(assignmentsData.results || assignmentsData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, isAdmin])

  const handleAssign = async () => {
    if (!selectedStudent || !selectedFaculty) {
      setError('Please select student and faculty')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8000/api/mentor-assignments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          student: selectedStudent,
          faculty: selectedFaculty,
          notes: notes,
          status: selectedStatus,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create assignment')
      }

      const newAssignment = await response.json()
      setAssignments([...assignments, newAssignment])
      setSelectedStudent('')
      setSelectedFaculty('')
      setNotes('')
      setSelectedStatus('Active')
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleRemoveAssignment = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to remove this assignment?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8000/api/mentor-assignments/${assignmentId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to remove assignment')
      }

      setAssignments(assignments.filter(a => a.id !== assignmentId))
    } catch (err) {
      setError(err.message)
    }
  }

  const handleUpdateStatus = async () => {
    if (!statusEditingAssignment) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8000/api/mentor-assignments/${statusEditingAssignment.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      const updatedAssignment = await response.json()
      setAssignments(assignments.map(a => a.id === updatedAssignment.id ? updatedAssignment : a))
      setStatusDialogOpen(false)
      setStatusEditingAssignment(null)
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
        Mentor Mapping
      </Typography>

      {error && <Alert severity="error" sx={{ marginBottom: '20px' }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* Left Panel - Form */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ padding: '20px', borderRadius: '10px' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Assign Mentor
            </Typography>

            <Stack spacing={2}>
              <TextField
                select
                label="Student *"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                fullWidth
              >
                {students.map(s => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name} ({s.enrolment_no})
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Faculty / Mentor *"
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                fullWidth
              >
                {faculty.map(f => (
                  <MenuItem key={f.id} value={f.id}>
                    {f.fact_name} ({f.fact_id})
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                fullWidth
                multiline
                rows={3}
              />

              <Box>
                <Typography variant="subtitle2" sx={{ marginBottom: '8px', fontWeight: 'bold' }}>
                  Status
                </Typography>
                <Stack direction="row" spacing={1}>
                  {STATUS_CHOICES.map(status => (
                    <Button
                      key={status.value}
                      variant={selectedStatus === status.value ? 'contained' : 'outlined'}
                      onClick={() => setSelectedStatus(status.value)}
                      size="small"
                    >
                      {status.label}
                    </Button>
                  ))}
                </Stack>
              </Box>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAssign}
                  fullWidth
                >
                  Assign
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        {/* Right Panel - Table */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ padding: '20px', borderRadius: '10px' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Mentor Assignments
            </Typography>

            {assignments.length === 0 ? (
              <Alert severity="info">No assignments found</Alert>
            ) : (
              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell><strong>Student</strong></TableCell>
                      <TableCell><strong>Roll No</strong></TableCell>
                      <TableCell><strong>Department</strong></TableCell>
                      <TableCell><strong>Faculty</strong></TableCell>
                      <TableCell><strong>Assigned On</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignments.map(assignment => (
                      <TableRow key={assignment.id}>
                        <TableCell>{assignment.student_name}</TableCell>
                        <TableCell>{assignment.student_enrolment}</TableCell>
                        <TableCell>{assignment.student_department}</TableCell>
                        <TableCell>{assignment.faculty_name}</TableCell>
                        <TableCell>{new Date(assignment.assigned_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Box sx={{
                            backgroundColor: assignment.status === 'Active' ? '#e8f5e9' : assignment.status === 'Completed' ? '#f3e5f5' : '#fff3e0',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            display: 'inline-block'
                          }}>
                            {assignment.status}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<EditIcon />}
                              onClick={() => {
                                setStatusEditingAssignment(assignment)
                                setNewStatus(assignment.status)
                                setStatusDialogOpen(true)
                              }}
                            >
                              Update
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleRemoveAssignment(assignment.id)}
                            >
                              Remove
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>Update Status</DialogTitle>
        <DialogContent sx={{ minWidth: '400px', paddingTop: '20px' }}>
          <FormControl fullWidth>
            <InputLabel>New Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="New Status"
            >
              {STATUS_CHOICES.map(status => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateStatus} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

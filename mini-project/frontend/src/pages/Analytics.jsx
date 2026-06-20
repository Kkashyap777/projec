import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../data/AuthContext'
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material'
import { People, School, Link as LinkIcon, Event, Pending } from '@mui/icons-material'

export default function Analytics() {
  const { user, isAdmin } = useContext(AuthContext)
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token')
        const params = new URLSearchParams()
        
        if (!isAdmin && user?.faculty_id) {
          params.append('role', 'faculty')
          params.append('faculty_id', user.faculty_id)
        }

        const response = await fetch(`http://localhost:8000/api/analytics/?${params}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch analytics')
        }

        const data = await response.json()
        setAnalyticsData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [user, isAdmin])

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

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <Card sx={{ textAlign: 'center', height: '100%', borderTop: `4px solid ${color}` }}>
      <CardContent>
        <Icon sx={{ fontSize: 40, color: color, marginBottom: '10px' }} />
        <Typography color="textSecondary" gutterBottom>
          {label}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: color }}>
          {value || 0}
        </Typography>
      </CardContent>
    </Card>
  )

  return (
    <Container maxWidth="lg" sx={{ paddingY: '40px' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Analytics
      </Typography>

      {isAdmin ? (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ marginBottom: '30px', color: '#666' }}>
            Admin Analytics
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={School}
                label="Total Students"
                value={analyticsData?.total_students}
                color="#1976d2"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={People}
                label="Total Faculty"
                value={analyticsData?.total_faculty}
                color="#388e3c"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={LinkIcon}
                label="Total Mentor Assignments"
                value={analyticsData?.total_assignments}
                color="#f57c00"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={Event}
                label="Total Mentoring Sessions"
                value={analyticsData?.total_sessions}
                color="#c2185b"
              />
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ marginBottom: '30px', color: '#666' }}>
            Faculty Analytics
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={School}
                label="Assigned Students"
                value={analyticsData?.assigned_students}
                color="#1976d2"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={Event}
                label="Completed Sessions"
                value={analyticsData?.completed_sessions}
                color="#388e3c"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={People}
                label="Active Students"
                value={analyticsData?.active_students}
                color="#f57c00"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={Pending}
                label="Pending Cases"
                value={analyticsData?.pending_cases}
                color="#c2185b"
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  )
}

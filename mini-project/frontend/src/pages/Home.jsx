import { useContext, useEffect, useState } from 'react'
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
import { People, School, Link as LinkIcon, Event } from '@mui/icons-material'

const Dashboard = () => {
  const { user, isAdmin } = useContext(AuthContext)
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token')
        const params = new URLSearchParams()
        
        if (!isAdmin && user?.faculty_id) {
          params.append('role', 'faculty')
          params.append('faculty_id', user.faculty_id)
        }

        const response = await fetch(`http://localhost:8000/api/dashboard/?${params}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }

        const data = await response.json()
        setDashboardData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
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
    <Card sx={{ textAlign: 'center', height: '100%' }}>
      <CardContent>
        <Icon sx={{ fontSize: 40, color: color, marginBottom: '10px' }} />
        <Typography color="textSecondary" gutterBottom>
          {label}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {value || 0}
        </Typography>
      </CardContent>
    </Card>
  )

  return (
    <Container maxWidth="lg" sx={{ paddingY: '40px' }}>
      <Box sx={{ marginBottom: '40px' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Welcome, {user?.fact_name || user?.username}!
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {isAdmin ? (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={School}
                label="Total Students"
                value={dashboardData?.total_students}
                color="#1976d2"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={People}
                label="Total Faculty"
                value={dashboardData?.total_faculty}
                color="#388e3c"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={LinkIcon}
                label="Total Mentor Assignments"
                value={dashboardData?.total_assignments}
                color="#f57c00"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={Event}
                label="Total Mentoring Sessions"
                value={dashboardData?.total_sessions}
                color="#c2185b"
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={School}
                label="Assigned Students"
                value={dashboardData?.total_students}
                color="#1976d2"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={People}
                label="Total Faculty"
                value={dashboardData?.total_mentors}
                color="#388e3c"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={LinkIcon}
                label="Active Students"
                value={dashboardData?.total_assignments}
                color="#f57c00"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={Event}
                label="Mentoring Sessions"
                value={dashboardData?.total_sessions}
                color="#c2185b"
              />
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  )
}

export default Dashboard
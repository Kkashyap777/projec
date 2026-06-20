import './App.css'
import { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthContext, AuthProvider } from './data/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Home'
import DisplayStudents from './pages/DisplayStudents'

// Placeholder components for new pages
import MentorMapping from './pages/MentorMapping'
import MentoringActivity from './pages/MentoringActivity'
import StudentReport from './pages/StudentReport'
import MentoringActivityReport from './pages/MentoringActivityReport'
import Analytics from './pages/Analytics'
import AddStudent from './pages/AddStudent'
import AddFaculty from './pages/AddFaculty'
import DisplayFaculty from './pages/DisplayFaculty'

function AppContent() {
  const { isAuthenticated, loading } = useContext(AuthContext)

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        
        {/* Students Module */}
        <Route path="/add-students" element={<AddStudent />} />
        <Route path="/display-students" element={<DisplayStudents />} />
        
        {/* Faculty Module */}
        <Route path="/add-faculty" element={<AddFaculty />} />
        <Route path="/display-faculty" element={<DisplayFaculty />} />
        
        {/* Mentoring Module */}
        <Route path="/mentor-mapping" element={<MentorMapping />} />
        <Route path="/mentoring-activity" element={<MentoringActivity />} />
        
        {/* Reports Module */}
        <Route path="/student-report" element={<StudentReport />} />
        <Route path="/mentoring-activity-report" element={<MentoringActivityReport />} />
        
        {/* Analytics Module */}
        <Route path="/analytics" element={<Analytics />} />
      </Route>
      
      {/* Redirect to login if not authenticated */}
      <Route path="*" element={isAuthenticated ? <Navigate to="/" /> : <Navigate to="/login" />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
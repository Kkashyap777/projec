import * as React from 'react';
import { useContext } from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import LinkIcon from '@mui/icons-material/Link';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AnalyticsIcon from '@mui/icons-material/Analytics';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../data/AuthContext';

export default function Menu() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);
  const [openModule, setOpenModule] = React.useState(null);

  const handleToggle = (module) => {
    setOpenModule(prev => (prev === module ? null : module));
  };

  React.useEffect(() => {
    // Auto-expand module based on current path
    if (
      location.pathname.startsWith("/add-students") ||
      location.pathname.startsWith("/display-students")
    ) {
      setOpenModule("students");
    } else if (
      location.pathname.startsWith("/add-faculty") ||
      location.pathname.startsWith("/display-faculty")
    ) {
      setOpenModule("faculty");
    } else if (
      location.pathname.startsWith("/mentor-mapping") ||
      location.pathname.startsWith("/mentoring-activity")
    ) {
      setOpenModule("mentoring");
    } else if (
      location.pathname.startsWith("/student-report") ||
      location.pathname.startsWith("/mentoring-activity-report")
    ) {
      setOpenModule("reports");
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <List
      sx={{ width: '100%', maxWidth: 360 }}
      component="nav"
      subheader={
        <ListSubheader component="div">
          Modules
        </ListSubheader>
      }
    >
      {/* Dashboard */}
      <ListItemButton
        component={Link}
        to="/"
        selected={location.pathname === "/"}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>

      <Divider sx={{ my: 1 }} />

      {/* STUDENTS Module */}
      <ListItemButton onClick={() => handleToggle("students")}>
        <ListItemIcon>
          <SchoolIcon />
        </ListItemIcon>
        <ListItemText primary="Students" />
        {openModule === "students" ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={openModule === "students"} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton
            component={Link}
            to="/add-students"
            selected={location.pathname === "/add-students"}
            sx={{ pl: 4 }}
          >
            <ListItemIcon>
              <DashboardIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText primary="Add Student" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/display-students"
            selected={location.pathname === "/display-students"}
            sx={{ pl: 4 }}
          >
            <ListItemIcon>
              <DashboardIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText primary="Display Students" />
          </ListItemButton>
        </List>
      </Collapse>

      {/* FACULTY Module */}
      <ListItemButton onClick={() => handleToggle("faculty")}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Faculty" />
        {openModule === "faculty" ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={openModule === "faculty"} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton
            component={Link}
            to="/add-faculty"
            selected={location.pathname === "/add-faculty"}
            sx={{ pl: 4 }}
          >
            <ListItemIcon>
              <DashboardIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText primary="Add Faculty" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/display-faculty"
            selected={location.pathname === "/display-faculty"}
            sx={{ pl: 4 }}
          >
            <ListItemIcon>
              <DashboardIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText primary="Display Faculty" />
          </ListItemButton>
        </List>
      </Collapse>

      <Divider sx={{ my: 1 }} />

      {/* MENTORING Module */}
      <ListItemButton onClick={() => handleToggle("mentoring")}>
        <ListItemIcon>
          <LinkIcon />
        </ListItemIcon>
        <ListItemText primary="Mentoring" />
        {openModule === "mentoring" ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={openModule === "mentoring"} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton
            component={Link}
            to="/mentor-mapping"
            selected={location.pathname === "/mentor-mapping"}
            sx={{ pl: 4 }}
          >
            <ListItemIcon>
              <DashboardIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText primary="Mentor Mapping" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/mentoring-activity"
            selected={location.pathname === "/mentoring-activity"}
            sx={{ pl: 4 }}
          >
            <ListItemIcon>
              <DashboardIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText primary="Mentoring Activity" />
          </ListItemButton>
        </List>
      </Collapse>

      <Divider sx={{ my: 1 }} />

      {/* REPORTS Module */}
      <ListItemButton onClick={() => handleToggle("reports")}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Reports" />
        {openModule === "reports" ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={openModule === "reports"} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton
            component={Link}
            to="/student-report"
            selected={location.pathname === "/student-report"}
            sx={{ pl: 4 }}
          >
            <ListItemIcon>
              <DashboardIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText primary="Student Report" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/mentoring-activity-report"
            selected={location.pathname === "/mentoring-activity-report"}
            sx={{ pl: 4 }}
          >
            <ListItemIcon>
              <DashboardIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText primary="Mentoring Activity Report" />
          </ListItemButton>
        </List>
      </Collapse>

      <Divider sx={{ my: 1 }} />

      {/* ANALYTICS Module */}
      <ListItemButton
        component={Link}
        to="/analytics"
        selected={location.pathname === "/analytics"}
      >
        <ListItemIcon>
          <AnalyticsIcon />
        </ListItemIcon>
        <ListItemText primary="Analytics" />
      </ListItemButton>

      <Divider sx={{ my: 2 }} />

      {/* Logout */}
      <ListItemButton
        onClick={handleLogout}
        sx={{ color: 'error.main' }}
      >
        <ListItemText primary={`Logout (${user?.fact_name || user?.username})`} />
      </ListItemButton>
    </List>
  );
}
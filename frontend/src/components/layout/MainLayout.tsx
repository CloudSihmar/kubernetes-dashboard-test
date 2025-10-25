"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Computer as ComputerIcon,
  Terminal as TerminalIcon,
  ViewModule as ViewModuleIcon,
  Build as BuildIcon,
  Cloud as CloudIcon,
  People as PeopleIcon,
  History as HistoryIcon,
  Key as KeyIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

const DRAWER_WIDTH = 240

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    handleMenuClose()
  }

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/", roles: ["super_admin", "operator", "viewer"] },
    { text: "Kubernetes", icon: <CloudIcon />, path: "/kubernetes", roles: ["super_admin", "operator", "viewer"] },
    { text: "Machines", icon: <ComputerIcon />, path: "/machines", roles: ["super_admin", "operator", "viewer"] },
    { text: "SSH Terminal", icon: <TerminalIcon />, path: "/terminal", roles: ["super_admin", "operator", "viewer"] },
    { text: "Dashboards", icon: <ViewModuleIcon />, path: "/dashboards", roles: ["super_admin", "operator", "viewer"] },
    { text: "Automation", icon: <BuildIcon />, path: "/automation", roles: ["super_admin", "operator", "viewer"] },
    { text: "Terraform", icon: <CloudIcon />, path: "/terraform", roles: ["super_admin", "operator", "viewer"] },
    { text: "Users", icon: <PeopleIcon />, path: "/users", roles: ["super_admin"] },
    { text: "Credentials", icon: <KeyIcon />, path: "/credentials", roles: ["super_admin", "operator", "viewer"] },
    { text: "Audit Logs", icon: <HistoryIcon />, path: "/audit", roles: ["super_admin", "operator", "viewer"] },
  ]

  const filteredMenuItems = menuItems.filter((item) => user && item.roles.includes(user.role))

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "background.paper" }}>
      <Box sx={{ p: 2.5, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
          DevOps Control
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Platform
        </Typography>
      </Box>
      <List sx={{ flex: 1, px: 1.5, py: 2 }}>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 1.5,
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "white",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "text.secondary" }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: "0.875rem" }}>
              {user?.username.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              sx: { mt: 1.5, minWidth: 200 },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="body2" fontWeight={600}>
                {user?.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.role.replace("_", " ").toUpperCase()}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: DRAWER_WIDTH },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              border: "none",
              borderRight: 1,
              borderColor: "divider",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: 8,
          bgcolor: "background.default",
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default MainLayout

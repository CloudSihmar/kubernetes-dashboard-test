import type React from "react"
import { Box, Grid, Card, CardContent, Typography } from "@mui/material"
import { Cloud, Computer, Terminal, ViewModule, Build, CloudQueue } from "@mui/icons-material"

const Dashboard: React.FC = () => {
  const stats = [
    { title: "Kubernetes Clusters", value: "0", icon: <Cloud />, color: "#3b82f6" },
    { title: "Registered Machines", value: "0", icon: <Computer />, color: "#8b5cf6" },
    { title: "Active SSH Sessions", value: "0", icon: <Terminal />, color: "#10b981" },
    { title: "Connected Dashboards", value: "0", icon: <ViewModule />, color: "#f59e0b" },
    { title: "Automation Tasks", value: "0", icon: <Build />, color: "#ef4444" },
    { title: "Terraform Projects", value: "0", icon: <CloudQueue />, color: "#06b6d4" },
  ]

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: `${stat.color}20`,
                      color: stat.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stat.value}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Welcome to DevOps Control Platform
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This enterprise-grade platform provides unified management for:
          </Typography>
          <Box component="ul" sx={{ pl: 2, "& li": { mb: 1 } }}>
            <Typography component="li" variant="body2" color="text.secondary">
              Kubernetes cluster provisioning and management
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              Machine registry and inventory tracking
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              Web-based SSH terminal access
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              Dashboard integration (K8s, ArgoCD, Grafana, etc.)
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              Ansible automation engine
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              Terraform infrastructure as code
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Dashboard

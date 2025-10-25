import type React from "react"
import { Box, Typography, Card, CardContent } from "@mui/material"

const Users: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        User Management
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            User management interface will be implemented in the next phase.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Users

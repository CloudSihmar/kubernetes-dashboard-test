import type React from "react"
import { Box, Typography, Card, CardContent } from "@mui/material"

const Credentials: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Encrypted Credentials
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Credential management interface will be implemented in the next phase.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Credentials

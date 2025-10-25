"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Database, Download, Upload, MoreVertical, CheckCircle2 } from "lucide-react"

const backups = [
  {
    id: 1,
    name: "Automatic Backup",
    timestamp: "2025-01-24 02:00:00",
    size: "2.4 GB",
    type: "Full",
    status: "Completed",
  },
  {
    id: 2,
    name: "Automatic Backup",
    timestamp: "2025-01-23 02:00:00",
    size: "2.3 GB",
    type: "Full",
    status: "Completed",
  },
  {
    id: 3,
    name: "Manual Backup",
    timestamp: "2025-01-22 15:30:00",
    size: "2.3 GB",
    type: "Full",
    status: "Completed",
  },
  {
    id: 4,
    name: "Automatic Backup",
    timestamp: "2025-01-22 02:00:00",
    size: "2.2 GB",
    type: "Full",
    status: "Completed",
  },
  {
    id: 5,
    name: "Automatic Backup",
    timestamp: "2025-01-21 02:00:00",
    size: "2.2 GB",
    type: "Full",
    status: "Completed",
  },
]

export function BackupRestore() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Backup & Restore</CardTitle>
              <CardDescription>Manage database backups and restore operations</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Restore
              </Button>
              <Button>
                <Database className="h-4 w-4 mr-2" />
                Create Backup
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Backup Name</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backups.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell className="font-medium">{backup.name}</TableCell>
                    <TableCell className="font-mono text-sm">{backup.timestamp}</TableCell>
                    <TableCell>{backup.size}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{backup.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{backup.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Upload className="h-4 w-4 mr-2" />
                            Restore
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete Backup</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backup Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm font-medium">Total Backups</span>
              <span className="text-sm text-muted-foreground">5 backups</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm font-medium">Total Storage Used</span>
              <span className="text-sm text-muted-foreground">11.4 GB</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm font-medium">Last Backup</span>
              <span className="text-sm text-muted-foreground">2025-01-24 02:00:00</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">Next Scheduled Backup</span>
              <span className="text-sm text-muted-foreground">2025-01-25 02:00:00</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-500/50 bg-blue-500/5">
        <CardHeader>
          <CardTitle className="text-blue-500">Backup Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Keep at least 7 days of daily backups</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Store backups in a separate location from production data</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Test restore procedures regularly to ensure backup integrity</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Encrypt backups containing sensitive information</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

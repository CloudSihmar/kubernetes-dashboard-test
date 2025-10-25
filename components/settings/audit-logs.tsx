"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download, Filter } from "lucide-react"

const auditLogs = [
  {
    id: 1,
    timestamp: "2025-01-24 14:32:15",
    user: "john@example.com",
    action: "User Login",
    resource: "Authentication",
    status: "Success",
    ip: "192.168.1.100",
    details: "Successful login with MFA",
  },
  {
    id: 2,
    timestamp: "2025-01-24 14:28:42",
    user: "jane@example.com",
    action: "Deploy Application",
    resource: "Kubernetes Cluster: prod-cluster",
    status: "Success",
    ip: "192.168.1.105",
    details: "Deployed app-v2.1.0 to production",
  },
  {
    id: 3,
    timestamp: "2025-01-24 14:15:33",
    user: "bob@example.com",
    action: "Failed Login",
    resource: "Authentication",
    status: "Failed",
    ip: "203.0.113.45",
    details: "Invalid password attempt",
  },
  {
    id: 4,
    timestamp: "2025-01-24 13:45:21",
    user: "john@example.com",
    action: "Create User",
    resource: "User Management",
    status: "Success",
    ip: "192.168.1.100",
    details: "Created user alice@example.com",
  },
  {
    id: 5,
    timestamp: "2025-01-24 13:30:18",
    user: "jane@example.com",
    action: "Execute Playbook",
    resource: "Ansible: system-update",
    status: "Success",
    ip: "192.168.1.105",
    details: "Executed on 15 hosts",
  },
  {
    id: 6,
    timestamp: "2025-01-24 12:55:09",
    user: "john@example.com",
    action: "Modify Security Settings",
    resource: "System Settings",
    status: "Success",
    ip: "192.168.1.100",
    details: "Enabled MFA requirement",
  },
  {
    id: 7,
    timestamp: "2025-01-24 12:20:45",
    user: "alice@example.com",
    action: "SSH Connection",
    resource: "Machine: web-server-01",
    status: "Success",
    ip: "192.168.1.110",
    details: "Established SSH session",
  },
  {
    id: 8,
    timestamp: "2025-01-24 11:45:33",
    user: "jane@example.com",
    action: "Terraform Apply",
    resource: "Workspace: production",
    status: "Success",
    ip: "192.168.1.105",
    details: "Applied 5 resource changes",
  },
]

export function AuditLogs() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || log.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>Track all security events and user activities</CardDescription>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                      <TableCell className="text-sm">{log.user}</TableCell>
                      <TableCell className="font-medium">{log.action}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{log.resource}</TableCell>
                      <TableCell>
                        <Badge variant={log.status === "Success" ? "default" : "destructive"}>{log.status}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="text-sm text-muted-foreground">
              Showing {filteredLogs.length} of {auditLogs.length} logs
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

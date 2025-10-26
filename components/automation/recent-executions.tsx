"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, Eye } from "lucide-react"
import { useState } from "react"
import { ExecutionLogsDialog } from "./execution-logs-dialog"

interface Execution {
  id: string
  playbook: string
  status: "success" | "failed" | "running"
  startTime: string
  duration: string
  targets: number
}

export function RecentExecutions() {
  const [selectedExecution, setSelectedExecution] = useState<Execution | null>(null)
  const [showLogsDialog, setShowLogsDialog] = useState(false)

  // Mock data - in production, fetch from your API
  const executions: Execution[] = [
    {
      id: "1",
      playbook: "deploy-web-app",
      status: "success",
      startTime: "2h ago",
      duration: "3m 24s",
      targets: 5,
    },
    {
      id: "2",
      playbook: "backup-databases",
      status: "success",
      startTime: "12h ago",
      duration: "8m 12s",
      targets: 3,
    },
    {
      id: "3",
      playbook: "update-system-packages",
      status: "running",
      startTime: "5m ago",
      duration: "5m 00s",
      targets: 12,
    },
    {
      id: "4",
      playbook: "configure-firewall",
      status: "failed",
      startTime: "1d ago",
      duration: "1m 45s",
      targets: 8,
    },
    {
      id: "5",
      playbook: "setup-monitoring",
      status: "success",
      startTime: "5d ago",
      duration: "12m 30s",
      targets: 10,
    },
  ]

  const handleViewLogs = (execution: Execution) => {
    setSelectedExecution(execution)
    setShowLogsDialog(true)
  }

  const getStatusIcon = (status: Execution["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "running":
        return <Clock className="h-4 w-4 animate-spin text-blue-500" />
    }
  }

  const getStatusColor = (status: Execution["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-500/10 text-green-500"
      case "failed":
        return "bg-red-500/10 text-red-500"
      case "running":
        return "bg-blue-500/10 text-blue-500"
    }
  }

  return (
    <>
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Recent Executions</h2>
        </div>

        <div className="space-y-3">
          {executions.map((execution) => (
            <Card key={execution.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    {getStatusIcon(execution.status)}
                    <span className="font-medium">{execution.playbook}</span>
                    <Badge variant="outline" className={getStatusColor(execution.status)}>
                      {execution.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{execution.startTime}</span>
                    <span>{execution.duration}</span>
                    <span>{execution.targets} targets</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleViewLogs(execution)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Logs
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {selectedExecution && (
        <ExecutionLogsDialog open={showLogsDialog} onOpenChange={setShowLogsDialog} execution={selectedExecution} />
      )}
    </>
  )
}

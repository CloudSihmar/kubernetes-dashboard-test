"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, Eye } from "lucide-react"
import { useState } from "react"
import { RunLogsDialog } from "./run-logs-dialog"

interface TerraformRun {
  id: string
  workspace: string
  action: "plan" | "apply" | "destroy"
  status: "success" | "failed" | "running"
  startTime: string
  duration: string
  changes: {
    add: number
    change: number
    destroy: number
  }
}

export function RecentRuns() {
  const [selectedRun, setSelectedRun] = useState<TerraformRun | null>(null)
  const [showLogsDialog, setShowLogsDialog] = useState(false)

  // Mock data - in production, fetch from your API
  const runs: TerraformRun[] = [
    {
      id: "1",
      workspace: "production-infrastructure",
      action: "apply",
      status: "success",
      startTime: "2h ago",
      duration: "4m 32s",
      changes: { add: 2, change: 3, destroy: 0 },
    },
    {
      id: "2",
      workspace: "staging-infrastructure",
      action: "apply",
      status: "success",
      startTime: "1d ago",
      duration: "3m 15s",
      changes: { add: 1, change: 2, destroy: 0 },
    },
    {
      id: "3",
      workspace: "kubernetes-cluster",
      action: "plan",
      status: "running",
      startTime: "5m ago",
      duration: "5m 00s",
      changes: { add: 0, change: 5, destroy: 0 },
    },
    {
      id: "4",
      workspace: "networking",
      action: "apply",
      status: "failed",
      startTime: "3d ago",
      duration: "2m 10s",
      changes: { add: 0, change: 1, destroy: 0 },
    },
  ]

  const handleViewLogs = (run: TerraformRun) => {
    setSelectedRun(run)
    setShowLogsDialog(true)
  }

  const getStatusIcon = (status: TerraformRun["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "running":
        return <Clock className="h-4 w-4 animate-spin text-blue-500" />
    }
  }

  const getStatusColor = (status: TerraformRun["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-500/10 text-green-500"
      case "failed":
        return "bg-red-500/10 text-red-500"
      case "running":
        return "bg-blue-500/10 text-blue-500"
    }
  }

  const getActionColor = (action: TerraformRun["action"]) => {
    switch (action) {
      case "plan":
        return "bg-blue-500/10 text-blue-500"
      case "apply":
        return "bg-green-500/10 text-green-500"
      case "destroy":
        return "bg-red-500/10 text-red-500"
    }
  }

  return (
    <>
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Recent Runs</h2>
        </div>

        <div className="space-y-3">
          {runs.map((run) => (
            <Card key={run.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    {getStatusIcon(run.status)}
                    <span className="font-medium">{run.workspace}</span>
                    <Badge variant="outline" className={getActionColor(run.action)}>
                      {run.action}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(run.status)}>
                      {run.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{run.startTime}</span>
                    <span>{run.duration}</span>
                    <span className="text-green-500">+{run.changes.add}</span>
                    <span className="text-yellow-500">~{run.changes.change}</span>
                    <span className="text-red-500">-{run.changes.destroy}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleViewLogs(run)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Logs
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {selectedRun && <RunLogsDialog open={showLogsDialog} onOpenChange={setShowLogsDialog} run={selectedRun} />}
    </>
  )
}

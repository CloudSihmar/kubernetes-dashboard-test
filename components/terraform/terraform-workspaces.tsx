"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, FolderGit2, Play, Eye } from "lucide-react"
import { CreateWorkspaceDialog } from "./create-workspace-dialog"
import { WorkspaceDetailsDialog } from "./workspace-details-dialog"
import { PlanApplyDialog } from "./plan-apply-dialog"

interface Workspace {
  id: string
  name: string
  environment: string
  provider: string
  resources: number
  lastRun?: string
  status: "synced" | "drifted" | "pending"
}

export function TerraformWorkspaces() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showPlanDialog, setShowPlanDialog] = useState(false)

  // Mock data - in production, fetch from your API
  const workspaces: Workspace[] = [
    {
      id: "1",
      name: "production-infrastructure",
      environment: "production",
      provider: "AWS",
      resources: 45,
      lastRun: "2h ago",
      status: "synced",
    },
    {
      id: "2",
      name: "staging-infrastructure",
      environment: "staging",
      provider: "AWS",
      resources: 32,
      lastRun: "1d ago",
      status: "synced",
    },
    {
      id: "3",
      name: "kubernetes-cluster",
      environment: "production",
      provider: "GCP",
      resources: 28,
      lastRun: "3d ago",
      status: "drifted",
    },
    {
      id: "4",
      name: "networking",
      environment: "production",
      provider: "AWS",
      resources: 18,
      lastRun: "5d ago",
      status: "synced",
    },
  ]

  const handleViewDetails = (workspace: Workspace) => {
    setSelectedWorkspace(workspace)
    setShowDetailsDialog(true)
  }

  const handlePlanApply = (workspace: Workspace) => {
    setSelectedWorkspace(workspace)
    setShowPlanDialog(true)
  }

  const getStatusColor = (status: Workspace["status"]) => {
    switch (status) {
      case "synced":
        return "bg-green-500/10 text-green-500"
      case "drifted":
        return "bg-yellow-500/10 text-yellow-500"
      case "pending":
        return "bg-blue-500/10 text-blue-500"
    }
  }

  const getEnvironmentColor = (environment: string) => {
    switch (environment) {
      case "production":
        return "bg-red-500/10 text-red-500"
      case "staging":
        return "bg-yellow-500/10 text-yellow-500"
      case "development":
        return "bg-blue-500/10 text-blue-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  return (
    <>
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Workspaces</h2>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Workspace
          </Button>
        </div>

        <div className="space-y-4">
          {workspaces.map((workspace) => (
            <Card key={workspace.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <FolderGit2 className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold">{workspace.name}</h3>
                    <Badge variant="outline" className={getEnvironmentColor(workspace.environment)}>
                      {workspace.environment}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(workspace.status)}>
                      {workspace.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{workspace.provider}</span>
                    <span>{workspace.resources} resources</span>
                    <span>Last run: {workspace.lastRun || "Never"}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(workspace)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Details
                  </Button>
                  <Button size="sm" onClick={() => handlePlanApply(workspace)}>
                    <Play className="mr-2 h-4 w-4" />
                    Plan & Apply
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <CreateWorkspaceDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      {selectedWorkspace && (
        <>
          <WorkspaceDetailsDialog
            open={showDetailsDialog}
            onOpenChange={setShowDetailsDialog}
            workspace={selectedWorkspace}
          />
          <PlanApplyDialog open={showPlanDialog} onOpenChange={setShowPlanDialog} workspace={selectedWorkspace} />
        </>
      )}
    </>
  )
}

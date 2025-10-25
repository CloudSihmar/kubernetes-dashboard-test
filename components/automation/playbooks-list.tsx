"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Play, FileCode, Clock } from "lucide-react"
import { CreatePlaybookDialog } from "./create-playbook-dialog"
import { RunPlaybookDialog } from "./run-playbook-dialog"

interface Playbook {
  id: string
  name: string
  description: string
  category: string
  lastRun?: string
  successRate: number
  tasks: number
}

export function PlaybooksList() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null)
  const [showRunDialog, setShowRunDialog] = useState(false)

  // Mock data - in production, fetch from your API
  const playbooks: Playbook[] = [
    {
      id: "1",
      name: "deploy-web-app",
      description: "Deploy web application to production servers",
      category: "deployment",
      lastRun: "2h ago",
      successRate: 98,
      tasks: 12,
    },
    {
      id: "2",
      name: "update-system-packages",
      description: "Update all system packages across servers",
      category: "maintenance",
      lastRun: "1d ago",
      successRate: 100,
      tasks: 5,
    },
    {
      id: "3",
      name: "configure-firewall",
      description: "Configure firewall rules and security settings",
      category: "security",
      lastRun: "3d ago",
      successRate: 95,
      tasks: 8,
    },
    {
      id: "4",
      name: "backup-databases",
      description: "Backup all databases to remote storage",
      category: "backup",
      lastRun: "12h ago",
      successRate: 100,
      tasks: 6,
    },
    {
      id: "5",
      name: "setup-monitoring",
      description: "Install and configure monitoring agents",
      category: "monitoring",
      lastRun: "5d ago",
      successRate: 92,
      tasks: 15,
    },
  ]

  const handleRunPlaybook = (playbook: Playbook) => {
    setSelectedPlaybook(playbook)
    setShowRunDialog(true)
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      deployment: "bg-blue-500/10 text-blue-500",
      maintenance: "bg-green-500/10 text-green-500",
      security: "bg-red-500/10 text-red-500",
      backup: "bg-purple-500/10 text-purple-500",
      monitoring: "bg-yellow-500/10 text-yellow-500",
    }
    return colors[category] || "bg-gray-500/10 text-gray-500"
  }

  return (
    <>
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Playbooks</h2>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Playbook
          </Button>
        </div>

        <div className="space-y-4">
          {playbooks.map((playbook) => (
            <Card key={playbook.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold">{playbook.name}</h3>
                    <Badge variant="outline" className={getCategoryColor(playbook.category)}>
                      {playbook.category}
                    </Badge>
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground">{playbook.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{playbook.lastRun || "Never run"}</span>
                    </div>
                    <span>{playbook.tasks} tasks</span>
                    <span className={playbook.successRate >= 95 ? "text-green-500" : "text-yellow-500"}>
                      {playbook.successRate}% success
                    </span>
                  </div>
                </div>
                <Button size="sm" onClick={() => handleRunPlaybook(playbook)}>
                  <Play className="mr-2 h-4 w-4" />
                  Run
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <CreatePlaybookDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      {selectedPlaybook && (
        <RunPlaybookDialog open={showRunDialog} onOpenChange={setShowRunDialog} playbook={selectedPlaybook} />
      )}
    </>
  )
}

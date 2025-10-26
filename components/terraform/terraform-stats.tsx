import { Card } from "@/components/ui/card"
import { FolderGit2, Layers, CheckCircle, AlertTriangle } from "lucide-react"

export async function TerraformStats() {
  // Mock data - in production, fetch from your API
  const stats = {
    workspaces: 8,
    resources: 142,
    applied: 89,
    drifted: 3,
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <FolderGit2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Workspaces</p>
            <p className="text-2xl font-bold">{stats.workspaces}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
            <Layers className="h-6 w-6 text-chart-2" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Resources</p>
            <p className="text-2xl font-bold">{stats.resources}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Applied</p>
            <p className="text-2xl font-bold">{stats.applied}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/10">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Drifted</p>
            <p className="text-2xl font-bold">{stats.drifted}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

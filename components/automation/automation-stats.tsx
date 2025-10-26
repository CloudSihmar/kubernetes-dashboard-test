import { Card } from "@/components/ui/card"
import { FileCode, Play, CheckCircle, XCircle } from "lucide-react"

export async function AutomationStats() {
  // Mock data - in production, fetch from your API
  const stats = {
    playbooks: 18,
    executions: 247,
    successful: 234,
    failed: 13,
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <FileCode className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Playbooks</p>
            <p className="text-2xl font-bold">{stats.playbooks}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
            <Play className="h-6 w-6 text-chart-2" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Executions</p>
            <p className="text-2xl font-bold">{stats.executions}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Successful</p>
            <p className="text-2xl font-bold">{stats.successful}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
            <XCircle className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Failed</p>
            <p className="text-2xl font-bold">{stats.failed}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

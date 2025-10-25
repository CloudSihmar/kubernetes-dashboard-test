import { Card } from "@/components/ui/card"
import { Activity, Server, Box, AlertCircle } from "lucide-react"

export async function KubernetesStats() {
  // Mock data - in production, fetch from your Kubernetes API
  const stats = {
    clusters: 3,
    nodes: 12,
    pods: 156,
    alerts: 2,
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Server className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Clusters</p>
            <p className="text-2xl font-bold">{stats.clusters}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
            <Activity className="h-6 w-6 text-chart-2" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nodes</p>
            <p className="text-2xl font-bold">{stats.nodes}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
            <Box className="h-6 w-6 text-chart-3" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Pods</p>
            <p className="text-2xl font-bold">{stats.pods}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Alerts</p>
            <p className="text-2xl font-bold">{stats.alerts}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

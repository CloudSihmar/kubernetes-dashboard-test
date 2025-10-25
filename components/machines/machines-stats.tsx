import { Card } from "@/components/ui/card"
import { Server, HardDrive, Cpu, Activity } from "lucide-react"

export async function MachinesStats() {
  // Mock data - in production, fetch from your API
  const stats = {
    total: 24,
    online: 22,
    offline: 2,
    avgCpu: 45,
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Server className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Machines</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
            <Activity className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Online</p>
            <p className="text-2xl font-bold">{stats.online}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
            <HardDrive className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Offline</p>
            <p className="text-2xl font-bold">{stats.offline}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
            <Cpu className="h-6 w-6 text-chart-3" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Avg CPU</p>
            <p className="text-2xl font-bold">{stats.avgCpu}%</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

interface NodesTableProps {
  clusterId: string
}

export function NodesTable({ clusterId }: NodesTableProps) {
  // Mock data - in production, fetch from your Kubernetes API
  const nodes = [
    {
      name: "node-1",
      status: "Ready",
      role: "control-plane",
      version: "v1.28.3",
      cpu: 45,
      memory: 62,
      pods: 18,
    },
    {
      name: "node-2",
      status: "Ready",
      role: "worker",
      version: "v1.28.3",
      cpu: 72,
      memory: 68,
      pods: 24,
    },
    {
      name: "node-3",
      status: "Ready",
      role: "worker",
      version: "v1.28.3",
      cpu: 58,
      memory: 71,
      pods: 22,
    },
    {
      name: "node-4",
      status: "Ready",
      role: "worker",
      version: "v1.28.3",
      cpu: 81,
      memory: 79,
      pods: 23,
    },
  ]

  return (
    <Card className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>CPU</TableHead>
            <TableHead>Memory</TableHead>
            <TableHead>Pods</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nodes.map((node) => (
            <TableRow key={node.name}>
              <TableCell className="font-medium">{node.name}</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-green-500/10 text-green-500">
                  {node.status}
                </Badge>
              </TableCell>
              <TableCell>{node.role}</TableCell>
              <TableCell className="text-muted-foreground">{node.version}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={node.cpu} className="w-20" />
                  <span className="text-sm text-muted-foreground">{node.cpu}%</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={node.memory} className="w-20" />
                  <span className="text-sm text-muted-foreground">{node.memory}%</span>
                </div>
              </TableCell>
              <TableCell>{node.pods}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

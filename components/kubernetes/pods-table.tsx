import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"

interface PodsTableProps {
  clusterId: string
}

export function PodsTable({ clusterId }: PodsTableProps) {
  // Mock data - in production, fetch from your Kubernetes API
  const pods = [
    {
      name: "nginx-deployment-7d64c8d9f8-abc12",
      namespace: "default",
      status: "Running",
      restarts: 0,
      age: "2d",
      node: "node-2",
    },
    {
      name: "postgres-statefulset-0",
      namespace: "database",
      status: "Running",
      restarts: 1,
      age: "5d",
      node: "node-3",
    },
    {
      name: "redis-deployment-5f7b9c8d6e-xyz89",
      namespace: "cache",
      status: "Running",
      restarts: 0,
      age: "3d",
      node: "node-4",
    },
    {
      name: "api-deployment-6c8d9e7f5a-def45",
      namespace: "default",
      status: "Running",
      restarts: 2,
      age: "1d",
      node: "node-2",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Running":
        return "bg-green-500/10 text-green-500"
      case "Pending":
        return "bg-yellow-500/10 text-yellow-500"
      case "Failed":
        return "bg-red-500/10 text-red-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  return (
    <Card className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Namespace</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Restarts</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Node</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pods.map((pod) => (
            <TableRow key={pod.name}>
              <TableCell className="font-medium">{pod.name}</TableCell>
              <TableCell>{pod.namespace}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(pod.status)}>
                  {pod.status}
                </Badge>
              </TableCell>
              <TableCell>{pod.restarts}</TableCell>
              <TableCell className="text-muted-foreground">{pod.age}</TableCell>
              <TableCell className="text-muted-foreground">{pod.node}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Logs</DropdownMenuItem>
                    <DropdownMenuItem>Describe</DropdownMenuItem>
                    <DropdownMenuItem>Execute Shell</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete Pod</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

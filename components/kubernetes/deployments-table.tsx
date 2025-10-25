import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"

interface DeploymentsTableProps {
  clusterId: string
}

export function DeploymentsTable({ clusterId }: DeploymentsTableProps) {
  // Mock data - in production, fetch from your Kubernetes API
  const deployments = [
    {
      name: "nginx-deployment",
      namespace: "default",
      ready: "3/3",
      upToDate: 3,
      available: 3,
      age: "2d",
    },
    {
      name: "api-deployment",
      namespace: "default",
      ready: "5/5",
      upToDate: 5,
      available: 5,
      age: "1d",
    },
    {
      name: "redis-deployment",
      namespace: "cache",
      ready: "2/2",
      upToDate: 2,
      available: 2,
      age: "3d",
    },
  ]

  return (
    <Card className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Namespace</TableHead>
            <TableHead>Ready</TableHead>
            <TableHead>Up-to-date</TableHead>
            <TableHead>Available</TableHead>
            <TableHead>Age</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deployments.map((deployment) => (
            <TableRow key={deployment.name}>
              <TableCell className="font-medium">{deployment.name}</TableCell>
              <TableCell>{deployment.namespace}</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-green-500/10 text-green-500">
                  {deployment.ready}
                </Badge>
              </TableCell>
              <TableCell>{deployment.upToDate}</TableCell>
              <TableCell>{deployment.available}</TableCell>
              <TableCell className="text-muted-foreground">{deployment.age}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Scale</DropdownMenuItem>
                    <DropdownMenuItem>Edit YAML</DropdownMenuItem>
                    <DropdownMenuItem>Restart</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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

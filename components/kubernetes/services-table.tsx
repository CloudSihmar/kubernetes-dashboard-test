import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ServicesTableProps {
  clusterId: string
}

export function ServicesTable({ clusterId }: ServicesTableProps) {
  // Mock data - in production, fetch from your Kubernetes API
  const services = [
    {
      name: "nginx-service",
      namespace: "default",
      type: "LoadBalancer",
      clusterIP: "10.96.0.10",
      externalIP: "203.0.113.42",
      ports: "80:30080/TCP",
      age: "2d",
    },
    {
      name: "api-service",
      namespace: "default",
      type: "ClusterIP",
      clusterIP: "10.96.0.15",
      externalIP: "<none>",
      ports: "8080/TCP",
      age: "1d",
    },
    {
      name: "redis-service",
      namespace: "cache",
      type: "ClusterIP",
      clusterIP: "10.96.0.20",
      externalIP: "<none>",
      ports: "6379/TCP",
      age: "3d",
    },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "LoadBalancer":
        return "bg-blue-500/10 text-blue-500"
      case "ClusterIP":
        return "bg-purple-500/10 text-purple-500"
      case "NodePort":
        return "bg-green-500/10 text-green-500"
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
            <TableHead>Type</TableHead>
            <TableHead>Cluster IP</TableHead>
            <TableHead>External IP</TableHead>
            <TableHead>Ports</TableHead>
            <TableHead>Age</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.name}>
              <TableCell className="font-medium">{service.name}</TableCell>
              <TableCell>{service.namespace}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getTypeColor(service.type)}>
                  {service.type}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-sm">{service.clusterIP}</TableCell>
              <TableCell className="font-mono text-sm">{service.externalIP}</TableCell>
              <TableCell className="text-muted-foreground">{service.ports}</TableCell>
              <TableCell className="text-muted-foreground">{service.age}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

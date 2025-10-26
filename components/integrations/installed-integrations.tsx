"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, ExternalLink, Activity } from "lucide-react"

interface InstalledIntegration {
  id: string
  name: string
  icon: string
  version: string
  cluster: string
  namespace: string
  status: "running" | "stopped" | "error"
  replicas: string
  uptime: string
  url?: string
}

export function InstalledIntegrations() {
  // Mock data - in production, fetch from your API
  const installed: InstalledIntegration[] = [
    {
      id: "k8s-dash-prod",
      name: "Kubernetes Dashboard",
      icon: "☸️",
      version: "2.7.0",
      cluster: "production-cluster",
      namespace: "kubernetes-dashboard",
      status: "running",
      replicas: "1/1",
      uptime: "30d",
      url: "https://k8s-dashboard.prod.homelab.local",
    },
    {
      id: "kiali-prod",
      name: "Kiali",
      icon: "🕸️",
      version: "1.77.0",
      cluster: "production-cluster",
      namespace: "istio-system",
      status: "running",
      replicas: "1/1",
      uptime: "30d",
      url: "https://kiali.prod.homelab.local",
    },
    {
      id: "argocd-prod",
      name: "ArgoCD",
      icon: "🚀",
      version: "2.9.3",
      cluster: "production-cluster",
      namespace: "argocd",
      status: "running",
      replicas: "3/3",
      uptime: "30d",
      url: "https://argocd.prod.homelab.local",
    },
    {
      id: "k8s-dash-staging",
      name: "Kubernetes Dashboard",
      icon: "☸️",
      version: "2.7.0",
      cluster: "staging-cluster",
      namespace: "kubernetes-dashboard",
      status: "running",
      replicas: "1/1",
      uptime: "25d",
      url: "https://k8s-dashboard.staging.homelab.local",
    },
    {
      id: "kiali-staging",
      name: "Kiali",
      icon: "🕸️",
      version: "1.77.0",
      cluster: "staging-cluster",
      namespace: "istio-system",
      status: "running",
      replicas: "1/1",
      uptime: "25d",
      url: "https://kiali.staging.homelab.local",
    },
    {
      id: "argocd-staging",
      name: "ArgoCD",
      icon: "🚀",
      version: "2.9.3",
      cluster: "staging-cluster",
      namespace: "argocd",
      status: "running",
      replicas: "2/2",
      uptime: "25d",
      url: "https://argocd.staging.homelab.local",
    },
    {
      id: "k8s-dash-dev",
      name: "Kubernetes Dashboard",
      icon: "☸️",
      version: "2.7.0",
      cluster: "dev-cluster",
      namespace: "kubernetes-dashboard",
      status: "running",
      replicas: "1/1",
      uptime: "20d",
      url: "https://k8s-dashboard.dev.homelab.local",
    },
    {
      id: "1",
      name: "Grafana",
      icon: "📊",
      version: "10.2.3",
      cluster: "production-cluster",
      namespace: "monitoring",
      status: "running",
      replicas: "2/2",
      uptime: "15d",
      url: "https://grafana.homelab.local",
    },
    {
      id: "2",
      name: "Prometheus",
      icon: "🔥",
      version: "2.48.1",
      cluster: "production-cluster",
      namespace: "monitoring",
      status: "running",
      replicas: "1/1",
      uptime: "15d",
      url: "https://prometheus.homelab.local",
    },
    {
      id: "3",
      name: "PostgreSQL",
      icon: "🐘",
      version: "16.1",
      cluster: "production-cluster",
      namespace: "database",
      status: "running",
      replicas: "3/3",
      uptime: "30d",
    },
  ]

  const getStatusColor = (status: InstalledIntegration["status"]) => {
    switch (status) {
      case "running":
        return "bg-green-500/10 text-green-500"
      case "stopped":
        return "bg-gray-500/10 text-gray-500"
      case "error":
        return "bg-red-500/10 text-red-500"
    }
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Installed Integrations</h2>
        <p className="text-sm text-muted-foreground">Manage your deployed services and applications</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Cluster</TableHead>
            <TableHead>Namespace</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Replicas</TableHead>
            <TableHead>Uptime</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {installed.map((integration) => (
            <TableRow key={integration.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{integration.icon}</span>
                  <span className="font-medium">{integration.name}</span>
                  {integration.url && (
                    <a href={integration.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </a>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{integration.version}</TableCell>
              <TableCell className="text-muted-foreground">{integration.cluster}</TableCell>
              <TableCell className="text-muted-foreground">{integration.namespace}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(integration.status)}>
                  <Activity className="mr-1 h-3 w-3" />
                  {integration.status}
                </Badge>
              </TableCell>
              <TableCell>{integration.replicas}</TableCell>
              <TableCell className="text-muted-foreground">{integration.uptime}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Logs</DropdownMenuItem>
                    <DropdownMenuItem>Scale</DropdownMenuItem>
                    <DropdownMenuItem>Restart</DropdownMenuItem>
                    <DropdownMenuItem>Update</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Uninstall</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {installed.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No integrations installed yet</p>
        </div>
      )}
    </Card>
  )
}

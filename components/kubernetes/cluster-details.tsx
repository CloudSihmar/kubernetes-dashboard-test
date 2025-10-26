"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Activity, RefreshCw, ExternalLink } from "lucide-react"
import { NodesTable } from "./nodes-table"
import { PodsTable } from "./pods-table"
import { DeploymentsTable } from "./deployments-table"
import { ServicesTable } from "./services-table"

interface Cluster {
  id: string
  name: string
  version: string
  status: "healthy" | "warning" | "error"
  nodes: number
  pods: number
  cpu: number
  memory: number
  endpoint: string
  dashboards?: {
    kubernetes?: string
    kiali?: string
    argocd?: string
  }
}

interface ClusterDetailsProps {
  cluster: Cluster
  onBack: () => void
}

export function ClusterDetails({ cluster, onBack }: ClusterDetailsProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const getStatusColor = (status: Cluster["status"]) => {
    switch (status) {
      case "healthy":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "warning":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "error":
        return "bg-red-500/10 text-red-500 border-red-500/20"
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold">{cluster.name}</h2>
              <p className="text-sm text-muted-foreground">Kubernetes {cluster.version}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getStatusColor(cluster.status)}>
              <Activity className="mr-1 h-3 w-3" />
              {cluster.status}
            </Badge>
            <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {cluster.dashboards && Object.keys(cluster.dashboards).length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold">Connected Dashboards</h3>
            <div className="grid gap-3 md:grid-cols-3">
              {cluster.dashboards.kubernetes && (
                <a
                  href={cluster.dashboards.kubernetes}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:bg-accent"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-500/10">
                      <span className="text-lg">☸️</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Kubernetes Dashboard</p>
                      <p className="text-xs text-muted-foreground">Cluster Management</p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              )}
              {cluster.dashboards.kiali && (
                <a
                  href={cluster.dashboards.kiali}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:bg-accent"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-green-500/10">
                      <span className="text-lg">🕸️</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Kiali</p>
                      <p className="text-xs text-muted-foreground">Service Mesh</p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              )}
              {cluster.dashboards.argocd && (
                <a
                  href={cluster.dashboards.argocd}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:bg-accent"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-orange-500/10">
                      <span className="text-lg">🚀</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">ArgoCD</p>
                      <p className="text-xs text-muted-foreground">GitOps CD</p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              )}
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Nodes</p>
            <p className="text-2xl font-bold">{cluster.nodes}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Pods</p>
            <p className="text-2xl font-bold">{cluster.pods}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">CPU Usage</p>
            <p className="text-2xl font-bold">{cluster.cpu}%</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Memory Usage</p>
            <p className="text-2xl font-bold">{cluster.memory}%</p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="nodes" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="nodes">Nodes</TabsTrigger>
          <TabsTrigger value="pods">Pods</TabsTrigger>
          <TabsTrigger value="deployments">Deployments</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>
        <TabsContent value="nodes">
          <NodesTable clusterId={cluster.id} />
        </TabsContent>
        <TabsContent value="pods">
          <PodsTable clusterId={cluster.id} />
        </TabsContent>
        <TabsContent value="deployments">
          <DeploymentsTable clusterId={cluster.id} />
        </TabsContent>
        <TabsContent value="services">
          <ServicesTable clusterId={cluster.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

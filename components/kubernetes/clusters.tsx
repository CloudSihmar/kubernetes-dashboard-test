"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Plus, Server, Activity } from "lucide-react"
import { ClusterDetails } from "./cluster-details"
import { AddClusterDialog } from "./add-cluster-dialog"
import { apiClient } from "@/lib/api-client"

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

export function KubernetesClusters() {
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [clusters, setClusters] = useState<Cluster[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const data = await apiClient.getClusters()
        setClusters(data as Cluster[])
      } catch (error) {
        console.error("[v0] Failed to fetch clusters:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchClusters()
  }, [])

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

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading clusters...</p>
        </div>
      </Card>
    )
  }

  if (selectedCluster) {
    return <ClusterDetails cluster={selectedCluster} onBack={() => setSelectedCluster(null)} />
  }

  return (
    <>
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Clusters</h2>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Cluster
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clusters.map((cluster) => (
            <Card
              key={cluster.id}
              className="cursor-pointer p-4 transition-colors hover:bg-accent"
              onClick={() => setSelectedCluster(cluster)}
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Server className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{cluster.name}</h3>
                    <p className="text-sm text-muted-foreground">{cluster.version}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Configuration</DropdownMenuItem>
                    <DropdownMenuItem>Download Kubeconfig</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Remove Cluster</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mb-4 flex items-center gap-2">
                <Badge variant="outline" className={getStatusColor(cluster.status)}>
                  <Activity className="mr-1 h-3 w-3" />
                  {cluster.status}
                </Badge>
              </div>

              {cluster.dashboards && Object.keys(cluster.dashboards).length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {cluster.dashboards.kubernetes && (
                    <Badge variant="secondary" className="text-xs">
                      K8s Dashboard
                    </Badge>
                  )}
                  {cluster.dashboards.kiali && (
                    <Badge variant="secondary" className="text-xs">
                      Kiali
                    </Badge>
                  )}
                  {cluster.dashboards.argocd && (
                    <Badge variant="secondary" className="text-xs">
                      ArgoCD
                    </Badge>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Nodes</p>
                  <p className="font-semibold">{cluster.nodes}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Pods</p>
                  <p className="font-semibold">{cluster.pods}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">CPU</p>
                  <p className="font-semibold">{cluster.cpu}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Memory</p>
                  <p className="font-semibold">{cluster.memory}%</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <AddClusterDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </>
  )
}

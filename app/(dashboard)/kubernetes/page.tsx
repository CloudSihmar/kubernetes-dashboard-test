import { Suspense } from "react"
import { KubernetesClusters } from "@/components/kubernetes/clusters"
import { KubernetesStats } from "@/components/kubernetes/stats"
import { Skeleton } from "@/components/ui/skeleton"

export default function KubernetesPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kubernetes</h1>
          <p className="text-muted-foreground">Manage your Kubernetes clusters, nodes, and workloads</p>
        </div>
      </div>

      <Suspense fallback={<Skeleton className="h-32 w-full" />}>
        <KubernetesStats />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <KubernetesClusters />
      </Suspense>
    </div>
  )
}

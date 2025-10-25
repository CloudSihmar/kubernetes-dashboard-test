import { Suspense } from "react"
import { MachinesList } from "@/components/machines/machines-list"
import { MachinesStats } from "@/components/machines/machines-stats"
import { Skeleton } from "@/components/ui/skeleton"

export default function MachinesPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Machines</h1>
          <p className="text-muted-foreground">Manage your servers and infrastructure machines</p>
        </div>
      </div>

      <Suspense fallback={<Skeleton className="h-32 w-full" />}>
        <MachinesStats />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <MachinesList />
      </Suspense>
    </div>
  )
}

import { Suspense } from "react"
import { TerraformWorkspaces } from "@/components/terraform/terraform-workspaces"
import { TerraformStats } from "@/components/terraform/terraform-stats"
import { RecentRuns } from "@/components/terraform/recent-runs"
import { Skeleton } from "@/components/ui/skeleton"

export default function TerraformPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Terraform</h1>
          <p className="text-muted-foreground">Manage infrastructure as code with Terraform</p>
        </div>
      </div>

      <Suspense fallback={<Skeleton className="h-32 w-full" />}>
        <TerraformStats />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <TerraformWorkspaces />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <RecentRuns />
        </Suspense>
      </div>
    </div>
  )
}

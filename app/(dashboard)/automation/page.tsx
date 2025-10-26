import { Suspense } from "react"
import { PlaybooksList } from "@/components/automation/playbooks-list"
import { AutomationStats } from "@/components/automation/automation-stats"
import { RecentExecutions } from "@/components/automation/recent-executions"
import { Skeleton } from "@/components/ui/skeleton"

export default function AutomationPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automation</h1>
          <p className="text-muted-foreground">Manage Ansible playbooks and automation tasks</p>
        </div>
      </div>

      <Suspense fallback={<Skeleton className="h-32 w-full" />}>
        <AutomationStats />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <PlaybooksList />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <RecentExecutions />
        </Suspense>
      </div>
    </div>
  )
}

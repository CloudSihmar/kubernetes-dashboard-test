import { Suspense } from "react"
import { IntegrationsCatalog } from "@/components/integrations/integrations-catalog"
import { InstalledIntegrations } from "@/components/integrations/installed-integrations"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function IntegrationsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground">Browse and install services for your homelab</p>
        </div>
      </div>

      <Tabs defaultValue="catalog" className="w-full">
        <TabsList>
          <TabsTrigger value="catalog">Catalog</TabsTrigger>
          <TabsTrigger value="installed">Installed</TabsTrigger>
        </TabsList>
        <TabsContent value="catalog">
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <IntegrationsCatalog />
          </Suspense>
        </TabsContent>
        <TabsContent value="installed">
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <InstalledIntegrations />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

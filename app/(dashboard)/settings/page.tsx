"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SecuritySettings } from "@/components/settings/security-settings"
import { UserManagement } from "@/components/settings/user-management"
import { AuditLogs } from "@/components/settings/audit-logs"
import { SystemSettings } from "@/components/settings/system-settings"
import { ApiKeys } from "@/components/settings/api-keys"
import { BackupRestore } from "@/components/settings/backup-restore"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage security, users, and system configuration</p>
      </div>

      <Tabs defaultValue="security" className="space-y-6">
        <TabsList>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="space-y-6">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <AuditLogs />
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <ApiKeys />
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <SystemSettings />
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <BackupRestore />
        </TabsContent>
      </Tabs>
    </div>
  )
}

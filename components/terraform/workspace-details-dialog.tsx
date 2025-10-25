"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { X } from "lucide-react"

interface Workspace {
  id: string
  name: string
  environment: string
  provider: string
  resources: number
  status: "synced" | "drifted" | "pending"
}

interface WorkspaceDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspace: Workspace
}

export function WorkspaceDetailsDialog({ open, onOpenChange, workspace }: WorkspaceDetailsDialogProps) {
  // Mock data - in production, fetch from your API
  const resources = [
    { type: "aws_instance", name: "web-server-1", status: "synced" },
    { type: "aws_instance", name: "web-server-2", status: "synced" },
    { type: "aws_db_instance", name: "postgres-db", status: "synced" },
    { type: "aws_s3_bucket", name: "app-storage", status: "synced" },
    { type: "aws_vpc", name: "main-vpc", status: "synced" },
  ]

  const variables = [
    { name: "region", value: "us-east-1", sensitive: false },
    { name: "instance_type", value: "t3.medium", sensitive: false },
    { name: "db_password", value: "••••••••", sensitive: true },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle>{workspace.name}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="resources" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="variables">Variables</TabsTrigger>
            <TabsTrigger value="state">State</TabsTrigger>
          </TabsList>
          <TabsContent value="resources" className="max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources.map((resource, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-sm">{resource.type}</TableCell>
                    <TableCell>{resource.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        {resource.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="variables" className="max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Variable</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Sensitive</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variables.map((variable, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-sm">{variable.name}</TableCell>
                    <TableCell className="font-mono text-sm">{variable.value}</TableCell>
                    <TableCell>
                      {variable.sensitive ? (
                        <Badge variant="outline" className="bg-red-500/10 text-red-500">
                          Yes
                        </Badge>
                      ) : (
                        <Badge variant="outline">No</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="state" className="max-h-[400px] overflow-y-auto">
            <div className="rounded-lg bg-muted p-4 font-mono text-sm">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(
                  {
                    version: 4,
                    terraform_version: "1.6.5",
                    serial: 42,
                    lineage: "abc123-def456-ghi789",
                    outputs: {},
                    resources: resources.length,
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

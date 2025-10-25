"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Key, Plus, MoreVertical, Copy, Eye, EyeOff } from "lucide-react"

const apiKeys = [
  {
    id: 1,
    name: "Production API Key",
    key: "dpk_prod_abc123...xyz789",
    created: "2025-01-15",
    lastUsed: "2 hours ago",
    status: "Active",
  },
  {
    id: 2,
    name: "CI/CD Pipeline",
    key: "dpk_cicd_def456...uvw012",
    created: "2025-01-10",
    lastUsed: "1 day ago",
    status: "Active",
  },
  {
    id: 3,
    name: "Development Key",
    key: "dpk_dev_ghi789...rst345",
    created: "2025-01-05",
    lastUsed: "3 days ago",
    status: "Active",
  },
  {
    id: 4,
    name: "Legacy Integration",
    key: "dpk_legacy_jkl012...opq678",
    created: "2024-12-20",
    lastUsed: "2 weeks ago",
    status: "Inactive",
  },
]

export function ApiKeys() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [visibleKeys, setVisibleKeys] = useState<Set<number>>(new Set())

  const toggleKeyVisibility = (id: number) => {
    const newVisible = new Set(visibleKeys)
    if (newVisible.has(id)) {
      newVisible.delete(id)
    } else {
      newVisible.add(id)
    }
    setVisibleKeys(newVisible)
  }

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage API keys for programmatic access</CardDescription>
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create API Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New API Key</DialogTitle>
                  <DialogDescription>Generate a new API key for programmatic access</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Key Name</Label>
                    <Input placeholder="e.g., Production API Key" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description (Optional)</Label>
                    <Input placeholder="What will this key be used for?" />
                  </div>
                  <div className="rounded-lg border border-orange-500/50 bg-orange-500/5 p-4">
                    <p className="text-sm text-orange-500">
                      Make sure to copy your API key now. You won't be able to see it again!
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsCreateOpen(false)}>Generate Key</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>API Key</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-medium">{apiKey.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono">
                          {visibleKeys.has(apiKey.id) ? apiKey.key : apiKey.key.replace(/[a-z0-9]/gi, "•")}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                        >
                          {visibleKeys.has(apiKey.id) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(apiKey.key)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{apiKey.created}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{apiKey.lastUsed}</TableCell>
                    <TableCell>
                      <Badge variant={apiKey.status === "Active" ? "default" : "secondary"}>{apiKey.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Regenerate Key</DropdownMenuItem>
                          <DropdownMenuItem>View Usage</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Revoke Key</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            <CardTitle>API Key Best Practices</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Store API keys securely and never commit them to version control</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Rotate API keys regularly (recommended every 90 days)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Use separate keys for different environments (dev, staging, prod)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Revoke unused or compromised keys immediately</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreVertical, Terminal, Activity } from "lucide-react"
import { AddMachineDialog } from "./add-machine-dialog"
import { SSHTerminalDialog } from "./ssh-terminal-dialog"

interface Machine {
  id: string
  name: string
  hostname: string
  ip: string
  os: string
  status: "online" | "offline"
  cpu: number
  memory: number
  disk: number
  tags: string[]
}

export function MachinesList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null)
  const [showTerminal, setShowTerminal] = useState(false)

  // Mock data - in production, fetch from your API
  const machines: Machine[] = [
    {
      id: "1",
      name: "web-server-01",
      hostname: "web01.homelab.local",
      ip: "192.168.1.10",
      os: "Ubuntu 22.04",
      status: "online",
      cpu: 45,
      memory: 62,
      disk: 58,
      tags: ["production", "web"],
    },
    {
      id: "2",
      name: "db-server-01",
      hostname: "db01.homelab.local",
      ip: "192.168.1.11",
      os: "Ubuntu 22.04",
      status: "online",
      cpu: 72,
      memory: 81,
      disk: 65,
      tags: ["production", "database"],
    },
    {
      id: "3",
      name: "app-server-01",
      hostname: "app01.homelab.local",
      ip: "192.168.1.12",
      os: "Debian 12",
      status: "online",
      cpu: 38,
      memory: 54,
      disk: 42,
      tags: ["production", "app"],
    },
    {
      id: "4",
      name: "backup-server",
      hostname: "backup.homelab.local",
      ip: "192.168.1.20",
      os: "Ubuntu 22.04",
      status: "offline",
      cpu: 0,
      memory: 0,
      disk: 88,
      tags: ["backup"],
    },
  ]

  const filteredMachines = machines.filter(
    (machine) =>
      machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.ip.includes(searchQuery),
  )

  const handleOpenTerminal = (machine: Machine) => {
    setSelectedMachine(machine)
    setShowTerminal(true)
  }

  return (
    <>
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search machines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Machine
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Hostname</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>OS</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>CPU</TableHead>
              <TableHead>Memory</TableHead>
              <TableHead>Disk</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMachines.map((machine) => (
              <TableRow key={machine.id}>
                <TableCell className="font-medium">{machine.name}</TableCell>
                <TableCell className="font-mono text-sm">{machine.hostname}</TableCell>
                <TableCell className="font-mono text-sm">{machine.ip}</TableCell>
                <TableCell className="text-muted-foreground">{machine.os}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      machine.status === "online" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                    }
                  >
                    <Activity className="mr-1 h-3 w-3" />
                    {machine.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={machine.cpu > 80 ? "text-red-500" : ""}>{machine.cpu}%</span>
                </TableCell>
                <TableCell>
                  <span className={machine.memory > 80 ? "text-red-500" : ""}>{machine.memory}%</span>
                </TableCell>
                <TableCell>
                  <span className={machine.disk > 80 ? "text-yellow-500" : ""}>{machine.disk}%</span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {machine.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenTerminal(machine)}>
                        <Terminal className="mr-2 h-4 w-4" />
                        Open SSH Terminal
                      </DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Run Health Check</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <AddMachineDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
      {selectedMachine && (
        <SSHTerminalDialog open={showTerminal} onOpenChange={setShowTerminal} machine={selectedMachine} />
      )}
    </>
  )
}

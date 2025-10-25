"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

interface Playbook {
  id: string
  name: string
  description: string
  tasks: number
}

interface RunPlaybookDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  playbook: Playbook
}

export function RunPlaybookDialog({ open, onOpenChange, playbook }: RunPlaybookDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTargets, setSelectedTargets] = useState<string[]>([])

  // Mock data - in production, fetch from your API
  const targets = [
    { id: "1", name: "web-server-01", ip: "192.168.1.10" },
    { id: "2", name: "web-server-02", ip: "192.168.1.11" },
    { id: "3", name: "db-server-01", ip: "192.168.1.12" },
    { id: "4", name: "app-server-01", ip: "192.168.1.13" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    onOpenChange(false)
  }

  const toggleTarget = (targetId: string) => {
    setSelectedTargets((prev) => (prev.includes(targetId) ? prev.filter((id) => id !== targetId) : [...prev, targetId]))
  }

  const selectAll = () => {
    setSelectedTargets(targets.map((t) => t.id))
  }

  const deselectAll = () => {
    setSelectedTargets([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Run Playbook: {playbook.name}</DialogTitle>
          <DialogDescription>{playbook.description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <Label>Select Target Machines</Label>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={selectAll}>
                  Select All
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={deselectAll}>
                  Deselect All
                </Button>
              </div>
            </div>

            <div className="max-h-[300px] space-y-2 overflow-y-auto rounded-lg border p-4">
              {targets.map((target) => (
                <div key={target.id} className="flex items-center space-x-3 rounded-lg p-2 hover:bg-accent">
                  <Checkbox
                    id={target.id}
                    checked={selectedTargets.includes(target.id)}
                    onCheckedChange={() => toggleTarget(target.id)}
                  />
                  <Label htmlFor={target.id} className="flex flex-1 cursor-pointer items-center justify-between">
                    <span className="font-medium">{target.name}</span>
                    <span className="font-mono text-sm text-muted-foreground">{target.ip}</span>
                  </Label>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
              <div>
                <p className="text-sm font-medium">Selected Targets</p>
                <p className="text-sm text-muted-foreground">{playbook.tasks} tasks will be executed</p>
              </div>
              <Badge variant="secondary" className="text-lg">
                {selectedTargets.length}
              </Badge>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || selectedTargets.length === 0}>
              {isLoading ? "Running..." : "Run Playbook"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

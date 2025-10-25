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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface Integration {
  id: string
  name: string
  description: string
  category: string
  icon: string
  version: string
}

interface InstallIntegrationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  integration: Integration
}

export function InstallIntegrationDialog({ open, onOpenChange, integration }: InstallIntegrationDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [installProgress, setInstallProgress] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate installation progress
    for (let i = 0; i <= 100; i += 10) {
      setInstallProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 200))
    }

    setIsLoading(false)
    setInstallProgress(0)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Install {integration.name} {integration.icon}
          </DialogTitle>
          <DialogDescription>{integration.description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cluster">Target Cluster</Label>
              <Select>
                <SelectTrigger id="cluster">
                  <SelectValue placeholder="Select cluster" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prod">production-cluster</SelectItem>
                  <SelectItem value="staging">staging-cluster</SelectItem>
                  <SelectItem value="dev">dev-cluster</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="namespace">Namespace</Label>
              <Input id="namespace" placeholder="default" defaultValue="default" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="replicas">Replicas</Label>
              <Input id="replicas" type="number" min="1" max="10" defaultValue="1" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="storage">Storage Size (GB)</Label>
              <Input id="storage" type="number" min="1" max="1000" defaultValue="10" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="monitoring" defaultChecked />
              <Label htmlFor="monitoring" className="text-sm font-normal">
                Enable monitoring and metrics
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="backup" defaultChecked />
              <Label htmlFor="backup" className="text-sm font-normal">
                Enable automatic backups
              </Label>
            </div>

            {isLoading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Installing {integration.name}...</span>
                  <span>{installProgress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${installProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Installing..." : "Install"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

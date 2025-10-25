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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddMachineDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddMachineDialog({ open, onOpenChange }: AddMachineDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Machine</DialogTitle>
          <DialogDescription>Register a new machine to your homelab infrastructure</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Machine Name</Label>
                <Input id="name" placeholder="web-server-01" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hostname">Hostname</Label>
                <Input id="hostname" placeholder="web01.homelab.local" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="ip">IP Address</Label>
                <Input id="ip" placeholder="192.168.1.10" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="os">Operating System</Label>
                <Select>
                  <SelectTrigger id="os">
                    <SelectValue placeholder="Select OS" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ubuntu-22">Ubuntu 22.04</SelectItem>
                    <SelectItem value="ubuntu-24">Ubuntu 24.04</SelectItem>
                    <SelectItem value="debian-12">Debian 12</SelectItem>
                    <SelectItem value="centos-9">CentOS 9</SelectItem>
                    <SelectItem value="rhel-9">RHEL 9</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ssh-key">SSH Private Key</Label>
              <Textarea
                id="ssh-key"
                placeholder="Paste your SSH private key here..."
                className="font-mono text-sm"
                rows={6}
              />
              <p className="text-sm text-muted-foreground">Your SSH key will be securely stored and encrypted</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input id="tags" placeholder="production, web, frontend" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Machine"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

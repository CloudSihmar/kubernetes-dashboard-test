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

interface AddClusterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddClusterDialog({ open, onOpenChange }: AddClusterDialogProps) {
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
          <DialogTitle>Add Kubernetes Cluster</DialogTitle>
          <DialogDescription>Connect a new Kubernetes cluster to your homelab platform</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Cluster Name</Label>
              <Input id="name" placeholder="production-cluster" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endpoint">API Endpoint</Label>
              <Input id="endpoint" type="url" placeholder="https://k8s.example.com:6443" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="kubeconfig">Kubeconfig</Label>
              <Textarea
                id="kubeconfig"
                placeholder="Paste your kubeconfig file content here..."
                className="font-mono text-sm"
                rows={8}
                required
              />
              <p className="text-sm text-muted-foreground">Your kubeconfig will be securely stored and encrypted</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Cluster"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

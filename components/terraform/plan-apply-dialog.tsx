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
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface Workspace {
  id: string
  name: string
}

interface PlanApplyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspace: Workspace
}

export function PlanApplyDialog({ open, onOpenChange, workspace }: PlanApplyDialogProps) {
  const [isPlanning, setIsPlanning] = useState(false)
  const [planComplete, setPlanComplete] = useState(false)
  const [isApplying, setIsApplying] = useState(false)

  const handlePlan = async () => {
    setIsPlanning(true)
    // Simulate plan
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsPlanning(false)
    setPlanComplete(true)
  }

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsApplying(true)
    // Simulate apply
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsApplying(false)
    onOpenChange(false)
    setPlanComplete(false)
  }

  // Mock plan results
  const planResults = {
    add: 2,
    change: 3,
    destroy: 0,
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Plan & Apply - {workspace.name}</DialogTitle>
          <DialogDescription>Review and apply infrastructure changes</DialogDescription>
        </DialogHeader>

        {!planComplete ? (
          <div className="py-6">
            <p className="mb-4 text-sm text-muted-foreground">
              Run a Terraform plan to preview the changes that will be made to your infrastructure.
            </p>
            <Button onClick={handlePlan} disabled={isPlanning} className="w-full">
              {isPlanning ? "Planning..." : "Run Plan"}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleApply}>
            <div className="space-y-4 py-4">
              <div className="rounded-lg border bg-muted/50 p-4">
                <h3 className="mb-3 font-semibold">Plan Results</h3>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-500/10 text-green-500">
                      +{planResults.add}
                    </Badge>
                    <span className="text-sm text-muted-foreground">to add</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                      ~{planResults.change}
                    </Badge>
                    <span className="text-sm text-muted-foreground">to change</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-red-500/10 text-red-500">
                      -{planResults.destroy}
                    </Badge>
                    <span className="text-sm text-muted-foreground">to destroy</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-black p-4 font-mono text-sm text-green-400">
                <pre className="whitespace-pre-wrap">
                  {`Terraform will perform the following actions:

  # aws_instance.web-server-3 will be created
  + resource "aws_instance" "web-server-3" {
      + ami           = "ami-0c55b159cbfafe1f0"
      + instance_type = "t3.medium"
    }

  # aws_security_group.web will be updated in-place
  ~ resource "aws_security_group" "web" {
      ~ ingress {
          + cidr_blocks = ["0.0.0.0/0"]
        }
    }

Plan: 2 to add, 3 to change, 0 to destroy.`}
                </pre>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="confirm" required />
                <Label htmlFor="confirm" className="text-sm font-normal">
                  I have reviewed the plan and want to apply these changes
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setPlanComplete(false)
                  onOpenChange(false)
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isApplying}>
                {isApplying ? "Applying..." : "Apply Changes"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

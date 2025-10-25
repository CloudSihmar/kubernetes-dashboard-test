"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Copy } from "lucide-react"

interface TerraformRun {
  id: string
  workspace: string
  action: "plan" | "apply" | "destroy"
  status: "success" | "failed" | "running"
  startTime: string
  duration: string
  changes: {
    add: number
    change: number
    destroy: number
  }
}

interface RunLogsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  run: TerraformRun
}

export function RunLogsDialog({ open, onOpenChange, run }: RunLogsDialogProps) {
  // Mock logs - in production, fetch from your API
  const logs = `Terraform v1.6.5
on linux_amd64

Initializing the backend...

Successfully configured the backend "s3"!

Initializing provider plugins...
- Finding hashicorp/aws versions matching "~> 5.0"...
- Installing hashicorp/aws v5.31.0...
- Installed hashicorp/aws v5.31.0

Terraform has been successfully initialized!

aws_vpc.main: Refreshing state... [id=vpc-0123456789abcdef0]
aws_subnet.public: Refreshing state... [id=subnet-0123456789abcdef0]
aws_instance.web-server-1: Refreshing state... [id=i-0123456789abcdef0]

Terraform will perform the following actions:

  # aws_instance.web-server-2 will be created
  + resource "aws_instance" "web-server-2" {
      + ami           = "ami-0c55b159cbfafe1f0"
      + instance_type = "t3.medium"
    }

Plan: 2 to add, 3 to change, 0 to destroy.

aws_instance.web-server-2: Creating...
aws_instance.web-server-2: Still creating... [10s elapsed]
aws_instance.web-server-2: Creation complete after 45s [id=i-0987654321fedcba0]

Apply complete! Resources: 2 added, 3 changed, 0 destroyed.`

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(logs)
  }

  const getStatusColor = (status: TerraformRun["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-500/10 text-green-500"
      case "failed":
        return "bg-red-500/10 text-red-500"
      case "running":
        return "bg-blue-500/10 text-blue-500"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle>
                {run.action.toUpperCase()} - {run.workspace}
              </DialogTitle>
              <Badge variant="outline" className={getStatusColor(run.status)}>
                {run.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleCopyLogs}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Started: {run.startTime}</span>
            <span>Duration: {run.duration}</span>
            <span className="text-green-500">+{run.changes.add}</span>
            <span className="text-yellow-500">~{run.changes.change}</span>
            <span className="text-red-500">-{run.changes.destroy}</span>
          </div>
        </DialogHeader>

        <div className="max-h-[500px] overflow-y-auto rounded-lg bg-black p-4 font-mono text-sm text-green-400">
          <pre className="whitespace-pre-wrap">{logs}</pre>
        </div>
      </DialogContent>
    </Dialog>
  )
}

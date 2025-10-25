"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Copy } from "lucide-react"

interface Execution {
  id: string
  playbook: string
  status: "success" | "failed" | "running"
  startTime: string
  duration: string
  targets: number
}

interface ExecutionLogsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  execution: Execution
}

export function ExecutionLogsDialog({ open, onOpenChange, execution }: ExecutionLogsDialogProps) {
  // Mock logs - in production, fetch from your API
  const logs = `PLAY [Deploy Web Application] **************************************************

TASK [Gathering Facts] *********************************************************
ok: [web-server-01]
ok: [web-server-02]

TASK [Update apt cache] ********************************************************
changed: [web-server-01]
changed: [web-server-02]

TASK [Install nginx] ***********************************************************
ok: [web-server-01]
ok: [web-server-02]

TASK [Copy application files] **************************************************
changed: [web-server-01]
changed: [web-server-02]

TASK [Restart nginx service] ***************************************************
changed: [web-server-01]
changed: [web-server-02]

PLAY RECAP *********************************************************************
web-server-01              : ok=5    changed=3    unreachable=0    failed=0
web-server-02              : ok=5    changed=3    unreachable=0    failed=0`

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(logs)
  }

  const getStatusColor = (status: Execution["status"]) => {
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
              <DialogTitle>Execution Logs - {execution.playbook}</DialogTitle>
              <Badge variant="outline" className={getStatusColor(execution.status)}>
                {execution.status}
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
            <span>Started: {execution.startTime}</span>
            <span>Duration: {execution.duration}</span>
            <span>Targets: {execution.targets}</span>
          </div>
        </DialogHeader>

        <div className="max-h-[500px] overflow-y-auto rounded-lg bg-black p-4 font-mono text-sm text-green-400">
          <pre className="whitespace-pre-wrap">{logs}</pre>
        </div>
      </DialogContent>
    </Dialog>
  )
}

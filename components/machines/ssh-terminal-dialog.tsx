"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Maximize2, Minimize2, Copy } from "lucide-react"

interface Machine {
  id: string
  name: string
  hostname: string
  ip: string
  os: string
  status: "online" | "offline"
}

interface SSHTerminalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  machine: Machine
}

export function SSHTerminalDialog({ open, onOpenChange, machine }: SSHTerminalDialogProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [terminalOutput, setTerminalOutput] = useState<string[]>([])
  const [currentCommand, setCurrentCommand] = useState("")
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTerminalOutput([
        `Connecting to ${machine.hostname} (${machine.ip})...`,
        `Connected to ${machine.name}`,
        `Welcome to ${machine.os}`,
        "",
        `user@${machine.hostname}:~$ `,
      ])
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [open, machine])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalOutput])

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentCommand.trim()) {
      const command = currentCommand.trim()
      setTerminalOutput((prev) => [...prev, command])

      // Simulate command execution
      setTimeout(() => {
        let response = ""
        if (command === "ls") {
          response = "Desktop  Documents  Downloads  Pictures  Videos"
        } else if (command === "pwd") {
          response = "/home/user"
        } else if (command.startsWith("echo ")) {
          response = command.substring(5)
        } else if (command === "clear") {
          setTerminalOutput([`user@${machine.hostname}:~$ `])
          setCurrentCommand("")
          return
        } else {
          response = `bash: ${command}: command not found`
        }

        setTerminalOutput((prev) => [...prev, response, "", `user@${machine.hostname}:~$ `])
      }, 100)

      setCurrentCommand("")
    }
  }

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(terminalOutput.join("\n"))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${isFullscreen ? "h-screen max-h-screen w-screen max-w-none" : "sm:max-w-[900px]"} p-0`}
      >
        <DialogHeader className="border-b bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle>SSH Terminal - {machine.name}</DialogTitle>
              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                Connected
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleCopyOutput}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(!isFullscreen)}>
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div
          ref={terminalRef}
          className={`overflow-y-auto bg-black p-4 font-mono text-sm text-green-400 ${isFullscreen ? "h-[calc(100vh-80px)]" : "h-[500px]"}`}
          onClick={() => inputRef.current?.focus()}
        >
          {terminalOutput.map((line, index) => (
            <div key={index} className="whitespace-pre-wrap">
              {line}
            </div>
          ))}
          <div className="flex">
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyDown={handleCommand}
              className="flex-1 bg-transparent outline-none"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

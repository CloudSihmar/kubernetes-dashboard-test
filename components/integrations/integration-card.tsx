"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Star } from "lucide-react"

interface Integration {
  id: string
  name: string
  description: string
  category: string
  icon: string
  version: string
  popularity: number
  installed: boolean
  tags: string[]
}

interface IntegrationCardProps {
  integration: Integration
  onInstall: (integration: Integration) => void
}

export function IntegrationCard({ integration, onInstall }: IntegrationCardProps) {
  return (
    <Card className="flex flex-col p-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl">
            {integration.icon}
          </div>
          <div>
            <h3 className="font-semibold">{integration.name}</h3>
            <p className="text-sm text-muted-foreground">v{integration.version}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
          <span>{integration.popularity}</span>
        </div>
      </div>

      <p className="mb-4 flex-1 text-sm text-muted-foreground">{integration.description}</p>

      <div className="mb-4 flex flex-wrap gap-2">
        {integration.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>

      <Button onClick={() => onInstall(integration)} className="w-full">
        <Download className="mr-2 h-4 w-4" />
        Install
      </Button>
    </Card>
  )
}

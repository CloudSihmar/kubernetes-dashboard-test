"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { IntegrationCard } from "./integration-card"
import { InstallIntegrationDialog } from "./install-integration-dialog"

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

export function IntegrationsCatalog() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [showInstallDialog, setShowInstallDialog] = useState(false)

  // Mock data - in production, fetch from your API
  const integrations: Integration[] = [
    {
      id: "k8s-dashboard",
      name: "Kubernetes Dashboard",
      description: "General-purpose web UI for Kubernetes clusters",
      category: "kubernetes",
      icon: "☸️",
      version: "2.7.0",
      popularity: 97,
      installed: false,
      tags: ["kubernetes", "dashboard", "management"],
    },
    {
      id: "kiali",
      name: "Kiali",
      description: "Service mesh observability and configuration for Istio",
      category: "kubernetes",
      icon: "🕸️",
      version: "1.77.0",
      popularity: 94,
      installed: false,
      tags: ["kubernetes", "service-mesh", "istio", "observability"],
    },
    {
      id: "argocd",
      name: "ArgoCD",
      description: "Declarative GitOps continuous delivery tool for Kubernetes",
      category: "kubernetes",
      icon: "🚀",
      version: "2.9.3",
      popularity: 96,
      installed: false,
      tags: ["kubernetes", "gitops", "cd", "deployment"],
    },
    {
      id: "1",
      name: "Portainer",
      description: "Container management platform for Docker and Kubernetes",
      category: "containers",
      icon: "🐳",
      version: "2.19.4",
      popularity: 95,
      installed: false,
      tags: ["docker", "kubernetes", "management"],
    },
    {
      id: "2",
      name: "Grafana",
      description: "Analytics and monitoring platform with beautiful dashboards",
      category: "monitoring",
      icon: "📊",
      version: "10.2.3",
      popularity: 98,
      installed: false,
      tags: ["monitoring", "analytics", "visualization"],
    },
    {
      id: "3",
      name: "Prometheus",
      description: "Open-source monitoring and alerting toolkit",
      category: "monitoring",
      icon: "🔥",
      version: "2.48.1",
      popularity: 96,
      installed: false,
      tags: ["monitoring", "metrics", "alerting"],
    },
    {
      id: "4",
      name: "Traefik",
      description: "Modern HTTP reverse proxy and load balancer",
      category: "networking",
      icon: "🔀",
      version: "2.10.7",
      popularity: 92,
      installed: false,
      tags: ["proxy", "load-balancer", "networking"],
    },
    {
      id: "5",
      name: "GitLab",
      description: "Complete DevOps platform with Git repository management",
      category: "devops",
      icon: "🦊",
      version: "16.7.2",
      popularity: 94,
      installed: false,
      tags: ["git", "ci-cd", "devops"],
    },
    {
      id: "6",
      name: "Jenkins",
      description: "Leading open-source automation server for CI/CD",
      category: "devops",
      icon: "👷",
      version: "2.426.2",
      popularity: 90,
      installed: false,
      tags: ["ci-cd", "automation", "build"],
    },
    {
      id: "7",
      name: "PostgreSQL",
      description: "Advanced open-source relational database",
      category: "database",
      icon: "🐘",
      version: "16.1",
      popularity: 97,
      installed: false,
      tags: ["database", "sql", "relational"],
    },
    {
      id: "8",
      name: "Redis",
      description: "In-memory data structure store and cache",
      category: "database",
      icon: "🔴",
      version: "7.2.3",
      popularity: 95,
      installed: false,
      tags: ["cache", "database", "in-memory"],
    },
    {
      id: "9",
      name: "Nginx",
      description: "High-performance web server and reverse proxy",
      category: "networking",
      icon: "🌐",
      version: "1.25.3",
      popularity: 99,
      installed: false,
      tags: ["web-server", "proxy", "networking"],
    },
    {
      id: "10",
      name: "Nextcloud",
      description: "Self-hosted file sync and share platform",
      category: "storage",
      icon: "☁️",
      version: "28.0.1",
      popularity: 93,
      installed: false,
      tags: ["storage", "files", "collaboration"],
    },
    {
      id: "11",
      name: "Home Assistant",
      description: "Open-source home automation platform",
      category: "automation",
      icon: "🏠",
      version: "2023.12.3",
      popularity: 91,
      installed: false,
      tags: ["automation", "iot", "smart-home"],
    },
    {
      id: "12",
      name: "Vault",
      description: "Secrets management and data protection",
      category: "security",
      icon: "🔐",
      version: "1.15.4",
      popularity: 89,
      installed: false,
      tags: ["security", "secrets", "encryption"],
    },
  ]

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "kubernetes", label: "Kubernetes" },
    { value: "containers", label: "Containers" },
    { value: "monitoring", label: "Monitoring" },
    { value: "networking", label: "Networking" },
    { value: "devops", label: "DevOps" },
    { value: "database", label: "Database" },
    { value: "storage", label: "Storage" },
    { value: "automation", label: "Automation" },
    { value: "security", label: "Security" },
  ]

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || integration.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleInstall = (integration: Integration) => {
    setSelectedIntegration(integration)
    setShowInstallDialog(true)
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredIntegrations.map((integration) => (
            <IntegrationCard key={integration.id} integration={integration} onInstall={handleInstall} />
          ))}
        </div>

        {filteredIntegrations.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No integrations found matching your criteria</p>
          </Card>
        )}
      </div>

      {selectedIntegration && (
        <InstallIntegrationDialog
          open={showInstallDialog}
          onOpenChange={setShowInstallDialog}
          integration={selectedIntegration}
        />
      )}
    </>
  )
}

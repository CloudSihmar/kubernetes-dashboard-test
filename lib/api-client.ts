const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

interface AuthTokens {
  access: string
  refresh: string
}

class ApiClient {
  private accessToken: string | null = null
  private refreshToken: string | null = null

  constructor() {
    if (typeof window !== "undefined") {
      this.accessToken = localStorage.getItem("access_token")
      this.refreshToken = localStorage.getItem("refresh_token")
    }
  }

  setTokens(tokens: AuthTokens) {
    this.accessToken = tokens.access
    this.refreshToken = tokens.refresh
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", tokens.access)
      localStorage.setItem("refresh_token", tokens.refresh)
    }
  }

  clearTokens() {
    this.accessToken = null
    this.refreshToken = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
    }
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false

    try {
      const response = await fetch(`${API_BASE_URL}/users/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: this.refreshToken }),
      })

      if (response.ok) {
        const data = await response.json()
        this.accessToken = data.access
        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", data.access)
        }
        return true
      }
      return false
    } catch {
      return false
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    }

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`
    }

    let response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    // If unauthorized, try to refresh token
    if (response.status === 401 && this.refreshToken) {
      const refreshed = await this.refreshAccessToken()
      if (refreshed) {
        headers["Authorization"] = `Bearer ${this.accessToken}`
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
        })
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "An error occurred" }))
      throw new Error(error.detail || error.message || "Request failed")
    }

    return response.json()
  }

  // Authentication
  async login(email: string, password: string) {
    const data = await this.request<AuthTokens>("/users/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    this.setTokens(data)
    return data
  }

  async logout() {
    this.clearTokens()
  }

  async getCurrentUser() {
    return this.request("/users/me/")
  }

  // Kubernetes
  async getClusters() {
    return this.request("/kubernetes/clusters/")
  }

  async getCluster(id: string) {
    return this.request(`/kubernetes/clusters/${id}/`)
  }

  async createCluster(data: any) {
    return this.request("/kubernetes/clusters/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateCluster(id: string, data: any) {
    return this.request(`/kubernetes/clusters/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async deleteCluster(id: string) {
    return this.request(`/kubernetes/clusters/${id}/`, {
      method: "DELETE",
    })
  }

  async syncCluster(id: string) {
    return this.request(`/kubernetes/clusters/${id}/sync/`, {
      method: "POST",
    })
  }

  async getNodes(clusterId: string) {
    return this.request(`/kubernetes/clusters/${clusterId}/nodes/`)
  }

  async getPods(clusterId: string) {
    return this.request(`/kubernetes/clusters/${clusterId}/pods/`)
  }

  async getDeployments(clusterId: string) {
    return this.request(`/kubernetes/clusters/${clusterId}/deployments/`)
  }

  // Machines
  async getMachines() {
    return this.request("/machines/machines/")
  }

  async getMachine(id: string) {
    return this.request(`/machines/machines/${id}/`)
  }

  async createMachine(data: any) {
    return this.request("/machines/machines/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateMachine(id: string, data: any) {
    return this.request(`/machines/machines/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async deleteMachine(id: string) {
    return this.request(`/machines/machines/${id}/`, {
      method: "DELETE",
    })
  }

  async testConnection(id: string) {
    return this.request(`/machines/machines/${id}/test_connection/`, {
      method: "POST",
    })
  }

  // Dashboards
  async getDashboards() {
    return this.request("/dashboards/dashboards/")
  }

  async getIntegrations() {
    return this.request("/dashboards/integrations/")
  }

  async createIntegration(data: any) {
    return this.request("/dashboards/integrations/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async deleteIntegration(id: string) {
    return this.request(`/dashboards/integrations/${id}/`, {
      method: "DELETE",
    })
  }

  async getLoginUrl(id: string) {
    return this.request(`/dashboards/integrations/${id}/get_login_url/`)
  }

  // Automation (Ansible)
  async getPlaybooks() {
    return this.request("/automation/playbooks/")
  }

  async createPlaybook(data: any) {
    return this.request("/automation/playbooks/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updatePlaybook(id: string, data: any) {
    return this.request(`/automation/playbooks/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async deletePlaybook(id: string) {
    return this.request(`/automation/playbooks/${id}/`, {
      method: "DELETE",
    })
  }

  async runPlaybook(id: string, data: any) {
    return this.request(`/automation/playbooks/${id}/run/`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getExecutions() {
    return this.request("/automation/executions/")
  }

  async getExecution(id: string) {
    return this.request(`/automation/executions/${id}/`)
  }

  // Terraform
  async getWorkspaces() {
    return this.request("/terraform/workspaces/")
  }

  async createWorkspace(data: any) {
    return this.request("/terraform/workspaces/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateWorkspace(id: string, data: any) {
    return this.request(`/terraform/workspaces/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async deleteWorkspace(id: string) {
    return this.request(`/terraform/workspaces/${id}/`, {
      method: "DELETE",
    })
  }

  async planWorkspace(id: string) {
    return this.request(`/terraform/workspaces/${id}/plan/`, {
      method: "POST",
    })
  }

  async applyWorkspace(id: string) {
    return this.request(`/terraform/workspaces/${id}/apply/`, {
      method: "POST",
    })
  }

  async getRuns(workspaceId: string) {
    return this.request(`/terraform/workspaces/${workspaceId}/runs/`)
  }

  // Audit Logs
  async getAuditLogs(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ""
    return this.request(`/audit/logs/${queryString}`)
  }
}

export const apiClient = new ApiClient()

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Shield, Lock, AlertTriangle } from "lucide-react"

export function SecuritySettings() {
  const [settings, setSettings] = useState({
    mfaEnabled: true,
    sessionTimeout: "30",
    passwordExpiry: "90",
    maxLoginAttempts: "5",
    ipWhitelist: false,
    sslRequired: true,
    auditLogging: true,
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Authentication Security</CardTitle>
          </div>
          <CardDescription>Configure authentication and access control settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Multi-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Require MFA for all users</p>
            </div>
            <Switch
              checked={settings.mfaEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, mfaEnabled: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label>Session Timeout (minutes)</Label>
            <Input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
            />
            <p className="text-sm text-muted-foreground">Automatically log out inactive users</p>
          </div>

          <div className="space-y-2">
            <Label>Password Expiry (days)</Label>
            <Input
              type="number"
              value={settings.passwordExpiry}
              onChange={(e) => setSettings({ ...settings, passwordExpiry: e.target.value })}
            />
            <p className="text-sm text-muted-foreground">Force password change after this period</p>
          </div>

          <div className="space-y-2">
            <Label>Max Login Attempts</Label>
            <Input
              type="number"
              value={settings.maxLoginAttempts}
              onChange={(e) => setSettings({ ...settings, maxLoginAttempts: e.target.value })}
            />
            <p className="text-sm text-muted-foreground">Lock account after failed attempts</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            <CardTitle>Network Security</CardTitle>
          </div>
          <CardDescription>Configure network access and encryption settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>IP Whitelist</Label>
              <p className="text-sm text-muted-foreground">Restrict access to specific IP addresses</p>
            </div>
            <Switch
              checked={settings.ipWhitelist}
              onCheckedChange={(checked) => setSettings({ ...settings, ipWhitelist: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require SSL/TLS</Label>
              <p className="text-sm text-muted-foreground">Force HTTPS for all connections</p>
            </div>
            <Switch
              checked={settings.sslRequired}
              onCheckedChange={(checked) => setSettings({ ...settings, sslRequired: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Audit Logging</Label>
              <p className="text-sm text-muted-foreground">Log all security events and access attempts</p>
            </div>
            <Switch
              checked={settings.auditLogging}
              onCheckedChange={(checked) => setSettings({ ...settings, auditLogging: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-500/50 bg-orange-500/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <CardTitle>Security Recommendations</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-orange-500">•</span>
              <span>Enable MFA for all administrator accounts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500">•</span>
              <span>Rotate API keys and credentials every 90 days</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500">•</span>
              <span>Review audit logs regularly for suspicious activity</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500">•</span>
              <span>Keep all system components up to date</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save Security Settings</Button>
      </div>
    </div>
  )
}

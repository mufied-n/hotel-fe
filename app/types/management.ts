export type StaffPreviewRole = 'receptionist' | 'housekeeping' | 'revenue_mgr' | 'finance' | 'gm_admin'
export type StaffCapability = 'front_desk' | 'housekeeping' | 'finance' | 'catalog' | 'revenue' | 'channels' | 'notifications' | 'configuration' | 'audit'
export interface StaffPrincipal { username: string, role: StaffPreviewRole, fullName?: string, expiresAt: string }

export interface ChannelSnapshot { id: string, name: string, status: 'healthy' | 'delayed' | 'attention' | 'stale' | 'unknown', lastSyncAt: string, pendingUpdates: number, message: string, operation: string, resource: string, version: string, attempts: number, lastEvent: string, sanitizedError?: string, retryEligible: boolean }
export interface DeliverySnapshot { id: string, channel: 'email' | 'whatsapp', recipient: string, template: string, status: 'accepted' | 'queued' | 'sent' | 'delivered' | 'failed' | 'unknown', attempts: number, updatedAt: string, reference: string, retryEligible: boolean, timeline: Array<{ status: string, at: string }> }
export interface AuditSnapshot { id: string, actor: string, role: StaffPreviewRole, action: string, target: string, resourceType: string, occurredAt: string, result: 'success' | 'denied', before?: Record<string, string>, after?: Record<string, string> }
export interface PromoSnapshot { id?: string, name?: string, code: string, type: 'percent' | 'fixed', value: number, status: 'active' | 'scheduled' | 'expired', startsAt: string, endsAt: string, quotaTotal?: number, quotaUsed?: number }
export interface FeatureFlagSnapshot { key: string, name: string, description: string, enabled: boolean, allowed_roles: string[] | null, updated_by: string, updated_at: string }

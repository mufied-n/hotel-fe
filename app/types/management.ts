export type StaffPreviewRole = 'receptionist' | 'housekeeping' | 'revenue_mgr' | 'finance' | 'gm_admin'
export type StaffCapability = 'front_desk' | 'housekeeping' | 'finance' | 'catalog' | 'revenue' | 'channels' | 'notifications' | 'configuration' | 'audit'
export interface StaffPrincipal { username: string, role: StaffPreviewRole, fullName?: string, expiresAt: string }

export interface ChannelSnapshot { id: string, name: string, status: 'healthy' | 'delayed' | 'attention', lastSyncAt: string, pendingUpdates: number, message: string }
export interface DeliverySnapshot { id: string, channel: 'email' | 'whatsapp', recipient: string, template: string, status: 'delivered' | 'retrying' | 'failed', attempts: number, updatedAt: string }
export interface AuditSnapshot { id: string, actor: string, role: StaffPreviewRole, action: string, target: string, occurredAt: string, result: 'success' | 'denied' }
export interface PromoSnapshot { code: string, type: 'percent' | 'fixed', value: number, status: 'active' | 'scheduled' | 'expired', startsAt: string, endsAt: string }
export interface FeatureFlagSnapshot { key: string, name: string, description: string, enabled: boolean, allowed_roles: string[] | null, updated_by: string, updated_at: string }

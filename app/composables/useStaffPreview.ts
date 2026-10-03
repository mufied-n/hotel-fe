import type { StaffCapability, StaffPreviewRole } from '~/types/management'

export const staffRoleLabels: Record<StaffPreviewRole, string> = { receptionist: 'Receptionist', housekeeping: 'Housekeeping', finance: 'Finance', gm_admin: 'GM admin' }
const roleCapabilities: Record<StaffPreviewRole, StaffCapability[]> = {
  receptionist: ['front_desk', 'catalog', 'notifications'],
  housekeeping: ['housekeeping', 'catalog'],
  finance: ['finance', 'revenue', 'audit'],
  gm_admin: ['front_desk', 'housekeeping', 'finance', 'catalog', 'revenue', 'channels', 'notifications', 'configuration', 'audit'],
}

export function roleCan(role: StaffPreviewRole, capability: StaffCapability) { return roleCapabilities[role].includes(capability) }

export function useStaffPreview() {
  const role = useState<StaffPreviewRole>('staff-preview-role', () => 'gm_admin')
  const active = useState('staff-preview-active', () => true)
  return {
    role,
    active,
    can: (capability: StaffCapability) => roleCan(role.value, capability),
    enter: (nextRole: StaffPreviewRole) => { role.value = nextRole; active.value = true },
    expire: () => { active.value = false },
  }
}

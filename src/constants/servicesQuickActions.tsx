import {
  Add as AddIcon,
  PlaylistAdd as PlaylistAddIcon,
  Inventory as InventoryIcon,
  Insights as InsightsIcon,
} from '@mui/icons-material'

export type ServiceQuickActionId = 'add-service' | 'manage-addons' | 'inventory-sync' | 'performance-insights'

export interface ServiceQuickAction {
  id: ServiceQuickActionId
  label: string
  description: string
  icon: React.ReactNode
}

export const servicesQuickActions: ServiceQuickAction[] = [
  {
    id: 'add-service',
    label: 'Add Service',
    description: 'Create a new detailing package',
    icon: <AddIcon />,
  },
  {
    id: 'manage-addons',
    label: 'Manage Add-ons',
    description: 'Update upsell items & bundles',
    icon: <PlaylistAddIcon />,
  },
  {
    id: 'inventory-sync',
    label: 'Inventory Sync',
    description: 'Check availability for supplies',
    icon: <InventoryIcon />,
  },
  {
    id: 'performance-insights',
    label: 'Performance Insights',
    description: 'Review top services & pricing',
    icon: <InsightsIcon />,
  },
]


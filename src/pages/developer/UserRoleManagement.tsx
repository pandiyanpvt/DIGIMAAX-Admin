import { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Switch,
  FormControlLabel,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  AdminPanelSettings as RoleIcon,
} from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'

const sampleRoles = [
  {
    id: 1,
    name: 'superadmin',
    displayName: 'Super Admin',
    description: 'Full system access with all permissions',
    permissions: ['all'],
    userCount: 2,
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    name: 'admin',
    displayName: 'Admin',
    description: 'Administrative access to manage content and users',
    permissions: ['manage_content', 'manage_users', 'view_reports'],
    userCount: 5,
    createdAt: '2024-01-14',
  },
  {
    id: 3,
    name: 'user',
    displayName: 'User',
    description: 'Basic user access with limited permissions',
    permissions: ['view_content'],
    userCount: 25,
    createdAt: '2024-01-13',
  },
]

function UserRoleManagement() {
  const [roles, setRoles] = useState(sampleRoles)
  const [selectedRole, setSelectedRole] = useState<any>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredRoles = roles.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAdd = () => {
    setSelectedRole({
      name: '',
      displayName: '',
      description: '',
      permissions: [],
    })
    setAddDialogOpen(true)
  }

  const handleEdit = (role: any) => {
    setSelectedRole({ ...role })
    setEditDialogOpen(true)
  }

  const handleSave = () => {
    if (selectedRole) {
      if (selectedRole.id) {
        setRoles(roles.map((r) => (r.id === selectedRole.id ? selectedRole : r)))
        setEditDialogOpen(false)
      } else {
        const newRole = {
          ...selectedRole,
          id: Date.now(),
          userCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
        }
        setRoles([...roles, newRole])
        setAddDialogOpen(false)
      }
      setSelectedRole(null)
    }
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      setRoles(roles.filter((r) => r.id !== id))
    }
  }

  return (
    <PageContainer sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Card sx={{ p: { xs: 2, sm: 2.5, md: 3 }, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2, mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            User Role Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{ backgroundColor: 'primary.main' }}
          >
            Add Role
          </Button>
        </Box>

        <TextField
          placeholder="Search roles..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3, minWidth: { xs: '100%', sm: 300 } }}
          fullWidth={false}
        />

        <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Table sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell>Role</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Permissions</TableCell>
                <TableCell>Users</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <RoleIcon color="primary" />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {role.displayName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {role.name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{role.description}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {role.permissions.length > 0 && role.permissions[0] === 'all' ? (
                        <Chip label="All Permissions" size="small" color="primary" />
                      ) : (
                        role.permissions.slice(0, 3).map((perm: string, idx: number) => (
                          <Chip key={idx} label={perm} size="small" />
                        ))
                      )}
                      {role.permissions.length > 3 && (
                        <Chip label={`+${role.permissions.length - 3}`} size="small" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={role.userCount} size="small" />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(role)}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(role.id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={addDialogOpen || editDialogOpen}
        onClose={() => {
          setAddDialogOpen(false)
          setEditDialogOpen(false)
          setSelectedRole(null)
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedRole?.id ? 'Edit User Role' : 'Add User Role'}</DialogTitle>
        <DialogContent>
          {selectedRole && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Role Name"
                value={selectedRole.name}
                onChange={(e) => setSelectedRole({ ...selectedRole, name: e.target.value })}
                placeholder="e.g., admin, manager"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Display Name"
                value={selectedRole.displayName}
                onChange={(e) =>
                  setSelectedRole({ ...selectedRole, displayName: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Description"
                value={selectedRole.description}
                onChange={(e) =>
                  setSelectedRole({ ...selectedRole, description: e.target.value })
                }
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Permissions (comma-separated)"
                value={selectedRole.permissions.join(', ')}
                onChange={(e) =>
                  setSelectedRole({
                    ...selectedRole,
                    permissions: e.target.value.split(',').map((p) => p.trim()),
                  })
                }
                placeholder="e.g., manage_users, view_reports, all"
                sx={{ mb: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAddDialogOpen(false)
              setEditDialogOpen(false)
              setSelectedRole(null)
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: 'primary.main' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  )
}

export default UserRoleManagement


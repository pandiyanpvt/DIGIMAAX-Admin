import { useState, useEffect } from 'react'
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
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  AdminPanelSettings as RoleIcon,
} from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import {
  getAllUserRoles,
  createUserRole,
  updateUserRole,
  deleteUserRole,
  type UserRole,
  type CreateUserRolePayload,
  type UpdateUserRolePayload,
} from '../../api/userRoles'
import { getUsersByRole } from '../../api/users'

function UserRoleManagement() {
  const [roles, setRoles] = useState<UserRole[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [userCounts, setUserCounts] = useState<Record<number, number>>({})

  const [formData, setFormData] = useState({
    name: '',
    is_active: true,
  })
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Fetch roles on mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true)
        setError(null)
        const rolesData = await getAllUserRoles()
        setRoles(rolesData)

        // Fetch user counts for each role
        const counts: Record<number, number> = {}
        for (const role of rolesData) {
          try {
            const users = await getUsersByRole(role.id)
            counts[role.id] = users.length
          } catch (err) {
            counts[role.id] = 0
          }
        }
        setUserCounts(counts)
      } catch (err: any) {
        console.error('Error fetching roles:', err)
        setError(err?.response?.data?.message || err?.message || 'Failed to fetch user roles')
      } finally {
        setLoading(false)
      }
    }

    fetchRoles()
  }, [])

  const filteredRoles = roles.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAdd = () => {
    setSelectedRole(null)
    setFormData({
      name: '',
      is_active: true,
    })
    setAddDialogOpen(true)
    setError(null)
  }

  const handleEdit = (role: UserRole) => {
    setSelectedRole(role)
    setFormData({
      name: role.name,
      is_active: role.is_active,
    })
    setEditDialogOpen(true)
    setError(null)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccessMessage(null)

      if (!formData.name.trim()) {
        setError('Role name is required')
        return
      }

      if (selectedRole) {
        // Update existing role
        const payload: UpdateUserRolePayload = {
          id: selectedRole.id,
          name: formData.name.trim(),
          is_active: formData.is_active,
        }
        const updated = await updateUserRole(payload)
        setRoles(roles.map((r) => (r.id === selectedRole.id ? updated : r)))
        setSuccessMessage('User role updated successfully!')
        setEditDialogOpen(false)
      } else {
        // Create new role
        const payload: CreateUserRolePayload = {
          name: formData.name.trim(),
          is_active: formData.is_active,
        }
        const created = await createUserRole(payload)
        setRoles([...roles, created])
        setUserCounts({ ...userCounts, [created.id]: 0 })
        setSuccessMessage('User role created successfully!')
        setAddDialogOpen(false)
      }

      setFormData({
        name: '',
        is_active: true,
      })
      setSelectedRole(null)
    } catch (err: any) {
      console.error('Error saving role:', err)
      setError(err?.response?.data?.message || err?.message || 'Failed to save user role')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (id: number) => {
    setRoleToDelete(id)
    setConfirmDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (roleToDelete === null) return

    try {
      setDeleting(true)
      setError(null)
      await deleteUserRole(roleToDelete)
      setRoles(roles.filter((r) => r.id !== roleToDelete))
      const newCounts = { ...userCounts }
      delete newCounts[roleToDelete]
      setUserCounts(newCounts)
      setSuccessMessage('User role deleted successfully!')
      setConfirmDialogOpen(false)
      setRoleToDelete(null)
    } catch (err: any) {
      console.error('Error deleting role:', err)
      setError(err?.response?.data?.message || err?.message || 'Failed to delete user role')
      setConfirmDialogOpen(false)
      setRoleToDelete(null)
    } finally {
      setDeleting(false)
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

        {(error || successMessage) && (
          <Alert
            severity={error ? 'error' : 'success'}
            onClose={() => {
              setError(null)
              setSuccessMessage(null)
            }}
            sx={{ mb: 2 }}
          >
            {error || successMessage}
          </Alert>
        )}

        <TextField
          placeholder="Search roles..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3, minWidth: { xs: '100%', sm: 300 } }}
          fullWidth={false}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Role Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Users</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRoles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No roles found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRoles.map((role) => (
                    <TableRow key={role.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <RoleIcon color="primary" />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {role.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={role.is_active ? 'Active' : 'Inactive'}
                          size="small"
                          color={role.is_active ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip label={userCounts[role.id] || 0} size="small" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(role.created_at).toLocaleDateString()}
                        </Typography>
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
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={addDialogOpen || editDialogOpen}
        onClose={() => {
          setAddDialogOpen(false)
          setEditDialogOpen(false)
          setSelectedRole(null)
          setError(null)
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedRole ? 'Edit User Role' : 'Add User Role'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              fullWidth
              label="Role Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Admin, Manager, Developer"
              sx={{ mb: 2 }}
              required
              disabled={saving}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  disabled={saving}
                />
              }
              label="Active"
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAddDialogOpen(false)
              setEditDialogOpen(false)
              setSelectedRole(null)
              setError(null)
            }}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving}
            sx={{ backgroundColor: 'primary.main' }}
          >
            {saving ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <ConfirmDialog
        open={confirmDialogOpen}
        title="Delete Role"
        message={`Are you sure you want to delete "${roles.find((r) => r.id === roleToDelete)?.name || 'this role'}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmDialogOpen(false)
          setRoleToDelete(null)
        }}
        loading={deleting}
      />
    </PageContainer>
  )
}

export default UserRoleManagement

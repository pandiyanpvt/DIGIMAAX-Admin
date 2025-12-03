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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
} from '@mui/material'
import { Grid } from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { getCurrentUserRole, rolePermissions } from '../../constants/roles'
import { getAllUsers, updateUser, deleteUser, type User } from '../../api/users'
import { registerAdmin } from '../../api/auth'
import { getAllUserRoles } from '../../api/userRoles'
import { Alert, CircularProgress } from '@mui/material'

const roleColors: Record<string, string> = {
  user: '#4caf50',
}

function UsersManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [userRoles, setUserRoles] = useState<Array<{ id: number; name: string }>>([])
  const currentRole = getCurrentUserRole()
  const permissions = rolePermissions[currentRole]
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    userRoleId: 2, // Default to User role (ID 2)
    password: '',
  })
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Fetch users and roles on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch all users
        const usersData = await getAllUsers()
        // Filter to show only users with role "User" (userRoleId = 2)
        const shopWorkers = usersData.filter(user => user.userRoleId === 2)
        setUsers(shopWorkers)
        
        // Fetch user roles to map role names to IDs
        const roles = await getAllUserRoles()
        setUserRoles(roles)
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || 'Failed to fetch users')
        console.error('Error fetching users:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const handleAdd = () => {
    setEditingUser(null)
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      userRoleId: 2,
      password: '',
    })
    setDialogOpen(true)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      userRoleId: user.userRoleId,
      password: '',
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      setError(null)
      
      if (editingUser) {
        // Update existing user
        await updateUser({
          id: editingUser.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          userRoleId: formData.userRoleId,
        })
        
        // Refresh users list
        const usersData = await getAllUsers()
        const shopWorkers = usersData.filter(user => user.userRoleId === 2)
        setUsers(shopWorkers)
      } else {
        // Create new user
        if (!formData.password) {
          setError('Password is required for new users')
          return
        }
        
        await registerAdmin({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          userRoleId: formData.userRoleId,
        })
        
        // Refresh users list
        const usersData = await getAllUsers()
        const shopWorkers = usersData.filter(user => user.userRoleId === 2)
        setUsers(shopWorkers)
      }
      
      setDialogOpen(false)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        userRoleId: 2,
        password: '',
      })
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save user')
      console.error('Error saving user:', err)
    }
  }

  const handleDelete = (id: number) => {
    setUserToDelete(id)
    setConfirmDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (userToDelete === null) return

    try {
      setDeleting(true)
      setError(null)
      await deleteUser(userToDelete)
      
      // Refresh users list
      const usersData = await getAllUsers()
      const shopWorkers = usersData.filter(user => user.userRoleId === 2)
      setUsers(shopWorkers)
      setConfirmDialogOpen(false)
      setUserToDelete(null)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to delete user')
      console.error('Error deleting user:', err)
      setConfirmDialogOpen(false)
      setUserToDelete(null)
    } finally {
      setDeleting(false)
    }
  }

  const canManage = permissions.canManageUsers


  if (loading) {
    return (
      <PageContainer sx={{ p: { xs: 2, sm: 3, md: 4 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </PageContainer>
    )
  }

  return (
    <PageContainer sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Card sx={{ p: { xs: 2, sm: 2.5, md: 3 }, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Shop Workers Management
          </Typography>
          {canManage && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
              sx={{ backgroundColor: 'primary.main' }}
            >
              Add Shop Worker
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Shop Worker</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Login</TableCell>
                {canManage && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No shop workers found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ backgroundColor: roleColors['user'] }}>
                          <PersonIcon />
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {user.firstName} {user.lastName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phoneNumber}</TableCell>
                    <TableCell>
                      <Chip
                        label="Shop Worker"
                        size="small"
                        sx={{
                          backgroundColor: roleColors['user'],
                          color: 'white',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.is_verified ? 'Verified' : 'Unverified'}
                        size="small"
                        color={user.is_verified ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      {user.updated_at
                        ? new Date(user.updated_at).toLocaleString()
                        : 'Never'}
                    </TableCell>
                    {canManage && (
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(user)}
                            color="primary"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(user.id)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add/Edit Dialog */}
      {canManage && (
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editingUser ? 'Edit Shop Worker' : 'Add New Shop Worker'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
                </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
                </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
                </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={formData.userRoleId}
                    label="Role"
                    onChange={(e) =>
                      setFormData({ ...formData, userRoleId: Number(e.target.value) })
                    }
                  >
                    {userRoles
                      .filter(role => role.name === 'User' || role.id === 2)
                      .map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          Shop Worker
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label={editingUser ? 'New Password (leave blank to keep current)' : 'Password'}
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                </Grid>
                </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: 'primary.main' }}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <ConfirmDialog
        open={confirmDialogOpen}
        title="Delete Shop Worker"
        message={`Are you sure you want to delete "${users.find((u) => u.id === userToDelete)?.firstName || users.find((u) => u.id === userToDelete)?.email || 'this shop worker'}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmDialogOpen(false)
          setUserToDelete(null)
        }}
        loading={deleting}
      />
    </PageContainer>
  )
}

export default UsersManagement


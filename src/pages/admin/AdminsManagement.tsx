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
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'
import { getCurrentUserRole } from '../../constants/roles'
import { getAllUsers, updateUser, deleteUser, type User } from '../../api/users'
import { registerAdmin } from '../../api/auth'
import { getAllUserRoles } from '../../api/userRoles'
import { Alert, CircularProgress } from '@mui/material'

function AdminsManagement() {
  const [admins, setAdmins] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<User | null>(null)
  const [userRoles, setUserRoles] = useState<Array<{ id: number; name: string }>>([])
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    userRoleId: 1, // Default to Admin role (ID 1)
    password: '',
  })

  const currentRole = getCurrentUserRole()
  const canEdit = currentRole === 'superadmin'

  // Fetch admins and roles on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch all users
        const usersData = await getAllUsers()
        // Filter to show only Admin (ID 1) and Developer (ID 3) roles
        const adminUsers = usersData.filter(user => user.userRoleId === 1 || user.userRoleId === 3)
        setAdmins(adminUsers)
        
        // Fetch user roles to map role names to IDs
        const roles = await getAllUserRoles()
        setUserRoles(roles)
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || 'Failed to fetch admins')
('Error fetching admins:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const handleAdd = () => {
    setEditingAdmin(null)
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      userRoleId: 1, // Default to Admin
      password: '',
    })
    setDialogOpen(true)
  }

  const handleEdit = (admin: User) => {
    setEditingAdmin(admin)
    setFormData({
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      phoneNumber: admin.phoneNumber || '',
      userRoleId: admin.userRoleId,
      password: '',
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      setError(null)
      
      if (editingAdmin) {
        // Update existing admin
        await updateUser({
          id: editingAdmin.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          userRoleId: formData.userRoleId,
        })
        
        // Refresh admins list
        const usersData = await getAllUsers()
        const adminUsers = usersData.filter(user => user.userRoleId === 1 || user.userRoleId === 3)
        setAdmins(adminUsers)
      } else {
        // Create new admin
        if (!formData.password) {
          setError('Password is required for new admins')
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
        
        // Refresh admins list
        const usersData = await getAllUsers()
        const adminUsers = usersData.filter(user => user.userRoleId === 1 || user.userRoleId === 3)
        setAdmins(adminUsers)
      }
      
      setDialogOpen(false)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        userRoleId: 1,
        password: '',
      })
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save admin')
('Error saving admin:', err)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        setError(null)
        await deleteUser(id)
        
        // Refresh admins list
        const usersData = await getAllUsers()
        const adminUsers = usersData.filter(user => user.userRoleId === 1 || user.userRoleId === 3)
        setAdmins(adminUsers)
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || 'Failed to delete admin')
('Error deleting admin:', err)
      }
    }
  }

  // Check if user is superadmin/developer
  const isSuperAdmin = (userRoleId: number): boolean => {
    return userRoleId === 3 // Developer role ID
  }

  const roleColors: Record<string, string> = {
    superadmin: '#f44336',
    admin: '#2196f3',
  }

  if (loading) {
    return (
      <PageContainer sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </PageContainer>
    )
  }

  return (
    <PageContainer sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Card sx={{ p: { xs: 2, sm: 2.5, md: 3 }, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2, mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Admins Management
          </Typography>
          {canEdit && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
              sx={{ backgroundColor: 'primary.main' }}
            >
              Add Admin
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>Admin</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No admins found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                admins.map((admin) => {
                  const isDev = isSuperAdmin(admin.userRoleId)
                  return (
                    <TableRow key={admin.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ backgroundColor: isDev ? roleColors.superadmin : roleColors.admin }}>
                            <AdminIcon />
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {admin.firstName} {admin.lastName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>{admin.phoneNumber || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={isDev ? 'Super Admin' : 'Admin'}
                          size="small"
                          sx={{
                            backgroundColor: isDev ? roleColors.superadmin : roleColors.admin,
                            color: 'white',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={admin.is_verified ? 'Verified' : 'Unverified'}
                          size="small"
                          color={admin.is_verified ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        {admin.updated_at
                          ? new Date(admin.updated_at).toLocaleString()
                          : 'Never'}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {canEdit && (
                            <>
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(admin)}
                                color="primary"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              {!isDev && (
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(admin.id)}
                                  color="error"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              )}
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add/Edit Dialog */}
      {canEdit && (
        <Dialog 
          open={dialogOpen} 
          onClose={() => setDialogOpen(false)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              m: { xs: 1, sm: 2 },
            }
          }}
        >
          <DialogTitle>{editingAdmin ? 'Edit Admin' : 'Add New Admin'}</DialogTitle>
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
                      .filter(role => role.name === 'Admin' || role.name === 'Developer' || role.id === 1 || role.id === 3)
                      .map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          {role.name === 'Developer' || role.id === 3 ? 'Super Admin' : 'Admin'}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label={editingAdmin ? 'New Password (leave blank to keep current)' : 'Password'}
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
    </PageContainer>
  )
}

export default AdminsManagement


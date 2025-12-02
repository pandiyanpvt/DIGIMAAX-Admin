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
  CircularProgress,
  Alert,
  Snackbar,
  InputAdornment,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'
import { getCurrentUserRole } from '../../constants/roles'
import {
  getAllUsers,
  createUser,
  getUserById,
  type User,
  type CreateUserPayload,
} from '../../api/users'
import { getAllUserRoles, type UserRole } from '../../api/userRoles'

function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [userRoles, setUserRoles] = useState<UserRole[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [roleFilter, setRoleFilter] = useState<number | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const currentRole = getCurrentUserRole()

  // Check if user is developer (superadmin role)
  const isDeveloper = currentRole === 'superadmin'

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    userRoleId: 1,
  })

  // Fetch users and roles on mount
  useEffect(() => {
    if (!isDeveloper) {
      setError('Access denied. Only developers can access this page.')
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const [usersData, rolesData] = await Promise.all([
          getAllUsers(),
          getAllUserRoles(),
        ])
        setUsers(usersData)
        setUserRoles(rolesData)
      } catch (err: any) {
        console.error('Error fetching data:', err)
        setError(err?.response?.data?.message || err?.message || 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isDeveloper])

  // Filter users by role and search term
  const filteredUsers = users.filter((user) => {
    // Role filter
    const matchesRole = roleFilter === 'all' || user.userRoleId === roleFilter
    
    // Search filter
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = !searchTerm || 
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      (user.phoneNumber && user.phoneNumber.toLowerCase().includes(searchLower)) ||
      (user.roleName && user.roleName.toLowerCase().includes(searchLower))
    
    return matchesRole && matchesSearch
  })

  const handleAdd = () => {
    setSelectedUser(null)
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      userRoleId: userRoles.length > 0 ? userRoles[0].id : 1,
    })
    setShowPassword(false)
    setAddDialogOpen(true)
    setError(null)
  }

  const handleEdit = async (user: User) => {
    try {
      setError(null)
      const fullUser = await getUserById(user.id)
      setSelectedUser(fullUser)
      setFormData({
        firstName: fullUser.firstName,
        lastName: fullUser.lastName,
        email: fullUser.email,
        phoneNumber: fullUser.phoneNumber,
        password: '',
        userRoleId: fullUser.userRoleId,
      })
      setShowPassword(false)
      setEditDialogOpen(true)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch user details')
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccessMessage(null)

      if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
        setError('First name, last name, and email are required')
        return
      }

      if (selectedUser) {
        // Update existing user (password is optional for updates)
        // Note: Update API might be different, adjust as needed
        setSuccessMessage('User update functionality - implement update API call')
        setEditDialogOpen(false)
      } else {
        // Create new user
        if (!formData.password.trim()) {
          setError('Password is required for new users')
          return
        }

        const payload: CreateUserPayload = {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          password: formData.password,
          userRoleId: formData.userRoleId,
        }

        await createUser(payload)
        setSuccessMessage('User created successfully!')

        // Refresh users list
        const usersData = await getAllUsers()
        setUsers(usersData)
        setAddDialogOpen(false)
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          password: '',
          userRoleId: userRoles.length > 0 ? userRoles[0].id : 1,
        })
      }
    } catch (err: any) {
      console.error('Error saving user:', err)
      setError(err?.response?.data?.message || err?.message || 'Failed to save user')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (_id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return
    }

    try {
      setError(null)
      // Note: Implement delete API call when available
      setSuccessMessage('User delete functionality - implement delete API call')
      // Refresh users list
      const usersData = await getAllUsers()
      setUsers(usersData)
    } catch (err: any) {
      console.error('Error deleting user:', err)
      setError(err?.response?.data?.message || err?.message || 'Failed to delete user')
    }
  }

  if (!isDeveloper) {
    return (
      <PageContainer sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Card sx={{ p: { xs: 2, sm: 2.5, md: 3 }, borderRadius: 2 }}>
          <Alert severity="error">Access denied. Only developers can access this page.</Alert>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Card sx={{ p: { xs: 2, sm: 2.5, md: 3 }, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2, mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Users Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{ backgroundColor: 'primary.main' }}
          >
            Add User
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

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TextField
              placeholder="Search users..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 2, minWidth: { xs: '100%', sm: 300 } }}
              fullWidth={false}
              disabled={loading}
            />
            <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Filter by Role</InputLabel>
                <Select
                  value={roleFilter}
                  label="Filter by Role"
                  onChange={(e) => setRoleFilter(e.target.value as number | 'all')}
                >
                  <MenuItem value="all">All Roles</MenuItem>
                  {userRoles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="body2" color="text.secondary">
                Total: {filteredUsers.length} user(s)
              </Typography>
            </Box>

            <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
              <Table sx={{ minWidth: 600 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          No users found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon color="action" />
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {user.firstName} {user.lastName}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{user.email}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{user.phoneNumber || 'N/A'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.roleName || `Role ${user.userRoleId}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.is_verified ? 'Verified' : 'Not Verified'}
                            size="small"
                            color={user.is_verified ? 'success' : 'default'}
                          />
                        </TableCell>
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
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={addDialogOpen || editDialogOpen}
        onClose={() => {
          setAddDialogOpen(false)
          setEditDialogOpen(false)
          setSelectedUser(null)
          setShowPassword(false)
          setError(null)
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              sx={{ mb: 2 }}
              required
              disabled={saving}
            />
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              sx={{ mb: 2 }}
              required
              disabled={saving}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              sx={{ mb: 2 }}
              required
              disabled={saving || !!selectedUser}
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              sx={{ mb: 2 }}
              disabled={saving}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.userRoleId}
                label="Role"
                onChange={(e) => setFormData({ ...formData, userRoleId: e.target.value as number })}
                disabled={saving}
              >
                {userRoles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              sx={{ mb: 2 }}
              required={!selectedUser}
              disabled={saving}
              helperText={selectedUser ? 'Leave empty to keep current password' : 'Required for new users'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={saving}
                      sx={{
                        color: 'action.active',
                        '&:hover': {
                          color: 'primary.main',
                        },
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAddDialogOpen(false)
              setEditDialogOpen(false)
              setSelectedUser(null)
              setShowPassword(false)
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
    </PageContainer>
  )
}

export default Users


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
import Grid from '@mui/material/GridLegacy'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'
import { mockAdmins, type MockAdmin } from '../../utils/mockData'
import { getCurrentUserRole } from '../../constants/roles'

function AdminsManagement() {
  const [admins, setAdmins] = useState<MockAdmin[]>(mockAdmins)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<MockAdmin | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    role: 'admin' as 'superadmin' | 'admin',
    password: '',
  })

  const currentRole = getCurrentUserRole()
  const canEdit = currentRole === 'superadmin'

  const handleAdd = () => {
    setEditingAdmin(null)
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      role: 'admin',
      password: '',
    })
    setDialogOpen(true)
  }

  const handleEdit = (admin: MockAdmin) => {
    setEditingAdmin(admin)
    setFormData({
      name: admin.name,
      email: admin.email,
      phoneNumber: admin.phoneNumber || '',
      role: admin.role,
      password: '',
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (editingAdmin) {
      setAdmins(
        admins.map((a) =>
          a.id === editingAdmin.id
            ? {
                ...a,
                ...formData,
                phoneNumber: formData.phoneNumber || undefined,
              }
            : a
        )
      )
    } else {
      setAdmins([
        ...admins,
        {
          id: Date.now().toString(),
          ...formData,
          status: 'active',
          createdAt: new Date().toISOString(),
          phoneNumber: formData.phoneNumber || undefined,
        },
      ])
    }
    setDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      setAdmins(admins.filter((a) => a.id !== id))
    }
  }

  const handleToggleStatus = (id: string) => {
    setAdmins(
      admins.map((a) =>
        a.id === id
          ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' }
          : a
      )
    )
  }

  const roleColors: Record<string, string> = {
    superadmin: '#f44336',
    admin: '#2196f3',
  }

  return (
    <PageContainer sx={{ p: 4 }}>
      <Card sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
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

        <TableContainer>
          <Table>
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
              {admins.map((admin) => (
                <TableRow key={admin.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ backgroundColor: roleColors[admin.role] }}>
                        <AdminIcon />
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {admin.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.phoneNumber || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label={admin.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                      size="small"
                      sx={{
                        backgroundColor: roleColors[admin.role],
                        color: 'white',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={admin.status}
                      size="small"
                      color={admin.status === 'active' ? 'success' : 'default'}
                      onClick={canEdit ? () => handleToggleStatus(admin.id) : undefined}
                      sx={{ cursor: canEdit ? 'pointer' : 'default' }}
                    />
                  </TableCell>
                  <TableCell>
                    {admin.lastLogin
                      ? new Date(admin.lastLogin).toLocaleString()
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
                          {admin.role !== 'superadmin' && (
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add/Edit Dialog */}
      {canEdit && (
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editingAdmin ? 'Edit Admin' : 'Add New Admin'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={formData.role}
                    label="Role"
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as 'superadmin' | 'admin' })
                    }
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="superadmin">Super Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
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


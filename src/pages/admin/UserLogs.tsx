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
  Chip,
  CircularProgress,
  Alert,
  Pagination,
  TextField,
  InputAdornment,
} from '@mui/material'
import {
  Search as SearchIcon,
  CheckCircle as SuccessIcon,
  Cancel as FailedIcon,
} from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'
import { getUserLogs, type UserLog } from '../../api/userLogs'

function UserLogs() {
  const [logs, setLogs] = useState<UserLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const pageSize = 20
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchLogs()
  }, [page])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getUserLogs({ page, pageSize })
      setLogs(response.logs || [])
      setTotalPages(response.pagination?.total_pages || 1)
      setTotalItems(response.pagination?.total_items || 0)
    } catch (err: any) {
('Error fetching user logs:', err)
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch user logs')
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = logs.filter((log) => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      log.email.toLowerCase().includes(search) ||
      log.login_type.toLowerCase().includes(search) ||
      log.login_status.toLowerCase().includes(search) ||
      (log.ip_address && log.ip_address.toLowerCase().includes(search)) ||
      (log.firstName && log.firstName.toLowerCase().includes(search)) ||
      (log.lastName && log.lastName.toLowerCase().includes(search))
    )
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getStatusColor = (status: string) => {
    return status === 'success' ? 'success' : 'error'
  }

  const getStatusIcon = (status: string) => {
    return status === 'success' ? <SuccessIcon fontSize="small" /> : <FailedIcon fontSize="small" />
  }

  return (
    <PageContainer sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Card sx={{ p: { xs: 2, sm: 2.5, md: 3 }, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              User Login Logs
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Total logs: {totalItems.toLocaleString()}
            </Typography>
          </Box>
          <TextField
            placeholder="Search logs..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: { xs: '100%', sm: 300 } }}
            fullWidth={false}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <>
            <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
              <Table sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Login Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>IP Address</TableCell>
                    <TableCell>Date & Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          No logs found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id} hover>
                        <TableCell>
                          {log.firstName || log.lastName ? (
                            <Typography variant="body2">
                              {[log.firstName, log.lastName].filter(Boolean).join(' ')}
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              N/A
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{log.email}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={log.login_type}
                            size="small"
                            sx={{
                              textTransform: 'capitalize',
                              backgroundColor: 'rgba(102, 126, 234, 0.1)',
                              color: '#667eea',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(log.login_status)}
                            label={log.login_status}
                            size="small"
                            color={getStatusColor(log.login_status)}
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {log.ip_address || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{formatDate(log.created_at)}</Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Card>
    </PageContainer>
  )
}

export default UserLogs


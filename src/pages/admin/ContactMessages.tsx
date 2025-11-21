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
  Avatar,
} from '@mui/material'
import Grid from '@mui/material/GridLegacy'
import {
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Email as EmailIcon,
  MarkEmailRead as MarkReadIcon,
  Reply as ReplyIcon,
} from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'

const sampleMessages = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    subject: 'Product Inquiry',
    message: 'I would like to know more about your products.',
    status: 'unread',
    createdAt: '2024-01-15T10:30:00',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1234567891',
    subject: 'Support Request',
    message: 'I need help with my order.',
    status: 'read',
    createdAt: '2024-01-14T14:20:00',
  },
]

function ContactMessages() {
  const [messages, setMessages] = useState(sampleMessages)
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'read' | 'unread'>('all')

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleView = (message: any) => {
    setSelectedMessage(message)
    setViewDialogOpen(true)
    // Mark as read when viewed
    if (message.status === 'unread') {
      setMessages(messages.map((m) => (m.id === message.id ? { ...m, status: 'read' } : m)))
    }
  }

  const handleMarkAsRead = (id: number) => {
    setMessages(messages.map((m) => (m.id === id ? { ...m, status: 'read' } : m)))
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setMessages(messages.filter((m) => m.id !== id))
    }
  }

  const handleReply = (email: string) => {
    window.location.href = `mailto:${email}`
  }

  const handleExport = () => {
    const csv = [
      ['ID', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Status', 'Date'].join(','),
      ...messages.map((m) =>
        [m.id, m.name, m.email, m.phone, m.subject, `"${m.message}"`, m.status, m.createdAt].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `contact-messages-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const unreadCount = messages.filter((m) => m.status === 'unread').length

  return (
    <PageContainer sx={{ p: 4 }}>
      <Card sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Contact Messages
            </Typography>
            {unreadCount > 0 && (
              <Chip
                label={`${unreadCount} Unread`}
                color="error"
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          </Box>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            sx={{ backgroundColor: 'primary.main' }}
          >
            Export
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            placeholder="Search messages..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 300 }}
          />
          <Button
            variant={statusFilter === 'all' ? 'contained' : 'outlined'}
            onClick={() => setStatusFilter('all')}
            size="small"
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'unread' ? 'contained' : 'outlined'}
            onClick={() => setStatusFilter('unread')}
            size="small"
          >
            Unread
          </Button>
          <Button
            variant={statusFilter === 'read' ? 'contained' : 'outlined'}
            onClick={() => setStatusFilter('read')}
            size="small"
          >
            Read
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>From</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMessages.map((message) => (
                <TableRow key={message.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ backgroundColor: '#667eea' }}>
                        <EmailIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {message.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {message.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{message.subject}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={message.status}
                      size="small"
                      color={message.status === 'unread' ? 'error' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(message.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleView(message)}
                        color="primary"
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                      {message.status === 'unread' && (
                        <IconButton
                          size="small"
                          onClick={() => handleMarkAsRead(message.id)}
                          color="primary"
                        >
                          <MarkReadIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => handleReply(message.email)}
                        color="primary"
                      >
                        <ReplyIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(message.id)}
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

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Message Details</DialogTitle>
        <DialogContent>
          {selectedMessage && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="h6">{selectedMessage.subject}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1">{selectedMessage.name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{selectedMessage.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1">{selectedMessage.phone}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Date
                </Typography>
                <Typography variant="body1">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  Message
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                  {selectedMessage.message}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          {selectedMessage && (
            <Button
              onClick={() => handleReply(selectedMessage.email)}
              variant="contained"
              startIcon={<ReplyIcon />}
              sx={{ backgroundColor: 'primary.main' }}
            >
              Reply
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </PageContainer>
  )
}

export default ContactMessages


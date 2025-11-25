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
  Avatar,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Email as EmailIcon,
  MarkEmailRead as MarkReadIcon,
  Reply as ReplyIcon,
} from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'
import {
  getAllContactMessages,
  getContactMessageById,
  deleteContactMessage,
  replyToContact,
  type ContactMessage,
  type ContactReply,
} from '../../api/contact'

interface DisplayMessage extends ContactMessage {
  status: 'read' | 'unread'
}

function ContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [readMessages, setReadMessages] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [replyDialogOpen, setReplyDialogOpen] = useState(false)
  const [replySubject, setReplySubject] = useState('')
  const [replyBody, setReplyBody] = useState('')
  const [replying, setReplying] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'read' | 'unread'>('all')

  // Fetch contact messages from backend
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getAllContactMessages()
        setMessages(data)
        // Load read messages from localStorage
        const stored = localStorage.getItem('readContactMessages')
        if (stored) {
          setReadMessages(new Set(JSON.parse(stored)))
        }
      } catch (err: any) {
        console.error('Error fetching contact messages:', err)
        setError(err?.response?.data?.message || 'Failed to fetch contact messages')
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  // Helper to check if message is read
  const isRead = (id: number) => readMessages.has(id)

  // Helper to get display message with status
  const getDisplayMessage = (msg: ContactMessage): DisplayMessage => ({
    ...msg,
    status: isRead(msg.id) ? 'read' : 'unread',
  })

  const filteredMessages = messages
    .map(getDisplayMessage)
    .filter((m) => {
      const matchesSearch =
        m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.emailAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.subject && m.subject.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesStatus = statusFilter === 'all' || m.status === statusFilter
      return matchesSearch && matchesStatus
    })

  const handleView = async (message: ContactMessage) => {
    try {
      // Fetch full message details
      const fullMessage = await getContactMessageById(message.id)
      setSelectedMessage(fullMessage)
      setViewDialogOpen(true)
      // Mark as read when viewed
      if (!isRead(message.id)) {
        const newReadMessages = new Set(readMessages)
        newReadMessages.add(message.id)
        setReadMessages(newReadMessages)
        localStorage.setItem('readContactMessages', JSON.stringify(Array.from(newReadMessages)))
      }
    } catch (err: any) {
      console.error('Error fetching message details:', err)
      // Fallback to showing the message we already have
      setSelectedMessage(message)
      setViewDialogOpen(true)
      if (!isRead(message.id)) {
        const newReadMessages = new Set(readMessages)
        newReadMessages.add(message.id)
        setReadMessages(newReadMessages)
        localStorage.setItem('readContactMessages', JSON.stringify(Array.from(newReadMessages)))
      }
    }
  }

  const handleMarkAsRead = (id: number) => {
    const newReadMessages = new Set(readMessages)
    newReadMessages.add(id)
    setReadMessages(newReadMessages)
    localStorage.setItem('readContactMessages', JSON.stringify(Array.from(newReadMessages)))
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return
    }

    try {
      setError(null)
      await deleteContactMessage(id)
      setMessages(messages.filter((m) => m.id !== id))
      // Remove from read messages if it was there
      const newReadMessages = new Set(readMessages)
      newReadMessages.delete(id)
      setReadMessages(newReadMessages)
      localStorage.setItem('readContactMessages', JSON.stringify(Array.from(newReadMessages)))
      setSuccessMessage('Message deleted successfully')
    } catch (err: any) {
      console.error('Error deleting message:', err)
      setError(err?.response?.data?.message || 'Failed to delete message')
    }
  }

  const handleReply = (message: ContactMessage) => {
    setSelectedMessage(message)
    setReplySubject(message.subject ? `Re: ${message.subject}` : 'Re: Your Inquiry')
    setReplyBody('')
    setReplyDialogOpen(true)
  }

  const handleSendReply = async () => {
    if (!selectedMessage || !replySubject.trim() || !replyBody.trim()) {
      setError('Subject and message are required')
      return
    }

    try {
      setReplying(true)
      setError(null)
      const response = await replyToContact(selectedMessage.id, {
        subject: replySubject.trim(),
        body: replyBody.trim(),
      })
      setSuccessMessage(`Reply sent successfully to ${response.sentTo}`)
      setReplyDialogOpen(false)
      setReplySubject('')
      setReplyBody('')
      // Refresh the message to get updated replies
      const updatedMessage = await getContactMessageById(selectedMessage.id)
      setSelectedMessage(updatedMessage)
      // Update in messages list
      setMessages(
        messages.map((m) => (m.id === selectedMessage.id ? updatedMessage : m))
      )
    } catch (err: any) {
      console.error('Error sending reply:', err)
      setError(err?.response?.data?.message || 'Failed to send reply')
    } finally {
      setReplying(false)
    }
  }

  const handleExport = () => {
    const csv = [
      ['ID', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Service Interest', 'Date'].join(','),
      ...messages.map((m) =>
        [
          m.id,
          m.fullName,
          m.emailAddress,
          m.phoneNumber || '',
          m.subject || '',
          `"${m.message || ''}"`,
          m.serviceInterest || '',
          m.created_at,
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `contact-messages-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const unreadCount = messages.filter((m) => !isRead(m.id)).length

  return (
    <PageContainer sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Card sx={{ p: { xs: 2, sm: 2.5, md: 3 }, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2, mb: 3 }}>
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
            disabled={loading || messages.length === 0}
          >
            Export
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
          <TextField
            placeholder="Search messages..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: { xs: '100%', sm: 300 } }}
            fullWidth={false}
          />
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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
          <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 600 }}>
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
                {filteredMessages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No messages found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMessages.map((message) => (
                    <TableRow key={message.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ backgroundColor: '#667eea' }}>
                            <EmailIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {message.fullName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {message.emailAddress}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{message.subject || 'No subject'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={message.status}
                          size="small"
                          color={message.status === 'unread' ? 'error' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(message.created_at).toLocaleDateString()}
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
                            onClick={() => handleReply(message)}
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
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* View Details Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        fullScreen={false}
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '95vh', sm: '90vh' },
          }
        }}
      >
        <DialogTitle>Message Details</DialogTitle>
        <DialogContent>
          {selectedMessage && (
            <Box sx={{ mt: 1 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6">{selectedMessage.subject || 'No Subject'}</Typography>
              </Box>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: 2,
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="body1">{selectedMessage.fullName}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">{selectedMessage.emailAddress}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">{selectedMessage.phoneNumber || 'N/A'}</Typography>
                </Box>
                {selectedMessage.serviceInterest && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Service Interest
                    </Typography>
                    <Typography variant="body1">{selectedMessage.serviceInterest}</Typography>
                  </Box>
                )}
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedMessage.created_at).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              {selectedMessage.message && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Message
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                    {selectedMessage.message}
                  </Typography>
                </Box>
              )}
              {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Previous Replies ({selectedMessage.replies.length})
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {selectedMessage.replies.map((reply: ContactReply) => (
                      <Card key={reply.id} sx={{ p: 2, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {reply.subject}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(reply.created_at).toLocaleString()}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>
                          {reply.body}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Sent by: {reply.firstName && reply.lastName
                            ? `${reply.firstName} ${reply.lastName}`
                            : reply.admin_email || 'System'}
                        </Typography>
                      </Card>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          {selectedMessage && (
            <Button
              onClick={() => handleReply(selectedMessage)}
              variant="contained"
              startIcon={<ReplyIcon />}
              sx={{ backgroundColor: 'primary.main' }}
            >
              Reply
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog 
        open={replyDialogOpen} 
        onClose={() => setReplyDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
          }
        }}
      >
        <DialogTitle>Reply to {selectedMessage?.fullName}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Subject"
              fullWidth
              value={replySubject}
              onChange={(e) => setReplySubject(e.target.value)}
              required
            />
            <TextField
              label="Message"
              fullWidth
              multiline
              rows={6}
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              required
              placeholder="Type your reply message here..."
            />
            {selectedMessage && (
              <Box sx={{ p: 1.5, backgroundColor: 'rgba(0, 0, 0, 0.02)', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  To: {selectedMessage.emailAddress}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyDialogOpen(false)} disabled={replying}>
            Cancel
          </Button>
          <Button
            onClick={handleSendReply}
            variant="contained"
            disabled={replying || !replySubject.trim() || !replyBody.trim()}
            startIcon={<ReplyIcon />}
            sx={{ backgroundColor: 'primary.main' }}
          >
            {replying ? 'Sending...' : 'Send Reply'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

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

export default ContactMessages


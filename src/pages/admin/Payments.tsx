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
} from '@mui/material'
import {
  Visibility as ViewIcon,
  Download as DownloadIcon,
} from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'

const samplePayments = [
  {
    id: 1,
    paymentId: 'PAY-001',
    orderNumber: 'ORD-001',
    customerName: 'John Doe',
    amount: 149.98,
    method: 'credit_card',
    status: 'completed',
    transactionId: 'TXN-123456',
    createdAt: '2024-01-15T10:30:00',
  },
  {
    id: 2,
    paymentId: 'PAY-002',
    orderNumber: 'ORD-002',
    customerName: 'Jane Smith',
    amount: 79.99,
    method: 'paypal',
    status: 'completed',
    transactionId: 'TXN-123457',
    createdAt: '2024-01-14T14:20:00',
  },
  {
    id: 3,
    paymentId: 'PAY-003',
    orderNumber: 'ORD-003',
    customerName: 'Bob Johnson',
    amount: 249.97,
    method: 'credit_card',
    status: 'pending',
    transactionId: 'TXN-123458',
    createdAt: '2024-01-13T09:15:00',
  },
  {
    id: 4,
    paymentId: 'PAY-004',
    orderNumber: 'ORD-004',
    customerName: 'Alice Brown',
    amount: 99.99,
    method: 'bank_transfer',
    status: 'failed',
    transactionId: 'TXN-123459',
    createdAt: '2024-01-12T16:45:00',
  },
]

function Payments() {
  const [payments] = useState(samplePayments)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleView = (payment: any) => {
    setSelectedPayment(payment)
    setViewDialogOpen(true)
  }

  const handleExport = () => {
    const csv = [
      [
        'Payment ID',
        'Order Number',
        'Customer',
        'Amount',
        'Method',
        'Status',
        'Transaction ID',
        'Date',
      ].join(','),
      ...payments.map((p) =>
        [
          p.paymentId,
          p.orderNumber,
          p.customerName,
          p.amount,
          p.method,
          p.status,
          p.transactionId,
          p.createdAt,
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'pending':
        return 'warning'
      case 'failed':
        return 'error'
      case 'refunded':
        return 'info'
      default:
        return 'default'
    }
  }

  const getMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      credit_card: 'Credit Card',
      paypal: 'PayPal',
      bank_transfer: 'Bank Transfer',
      cash: 'Cash',
    }
    return labels[method] || method
  }

  const totalRevenue = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <PageContainer sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Card sx={{ p: { xs: 2, sm: 2.5, md: 3 }, borderRadius: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              Payments Management
            </Typography>
            <Typography variant="h6" color="primary">
              Total Revenue: ${totalRevenue.toFixed(2)}
            </Typography>
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
      </Card>

      <Card sx={{ p: { xs: 2, sm: 2.5, md: 3 }, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
          <TextField
            placeholder="Search payments..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: { xs: '100%', sm: 300 } }}
            fullWidth={false}
          />
          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            SelectProps={{
              native: true,
            }}
            size="small"
            sx={{ minWidth: { xs: '100%', sm: 150 } }}
            fullWidth={false}
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </TextField>
        </Box>

        <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>Payment ID</TableCell>
                <TableCell>Order Number</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {payment.paymentId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{payment.orderNumber}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{payment.customerName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      ${payment.amount.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={getMethodLabel(payment.method)} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label={payment.status} size="small" color={getStatusColor(payment.status)} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                      {payment.transactionId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleView(payment)}
                      color="primary"
                    >
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* View Payment Details Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Payment Details - {selectedPayment?.paymentId}</DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Payment ID
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedPayment.paymentId}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Order Number
                  </Typography>
                  <Typography variant="body1">{selectedPayment.orderNumber}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Customer Name
                  </Typography>
                  <Typography variant="body1">{selectedPayment.customerName}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Amount
                  </Typography>
                  <Typography variant="h6">${selectedPayment.amount.toFixed(2)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Payment Method
                  </Typography>
                  <Chip
                    label={getMethodLabel(selectedPayment.method)}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={selectedPayment.status}
                    size="small"
                    color={getStatusColor(selectedPayment.status)}
                    sx={{ mt: 0.5 }}
                  />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Transaction ID
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {selectedPayment.transactionId}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Payment Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedPayment.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  )
}

export default Payments


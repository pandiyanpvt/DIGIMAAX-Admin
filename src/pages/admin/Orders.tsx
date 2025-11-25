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
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material'
import {
  Visibility as ViewIcon,
  Download as DownloadIcon,
} from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'
import { getAllOrders, getOrderById, updateOrderStatus, type Order } from '../../api/orders'

interface DisplayOrder {
  id: number
  orderNumber: string
  customerName: string
  customerEmail: string
  total: number
  status: string
  paymentStatus: string
  createdAt: string
  orderItems: Array<{
    id: number
    productName: string
    quantity: number
    price: number
    subtotal: number
  }>
}

function Orders() {
  const [orders, setOrders] = useState<DisplayOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<DisplayOrder | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Transform backend order to display format
  const transformOrder = (order: Order): DisplayOrder => {
    const customerName = order.billing_name || 
      (order.first_name && order.last_name ? `${order.first_name} ${order.last_name}` : 'N/A')
    const customerEmail = order.billing_email || order.email || 'N/A'
    
    return {
      id: order.id,
      orderNumber: order.order_number,
      customerName,
      customerEmail,
      total: parseFloat(order.total_amount?.toString() || '0'),
      status: order.status,
      paymentStatus: order.payment_status || 'pending',
      createdAt: order.created_at,
      orderItems: (order.items || []).map((item) => ({
        id: item.id,
        productName: item.product_title || 'Unknown Product',
        quantity: item.quantity,
        price: parseFloat(item.unit_price?.toString() || '0'),
        subtotal: parseFloat(item.total_price?.toString() || '0'),
      })),
    }
  }

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        setError(null)
        const statusParam = statusFilter === 'all' ? undefined : statusFilter
        const response = await getAllOrders({ status: statusParam, page: 1, limit: 100 })
        const transformedOrders = response.orders.map(transformOrder)
        setOrders(transformedOrders)
      } catch (err: any) {
        console.error('Error fetching orders:', err)
        setError(err?.response?.data?.error?.message || 'Failed to fetch orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [statusFilter])

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleView = async (order: DisplayOrder) => {
    try {
      // Fetch full order details with items
      const fullOrder = await getOrderById(order.id)
      const transformed = transformOrder(fullOrder)
      setSelectedOrder(transformed)
      setViewDialogOpen(true)
    } catch (err: any) {
      console.error('Error fetching order details:', err)
      setError(err?.response?.data?.error?.message || 'Failed to fetch order details')
      // Fallback to showing the order we already have
      setSelectedOrder(order)
      setViewDialogOpen(true)
    }
  }

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, { status: newStatus as any })
      setSuccessMessage(`Order status updated to ${newStatus}`)
      // Update local state
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)))
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
    } catch (err: any) {
      console.error('Error updating order status:', err)
      setError(err?.response?.data?.error?.message || 'Failed to update order status')
    }
  }

  const handleExport = () => {
    const csv = [
      [
        'Order Number',
        'Customer',
        'Email',
        'Total',
        'Status',
        'Payment Status',
        'Date',
        'Items Count',
      ].join(','),
      ...filteredOrders.map((o) =>
        [
          o.orderNumber,
          o.customerName,
          o.customerEmail,
          o.total,
          o.status,
          o.paymentStatus,
          o.createdAt,
          o.orderItems.length,
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'completed':
        return 'success'
      case 'processing':
      case 'shipped':
        return 'info'
      case 'pending':
        return 'warning'
      case 'cancelled':
        return 'error'
      default:
        return 'default'
    }
  }

  return (
    <PageContainer sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Card sx={{ p: { xs: 2, sm: 2.5, md: 3 }, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2, mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Orders Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            sx={{ backgroundColor: 'primary.main' }}
            disabled={loading || filteredOrders.length === 0}
          >
            Export
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
          <TextField
            placeholder="Search orders..."
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
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </TextField>
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
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Order Number</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No orders found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {order.orderNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">{order.customerName}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.customerEmail}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          LKR {order.total.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={order.status} size="small" color={getStatusColor(order.status)} />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.paymentStatus}
                          size="small"
                          color={order.paymentStatus === 'paid' ? 'success' : 'warning'}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleView(order)}
                          color="primary"
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* View Order Details Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Order Details - {selectedOrder?.orderNumber}</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ mt: 2 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: 2,
                  mb: 3,
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Customer Name
                  </Typography>
                  <Typography variant="body1">{selectedOrder.customerName}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">{selectedOrder.customerEmail}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Order Status
                  </Typography>
                  <Chip
                    label={selectedOrder.status}
                    size="small"
                    color={getStatusColor(selectedOrder.status)}
                    sx={{ mt: 0.5 }}
                  />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Payment Status
                  </Typography>
                  <Chip
                    label={selectedOrder.paymentStatus}
                    size="small"
                    color={selectedOrder.paymentStatus === 'paid' ? 'success' : 'warning'}
                    sx={{ mt: 0.5 }}
                  />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Order Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Amount
                  </Typography>
                  <Typography variant="h6">LKR {selectedOrder.total.toFixed(2)}</Typography>
                </Box>
              </Box>

              <Typography variant="h6" sx={{ mb: 2 }}>
                Order Items
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">LKR {item.price.toFixed(2)}</TableCell>
                        <TableCell align="right">LKR {item.subtotal.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} align="right" sx={{ fontWeight: 600 }}>
                        Total:
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        LKR {selectedOrder.total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Change Order Status
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                    <Button
                      key={status}
                      variant={selectedOrder.status === status ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => handleStatusChange(selectedOrder.id, status)}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
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

export default Orders


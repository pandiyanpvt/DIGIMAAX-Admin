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
  Grid,
} from '@mui/material'
import {
  Visibility as ViewIcon,
  ShoppingCart as CartIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'

const sampleCarts = [
  {
    id: 1,
    userId: 101,
    userName: 'John Doe',
    userEmail: 'john@example.com',
    status: 'active',
    itemCount: 3,
    total: 199.97,
    createdAt: '2024-01-15T10:30:00',
    updatedAt: '2024-01-15T11:00:00',
    cartItems: [
      {
        id: 1,
        productId: 1,
        productName: 'Product 1',
        quantity: 2,
        price: 99.99,
        subtotal: 199.98,
      },
      {
        id: 2,
        productId: 2,
        productName: 'Product 2',
        quantity: 1,
        price: 49.99,
        subtotal: 49.99,
      },
    ],
  },
  {
    id: 2,
    userId: 102,
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    status: 'abandoned',
    itemCount: 2,
    total: 149.98,
    createdAt: '2024-01-14T14:20:00',
    updatedAt: '2024-01-14T15:00:00',
    cartItems: [
      {
        id: 3,
        productId: 1,
        productName: 'Product 1',
        quantity: 1,
        price: 99.99,
        subtotal: 99.99,
      },
      {
        id: 4,
        productId: 3,
        productName: 'Product 3',
        quantity: 1,
        price: 49.99,
        subtotal: 49.99,
      },
    ],
  },
  {
    id: 3,
    userId: 103,
    userName: 'Bob Johnson',
    userEmail: 'bob@example.com',
    status: 'active',
    itemCount: 1,
    total: 79.99,
    createdAt: '2024-01-13T09:15:00',
    updatedAt: '2024-01-13T09:30:00',
    cartItems: [
      {
        id: 5,
        productId: 3,
        productName: 'Product 3',
        quantity: 1,
        price: 79.99,
        subtotal: 79.99,
      },
    ],
  },
]

function CartDetails() {
  const [carts, setCarts] = useState(sampleCarts)
  const [selectedCart, setSelectedCart] = useState<any>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredCarts = carts.filter((c) => {
    const matchesSearch =
      c.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleView = (cart: any) => {
    setSelectedCart(cart)
    setViewDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this cart?')) {
      setCarts(carts.filter((c) => c.id !== id))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'abandoned':
        return 'warning'
      case 'completed':
        return 'info'
      default:
        return 'default'
    }
  }

  const totalActiveCarts = carts.filter((c) => c.status === 'active').length
  const totalAbandonedCarts = carts.filter((c) => c.status === 'abandoned').length
  const totalValue = carts.reduce((sum, c) => sum + c.total, 0)

  return (
    <PageContainer sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Card sx={{ p: { xs: 2, sm: 2.5, md: 3 }, borderRadius: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              Cart Details Management
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 3 }, mt: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Active Carts
                </Typography>
                <Typography variant="h6">{totalActiveCarts}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Abandoned Carts
                </Typography>
                <Typography variant="h6" color="warning.main">
                  {totalAbandonedCarts}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Total Cart Value
                </Typography>
                <Typography variant="h6" color="primary.main">
                  €{totalValue.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>

      <Card sx={{ p: { xs: 2, sm: 2.5, md: 3 }, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
          <TextField
            placeholder="Search carts by user..."
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
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="abandoned">Abandoned</option>
            <option value="completed">Completed</option>
          </TextField>
        </Box>

        <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell>Cart ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCarts.map((cart) => (
                <TableRow key={cart.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      #{cart.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {cart.userName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {cart.userEmail}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={cart.itemCount} size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      €{cart.total.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={cart.status} size="small" color={getStatusColor(cart.status)} />
                  </TableCell>
                  <TableCell>
                    {new Date(cart.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleView(cart)}
                        color="primary"
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(cart.id)}
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

      {/* View Cart Details Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '95vh', sm: '90vh' },
          }
        }}
      >
        <DialogTitle>Cart Details - #{selectedCart?.id}</DialogTitle>
        <DialogContent>
          {selectedCart && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    User Name
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedCart.userName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">{selectedCart.userEmail}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Cart Status
                  </Typography>
                  <Chip
                    label={selectedCart.status}
                    size="small"
                    color={getStatusColor(selectedCart.status)}
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Total Items
                  </Typography>
                  <Typography variant="body1">{selectedCart.itemCount}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Created At
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedCart.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedCart.updatedAt).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    Total Value
                  </Typography>
                  <Typography variant="h6">€{selectedCart.total.toFixed(2)}</Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mb: 2 }}>
                Cart Items
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
                    {selectedCart.cartItems.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">€{item.price.toFixed(2)}</TableCell>
                        <TableCell align="right">€{item.subtotal.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} align="right" sx={{ fontWeight: 600 }}>
                        Total:
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        €{selectedCart.total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
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

export default CartDetails


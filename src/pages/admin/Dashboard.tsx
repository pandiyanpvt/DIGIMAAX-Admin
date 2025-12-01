import { useMemo, useState, useEffect } from 'react'
import { 
  Box, 
  Typography, 
  Card, 
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material'
import { motion } from 'framer-motion'
import {
  AttachMoney as RevenueIcon,
  People as CustomersIcon,
  TrendingUp as TopServicesIcon,
  ShoppingCart as OrdersIcon,
} from '@mui/icons-material'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../../components/common/PageContainer'
import { getSalesSummary, getSalesGraph, type SalesSummary, type SalesGraphData } from '../../api/analytics'
import { getAllContactMessages, type ContactMessage } from '../../api/contact'
import {
  Email as EmailIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material'

const formatPercentChange = (value: number) => {
  if (!Number.isFinite(value)) return '0%'
  const rounded = Number(value.toFixed(1))
  return `${rounded >= 0 ? '+' : ''}${rounded}%`
}

function AdminDashboard() {
  const navigate = useNavigate()
  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null)
  const [salesGraph, setSalesGraph] = useState<SalesGraphData | null>(null)
  const [unreadMessages, setUnreadMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch analytics data and unread messages from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        const [summary, graph, messages] = await Promise.all([
          getSalesSummary(),
          getSalesGraph(),
          getAllContactMessages().catch(() => []), // Don't fail dashboard if messages fail
        ])
        setSalesSummary(summary)
        setSalesGraph(graph)
        
        // Filter unread messages using backend is_read field (0 = unread, 1 = read)
        const unread = messages.filter((msg) => msg.is_read === 0 || msg.is_read === undefined)
        // Sort by created_at (newest first) and show only latest 5 unread messages
        const sortedUnread = unread.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        setUnreadMessages(sortedUnread.slice(0, 5))
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err)
        setError(err?.response?.data?.error?.message || err?.message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Format EUR currency with better formatting
  const formatEUR = (amount: number) => {
    if (amount >= 1000000) {
      return `€${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `€${(amount / 1000).toFixed(0)}K`
    }
    return `€${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // Format sales graph data for chart
  const salesGraphData = useMemo(() => {
    if (!salesGraph?.dailySales) return []
    
    return salesGraph.dailySales.map((item) => {
      const date = new Date(item.date)
      const day = date.getDate()
      const month = date.toLocaleDateString('en-US', { month: 'short' })
      return {
        date: `${day} ${month}`,
        amount: item.amount,
      }
    })
  }, [salesGraph])

  const kpiMetrics = useMemo(() => {
    if (!salesSummary) {
      return [
        {
          title: 'Daily Sales',
          value: '—',
          change: 'Loading...',
          changeValue: 0,
          icon: <RevenueIcon />,
          color: '#667eea',
        },
        {
          title: 'Daily Products Sold',
          value: '—',
          change: 'Loading...',
          changeValue: 0,
          icon: <OrdersIcon />,
          color: '#764ba2',
        },
        {
          title: 'Monthly Sales',
          value: '—',
          change: 'Loading...',
          changeValue: 0,
          icon: <TopServicesIcon />,
          color: '#6C9BCF',
        },
        {
          title: 'Monthly Products Sold',
          value: '—',
          change: 'Loading...',
          changeValue: 0,
          icon: <CustomersIcon />,
          color: '#8BB4E8',
        },
      ]
    }

    return [
      {
        title: 'Daily Sales',
        value: formatEUR(salesSummary.daily.totalSales),
        change: formatPercentChange(salesSummary.daily.salesPercentageChangeFromYesterday),
        changeValue: salesSummary.daily.salesPercentageChangeFromYesterday,
        icon: <RevenueIcon />,
        color: '#667eea',
      },
      {
        title: 'Daily Products Sold',
        value: salesSummary.daily.totalSoldProducts.toLocaleString(),
        change: formatPercentChange(salesSummary.daily.percentageChangeFromYesterday),
        changeValue: salesSummary.daily.percentageChangeFromYesterday,
        icon: <OrdersIcon />,
        color: '#764ba2',
      },
      {
        title: 'Monthly Sales',
        value: formatEUR(salesSummary.monthly.totalSales),
        change: formatPercentChange(salesSummary.monthly.salesPercentageChangeFromLastMonth),
        changeValue: salesSummary.monthly.salesPercentageChangeFromLastMonth,
        icon: <TopServicesIcon />,
        color: '#6C9BCF',
      },
      {
        title: 'Monthly Products Sold',
        value: salesSummary.monthly.totalSoldProducts.toLocaleString(),
        change: formatPercentChange(salesSummary.monthly.percentageChangeFromLastMonth),
        changeValue: salesSummary.monthly.percentageChangeFromLastMonth,
        icon: <CustomersIcon />,
        color: '#8BB4E8',
      },
    ]
  }, [salesSummary])

  if (loading) {
    return (
      <PageContainer sx={{ p: 4, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer sx={{ p: 4, minHeight: '100vh' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </PageContainer>
    )
  }

  return (
    <PageContainer sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: '100vh' }}>
      {/* Main Content Card */}
      <Card
        sx={{
          borderRadius: { xs: 2, md: 4 },
          backgroundColor: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          p: { xs: 2, sm: 2.5, md: 3 },
        }}
      >
        {/* KPIs Section */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(4, minmax(0, 1fr))' },
            gap: 1.5,
            mb: 3,
          }}
        >
          {kpiMetrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  background: '#ffffff',
                  border: `1px solid ${metric.color}33`,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: 1.5,
                  color: '#000000',
                  minHeight: 120,
                  width: '100%',
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 1.5,
                    backgroundColor: `${metric.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: metric.color,
                    flexShrink: 0,
                    '& svg': {
                      fontSize: '1.5rem',
                    },
                  }}
                >
                  {metric.icon}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                  <Typography 
                    variant="overline" 
                    sx={{ 
                      color: '#666666', 
                      display: 'block', 
                      letterSpacing: 0.5,
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      mb: 0.75,
                      lineHeight: 1.2,
                    }}
                  >
                    {metric.title}
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700, 
                      color: '#000000', 
                      lineHeight: 1.3, 
                      mb: 1,
                      fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    }}
                  >
                    {metric.value}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                    <Chip
                      label={metric.change}
                      size="small"
                      sx={{
                        backgroundColor: metric.changeValue > 0 
                          ? 'rgba(52, 211, 153, 0.15)' 
                          : metric.changeValue < 0 
                          ? 'rgba(248, 113, 113, 0.15)' 
                          : 'rgba(148, 163, 184, 0.15)',
                        color: metric.changeValue > 0 
                          ? '#34d399' 
                          : metric.changeValue < 0 
                          ? '#f87171' 
                          : '#94a3b8',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        height: 24,
                        border: 'none',
                      }}
                    />
                  </Box>
                </Box>
              </Card>
            </motion.div>
          ))}
        </Box>

        {/* Charts Row */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: { xs: 2, md: 3 } }}>
          {/* Sales Trend Chart (Last 30 Days) */}
          <Card sx={{ 
            p: 2, 
            borderRadius: 3, 
            backgroundColor: '#ffffff',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#000000' }}>
              Sales Trend (Last 30 Days)
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={salesGraphData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="#666666"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke="#666666"
                  tickFormatter={(value) => `€${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid rgba(0, 0, 0, 0.2)',
                    borderRadius: 8,
                    color: '#000000',
                    padding: '8px 12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  }}
                  formatter={(value: any) => {
                    const formatted = value >= 1000000 
                      ? `€${(value / 1000000).toFixed(1)}M`
                      : `€${(value / 1000).toFixed(0)}K`
                    return [formatted, 'Sales']
                  }}
                  labelStyle={{ color: '#666666', marginBottom: '4px' }}
                />
                <Legend wrapperStyle={{ color: '#000000' }} />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#667eea" 
                  strokeWidth={3}
                  dot={{ fill: '#667eea', r: 4 }}
                  name="Daily Sales"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Unread Messages Section */}
          <Card
            sx={{
              p: 2,
              borderRadius: 3,
              backgroundColor: '#ffffff',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 350,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#000000' }}>
                Unread Contact Messages {unreadMessages.length > 0 && `(${unreadMessages.length})`}
              </Typography>
              {unreadMessages.length > 0 && (
                <Box
                  onClick={() => navigate('/contact-messages')}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    cursor: 'pointer',
                    color: '#667eea',
                    '&:hover': {
                      color: '#764ba2',
                      textDecoration: 'underline',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    View All
                  </Typography>
                  <ArrowForwardIcon fontSize="small" />
                </Box>
              )}
            </Box>
            {unreadMessages.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1, overflowY: 'auto' }}>
                {unreadMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Box
                      onClick={() => navigate('/contact-messages')}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        p: 1.5,
                        borderRadius: 2,
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'rgba(236, 72, 153, 0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(236, 72, 153, 0.1)',
                          borderColor: 'rgba(236, 72, 153, 0.3)',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1.5,
                          backgroundColor: 'rgba(236, 72, 153, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ec4899',
                          flexShrink: 0,
                        }}
                      >
                        <EmailIcon />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: '#000000',
                            mb: 0.25,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {message.subject || 'No Subject'}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#666666',
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {message.fullName} • {message.emailAddress}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                        <Chip
                          label="New"
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(236, 72, 153, 0.2)',
                            color: '#ec4899',
                            fontWeight: 600,
                            fontSize: '0.65rem',
                            height: 20,
                          }}
                        />
                        <Typography variant="caption" sx={{ color: '#666666', fontSize: '0.7rem' }}>
                          {new Date(message.created_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: 300 }}>
                <Typography variant="body2" sx={{ color: '#666666', textAlign: 'center' }}>
                  No unread messages
                </Typography>
              </Box>
            )}
          </Card>
        </Box>

      </Card>
    </PageContainer>
  )
}

export default AdminDashboard

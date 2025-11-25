import { useMemo, useState, useEffect } from 'react'
import { 
  Box, 
  Typography, 
  Card, 
  Chip,
  IconButton,
} from '@mui/material'
import { motion } from 'framer-motion'
import {
  Security as SecurityIcon,
  DesignServices as DesignIcon,
  Print as PrintIcon,
  Home as InteriorIcon,
  RequestQuote as QuoteIcon,
  AttachMoney as RevenueIcon,
  People as CustomersIcon,
  TrendingUp as TopServicesIcon,
  PendingActions as PendingIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import PageContainer from '../../components/common/PageContainer'

// Sample data for quote requests over time (in LKR)
const quoteRequestsOverTimeData = [
  { month: 'Jan', requests: 45, revenue: 4200000 },
  { month: 'Feb', requests: 52, revenue: 4800000 },
  { month: 'Mar', requests: 48, revenue: 4500000 },
  { month: 'Apr', requests: 61, revenue: 5800000 },
  { month: 'May', requests: 55, revenue: 5200000 },
  { month: 'Jun', requests: 58, revenue: 5400000 },
  { month: 'Jul', requests: 65, revenue: 6200000 },
]

const weeklyRevenueData = [
  { week: 'Week 1', revenue: 4200000 },
  { week: 'Week 2', revenue: 4800000 },
  { week: 'Week 3', revenue: 4500000 },
  { week: 'Week 4', revenue: 5800000 },
]

// Top services data - icons stored as component references
const topServicesData = [
  { id: 1, name: 'CCTV Installation', requests: 145, revenue: 10875000, iconComponent: SecurityIcon },
  { id: 2, name: 'Interior Designing', requests: 98, revenue: 14700000, iconComponent: InteriorIcon },
  { id: 3, name: 'LED Board Designing', requests: 203, revenue: 10150000, iconComponent: DesignIcon },
  { id: 4, name: '3D Printed Model Creation', requests: 87, revenue: 6525000, iconComponent: PrintIcon },
]

// Alerts data
const alerts = [
  { id: 1, type: 'quote', severity: 'info', title: 'Pending Quote Requests', message: '15 quote requests are pending review', count: 15 },
  { id: 2, type: 'quote', severity: 'warning', title: 'Unquoted Requests', message: '8 quote requests need pricing', count: 8 },
  { id: 3, type: 'approval', severity: 'info', title: 'Pending Approval', message: '5 quote requests are pending customer approval', count: 5 },
  { id: 4, type: 'followup', severity: 'info', title: 'Follow-up Required', message: '12 confirmed quotes need follow-up', count: 12 },
]


const getPercentChange = (current: number, previous: number) => {
  if (previous === 0) {
    return current === 0 ? 0 : 100
  }
  return ((current - previous) / previous) * 100
}

const formatPercentChange = (value: number) => {
  if (!Number.isFinite(value)) return '0%'
  const rounded = Number(value.toFixed(1))
  return `${rounded >= 0 ? '+' : ''}${rounded}%`
}

function AdminDashboard() {
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = window.localStorage.getItem('admin:dismissedAlerts')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem('admin:dismissedAlerts', JSON.stringify(dismissedAlerts))
    } catch {}
  }, [dismissedAlerts])

  const handleDismissAlert = (alertId: number) => {
    setDismissedAlerts((prev) => (prev.includes(alertId) ? prev : [...prev, alertId]))
  }

  const visibleAlerts = alerts.filter((alert) => !dismissedAlerts.includes(alert.id))

  const kpiMetrics = useMemo(() => {
    const latestRequestsEntry = quoteRequestsOverTimeData[quoteRequestsOverTimeData.length - 1]
    const previousRequestsEntry = quoteRequestsOverTimeData[quoteRequestsOverTimeData.length - 2]
    const requestsChange = latestRequestsEntry && previousRequestsEntry
      ? getPercentChange(latestRequestsEntry.requests, previousRequestsEntry.requests)
      : 0

    const currentWeekRevenue = weeklyRevenueData[weeklyRevenueData.length - 1]?.revenue ?? 0
    const previousWeekRevenue = weeklyRevenueData[weeklyRevenueData.length - 2]?.revenue ?? 0
    const revenueChange = getPercentChange(currentWeekRevenue, previousWeekRevenue)

    const latestMonthRequests = latestRequestsEntry ? latestRequestsEntry.requests : 0
    const latestMonthRevenue = latestRequestsEntry ? latestRequestsEntry.revenue : 0
    const avgQuoteValue = latestMonthRequests ? latestMonthRevenue / latestMonthRequests : 0
    const totalServiceRequests = topServicesData.reduce((sum, service) => sum + service.requests, 0)

    // Format LKR currency with better formatting
    const formatLKR = (amount: number) => {
      if (amount >= 1000000) {
        return `LKR ${(amount / 1000000).toFixed(1)}M`
      } else if (amount >= 1000) {
        return `LKR ${(amount / 1000).toFixed(0)}K`
      }
      return `LKR ${amount.toLocaleString()}`
    }

    return [
      {
        title: 'Monthly Quote Requests',
        value: latestRequestsEntry ? latestRequestsEntry.requests.toLocaleString() : '—',
        change: formatPercentChange(requestsChange),
        changeValue: requestsChange,
        icon: <QuoteIcon />,
        color: '#667eea',
      },
      {
        title: 'Current Week Revenue',
        value: formatLKR(currentWeekRevenue),
        change: formatPercentChange(revenueChange),
        changeValue: revenueChange,
        icon: <RevenueIcon />,
        color: '#764ba2',
      },
      {
        title: 'Avg Quote Value',
        value: avgQuoteValue ? formatLKR(avgQuoteValue) : 'LKR 0',
        change: latestMonthRequests ? `${latestMonthRequests.toLocaleString()} requests` : 'No requests',
        changeValue: 0,
        icon: <CustomersIcon />,
        color: '#6C9BCF',
      },
      {
        title: 'Active Services',
        value: topServicesData.length.toString(),
        change: `${totalServiceRequests.toLocaleString()} total requests`,
        changeValue: 0,
        icon: <TopServicesIcon />,
        color: '#8BB4E8',
      },
    ]
  }, [])

  return (
    <PageContainer sx={{ p: 4, minHeight: '100vh' }}>
      {/* Main Content Card */}
      <Card
        sx={{
          borderRadius: 4,
          backgroundColor: 'rgba(10, 15, 30, 0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(59, 130, 246, 0.1)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          p: 3,
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
                  background: `linear-gradient(145deg, rgba(15,23,42,0.95) 0%, ${metric.color}26 100%)`,
                  border: '1px solid rgba(148, 163, 184, 0.15)',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: 1.5,
                  color: '#f8fafc',
                  minHeight: 120,
                  width: '100%',
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 1.5,
                    backgroundColor: `${metric.color}1f`,
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
                      color: '#cbd5f5', 
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
                      color: '#f8fafc', 
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
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {/* Bookings Over Time Chart */}
          <Card sx={{ 
            p: 2, 
            borderRadius: 3, 
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: '1px solid rgba(59, 130, 246, 0.15)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
          }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#e2e8f0' }}>
              Quote Requests Trend
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={quoteRequestsOverTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.12)" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: 8,
                    color: '#f8fafc',
                    padding: '8px 12px',
                  }}
                  formatter={(value: any) => [`${value} requests`, 'Quote Requests']}
                  labelStyle={{ color: '#cbd5f5', marginBottom: '4px' }}
                />
                <Legend wrapperStyle={{ color: '#cbd5f5' }} />
                <Line 
                  type="monotone" 
                  dataKey="requests" 
                  stroke="#667eea" 
                  strokeWidth={3}
                  dot={{ fill: '#667eea', r: 4 }}
                  name="Quote Requests"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Revenue Chart */}
          <Card sx={{ 
            p: 2, 
            borderRadius: 3, 
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: '1px solid rgba(236, 72, 153, 0.15)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
          }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#e2e8f0' }}>
              Weekly Revenue (LKR)
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.12)" />
                <XAxis dataKey="week" stroke="#94a3b8" />
                <YAxis 
                  stroke="#94a3b8" 
                  tickFormatter={(value) => `LKR ${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(244, 114, 182, 0.3)',
                    borderRadius: 8,
                    color: '#f8fafc',
                    padding: '8px 12px',
                  }}
                  formatter={(value: any) => {
                    const formatted = value >= 1000000 
                      ? `LKR ${(value / 1000000).toFixed(1)}M`
                      : `LKR ${(value / 1000).toFixed(0)}K`
                    return [formatted, 'Revenue']
                  }}
                  labelStyle={{ color: '#cbd5f5', marginBottom: '4px' }}
                />
                <Bar dataKey="revenue" fill="#764ba2" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Box>

        {/* Alerts Section */}
        {(visibleAlerts.length > 0 || topServicesData.length > 0) && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
              gap: 3,
              mb: 3,
            }}
          >
            {visibleAlerts.length > 0 && (
              <Card
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: 'rgba(15, 23, 42, 0.78)',
                  border: '1px solid rgba(148, 163, 184, 0.15)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                  height: '100%',
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#e2e8f0' }}>
                  Alerts & Notifications
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {visibleAlerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.25,
                          borderRadius: 2,
                          border: '1px solid rgba(148,163,184,0.2)',
                          backgroundColor: 'rgba(15, 23, 42, 0.65)',
                          px: 1.5,
                          py: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 1.5,
                            backgroundColor: alert.type === 'quote' 
                              ? 'rgba(96, 165, 250, 0.15)' 
                              : alert.type === 'followup' 
                              ? 'rgba(251, 191, 36, 0.15)' 
                              : alert.severity === 'warning'
                              ? 'rgba(251, 191, 36, 0.15)'
                              : 'rgba(52, 211, 153, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: alert.type === 'quote' 
                              ? '#60a5fa' 
                              : alert.type === 'followup' 
                              ? '#fbbf24' 
                              : alert.severity === 'warning'
                              ? '#fbbf24'
                              : '#34d399',
                          }}
                        >
                          {alert.type === 'quote' ? <QuoteIcon fontSize="small" /> : <PendingIcon fontSize="small" />}
                        </Box>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#e2e8f0',
                              fontWeight: 500,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                            title={alert.message}
                          >
                            {alert.message}
                          </Typography>
                          {alert.count && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#94a3b8',
                                display: 'block',
                                mt: 0.25,
                              }}
                            >
                              {alert.count} item{alert.count !== 1 ? 's' : ''}
                            </Typography>
                          )}
                        </Box>
                        <IconButton
                          aria-label="dismiss alert"
                          size="small"
                          onClick={() => handleDismissAlert(alert.id)}
                          sx={{ color: '#94a3b8' }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </Card>
            )}

            {topServicesData.length > 0 && (
              <Card
                sx={{
                  p: 1.75,
                  borderRadius: 2,
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(59, 130, 246, 0.15)',
                  boxShadow: '0 12px 28px rgba(0,0,0,0.3)',
                  height: '100%',
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#e2e8f0' }}>
                  Top Services
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                    gap: 1.5,
                  }}
                >
                  {topServicesData.map((service, index) => {
                    const IconComponent = service.iconComponent
                    return (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <Card
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            border: '1px solid rgba(148, 163, 184, 0.12)',
                            backgroundColor: 'rgba(15, 23, 42, 0.65)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            color: '#f8fafc',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1 }}>
                            <Box
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 1.5,
                                backgroundColor: '#667eea24',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#667eea',
                              }}
                            >
                              <IconComponent />
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, flex: 1, color: '#e2e8f0' }}>
                              {service.name}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="caption" sx={{ color: '#cbd5f5' }}>
                              Requests:
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#f8fafc', fontWeight: 600 }}>
                              {service.requests.toLocaleString()}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" sx={{ color: '#cbd5f5' }}>
                              Revenue:
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#34d399', fontWeight: 600 }}>
                              {service.revenue >= 1000000 
                                ? `LKR ${(service.revenue / 1000000).toFixed(1)}M`
                                : `LKR ${(service.revenue / 1000).toFixed(0)}K`}
                            </Typography>
                          </Box>
                        </Card>
                      </motion.div>
                    )
                  })}
                </Box>
              </Card>
            )}
          </Box>
        )}

      </Card>
    </PageContainer>
  )
}

export default AdminDashboard

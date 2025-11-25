import { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material'
import {
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import PageContainer from '../../components/common/PageContainer'

const bookingsByService = [
  { service: 'Basic Wash', bookings: 45 },
  { service: 'Full Service', bookings: 32 },
  { service: 'Premium Detail', bookings: 18 },
]

const revenueByPeriod = [
  { month: 'Jan', revenue: 4200 },
  { month: 'Feb', revenue: 4800 },
  { month: 'Mar', revenue: 4500 },
  { month: 'Apr', revenue: 5800 },
]

const repeatCustomerRate = [
  { month: 'Jan', rate: 32 },
  { month: 'Feb', rate: 35 },
  { month: 'Mar', rate: 37 },
  { month: 'Apr', rate: 41 },
  { month: 'May', rate: 39 },
  { month: 'Jun', rate: 44 },
]

type ReportType = 'bookings' | 'revenue' | 'repeat'

function ReportsAnalytics() {
  const [reportType, setReportType] = useState<ReportType>('bookings')

  const totalBookings = bookingsByService.reduce((sum, item) => sum + item.bookings, 0)
  const totalRevenue = revenueByPeriod.reduce((sum, item) => sum + item.revenue, 0)
  const latestRepeatRate = repeatCustomerRate[repeatCustomerRate.length - 1]?.rate ?? 0
  const topService = bookingsByService.reduce((prev, curr) => (curr.bookings > prev.bookings ? curr : prev))
  const topRevenueMonth = revenueByPeriod.reduce((prev, curr) => (curr.revenue > prev.revenue ? curr : prev))

  const formatAxisPercent = (value: number) => `${value}%`
  type TooltipValue = number | string | readonly (number | string)[] | undefined
  const formatTooltipPercent = (value: TooltipValue) => {
    const normalized = Array.isArray(value) ? value[0] ?? 0 : value ?? 0
    return `${normalized}%`
  }

  const reportConfigs: Record<ReportType, { title: string; description: string; insight: string }> = {
    bookings: {
      title: 'Bookings by Service',
      description: 'Compare booking volume across your detailing services to spot demand shifts.',
      insight: `Highest demand: ${topService.service} with ${topService.bookings} bookings.`,
    },
    revenue: {
      title: 'Revenue by Period',
      description: 'Track monthly revenue trends to understand seasonality and campaign lift.',
      insight: `Peak revenue: $${topRevenueMonth.revenue.toLocaleString()} in ${topRevenueMonth.month}.`,
    },
    repeat: {
      title: 'Repeat Customer Rate',
      description: 'Monitor how many customers return each month to assess loyalty.',
      insight: `Latest retention: ${latestRepeatRate}% repeat customers.`,
    },
  }

  const statCards = [
    { 
      label: 'Total Bookings', 
      value: totalBookings.toString(), 
      helper: `Top service: ${topService.service}`,
      icon: <AssessmentIcon />,
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    { 
      label: 'YTD Revenue', 
      value: `$${totalRevenue.toLocaleString()}`, 
      helper: `${topRevenueMonth.month} led revenue`,
      icon: <MoneyIcon />,
      color: '#764ba2',
      gradient: 'linear-gradient(135deg, #764ba2 0%, #f093fb 100%)',
    },
    { 
      label: 'Repeat Rate', 
      value: `${latestRepeatRate}%`, 
      helper: 'Goal: 45%+',
      icon: <PeopleIcon />,
      color: '#6C9BCF',
      gradient: 'linear-gradient(135deg, #6C9BCF 0%, #8BB4E8 100%)',
    },
  ]

  const handleExport = (format: string) => {
    const currentReport = reportConfigs[reportType]
    alert(`Exporting "${currentReport.title}" as ${format.toUpperCase()}...`)
  }

  const activeReport = reportConfigs[reportType]

  return (
    <PageContainer sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card 
          sx={{ 
            p: 4, 
            borderRadius: 4, 
            mb: 3,
            background: 'rgba(12, 17, 32, 0.92)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: '1px solid rgba(59, 130, 246, 0.15)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #38bdf8 0%, #a78bfa 50%, #f472b6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  mb: 0.5,
                }}
              >
                Reports & Analytics
              </Typography>
              <Typography variant="body2" sx={{ color: '#cbd5f5' }}>
                Comprehensive insights and data visualization
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<PdfIcon />}
                onClick={() => handleExport('pdf')}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  borderColor: 'rgba(56, 189, 248, 0.5)',
                  color: '#38bdf8',
                  '&:hover': {
                    borderColor: '#38bdf8',
                    background: 'rgba(56, 189, 248, 0.12)',
                  },
                }}
              >
                Export PDF
              </Button>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => handleExport('csv')}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
                  boxShadow: '0 8px 24px rgba(14, 165, 233, 0.45)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)',
                    boxShadow: '0 12px 30px rgba(99, 102, 241, 0.5)',
                  },
                }}
              >
                Export CSV
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
            <FormControl 
              sx={{ 
                minWidth: 240,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  background: 'rgba(15, 23, 42, 0.9)',
                  color: '#e2e8f0',
                  '& fieldset': {
                    border: '1px solid rgba(99, 102, 241, 0.4)',
                  },
                  '&:hover fieldset': {
                    border: '1px solid rgba(129, 140, 248, 0.7)',
                  },
                  '&.Mui-focused fieldset': {
                    border: '2px solid #38bdf8',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#94a3b8',
                  '&.Mui-focused': {
                    color: '#38bdf8',
                  },
                },
                '& .MuiSelect-select': {
                  color: '#e2e8f0',
                },
              }}
            >
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                label="Report Type"
                onChange={(e) => setReportType(e.target.value as ReportType)}
              >
                <MenuItem value="bookings">Bookings by Service</MenuItem>
                <MenuItem value="revenue">Revenue by Period</MenuItem>
                <MenuItem value="repeat">Repeat Customer Rate</MenuItem>
              </Select>
            </FormControl>
            <Chip
              icon={<TrendingUpIcon />}
              label="Live Data"
              color="primary"
              sx={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#34d399',
                fontWeight: 600,
              }}
            />
          </Box>

          <Box
            sx={{
              mt: 3,
              p: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              },
            }}
          >
            <Typography variant="overline" sx={{ color: '#38bdf8', fontWeight: 600, letterSpacing: 1 }}>
              Active Insight
            </Typography>
            <Typography variant="h6" sx={{ mt: 1, fontWeight: 700, color: '#f8fafc' }}>
              {activeReport.title}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: '#cbd5f5' }}>
              {activeReport.description}
            </Typography>
            <Box
              sx={{
                mt: 2,
                p: 1.5,
                borderRadius: 2,
                background: 'rgba(59, 130, 246, 0.1)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#a78bfa' }}>
                💡 {activeReport.insight}
              </Typography>
            </Box>
          </Box>
        </Card>
      </motion.div>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          mb: 4,
        }}
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card 
              sx={{ 
                p: 3, 
                borderRadius: 3,
                height: '100%',
                background: 'rgba(15, 23, 42, 0.9)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(59, 130, 246, 0.12)',
                boxShadow: '0 18px 40px rgba(0,0,0,0.4)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                color: '#f8fafc',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: stat.gradient,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: stat.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {stat.icon}
                </Box>
              </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1, color: '#cbd5f5' }}>
                {stat.label}
              </Typography>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  background: stat.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  mb: 1,
                }}
              >
                {stat.value}
              </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                {stat.helper}
              </Typography>
            </Card>
          </motion.div>
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        }}
      >
        <motion.div
          key="chart-bookings"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card 
            sx={{ 
              p: 3, 
              borderRadius: 3, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              background: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(59, 130, 246, 0.12)',
              boxShadow: '0 18px 40px rgba(0,0,0,0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 22px 50px rgba(59, 130, 246, 0.25)',
              },
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3, 
                fontWeight: 700, 
                minHeight: '32px',
                background: 'linear-gradient(135deg, #38bdf8 0%, #a78bfa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Bookings by Service Type
            </Typography>
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={bookingsByService}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.12)" />
                  <XAxis 
                    dataKey="service" 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    axisLine={{ stroke: '#1f2937' }}
                  />
                  <YAxis 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    axisLine={{ stroke: '#1f2937' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: 8,
                      boxShadow: '0 10px 24px rgba(0,0,0,0.35)',
                      color: '#f8fafc',
                    }}
                  />
                  <defs>
                    <linearGradient id="colorGradient1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#667eea" stopOpacity={1} />
                      <stop offset="100%" stopColor="#764ba2" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <Bar 
                    dataKey="bookings" 
                    fill="url(#colorGradient1)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </motion.div>

        <motion.div
          key="chart-revenue"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card 
            sx={{ 
              p: 3, 
              borderRadius: 3, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              background: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(236, 72, 153, 0.12)',
              boxShadow: '0 18px 40px rgba(0,0,0,0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 22px 50px rgba(236, 72, 153, 0.25)',
              },
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3, 
                fontWeight: 700, 
                minHeight: '32px',
                background: 'linear-gradient(135deg, #764ba2 0%, #f093fb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Revenue by Period
            </Typography>
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={revenueByPeriod}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.12)" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    axisLine={{ stroke: '#1f2937' }}
                  />
                  <YAxis 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    axisLine={{ stroke: '#1f2937' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(236, 72, 153, 0.3)',
                      borderRadius: 8,
                      boxShadow: '0 10px 24px rgba(0,0,0,0.35)',
                      color: '#f8fafc',
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: 20, color: '#cbd5f5' }}
                    iconType="line"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="url(#colorGradient2)" 
                    strokeWidth={3}
                    dot={{ fill: '#764ba2', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                  <defs>
                    <linearGradient id="colorGradient2" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#764ba2" stopOpacity={1} />
                      <stop offset="100%" stopColor="#f093fb" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </motion.div>

        <motion.div
          key="chart-repeat"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card 
            sx={{ 
              p: 3, 
              borderRadius: 3, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              background: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(59, 130, 246, 0.12)',
              boxShadow: '0 18px 40px rgba(0,0,0,0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 22px 50px rgba(108, 155, 207, 0.25)',
              },
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3, 
                fontWeight: 700, 
                minHeight: '32px',
                background: 'linear-gradient(135deg, #6C9BCF 0%, #8BB4E8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Repeat Customer Rate
            </Typography>
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={repeatCustomerRate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.12)" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    axisLine={{ stroke: '#1f2937' }}
                  />
                  <YAxis 
                    tickFormatter={formatAxisPercent}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    axisLine={{ stroke: '#1f2937' }}
                  />
                  <Tooltip 
                    formatter={(value) => formatTooltipPercent(value)}
                    contentStyle={{
                      background: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(108, 155, 207, 0.3)',
                      borderRadius: 8,
                      boxShadow: '0 10px 24px rgba(0,0,0,0.35)',
                      color: '#f8fafc',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke="url(#colorGradient3)"
                    fill="url(#colorGradient3Fill)"
                    strokeWidth={3}
                  />
                  <defs>
                    <linearGradient id="colorGradient3" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6C9BCF" stopOpacity={1} />
                      <stop offset="100%" stopColor="#8BB4E8" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="colorGradient3Fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6C9BCF" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#8BB4E8" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </motion.div>
      </Box>
      </PageContainer>
  )
}

export default ReportsAnalytics


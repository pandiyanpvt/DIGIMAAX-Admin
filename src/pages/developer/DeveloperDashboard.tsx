import { useMemo, type ReactNode } from 'react'
import {
  Box,
  Card,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material'
import {
  PeopleAlt as UsersIcon,
  Verified as VerifiedIcon,
  ShoppingCart as CartIcon,
  Insights as InsightsIcon,
  Shield as ShieldIcon,
  TrendingUp as TrendingUpIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'
import PageContainer from '../../components/common/PageContainer'

type KPI = {
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'flat'
  icon: ReactNode
  color: string
}

const userGrowthData = [
  { month: 'Jan', users: 142, admins: 12, developers: 3 },
  { month: 'Feb', users: 188, admins: 14, developers: 4 },
  { month: 'Mar', users: 214, admins: 15, developers: 4 },
  { month: 'Apr', users: 260, admins: 16, developers: 5 },
]

const cartInsightsData = [
  { segment: 'Saved Carts', value: 42 },
  { segment: 'Ready To Checkout', value: 21 },
  { segment: 'High Value', value: 8 },
  { segment: 'Dormant', value: 17 },
]

const roleDistributionData = [
  { role: 'Shop Workers', value: 312 },
  { role: 'Admins', value: 18 },
  { role: 'Developers', value: 5 },
]

const topServiceInsights = [
  { service: 'CCTV Installations', avgCartValue: 245000, conversion: 68 },
  { service: 'Interior Projects', avgCartValue: 615000, conversion: 54 },
  { service: '3D Printing', avgCartValue: 94000, conversion: 72 },
]

const COLORS = ['#60a5fa', '#34d399', '#f472b6', '#facc15']

const formatCurrency = (value: number) =>
  `LKR ${value.toLocaleString('en-LK', { maximumFractionDigits: 0 })}`

function DeveloperDashboard() {
  const dashboardKpis: KPI[] = useMemo(
    () => [
      {
        title: 'Total Users',
        value: '335',
        change: '+12.4% MoM',
        trend: 'up',
        icon: <UsersIcon />,
        color: '#60a5fa',
      },
      {
        title: 'Verified Accounts',
        value: '289',
        change: '86% verified',
        trend: 'flat',
        icon: <VerifiedIcon />,
        color: '#10b981',
      },
      {
        title: 'Active Carts',
        value: '63',
        change: '+9.3% WoW',
        trend: 'up',
        icon: <CartIcon />,
        color: '#f59e0b',
      },
      {
        title: 'Avg Cart Value',
        value: 'LKR 182K',
        change: '+5.1% YoY',
        trend: 'up',
        icon: <InsightsIcon />,
        color: '#a855f7',
      },
    ],
    []
  )

  return (
    <PageContainer sx={{ p: 4, minHeight: '100vh' }}>
      <Stack spacing={3}>
        <Card
          sx={{
            borderRadius: 4,
            background: 'linear-gradient(145deg, rgba(9, 12, 24, 0.95), rgba(18, 24, 45, 0.95))',
            border: '1px solid rgba(96, 165, 250, 0.25)',
            p: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
          }}
        >
          <Typography variant="h5" sx={{ color: '#e2e8f0', fontWeight: 700, mb: 3 }}>
            Developer Control Center
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
              gap: 2,
            }}
          >
            {dashboardKpis.map((kpi) => (
              <Card
                key={kpi.title}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  backgroundColor: 'rgba(10, 15, 30, 0.85)',
                  border: `1px solid ${kpi.color}33`,
                  color: '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.25,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: kpi.color,
                  }}
                >
                  {kpi.icon}
                  <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 0.6 }}>
                    {kpi.title}
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {kpi.value}
                </Typography>
                <Chip
                  icon={kpi.trend === 'up' ? <TrendingUpIcon fontSize="small" /> : <TimelineIcon fontSize="small" />}
                  label={kpi.change}
                  size="small"
                  sx={{
                    width: 'fit-content',
                    backgroundColor:
                      kpi.trend === 'up' ? 'rgba(16, 185, 129, 0.15)' : kpi.trend === 'down' ? 'rgba(248, 113, 113, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                    color: kpi.trend === 'up' ? '#34d399' : kpi.trend === 'down' ? '#f87171' : '#cbd5f5',
                    '& .MuiChip-icon': { color: 'inherit' },
                  }}
                />
              </Card>
            ))}
          </Box>
        </Card>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.2fr 0.8fr' },
            gap: 3,
          }}
        >
          <Card
            sx={{
              borderRadius: 3,
              p: 3,
              backgroundColor: 'rgba(10, 15, 30, 0.85)',
              border: '1px solid rgba(96, 165, 250, 0.2)',
            }}
          >
            <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 600, mb: 2 }}>
              User Growth Trajectory
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(9, 12, 24, 0.95)',
                    border: '1px solid rgba(96, 165, 250, 0.3)',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="users" name="Shop Workers" stroke="#60a5fa" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="admins" name="Admins" stroke="#34d399" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="developers" name="Developers" stroke="#f472b6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card
            sx={{
              borderRadius: 3,
              p: 3,
              backgroundColor: 'rgba(10, 15, 30, 0.85)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 600, mb: 2 }}>
              Role Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={roleDistributionData} dataKey="value" nameKey="role" outerRadius={100} innerRadius={40}>
                  {roleDistributionData.map((entry, index) => (
                    <Cell key={entry.role} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value.toLocaleString()} members`, '']}
                  contentStyle={{
                    backgroundColor: 'rgba(9, 12, 24, 0.95)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3,
          }}
        >
          <Card
            sx={{
              borderRadius: 3,
              p: 3,
              backgroundColor: 'rgba(10, 15, 30, 0.85)',
              border: '1px solid rgba(249, 115, 22, 0.25)',
              height: '100%',
            }}
          >
            <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 600, mb: 2 }}>
              Cart Health Snapshot
            </Typography>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={cartInsightsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis dataKey="segment" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  formatter={(value: number) => [`${value} carts`, '']}
                  contentStyle={{
                    backgroundColor: 'rgba(9, 12, 24, 0.95)',
                    border: '1px solid rgba(249, 115, 22, 0.3)',
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 2 }} />
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ color: '#cbd5f5' }}>
                High intent carts require 8 follow-ups
              </Typography>
              <Typography variant="body2" sx={{ color: '#cbd5f5' }}>
                Dormant carts older than 14 days automatically alert support
              </Typography>
            </Stack>
          </Card>

          <Card
            sx={{
              borderRadius: 3,
              p: 3,
              backgroundColor: 'rgba(10, 15, 30, 0.85)',
              border: '1px solid rgba(248, 113, 113, 0.3)',
              height: '100%',
            }}
          >
            <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 600, mb: 2 }}>
              Service Conversion Insights
            </Typography>
            <Stack spacing={2}>
              {topServiceInsights.map((service) => (
                <Box
                  key={service.service}
                  sx={{
                    backgroundColor: 'rgba(15, 23, 42, 0.65)',
                    borderRadius: 2,
                    border: '1px solid rgba(248, 113, 113, 0.2)',
                    p: 2,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ color: '#f8fafc', fontWeight: 600 }}>
                    {service.service}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#cbd5f5' }}>
                    Avg Cart Value: {formatCurrency(service.avgCartValue)}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={service.conversion}
                    sx={{
                      mt: 1,
                      height: 8,
                      borderRadius: 999,
                      backgroundColor: 'rgba(248,113,113,0.15)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #f97316, #fb7185)',
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#fca5a5' }}>
                    {service.conversion}% quote-to-order conversion
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        </Box>

        <Card
          sx={{
            borderRadius: 3,
            p: 3,
            backgroundColor: 'rgba(10, 15, 30, 0.85)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
          }}
        >
          <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 600, mb: 2 }}>
            Platform Guardrails
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
              gap: 2,
            }}
          >
            {[
              { title: 'API Health', status: 'Operational', value: '99.2% uptime', color: '#34d399' },
              { title: 'Security Rules', status: 'Hardened', value: '12 policies enforced', color: '#60a5fa' },
              { title: 'Audit Trail', status: 'Synced', value: 'Last sync 12 mins ago', color: '#f472b6' },
            ].map((item) => (
              <Card
                key={item.title}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'rgba(15, 23, 42, 0.65)',
                  border: `1px solid ${item.color}33`,
                  color: '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: item.color }}>
                  <ShieldIcon fontSize="small" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {item.title}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#cbd5f5' }}>
                  {item.status}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  {item.value}
                </Typography>
              </Card>
            ))}
          </Box>
        </Card>
      </Stack>
    </PageContainer>
  )
}

export default DeveloperDashboard



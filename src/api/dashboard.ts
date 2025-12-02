import { getAllOrders } from './orders'
import { getAllProducts } from './products'
import { getAllUsers } from './users'

export interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalCustomers: number
  totalProducts: number
  pendingOrders: number
  completedOrders: number
  monthlyRevenue: number
  averageOrderValue: number
}

export interface RevenueData {
  month: string
  revenue: number
  orders: number
}

export interface OrderStatusData {
  status: string
  count: number
}

// Get dashboard statistics
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Since backend doesn't have a dedicated dashboard endpoint,
    // we'll aggregate data from multiple endpoints
    const [ordersResponse, products, users] = await Promise.all([
      getAllOrders().catch(() => ({ orders: [] })),
      getAllProducts().catch(() => []),
      getAllUsers().catch(() => []),
    ])

    const orders = Array.isArray(ordersResponse) ? ordersResponse : ordersResponse.orders || []
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total_amount || order.total || 0), 0)
    const totalCustomers = users.filter((user: any) => user.roleName !== 'Admin').length
    const totalProducts = products.length
    const pendingOrders = orders.filter((order: any) => order.status === 'pending').length
    const completedOrders = orders.filter((order: any) => order.status === 'delivered').length
    
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const monthlyOrders = orders.filter((order: any) => {
      const orderDate = new Date(order.created_at)
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
    })
    const monthlyRevenue = monthlyOrders.reduce((sum: number, order: any) => sum + (order.total_amount || order.total || 0), 0)
    
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    return {
      totalOrders,
      totalRevenue,
      totalCustomers,
      totalProducts,
      pendingOrders,
      completedOrders,
      monthlyRevenue,
      averageOrderValue,
    }
  } catch (error: any) {
    throw error
  }
}

// Get revenue data for charts
export async function getRevenueData(months: number = 6): Promise<RevenueData[]> {
  try {
    const ordersResponse = await getAllOrders().catch(() => ({ orders: [] }))
    const orders = Array.isArray(ordersResponse) ? ordersResponse : ordersResponse.orders || []
    
    // Group orders by month
    const revenueByMonth: { [key: string]: { revenue: number; orders: number } } = {}
    
    orders.forEach((order: any) => {
      const date = new Date(order.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!revenueByMonth[monthKey]) {
        revenueByMonth[monthKey] = { revenue: 0, orders: 0 }
      }
      
      revenueByMonth[monthKey].revenue += order.total || 0
      revenueByMonth[monthKey].orders += 1
    })
    
    // Get last N months
    const result: RevenueData[] = []
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const monthName = monthNames[date.getMonth()]
      
      result.push({
        month: monthName,
        revenue: revenueByMonth[monthKey]?.revenue || 0,
        orders: revenueByMonth[monthKey]?.orders || 0,
      })
    }
    
    return result
  } catch (error: any) {
    throw error
  }
}

// Get order status distribution
export async function getOrderStatusData(): Promise<OrderStatusData[]> {
  try {
    const ordersResponse = await getAllOrders().catch(() => ({ orders: [] }))
    const orders = Array.isArray(ordersResponse) ? ordersResponse : ordersResponse.orders || []
    
    const statusCounts: { [key: string]: number } = {}
    orders.forEach((order: any) => {
      const status = order.status || 'unknown'
      statusCounts[status] = (statusCounts[status] || 0) + 1
    })
    
    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
    }))
  } catch (error: any) {
    throw error
  }
}


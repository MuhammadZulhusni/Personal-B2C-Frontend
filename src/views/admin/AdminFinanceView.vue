<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Finance Overview</h2>
        <p class="text-sm text-slate-500 mt-1">Revenue, expenses, and financial reports</p>
      </div>
      <select 
        v-model="selectedPeriod"
        class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="this_month">This Month</option>
        <option value="last_month">Last Month</option>
        <option value="this_year">This Year</option>
      </select>
    </div>

    <!-- Financial KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Revenue -->
      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-5 text-white">
        <div class="flex items-center justify-between mb-3">
          <p class="text-green-100 text-sm">Total Revenue</p>
          <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold">RM {{ formatPrice(finance.totalRevenue) }}</p>
        <p class="text-green-100 text-sm mt-1">
          <span v-if="finance.revenueGrowth >= 0">↑</span>
          <span v-else>↓</span>
          {{ Math.abs(finance.revenueGrowth) }}% vs last period
        </p>
      </div>

      <!-- Total Expenses -->
      <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div class="flex items-center justify-between mb-3">
          <p class="text-slate-500 text-sm">Total Expenses</p>
          <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-slate-800">RM {{ formatPrice(finance.totalExpenses) }}</p>
        <p class="text-sm mt-1" :class="finance.expenseChange <= 0 ? 'text-green-600' : 'text-red-600'">
          <span v-if="finance.expenseChange <= 0">↓</span>
          <span v-else>↑</span>
          {{ Math.abs(finance.expenseChange) }}% vs last period
        </p>
      </div>

      <!-- Net Profit -->
      <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div class="flex items-center justify-between mb-3">
          <p class="text-slate-500 text-sm">Net Profit</p>
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-slate-800">RM {{ formatPrice(finance.netProfit) }}</p>
        <p class="text-sm text-slate-500 mt-1">{{ finance.profitMargin }}% profit margin</p>
      </div>

      <!-- Pending Payments -->
      <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div class="flex items-center justify-between mb-3">
          <p class="text-slate-500 text-sm">Pending Payments</p>
          <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-slate-800">RM {{ formatPrice(finance.pendingPayments) }}</p>
        <p class="text-sm text-amber-600 mt-1">{{ finance.pendingCount }} orders pending</p>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Revenue vs Expenses Chart -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 class="text-lg font-semibold text-slate-800 mb-4">Revenue vs Expenses</h3>
        <div class="h-64">
          <canvas ref="financialChartRef"></canvas>
        </div>
      </div>

      <!-- Expense Breakdown -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 class="text-lg font-semibold text-slate-800 mb-4">Expense Breakdown</h3>
        <div v-if="expenseBreakdown.length === 0" class="text-center py-8 text-slate-500">
          No expense data available
        </div>
        <div v-else class="space-y-4">
          <div v-for="expense in expenseBreakdown" :key="expense.name" class="space-y-1">
            <div class="flex justify-between text-sm">
              <span class="text-slate-700">{{ expense.name }}</span>
              <span class="font-medium text-slate-800">RM {{ formatPrice(expense.amount) }}</span>
            </div>
            <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                class="h-full rounded-full"
                :class="expense.color || 'bg-blue-500'"
                :style="{ width: `${getExpensePercentage(expense.amount)}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Transactions Table -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-slate-800">Recent Transactions</h3>
        <RouterLink to="/admin/orders" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All Orders →
        </RouterLink>
      </div>
      
      <div v-if="transactions.length === 0" class="text-center py-8 text-slate-500">
        No transactions yet
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="text-left text-sm text-slate-500 border-b border-gray-100">
              <th class="pb-3">Transaction ID</th>
              <th class="pb-3">Order</th>
              <th class="pb-3">Customer</th>
              <th class="pb-3">Amount</th>
              <th class="pb-3">Status</th>
              <th class="pb-3">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in transactions" :key="tx.id" class="border-b border-gray-50 last:border-0">
              <td class="py-3 text-sm text-slate-600 font-mono">{{ tx.transaction_id }}</td>
              <td class="py-3 text-sm text-slate-600">{{ tx.order_number }}</td>
              <td class="py-3 text-sm text-slate-800 font-medium">{{ tx.customer }}</td>
              <td class="py-3 text-sm font-semibold text-slate-800">RM {{ formatPrice(tx.amount) }}</td>
              <td class="py-3">
                <span :class="getStatusClass(tx.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ tx.status }}
                </span>
              </td>
              <td class="py-3 text-sm text-slate-500">{{ tx.date }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Monthly Summary -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 class="text-lg font-semibold text-slate-800 mb-4">Monthly Summary</h3>
      <div v-if="monthlySummary.length === 0" class="text-center py-8 text-slate-500">
        No data available
      </div>
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div v-for="month in monthlySummary" :key="month.name" class="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <p class="text-xs text-slate-500 mb-1">{{ month.name }}</p>
          <p class="text-lg font-bold text-slate-800">RM {{ formatPrice(month.revenue) }}</p>
          <p :class="month.growth >= 0 ? 'text-green-600' : 'text-red-600'" class="text-xs mt-1">
            {{ month.growth >= 0 ? '+' : '' }}{{ month.growth }}%
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { RouterLink } from 'vue-router'
import Chart from 'chart.js/auto'
import api from '@/api'

// ── Refs ───────────────────────────────────────
const selectedPeriod = ref('this_month')
const financialChartRef = ref<HTMLCanvasElement | null>(null)
let financialChart: Chart | null = null

const finance = ref({
  totalRevenue: 0,
  revenueGrowth: 0,
  totalExpenses: 0,
  expenseChange: 0,
  netProfit: 0,
  profitMargin: 0,
  pendingPayments: 0,
  pendingCount: 0,
})

const expenseBreakdown = ref<any[]>([])
const transactions = ref<any[]>([])
const monthlySummary = ref<any[]>([])

// ── Computed ───────────────────────────────────
const totalExpensesAmount = computed(() => {
  return expenseBreakdown.value.reduce((sum, exp) => sum + exp.amount, 0)
})

// ── Helpers ────────────────────────────────────
const formatPrice = (price: any): string => {
  const n = typeof price === 'string' ? parseFloat(price) : price
  return isNaN(n) ? '0.00' : n.toFixed(2)
}

const getStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    Completed: 'bg-green-100 text-green-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Failed: 'bg-red-100 text-red-700',
    Refunded: 'bg-gray-100 text-gray-700',
    Processing: 'bg-blue-100 text-blue-700',
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const getExpensePercentage = (amount: number): number => {
  const total = totalExpensesAmount.value
  if (total === 0) return 0
  return (amount / total) * 100
}

// ── Chart ──────────────────────────────────────
const initChart = () => {
  if (!financialChartRef.value) return
  
  const ctx = financialChartRef.value.getContext('2d')
  if (!ctx) return
  
  if (financialChart) financialChart.destroy()
  
  // Get monthly data for chart
  const months = monthlySummary.value.length > 0 
    ? monthlySummary.value 
    : [
        { name: 'Jan', revenue: 0 }, { name: 'Feb', revenue: 0 }, { name: 'Mar', revenue: 0 },
        { name: 'Apr', revenue: 0 }, { name: 'May', revenue: 0 }, { name: 'Jun', revenue: 0 },
        { name: 'Jul', revenue: 0 }, { name: 'Aug', revenue: 0 }, { name: 'Sep', revenue: 0 },
        { name: 'Oct', revenue: 0 }, { name: 'Nov', revenue: 0 }, { name: 'Dec', revenue: 0 },
      ]
  
  financialChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months.map(m => m.name),
      datasets: [
        {
          label: 'Revenue',
          data: months.map(m => m.revenue || 0),
          backgroundColor: 'rgba(34, 197, 94, 0.6)',
          borderColor: '#22c55e',
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: 'Expenses',
          data: months.map(m => (m.revenue || 0) * 0.3),
          backgroundColor: 'rgba(239, 68, 68, 0.6)',
          borderColor: '#ef4444',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { usePointStyle: true, padding: 20 },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => `RM ${value}`,
          },
        },
      },
    },
  })
}

// ── API Calls ──────────────────────────────────
const fetchFinance = async () => {
  try {
    const { data } = await api.get('/admin/finance', {
      params: { period: selectedPeriod.value }
    })
    
    const d = data.data
    
    // Update financial summary
    finance.value = {
      totalRevenue: d.summary?.total_revenue || 0,
      revenueGrowth: d.summary?.revenue_growth || 0,
      totalExpenses: d.summary?.total_expenses || 0,
      expenseChange: d.summary?.expense_change || 0,
      netProfit: d.summary?.net_profit || 0,
      profitMargin: d.summary?.profit_margin || 0,
      pendingPayments: d.summary?.pending_payments || 0,
      pendingCount: d.summary?.pending_count || 0,
    }
    
    // Update expense breakdown
    expenseBreakdown.value = d.expense_breakdown || []
    
    // Update transactions
    transactions.value = d.transactions || []
    
    // Update monthly summary
    monthlySummary.value = d.monthly_revenue || []
    
    // Re-initialize chart with new data
    initChart()
    
  } catch (error) {
    console.error('Failed to fetch finance data:', error)
  }
}

// ── Watchers ───────────────────────────────────
watch(selectedPeriod, () => {
  fetchFinance()
})

// ── Lifecycle ──────────────────────────────────
onMounted(() => {
  fetchFinance()
})
</script>
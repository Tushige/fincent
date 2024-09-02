import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const SESSION_KEY = 'appwrite-session'
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const encryptId = (id: string) => {
  return btoa(id)
}
const decryptId = (id: string) => {
  return atob(id)
}
function formatUSD(amount: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })
  return formatter.format(amount)
}

const idxToMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function parseIntoMonthlyIncome(data) {
  /**
   * res = {
   *  year: {
   *    month: value 
   * }
   * }
   */
  const res = {}
  data.forEach(d => {
    const date = new Date(Date.parse(d.end_date))
    const year = String(date.getFullYear())
    const month = idxToMonth[date.getMonth()]
    const amount = d.total_amount
    if (!res[year]) {
      res[year] = {}
    }
    res[year][month] = amount
  })
  return res;
}

const monthIdxToMonthLabel = (monthIdx: number) => {
  const mapping = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  return mapping[monthIdx]
}

const CATEGORIES_SET = new Set([
  'FOOD_AND_DRINK',
  'ENTERTAINMENT',
  // 'PERSONAL_CARE',
  'GENERAL_SERVICES',
  // 'TRAVEL',
  'TRANSPORTATION',
  'GENERAL_MERCHANDISE'
])

const categoryLabels = {
  'FOOD_AND_DRINK': 'Food',
  'ENTERTAINMENT': 'Fun',
  'GENERAL_SERVICES': 'Services',
  'GENERAL_MERCHANDISE': 'Shopping',
  'TRANSPORTATION': 'Travel',
  'TRAVEL': 'Travel',
  'LOAN_PAYMENTS': 'Loans',
  'TRANSFER_OUT': 'Payment',
  'PERSONAL_CARE': 'Personal Care',
  'INCOME': 'Income'
}
export {
  SESSION_KEY,
  cn,
  encryptId,
  decryptId,
  formatUSD,
  parseIntoMonthlyIncome,
  monthIdxToMonthLabel,
  CATEGORIES_SET,
  categoryLabels
}
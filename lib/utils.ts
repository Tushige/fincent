import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const SESSION_KEY = 'appwrite-session'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatUSD(amount: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })
  return formatter.format(amount)
}

const idxToMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export function parseIntoMonthlyIncome(data) {
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

export const monthIdxToMonthLabel = (monthIdx: number) => {
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

export const CATEGORIES_SET = new Set([
  'FOOD_AND_DRINK',
  'ENTERTAINMENT',
  // 'PERSONAL_CARE',
  'GENERAL_SERVICES',
  // 'TRAVEL',
  'TRANSPORTATION',
  'GENERAL_MERCHANDISE'
])
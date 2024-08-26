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
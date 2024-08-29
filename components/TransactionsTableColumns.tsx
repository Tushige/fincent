'use client'
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import Image from "next/image";

export type Transaction = {
  id: string,
  amount: number,
  status: 'pending' | 'processing' | 'success' | 'failed',
  merchantName: string,
  date: string,
  category: string,
  logo_url: string
}

const columnHelper = createColumnHelper<Transaction>();

export const columns: ColumnDef<Transaction>[] = [
  columnHelper.accessor('merchant_name', {
    header: () => <div className="">Merchant</div>,
    cell: ({row}) => {
      let logo_url = row.getValue('logo_url')
      if (!logo_url) {
        logo_url = '/icons/shop-store-icon.svg'
      }
      let name =  row.getValue('merchant_name')
      if (!name) name = row.getValue('name')
      return (
        <div className="flex justify-start items-center gap-4 font-medium">
          <div className="rounded-full w-12 h-12 overflow-hidden">
            <Image src={logo_url} width={48} height={48} alt="company logo" />
          </div>
          {/* <Image width={34} height={34} alt="" src="https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=2250&q=80"/> */}
          <span>{name}</span>
        </div>
      )
    }
  }),
  columnHelper.accessor('amount', {
    header: () => <div className="">Amount</div>,
    cell: ({row}) => {
      const amount = parseFloat(row.getValue('amount'))
      const isProfit = amount >= 0;
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)
      const styles = isProfit ? (
        'text-green-400'
      ) : 'text-red-600'
      return <div className={styles}>{formatted}</div>
    }
  }),
  {
    accessorKey: "date",
    header: "Transaction Date",
  },
  columnHelper.accessor('category', {
    header: () => <div>Category</div>,
    cell: ({row}) => {
      const categoryList = row.getValue('category')
      const categoryLabel = categoryList.length > 0 ? categoryList[0] : 'Transfer'
      return <div className="border-2 rounded-lg border-slate-200 w-fit h-[34px] flex items-center px-1.5">{categoryLabel}</div>
    }
  }),
  columnHelper.accessor('pending', {
    header: () => <div>Status</div>,
    cell: ({row}) => {
      const pending = row.getValue('pending')
      if (pending) {
        return (
          <div className="rounded bg-slate-50 text-slate-600 flex justify-center items-center p-0 h-[34px]">pending</div>
        )
      } else {
        return (
          <div className="rounded bg-green-100 text-green-800 flex justify-center items-center p-0 h-[34px]">completed</div>
        )
      }
    }
  }),
  // need this to be able to access logo_url in merchant name but we don't want to render the column
  {
    accessorKey: 'logo_url',
    header: '',
    cell: ''
  },
  {
    accessorKey: 'name',
    header: '',
    cell: ''
  }
]
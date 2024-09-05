import { cn } from '@/lib/utils'
import React from 'react'

const AppTransactionTableContainer = ({children, CustomComponent, className}) => {
  if (CustomComponent) {
    <CustomComponent className={cn("w-[100%] md:w-[600px] lg:w-[700px] xl:w-[800px]", className)}>
      {children}
    </CustomComponent>
  }
  return (
    <div className={cn("w-[100%] md:w-[600px] lg:w-[700px] xl:w-[800px]", className)}>
      {children}
    </div>
  )
}

export default AppTransactionTableContainer
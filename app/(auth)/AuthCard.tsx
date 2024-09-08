import React from 'react'
import {
  Card,
} from "@/components/ui/card"
import { ProgressBar, ProgressBarProvider } from 'react-transition-progress'
import { AppNavBar } from '@/components/app-ui/AppNavBar'
import { cn } from '@/lib/utils'

const AuthCard = ({children, className}: {
  children: React.ReactNode,
  className?: string
}) => {
  return (
   <>
      <Card className={cn("w-[350px] relative", className)}>
        <ProgressBarProvider>
          <ProgressBar className="absolute h-[2px] shadow-lg shadow-fuchsia-500/20 bg-[linear-gradient(to_right,red,white)] top-0 left-0" />
          {children}
        </ProgressBarProvider>
      </Card>
    </>
  )
}
export default AuthCard

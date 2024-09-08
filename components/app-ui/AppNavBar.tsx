'use client'
import React from 'react'
import Image from 'next/image'
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

export function AppNavBar({isSignedin, className}) {
  const pathname = usePathname()
  return (
    <div className={cn("py-4", className)}>
      <div className="container flex flex-row justify-between items-center">
        <h1 className="flex flex-row gap-2 items-end text-2xl font-black ">
          <Image src={'/letter-f.png'} width={48} height={48} alt="company logo"/>
          <Link href="/" className="cursor-pointer">Fincent</Link>
        </h1>
        {
          !isSignedin && pathname ==='/' && (
            <Button className="bg-red-1 hover:bg-red-4 text-white hover:drop-shadow-xl">
              <Link href="/sign-up">Get Started</Link>
            </Button>
          )
        }
        {
          isSignedin && pathname ==='/' && (
            <Button className="bg-red-1 hover:bg-red-4 text-white hover:drop-shadow-xl">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          )
        }
      </div>
    </div>
  )
}
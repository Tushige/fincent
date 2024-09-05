'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  BuildingLibraryIcon,
  DocumentTextIcon,
  BanknotesIcon,
  LinkIcon
} from '@heroicons/react/24/outline'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  ArrowLeftEndOnRectangleIcon
} from '@heroicons/react/24/outline'

import { AppLogo } from './AppLogo'
import { signOut } from '@/lib/actions/auth.actions'
import PlaidLink from '../PlaidLink'

interface AppLink {
  label: string,
  href: string,
  icon: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref">>
}
const _links = [
  {label: 'Dashboard', href: '/dashboard', icon: HomeIcon},
  {label: 'My Banks', href: '/accounts', icon: BuildingLibraryIcon},
  {label: 'Transaction History', href: '/transaction-history', icon: DocumentTextIcon},
  {label: 'Transfer Funds', href: '/transfer-funds', icon: BanknotesIcon}
]

const NavLinks = ({links}: {links: AppLink[]}) => {
  const pathname = usePathname()
  return (
    <nav className="w-full">
      <ul className="mt-2 flex flex-col space-y-2 pt-4 md:pt-0">
        {
          links.map((link: AppLink, i: number) => {
            const LinkIcon = link.icon;
            return (
              <li key={link.href} className="w-full">
                <Link href={link.href} className={cn('w-full flex h-[48px] grow items-center gap-2 rounded-md bg-background p-3 text-sm font-medium hover:bg-muted md:justify-center lg:justify-start lg:flex-none lg:p-2 lg:px-3', 
                  {'bg-muted ': pathname === link.href})
                }>
                  <LinkIcon className="w-6 text-text"/>
                  <p className="block md:hidden lg:block text-text text-medium sm: text-lg">{link.label}</p>
                </Link>
              </li>
            )
          })
        }
      </ul>
    </nav>
  )
}

function SignOutForm(props: any) {
  return (
    <form action={signOut}>
      <button type="submit" className="w-full rounded-md flex flex-row gap-2 flex-start p-2 hover:bg-muted">
        <ArrowLeftEndOnRectangleIcon className="w-6 text-text"/>
        Sign Out
      </button>
    </form>
  )
}
/**
 * 
 * md-lg navigation only displays link icons
 * lg and over, we display icon and text
 */
const DesktopNav = () => {
  return (
    <section className="w-full h-full flex flex-grow flex-col p-2 lg:w-64 md:w-32 px-3 md:px-2 border-r-[1px] border-border bg-background">
      <h2 className="flex flex-col lg:flex-row items-center p-2 pt-0 text-lg font-bold">
        <AppLogo />
        <span className="hidden text-2xl lg:block">FINCENT</span>
      </h2>
      <div className="h-full flex flex-col gap-2">
        <NavLinks links={_links} />
        <PlaidLink variant="link"/>
        <div className="h-auto w-full grow rounded-md bg-background lg:block"/>
        <SignOutForm />
      </div>
    </section>
  )
}

const MobileNav = () => {
  return (
    <section className="w-full h-full flex flex-grow px-3 py-4 justify-between">
      <h2 className="flex items-center gap-2">
        <AppLogo />
        <span className="">FINCENT</span>
      </h2>
      <div className="h-full flex flex-col gap-2">
       <MobileNavSheet/>
      </div>
    </section>
  )
}


export function MobileNavSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">MENU</Button>
      </SheetTrigger>
      <SheetContent>
        <div className="h-full flex flex-col gap-2 items-start">
          <NavLinks links={_links} />
          <PlaidLink variant="link" className="w-full justify-start"/>
          <div className="h-auto w-full grow rounded-md bg-background lg:block"/>
          <SignOutForm>Sign Out</SignOutForm>
        </div>
      </SheetContent>
    </Sheet>
  )
}
export const AppSideNav = () => {
  return (
    <>
      <div className="hidden w-full h-full md:block">
        <DesktopNav/>
      </div>
      <div className="md:hidden">
        <MobileNav/>
      </div>
    </>
  )
}

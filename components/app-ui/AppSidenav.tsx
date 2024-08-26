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

import { AppLogo } from './AppLogo'
import { signOut } from '@/lib/actions'

interface AppLink {
  label: string,
  href: string,
  icon: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref">>
}
const _links = [
  {label: 'Home', href: '/', icon: HomeIcon},
  {label: 'My Banks', href: '/', icon: BuildingLibraryIcon},
  {label: 'Transaction History', href: '/', icon: DocumentTextIcon},
  {label: 'Payment Transfer', href: '/', icon: BanknotesIcon},
  {label: 'Connect Bank', href: '/', icon: LinkIcon},
]

const NavLinks = ({links}: {links: AppLink[]}) => {
  const pathname = usePathname()
  return (
    <nav>
      <ul className="mt-2 flex flex-col space-y-2 pt-4 md:pt-0">
        {
          links.map((link: AppLink, i: number) => {
            const LinkIcon = link.icon;
            return (
              <li key={link.href}>
                <Link href={link.href} className={cn('flex h-[48px] grow items-center gap-2 rounded-md bg-fuchsia-50 p-3 text-sm font-medium hover:bg-fuchsia-100 hover:text-fuchsia-500 md:justify-center lg:justify-start lg:flex-none lg:p-2 lg:px-3', {
                  'bg-fuchsia-100 text-fuchsia-500': pathname === link.href
                })}>
                  <LinkIcon className="w-6"/>
                  <p className="block md:hidden lg:block">{link.label}</p>
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
      <button type="submit">Sign Out</button>
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
    <section className="w-full h-full flex flex-grow flex-col lg:w-64 md:w-32 px-3 py-4 md:px-2">
      <h2 className="flex items-center">
        <AppLogo />
        <span>FINCENT</span>
      </h2>
      <div className="h-full flex flex-col gap-2">
        <NavLinks links={_links} />
        <div className="h-auto w-full grow rounded-md bg-fuchsia-50 lg:block"/>
        <SignOutForm>Sign Out</SignOutForm>
      </div>
    </section>
  )
}

const MobileNav = () => {
  return (
    <section className="w-full h-full flex flex-grow px-3 py-4 justify-between">
      <h2 className="flex items-center">
        <AppLogo />
        <span>FINCENT</span>
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
        <div className="h-full flex flex-col gap-2">
          <NavLinks links={_links} />
          <div className="h-auto w-full grow rounded-md bg-fuchsia-50 lg:block"/>
          <SignOutForm>Sign Out</SignOutForm>
        </div>
      </SheetContent>
    </Sheet>
  )
}
export const AppSideNav = () => {
  return (
    <>
      <div className="hidden md:block">
        <DesktopNav/>
      </div>
      <div className="md:hidden">
        <MobileNav/>
      </div>
    </>
  )
}

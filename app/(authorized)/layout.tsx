import {AppSideNav} from '@/components/app-ui/AppSidenav'
import { Toaster } from '@/components/ui/toaster';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen overflow-y-auto md:flex-row gap-2">
      <div className="pt-4 h-screen sticky top-0 left-0">
        <AppSideNav />
      </div>
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-[90%] lg:px-8">
        {children}
      </main>
      <Toaster />
    </div>
  );
}

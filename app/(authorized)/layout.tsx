import {AppSideNav} from '@/components/app-ui/AppSidenav'
import { Toaster } from '@/components/ui/toaster';
import { getSignedInUser } from '@/lib/actions/auth.actions';
import { redirect } from 'next/navigation';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSignedInUser()
  if (!user) {
    redirect('/')
  }
  return (
    <div className="flex flex-col h-screen overflow-y-auto md:flex-row">
      <div className="md:h-screen md:sticky md:top-0 sm:left-0">
        <AppSideNav />
      </div>
      <main className="container md:mx-auto">
        {children}
      </main>
      <Toaster />
    </div>
  );
}

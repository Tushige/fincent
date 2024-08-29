import {AppSideNav} from '@/components/app-ui/AppSidenav'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <AppSideNav />
      <main className="size-full px-3 py-4 md:px-2">
        {children}
      </main>
    </div>
  );
}

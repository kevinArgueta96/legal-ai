'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Menu, X } from "lucide-react"
import { routes, getRouteTitle } from "@/utils/routes/routes"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = React.useState(true)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out bg-gray-100 border-r",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex justify-between items-center p-4">
          <h2 className="text-lg font-semibold tracking-tight">Navigation</h2>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
            <X className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <div className="space-y-1">
                {routes.map((route) => {
                  const Icon = route.icon;
                  return (
                    <Button
                      key={route.path}
                      asChild
                      variant={pathname === route.path ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      <Link href={route.path}>
                        <Icon className="mr-2 h-4 w-4" />
                        {route.title}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main content */}
      <div className={cn("flex-1 flex flex-col overflow-hidden", sidebarOpen ? "md:ml-64" : "")}>
        <header className="flex items-center justify-between px-6 py-4 border-b">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Toggle sidebar">
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">
            {getRouteTitle(pathname)}
          </h1>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}

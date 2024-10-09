'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, LayoutDashboard, Menu, X } from "lucide-react"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const getTittle = (name: string) => {
    switch (name) {
      case "/":
        return "Chat Application"
      case "/dashboard":
        return "Dashboard"
      case "/langgraph":
        return "langgraph"
      default:
        return "Chat Application"
    }
  }
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
                <Button
                  asChild
                  variant={pathname === "/" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === "/dashboard" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === "/langgraph" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/langgraph">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    L3anggraph
                  </Link>
                </Button>
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
            {getTittle(pathname)}
          </h1>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
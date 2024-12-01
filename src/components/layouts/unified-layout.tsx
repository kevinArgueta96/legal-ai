"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes, getRouteTitle, getRouteDescription } from "@/utils/routes/routes";
import { Menu, X, Scale } from "lucide-react";

export function UnifiedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out bg-white border-r ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <Scale className="h-6 w-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Legal AI</h2>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close sidebar</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-auto py-6">
            <nav className="px-4 space-y-2">
              {routes.map((route) => {
                const Icon = route.icon;
                const isActive = pathname === route.path;
                return (
                  <Link
                    key={route.path}
                    href={route.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <div className="flex-1">
                      <p className="font-medium">{route.title}</p>
                      {route.description && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {route.description}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              Sistema de Asistencia Legal © 2024
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col overflow-hidden ${
          sidebarOpen ? "md:ml-64" : ""
        }`}
      >
        {/* Header */}
        <header className="bg-white border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Toggle sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {getRouteTitle(pathname)}
                </h1>
                <p className="text-sm text-gray-500">
                  {getRouteDescription(pathname)}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
      </div>
    </div>
  );
}

import { MainLayout } from "@/components/layouts/main-layout"

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="flex flex-col h-screen">
        <header className="flex items-center justify-between px-6 py-4 border-b">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome to your Dashboard</h2>
          <p>This is a placeholder for your dashboard content.</p>
        </main>
      </div>
    </MainLayout>
  )
}
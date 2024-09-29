//import { CardsChat } from "@/components/ui/chat"; // Asegúrate de que la ruta sea correcta
import { MainLayout } from "@/components/layouts/main-layout"
import { ChatLayout } from "@/components/layouts/chat-layout"

export default function Home() {
  return (
    <MainLayout>
      <ChatLayout />
    </MainLayout>
  )
}

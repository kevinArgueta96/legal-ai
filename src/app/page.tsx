
import { CardsChat } from "@/components/ui/chat"; // Asegúrate de que la ruta sea correcta

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <CardsChat></CardsChat>
      </div>
    </main>
  );
}

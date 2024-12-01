"use client";

import { ChatWindow } from "@/components/chat/chat-window";
import { Scale, Gavel, Shield } from "lucide-react";

export default function AgentePage() {
  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Description */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Agente Legal Especializado
          </h1>
          <p className="mt-2 text-gray-600">
            Asistente inteligente especializado en el sistema jurídico guatemalteco
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <Scale className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900">Asesoría Legal Precisa</h3>
            <p className="text-sm text-gray-600">
              Respuestas basadas en la legislación guatemalteca vigente
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <Gavel className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900">Análisis Jurídico</h3>
            <p className="text-sm text-gray-600">
              Interpretación de leyes y normativas actuales
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <Shield className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900">Protección Legal</h3>
            <p className="text-sm text-gray-600">
              Orientación sobre derechos y obligaciones legales
            </p>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Consulta con el Agente Legal
            </h2>
            <p className="text-gray-600">
              Realiza tus consultas sobre temas legales en Guatemala. El agente está 
              capacitado para proporcionar información precisa y actualizada sobre el 
              marco jurídico guatemalteco.
            </p>
          </div>
          <ChatWindow endpoint="/api/langchain-pinecone" />
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Nota importante:</strong> Este agente proporciona información general 
            y orientación sobre temas legales. Para casos específicos, se recomienda 
            consultar con un profesional legal calificado.
          </p>
        </div>
      </div>
    </div>
  );
}

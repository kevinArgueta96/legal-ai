"use client";

import { BookOpen, FileText, Download, ExternalLink, Search, BookMarked } from "lucide-react";

const legalResources = [
  {
    title: "Constitución Política",
    description: "Constitución Política de la República de Guatemala",
    type: "Documento Fundamental",
    lastUpdated: "2024",
    icon: BookMarked,
  },
  {
    title: "Código Civil",
    description: "Regulación de relaciones civiles y mercantiles",
    type: "Código Legal",
    lastUpdated: "2023",
    icon: FileText,
  },
  {
    title: "Código Penal",
    description: "Normativa penal y procesal",
    type: "Código Legal",
    lastUpdated: "2023",
    icon: FileText,
  },
  {
    title: "Leyes Laborales",
    description: "Código de Trabajo y regulaciones laborales",
    type: "Legislación Laboral",
    lastUpdated: "2024",
    icon: FileText,
  },
];

const categories = [
  {
    name: "Documentos Fundamentales",
    count: 15,
    icon: BookOpen,
  },
  {
    name: "Códigos Legales",
    count: 28,
    icon: FileText,
  },
  {
    name: "Jurisprudencia",
    count: 45,
    icon: BookMarked,
  },
];

export default function LanggraphPage() {
  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Recursos Legales de Guatemala
          </h1>
          <p className="mt-2 text-gray-600">
            Accede a documentación legal actualizada y recursos jurídicos
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar recursos legales..."
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.name}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.count} documentos</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resources List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Documentos Recientes
            </h2>
          </div>
          <div className="divide-y">
            {legalResources.map((resource) => {
              const Icon = resource.icon;
              return (
                <div
                  key={resource.title}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {resource.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-500">
                            Tipo: {resource.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            Actualizado: {resource.lastUpdated}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-500">
                        <Download className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-500">
                        <ExternalLink className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Información Importante
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <span className="mr-2">•</span>
              Los documentos se actualizan regularmente según cambios en la legislación
            </li>
            <li className="flex items-center">
              <span className="mr-2">•</span>
              Consulta siempre la versión más reciente de los documentos legales
            </li>
            <li className="flex items-center">
              <span className="mr-2">•</span>
              Para asesoría legal específica, consulta con un profesional calificado
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

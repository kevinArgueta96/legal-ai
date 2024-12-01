"use client";

import { BarChart3, Users, Scale, BookOpen, FileText, Building2 } from "lucide-react";

const stats = [
  {
    name: "Consultas Realizadas",
    value: "1,234",
    icon: BarChart3,
    change: "+12.3%",
    changeType: "positive",
  },
  {
    name: "Usuarios Activos",
    value: "567",
    icon: Users,
    change: "+8.2%",
    changeType: "positive",
  },
  {
    name: "Documentos Analizados",
    value: "892",
    icon: FileText,
    change: "+23.1%",
    changeType: "positive",
  },
];

const legalAreas = [
  {
    title: "Derecho Civil",
    description: "Contratos, propiedad, familia y sucesiones en Guatemala",
    icon: Scale,
  },
  {
    title: "Derecho Mercantil",
    description: "Sociedades, comercio y transacciones empresariales",
    icon: Building2,
  },
  {
    title: "Derecho Laboral",
    description: "Relaciones laborales y derechos del trabajador",
    icon: Users,
  },
  {
    title: "Recursos Legales",
    description: "Documentación y recursos jurídicos actualizados",
    icon: BookOpen,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Sistema Legal de Guatemala
          </h1>
          <p className="mt-2 text-gray-600">
            Información actualizada y recursos sobre el marco jurídico guatemalteco
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.name}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.name}
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="mt-4">
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === "positive"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-600"> vs último mes</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legal Areas Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Áreas Legales Principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {legalAreas.map((area) => {
              const Icon = area.icon;
              return (
                <div
                  key={area.title}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {area.title}
                      </h3>
                      <p className="mt-1 text-gray-600">{area.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resources Section */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recursos Disponibles
          </h2>
          <p className="text-gray-600 mb-4">
            Accede a nuestra biblioteca de recursos legales, incluyendo:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Constitución Política de la República de Guatemala</li>
            <li>Códigos y leyes actualizadas</li>
            <li>Jurisprudencia relevante</li>
            <li>Formularios y documentos legales</li>
            <li>Guías prácticas sobre procesos legales</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

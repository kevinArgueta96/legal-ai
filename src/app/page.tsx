"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Scale, Shield, BookOpen } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Asistente Legal Inteligente para Guatemala
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Accede a información legal precisa y actualizada sobre el sistema jurídico guatemalteco
              con la ayuda de inteligencia artificial.
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Comenzar Consulta
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Características Principales
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <Scale className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Asesoría Legal</h3>
              <p className="text-gray-600">
                Obtén respuestas precisas sobre leyes y regulaciones guatemaltecas actualizadas.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Protección Legal</h3>
              <p className="text-gray-600">
                Conoce tus derechos y obligaciones bajo el marco legal guatemalteco.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <BookOpen className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Recursos Educativos</h3>
              <p className="text-gray-600">
                Accede a información educativa sobre el sistema legal de Guatemala.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Comienza a Utilizar Nuestro Asistente Legal
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Obtén respuestas inmediatas a tus consultas legales
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Explorar Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

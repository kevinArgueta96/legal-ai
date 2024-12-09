import { Home, LayoutDashboard, MessageSquare, Scale, BookOpen, Bot } from "lucide-react";

export interface Route {
  path: string;
  title: string;
  icon: any;
  description?: string;
}

export const routes: Route[] = [
  {
    path: "/",
    title: "Inicio",
    icon: Home,
    description: "Página principal del asistente legal",
  },
  {
    path: "/dashboard",
    title: "Sistema Legal",
    icon: Scale,
    description: "Información del sistema legal guatemalteco",
  },
  {
    path: "/chat",
    title: "Consulta Legal",
    icon: MessageSquare,
    description: "Asistente legal inteligente",
  },
  {
    path: "/langgraph",
    title: "Recursos Legales",
    icon: BookOpen,
    description: "Documentación y recursos jurídicos",
  },
  {
    path: "/agent",
    title: "Agente Legal",
    icon: Bot,
    description: "Asistente especializado en derecho guatemalteco",
  }
];

export const getRouteTitle = (path: string): string => {
  const route = routes.find((route) => route.path === path);
  return route?.title || "Asistente Legal";
};

export const getRouteDescription = (path: string): string => {
  const route = routes.find((route) => route.path === path);
  return route?.description || "Sistema de asistencia legal";
};

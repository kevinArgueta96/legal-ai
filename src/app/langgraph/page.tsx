"use client";

import React from "react";
import { MainLayout } from "@/components/layouts/main-layout";
import { useEffect, useState } from "react";
import { getData, Notes } from "@/lib/supabase/get-data";

const MyComponent: React.FC = () => {
  const [data, setData] = useState<Notes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchMyData() {
      try {
        const result = await getData();
        setData(result);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMyData();
  }, []);

  if (loading) {
    
    return <MainLayout> <p>Cargando...</p> </MainLayout>;
  }

const testLangchain = async () => {
    const message = "Hola, ¿cómo estás?";
    const response = await fetch("api/test", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [message] }),
        });
    
    if (!response.body) {
      throw new Error('La respuesta no contiene un cuerpo de stream.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let done = false;

  while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      console.log(value, done)

      if (value) {
          // Decodificamos y mostramos el valor del stream
          console.log(decoder.decode(value, { stream: !done }));
      }
  }




    console.log(data);
}

  return (
    <MainLayout>
      <div>
        <button onClick={testLangchain}>Haz clic</button>
      </div>
      <div>
        <h1>Datos de Supabase</h1>

        {data.length === 0 ? (
          <p>No hay datos disponibles.</p>
        ) : (
          <ul>
            {data.map((item) => (
              <li key={item.id}>
                <strong>{item.id}</strong>: {item.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </MainLayout>
  );
};

export default MyComponent;

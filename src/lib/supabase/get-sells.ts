import { supabase } from '@/lib/supabase/supabase-client';

export interface Expense {
  product_name: number;
    total_sell : string;
  }

  export async function getExpenses(): Promise<Expense[]> {
    console.log("getExpenses");
    const { data, error } = await supabase
      .from<Expense>('amount_sell')
      .select('*');

  
    if (error) {
      console.error('Error al obtener datos: ', error.message);
      throw new Error(error.message);
    }

    // Enviar `dataString` a la API de ChatGPT o LangGraph para su análisis
    return data!; //
  }
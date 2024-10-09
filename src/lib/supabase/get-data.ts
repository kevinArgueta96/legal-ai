// lib/getData.ts

import { supabase } from '@/lib/supabase/supabase-client';

export interface Notes {
  id: number;
  title: string;
}

export async function getData(): Promise<Notes[]> {
  const { data, error } = await supabase
    .from<Notes>('notes')
    .select('*');

  if (error) {
    throw new Error(error.message);
  }

  return data!;
}
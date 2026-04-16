import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface UrlEntry {
  slug: string;
  original_url: string;
  created_at: number;
}

export async function getUrl(slug: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('urls')
    .select('original_url')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return null;
  }
  return data.original_url;
}

export async function setUrl(slug: string, originalUrl: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('urls')
    .insert({ slug, original_url: originalUrl });

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: `O slug "${slug}" já está em uso. Escolha outro.` };
    }
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function getAllUrls(): Promise<UrlEntry[]> {
  const { data, error } = await supabase
    .from('urls')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar URLs:', error);
    return [];
  }

  return (data || []).map((row) => ({
    slug: row.slug,
    original_url: row.original_url,
    created_at: new Date(row.created_at).getTime(),
  }));
}

export async function deleteUrl(slug: string): Promise<boolean> {
  const { error } = await supabase
    .from('urls')
    .delete()
    .eq('slug', slug);

  return !error;
}
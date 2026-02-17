export interface Product {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'script' | 'digisat' | 'plw' | string;
  preco: string | null;
  info_tecnica: string | null; // Currently text in DB, maybe JSON later?
  whatsapp_link: string | null;
  image_url: string | null;
  slug: string;
  created_at: string;
}

export interface Project {
  id: string;
  titulo: string;
  descricao: string;
  categoria: 'gov' | 'saude' | 'privado' | string;
  stack_tecnica: string[]; // Array in DB
  image_url: string | null;
  link: string | null;
  slug: string;
  created_at: string;
}

export interface Company {
  id: string;
  nome: string;
  logo_url: string | null;
  ordem: number;
  created_at: string;
}

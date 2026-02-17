import { MetadataRoute } from "next";
import { getProducts, getProjects } from "@/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://kltecnologia.com"; // Ajuste conforme seu domínio final

  // 1. Páginas estáticas
  const staticRoutes = [
    "",
    "/produtos",
    "/portfolio",
    // Adicione outras rotas estáticas se houver (ex: /sobre, /contato)
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // 2. Produtos Dinâmicos
  const products = await getProducts();
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/produtos/${product.slug}`,
    lastModified: new Date(product.created_at), // Idealmente seria updated_at
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // 3. Projetos Dinâmicos
  const projects = await getProjects();
  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/portfolio/${project.slug}`,
    lastModified: new Date(project.created_at),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes, ...projectRoutes];
}

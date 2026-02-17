import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://kltecnologia.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"], // Protege rotas administrativas
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

import type { MetadataRoute } from "next"
import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://noirespace.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: new Date(), priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE_URL}/programs`, lastModified: new Date(), priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE_URL}/studio`, lastModified: new Date(), priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE_URL}/services`, lastModified: new Date(), priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE_URL}/school`, lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE_URL}/about`, lastModified: new Date(), priority: 0.5, changeFrequency: "monthly" },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), priority: 0.5, changeFrequency: "monthly" },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), priority: 0.4, changeFrequency: "monthly" },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), priority: 0.3, changeFrequency: "yearly" },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), priority: 0.3, changeFrequency: "yearly" },
  ]

  let dynamicRoutes: MetadataRoute.Sitemap = []
  try {
    const publishedProducts = await db.query.products.findMany({
      where: eq(products.status, "published"),
    })

    dynamicRoutes = publishedProducts.map((p) => {
      const base = p.type === "education" ? "programs" : p.type === "studio" ? "studio" : p.type === "service" ? "services" : "school"
      return {
        url: `${BASE_URL}/${base}/${p.slug}`,
        lastModified: p.updatedAt,
        priority: 0.7,
        changeFrequency: "weekly",
      }
    })
  } catch {
    dynamicRoutes = []
  }

  return [...staticRoutes, ...dynamicRoutes]
}

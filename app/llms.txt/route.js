import { siteConfig } from "@/lib/siteConfig";

export const dynamic = "force-static";

export async function GET() {
  const body = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.tagline}`,
    "",
    "## Primary URLs",
    `${siteConfig.url}/`,
    `${siteConfig.url}/about`,
    `${siteConfig.url}/bhajans`,
    `${siteConfig.url}/events`,
    `${siteConfig.url}/gallery`,
    `${siteConfig.url}/media`,
    `${siteConfig.url}/contact`,
    "",
    "## Feeds & Discovery",
    `${siteConfig.url}/sitemap.xml`,
    `${siteConfig.url}/robots.txt`,
    "",
    "## Contact",
    `Email: ${siteConfig.email}`,
    `Website: ${siteConfig.url}`,
  ].join("\n");

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

import { siteConfig } from "@/lib/siteConfig";

export const dynamic = "force-static";

export async function GET() {
  const body = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    `${siteConfig.name} (अनीता प्रजापत) is a female Rajasthani devotional bhajan singer based in ${siteConfig.city}, performing since ${siteConfig.performingSince}. She is best known for Sanwariya Seth Bhajan and Khatu Shyam Bhajan, along with Balaji, Mataji, Satguru, Krishna, Marwadi and Rajasthani bhajans, and has performed at ${siteConfig.stageShows} live Jagrans across India. New bhajans are published every week on her YouTube channel.`,
    "",
    `अनीता प्रजापत जयपुर, राजस्थान की भजन गायिका हैं — सांवरिया सेठ भजन, खाटू श्याम भजन, माताजी, बालाजी और सतगुरु भजन तथा लाइव जागरण के लिए जानी जाती हैं। जागरण बुकिंग के लिए WhatsApp +${siteConfig.whatsapp} पर संपर्क करें।`,
    "",
    "## Specialties",
    ...siteConfig.genres.map((g) => `- ${g}`),
    "",
    "## Primary URLs",
    `- Home: ${siteConfig.url}/`,
    `- About: ${siteConfig.url}/about`,
    `- Bhajans (videos): ${siteConfig.url}/bhajans`,
    `- Events / Live Jagran: ${siteConfig.url}/events`,
    `- Gallery: ${siteConfig.url}/gallery`,
    `- Media coverage: ${siteConfig.url}/media`,
    `- Contact & booking: ${siteConfig.url}/contact`,
    "",
    "## Watch & Subscribe",
    `- YouTube channel (Sanwariya Seth & Khatu Shyam bhajans): ${siteConfig.social.youtube}`,
    `- Instagram: ${siteConfig.social.instagram}`,
    `- Facebook: ${siteConfig.social.facebook}`,
    "",
    "## Feeds & Discovery",
    `${siteConfig.url}/sitemap.xml`,
    `${siteConfig.url}/robots.txt`,
    "",
    "## Contact",
    `Email: ${siteConfig.email}`,
    `Booking manager: ${siteConfig.manager} (WhatsApp +${siteConfig.whatsapp})`,
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

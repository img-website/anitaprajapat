import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingBar from "@/components/layout/FloatingBar";
import MobileTabBar from "@/components/layout/MobileTabBar";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { getSettings } from "@/services/content";

export default async function SiteLayout({ children }) {
  const settings = await getSettings();
  return (
    <>
      <ScrollProgress />
      <Navbar logo={settings.logo} whatsapp={settings.whatsapp} />
      <main>{children}</main>
      <Footer settings={settings} />
      <FloatingBar settings={settings} />
      <MobileTabBar whatsapp={settings.whatsapp} />
    </>
  );
}

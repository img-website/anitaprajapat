import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingBar from "@/components/layout/FloatingBar";
import MobileTabBar from "@/components/layout/MobileTabBar";
import ScrollProgress from "@/components/ui/ScrollProgress";
import InstallPrompt from "@/components/pwa/InstallPrompt";
import BackgroundMusic from "@/components/pwa/BackgroundMusic";
import { getSettings } from "@/services/content";

export default async function SiteLayout({ children }) {
  const settings = await getSettings();
  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>
      <ScrollProgress />
      <Navbar logo={settings.logo} whatsapp={settings.whatsapp} />
      <main id="main" tabIndex={-1}>{children}</main>
      <Footer settings={settings} />
      <FloatingBar settings={settings} />
      <MobileTabBar whatsapp={settings.whatsapp} />
      <InstallPrompt />
      <BackgroundMusic src={settings.backgroundMusic} />
    </>
  );
}

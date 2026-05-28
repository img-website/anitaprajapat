import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import { getSettings } from "@/services/content";

export default async function PanelLayout({ children }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  const settings = await getSettings();

  return (
    <AdminShell user={session.user} logo={settings?.logo}>
      {children}
    </AdminShell>
  );
}

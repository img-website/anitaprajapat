"use client";

import ResourceManager from "@/components/admin/ResourceManager";
import { resourceConfigs } from "@/lib/adminResources";

export default function SponsorsAdminPage() {
  return <ResourceManager config={resourceConfigs.sponsors} />;
}

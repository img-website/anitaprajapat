"use client";

import ResourceManager from "@/components/admin/ResourceManager";
import { resourceConfigs } from "@/lib/adminResources";

export default function QuotesAdminPage() {
  return <ResourceManager config={resourceConfigs.quotes} />;
}

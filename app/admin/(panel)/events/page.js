"use client";

import ResourceManager from "@/components/admin/ResourceManager";
import { resourceConfigs } from "@/lib/adminResources";

export default function EventsAdminPage() {
  return <ResourceManager config={resourceConfigs.events} />;
}

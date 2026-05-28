"use client";

import ResourceManager from "@/components/admin/ResourceManager";
import { resourceConfigs } from "@/lib/adminResources";

export default function MediaAdminPage() {
  return <ResourceManager config={resourceConfigs.media} />;
}

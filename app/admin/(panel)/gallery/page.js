"use client";

import ResourceManager from "@/components/admin/ResourceManager";
import { resourceConfigs } from "@/lib/adminResources";

export default function GalleryAdminPage() {
  return <ResourceManager config={resourceConfigs.gallery} />;
}

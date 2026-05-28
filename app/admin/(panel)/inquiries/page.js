"use client";

import ResourceManager from "@/components/admin/ResourceManager";
import { resourceConfigs } from "@/lib/adminResources";

export default function InquiriesAdminPage() {
  return <ResourceManager config={resourceConfigs.inquiries} />;
}

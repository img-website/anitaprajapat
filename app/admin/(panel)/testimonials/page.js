"use client";

import ResourceManager from "@/components/admin/ResourceManager";
import { resourceConfigs } from "@/lib/adminResources";

export default function TestimonialsAdminPage() {
  return <ResourceManager config={resourceConfigs.testimonials} />;
}

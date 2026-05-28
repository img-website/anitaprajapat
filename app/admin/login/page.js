import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Admin Login",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    noimageindex: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

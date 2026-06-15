import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { hasAdminAccessFromCookies } from "@/lib/admin-auth";

export const metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  if (hasAdminAccessFromCookies()) {
    redirect("/admin");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-10">
      <h1 className="font-serif text-2xl font-normal text-ink dark:text-dark-text">Admin</h1>
      <AdminLoginForm />
    </main>
  );
}

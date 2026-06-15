import { AdminLoginForm } from "@/components/AdminLoginForm";

export const metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 py-16">
      <h1 className="mb-8 font-serif text-2xl text-ink">Admin</h1>
      <AdminLoginForm />
    </main>
  );
}

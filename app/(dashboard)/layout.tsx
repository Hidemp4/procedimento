import { createClient } from "@/lib/supabase/server";
import ClientLayout from "@/components/layouts/client-layout";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return <ClientLayout user={user}>{children}</ClientLayout>;
}
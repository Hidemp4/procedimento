"use client";

import { createClient } from "@/lib/supabase/client";

export function AuthButton() {
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  return (
    <button onClick={handleLogout} className="text-sm font-medium text-gray-600">
      Sair
    </button>
  );
}

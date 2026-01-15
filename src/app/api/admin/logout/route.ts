import { createClient } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = createClient();

    // 1. Déconnexion Supabase
    const { error } = await supabase.auth.signOut({ scope: 'global' })

    if (error) {
      console.error("Logout error:", error.message);
      return NextResponse.json(
        { error: "Failed to logout" },
        { status: 500 }
      );
    }

    // 2. Réponse OK
    return NextResponse.json(
      { success: true, message: "User logged out successfully" },
      { status: 200 }
    );

  } catch (err) {
    console.error("Logout exception:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { findUserByEmail, createUser } from "@/lib/dbService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, role } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Google account email is required." },
        { status: 400 }
      );
    }

    let user = await findUserByEmail(email);

    if (!user) {
      // Auto-register via Google
      user = await createUser({
        name: name || email.split("@")[0],
        email: email.toLowerCase().trim(),
        gender: "prefer_not_to_say",
        phone: "+91 98000 00000",
        role: role || "customer",
      });
    }

    // Check if this Google email is the admin email - strictly diyanshah2301@gmail.com
    const designatedAdminEmail = (process.env.ADMIN_EMAIL || "diyanshah2301@gmail.com").toLowerCase().trim();
    let effectiveRole = user.role;
    if (user.email.toLowerCase().trim() === designatedAdminEmail) {
      effectiveRole = "admin";
      user.role = "admin";
    } else if (effectiveRole === "admin") {
      effectiveRole = "customer";
      user.role = "customer";
    }

    return NextResponse.json({
      success: true,
      message: `Signed in with Google as ${user.name}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        phone: user.phone,
        role: effectiveRole,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Google authentication error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

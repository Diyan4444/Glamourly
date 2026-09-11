import { NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/dbService";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Please provide both email and password." },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User does not exist with this email. Please create an account first.",
        },
        { status: 404 }
      );
    }

    // Verify password (support hashed or plain text for initial seed users)
    let isPasswordValid = false;
    if (user.password) {
      if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
        isPasswordValid = await bcrypt.compare(password, user.password);
      } else {
        isPasswordValid = user.password === password;
      }
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Invalid password. Please check your credentials." },
        { status: 401 }
      );
    }

    // Check if user is the designated Admin - strictly diyanshah2301@gmail.com
    const designatedAdminEmail = (process.env.ADMIN_EMAIL || "diyanshah2301@gmail.com").toLowerCase().trim();
    let effectiveRole = user.role;
    if (user.email.toLowerCase().trim() === designatedAdminEmail) {
      effectiveRole = "admin";
      user.role = "admin";
    } else if (effectiveRole === "admin") {
      // If someone previously had admin but is NOT the designated email, downgrade to customer
      effectiveRole = "customer";
      user.role = "customer";
    }

    return NextResponse.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
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
    const message = error instanceof Error ? error.message : "Authentication error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

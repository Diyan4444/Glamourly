import { NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/lib/dbService";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, gender, phone, role } = body;

    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        { success: false, error: "Name, email, password, and phone number are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists. Please log in." },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
      gender: gender || "prefer_not_to_say",
      phone: phone.trim(),
      role: role || "customer",
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully!",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        gender: newUser.gender,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

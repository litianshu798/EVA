import { NextResponse } from "next/server";
import {
  registerPasswordUser,
  UserAuthError,
} from "@/backend/service/user";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim();
    const password = String(body.password || "");
    const nickname = String(body.nickname || "").trim();
    const inviteCode = String(body.invite_code || "").trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { code: "INVALID_EMAIL", message: "Invalid email" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          code: "WEAK_PASSWORD",
          message: "Password must be at least 8 characters",
        },
        { status: 400 }
      );
    }

    const user = await registerPasswordUser({
      email,
      password,
      nickname,
      inviteCode,
    });

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof UserAuthError) {
      return NextResponse.json(
        { code: error.code, message: error.message },
        { status: error.status }
      );
    }

    console.error("register failed", error);
    return NextResponse.json(
      { code: "REGISTER_FAILED", message: "Register failed" },
      { status: 500 }
    );
  }
}

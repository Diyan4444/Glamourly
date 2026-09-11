import { NextResponse } from "next/server";
import { handleRAGChat, testOmnirouteConnection } from "@/lib/aiService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, messages, query } = body;

    // Health check endpoint
    if (action === "test") {
      const result = await testOmnirouteConnection();
      return NextResponse.json(result);
    }

    // Extract latest user prompt
    let userPrompt = query;
    if (!userPrompt && messages && Array.isArray(messages)) {
      const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user");
      if (lastUserMsg) {
        userPrompt = lastUserMsg.content;
      }
    }

    if (!userPrompt) {
      return NextResponse.json(
        { success: false, error: "Please provide a query or message." },
        { status: 400 }
      );
    }

    const previousHistory = Array.isArray(messages) ? messages.slice(0, -1) : [];
    const reply = await handleRAGChat(userPrompt, previousHistory);

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "AI processing failed";
    return NextResponse.json(
      {
        success: false,
        error: msg,
      },
      { status: 500 }
    );
  }
}

import OpenAI from "openai";
import { getAllSalons, getAllBookings } from "./dbService";
import { MockSalon } from "./mockData";

/**
 * Glamourly AI Service with Website-Restricted RAG.
 * 
 * 1. If OmniRoute or an OpenAI-compatible proxy is reachable, it uses LLM chat completion
 *    with strictly grounded context derived from Glamourly's verified salon database.
 * 2. If no proxy is running locally, it provides an intelligent, fast internal RAG
 *    engine strictly limited to verified salons, services, staff, timings, prices, and locations
 *    on Glamourly.
 */

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({
      baseURL: process.env.OPENAI_BASE_URL || "http://localhost:20128/v1",
      apiKey: process.env.OPENAI_API_KEY || "sk-omniroute-local",
      timeout: 3000,
    });
  }
  return _client;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// ─── RAG Context Builder (Strict Website Scope) ─────────────────────────────
export async function buildWebsiteKnowledgeContext(userQuery: string): Promise<{
  contextText: string;
  matchedSalons: MockSalon[];
}> {
  const verifiedSalons = await getAllSalons({ onlyVerified: true });
  const q = userQuery.toLowerCase();

  // Score salons based on relevance to the query
  const scoredSalons = verifiedSalons.map((salon) => {
    let score = 0;
    const nameMatch = salon.name.toLowerCase().includes(q);
    const areaMatch = salon.area.toLowerCase().includes(q);
    const descMatch = salon.description.toLowerCase().includes(q);
    if (nameMatch) score += 10;
    if (areaMatch) score += 8;
    if (descMatch) score += 3;

    // Check services
    const matchedServices = salon.services.filter((srv) => {
      const srvName = srv.name.toLowerCase();
      const srvCat = srv.category.toLowerCase();
      return q.includes(srvName) || srvName.includes(q) || q.includes(srvCat) || srvCat.includes(q);
    });
    score += matchedServices.length * 5;

    // Check staff
    const matchedStaff = salon.staff.filter((st) =>
      q.includes(st.name.toLowerCase()) || q.includes(st.role.toLowerCase())
    );
    score += matchedStaff.length * 4;

    return { salon, score, matchedServices };
  });

  // Sort by score, then rating
  scoredSalons.sort((a, b) => b.score - a.score || b.salon.rating - a.salon.rating);

  const topSalons = scoredSalons.slice(0, 5).map((s) => s.salon);

  // Construct comprehensive grounded context text
  const contextLines: string[] = [
    "GLAMOURLY PLATFORM VERIFIED SALONS DATABASE (MUMBAI):",
  ];

  topSalons.forEach((s, idx) => {
    const servicesList = s.services
      .map((srv) => `    - ${srv.name} [${srv.category}, ₹${srv.price}, ${srv.durationMinutes} mins, ${srv.gender}]`)
      .join("\n");

    const staffList = s.staff
      .map((st) => `    - ${st.name} (${st.role}, rating: ${st.rating}⭐, exp: ${st.experience})`)
      .join("\n");

    const hours = s.operatingHours
      .map((h) => `${h.day}: ${h.isClosed ? "Closed" : `${h.open} - ${h.close}`}`)
      .join(", ");

    contextLines.push(
      `\n[Salon #${idx + 1}] ${s.name}
  - Area: ${s.area}, Mumbai
  - Full Address: ${s.address}
  - Contact Phone: ${s.contactPhone}
  - Email: ${s.contactEmail || "care@glamourly.in"}
  - Rating: ${s.rating} / 5 (${s.reviewCount} verified reviews)
  - License / GST: ${s.businessLicenseNumber}
  - Operating Hours: ${hours}
  - Services Offered:
${servicesList}
  - Stylist Team:
${staffList}`
    );
  });

  return {
    contextText: contextLines.join("\n"),
    matchedSalons: topSalons,
  };
}

// ─── Deterministic RAG Response Generator (No external API required) ────────
export function generateLocalRAGResponse(query: string, salons: MockSalon[]): string {
  const q = query.toLowerCase().trim();

  // 1. General Greeting
  if (/^(hi|hello|hey|greetings|namaste)\b/i.test(q)) {
    return (
      `Hello! Welcome to Glamourly Mumbai. ✨\n\n` +
      `I am strictly programmed with information about our verified Mumbai salons. You can ask me:\n` +
      `• "Which salons are in Bandra or Juhu?"\n` +
      `• "What is the price of French Balayage or Hydra Facial?"\n` +
      `• "Who are the stylists at Aura Luxury Hair Studio?"\n` +
      `• "Give me the contact phone number for Velvet Cut."\n\n` +
      `How can I assist your salon booking today?`
    );
  }

  // 2. Specific locality filter
  const areas = ["bandra", "juhu", "worli", "colaba", "andheri", "powai", "lower parel", "santacruz", "chembur", "malad", "thane"];
  const matchedArea = areas.find((a) => q.includes(a));

  // 3. Price / Cost inquiries
  if (q.includes("price") || q.includes("cost") || q.includes("rate") || q.includes("how much") || q.includes("₹")) {
    const results: string[] = [];
    salons.forEach((s) => {
      s.services.forEach((srv) => {
        if (q.includes(srv.name.toLowerCase()) || q.includes(srv.category.toLowerCase()) || q.includes(s.name.toLowerCase())) {
          results.push(`• **${srv.name}** at *${s.name}* (${s.area}): **₹${srv.price}** (${srv.durationMinutes} mins, ${srv.gender})`);
        }
      });
    });

    if (results.length > 0) {
      return (
        `Here are the exact prices from verified salons on Glamourly:\n\n` +
        results.slice(0, 6).join("\n") +
        `\n\nYou can book any of these slots directly on the salon's page!`
      );
    }
  }

  // 4. Contact / Phone / Timing inquiries
  if (q.includes("phone") || q.includes("contact") || q.includes("call") || q.includes("time") || q.includes("hours") || q.includes("open")) {
    const target = salons.find((s) => q.includes(s.name.toLowerCase()) || q.includes(s.area.toLowerCase())) || salons[0];
    if (target) {
      const todayHours = target.operatingHours[0]?.open
        ? `${target.operatingHours[0].open} - ${target.operatingHours[0].close}`
        : "10:00 AM - 08:30 PM";
      return (
        `**${target.name}** (${target.area}):\n` +
        `📞 Phone: **${target.contactPhone}**\n` +
        `✉️ Email: **${target.contactEmail || "reservations@" + target.name.toLowerCase().replace(/[^a-z]/g, "") + ".in"}**\n` +
        `📍 Address: ${target.address}\n` +
        `⏰ Hours: Typically ${todayHours}\n` +
        `⭐ Rating: ${target.rating}/5 (${target.reviewCount} verified reviews)`
      );
    }
  }

  // 5. Stylist / Staff inquiries
  const matchedStaffMember: { staff: any; salon: MockSalon }[] = [];
  salons.forEach((s) => {
    s.staff.forEach((st) => {
      const parts = st.name.toLowerCase().split(" ");
      if (q.includes(st.name.toLowerCase()) || parts.some((p) => p.length > 2 && q.includes(p))) {
        matchedStaffMember.push({ staff: st, salon: s });
      }
    });
  });

  if (matchedStaffMember.length > 0) {
    const details = matchedStaffMember.map(({ staff, salon }) => (
      `**${staff.name}** is a **${staff.role}** at **${salon.name}** (${salon.area}, Mumbai).\n` +
      `⭐ Rating: **${staff.rating}/5**\n` +
      `💼 Experience: ${staff.experience}\n` +
      `📅 Available: ${staff.workingDays.join(", ")}\n` +
      `📞 Salon Contact: ${salon.contactPhone}`
    )).join("\n\n");
    return `${details}\n\nYou can book an appointment with ${matchedStaffMember[0].staff.name} directly on Glamourly!`;
  }

  if (q.includes("stylist") || q.includes("staff") || q.includes("doctor") || q.includes("artist") || q.includes("expert") || q.includes("who works") || q.includes("team")) {
    const staffMatches: string[] = [];
    salons.forEach((s) => {
      s.staff.forEach((st) => {
        staffMatches.push(`• **${st.name}** (${st.role}) at *${s.name}* (${s.area}) — ${st.experience} [Rating: ${st.rating}⭐]`);
      });
    });

    if (staffMatches.length > 0) {
      return (
        `Here are verified stylists and artists on Glamourly:\n\n` +
        staffMatches.slice(0, 5).join("\n") +
        `\n\nYou can select your preferred stylist when booking on Glamourly!`
      );
    }
  }

  // 6. Area-specific search
  if (matchedArea) {
    const areaSalons = salons.filter((s) => s.area.toLowerCase().includes(matchedArea));
    if (areaSalons.length > 0) {
      const list = areaSalons.map((s) => {
        const topSrv = s.services.slice(0, 3).map((srv) => `${srv.name} (₹${srv.price})`).join(", ");
        return (
          `• **${s.name}** — ⭐ ${s.rating}/5 (${s.reviewCount} reviews)\n` +
          `  📍 ${s.address}\n` +
          `  📞 ${s.contactPhone}\n` +
          `  ✂️ Popular: ${topSrv}`
        );
      }).join("\n\n");

      return `Here are the verified salons in **${matchedArea.toUpperCase()}**, Mumbai:\n\n${list}\n\nWould you like to book a slot at one of these?`;
    }
  }

  // 7. General Salon Discovery / Matching
  const availableList = salons.slice(0, 3).map((s) => {
    const srvSummary = s.services.slice(0, 3).map((srv) => `${srv.name} (₹${srv.price})`).join(", ");
    return (
      `• **${s.name}** (${s.area}) — ⭐ ${s.rating}/5\n` +
      `  📞 ${s.contactPhone}\n` +
      `  ✂️ Services: ${srvSummary}`
    );
  }).join("\n\n");

  return (
    `Based on verified salons on Glamourly Mumbai:\n\n` +
    availableList +
    `\n\nAll listings are verified with trade licenses. Ask me for specific services (e.g. hair spa, facial, balayage) or locations!`
  );
}

// ─── Main Chat Handler (RAG with Fallback to Local Knowledge) ────────────────
export async function handleRAGChat(userMessage: string, history: ChatMessage[] = []): Promise<string> {
  // 1. Build strict website knowledge base
  const { contextText, matchedSalons } = await buildWebsiteKnowledgeContext(userMessage);

  // 2. Attempt LLM with RAG grounding if external proxy is active
  try {
    const client = getClient();
    const systemPrompt = `You are Glamourly AI, an assistant strictly restricted to information available on the Glamourly website.
Do NOT fabricate information, prices, or salons outside this provided context.

RESTRICTED WEBSITE KNOWLEDGE BASE:
${contextText}

RULES:
1. Answer the customer's question using ONLY the verified salon details provided above.
2. If asked about salons or locations not in Glamourly's database, politely state that only verified Mumbai salons listed on Glamourly are supported.
3. Always mention the price in ₹ (INR), exact salon name, locality, and contact phone where helpful.
4. Keep replies clear, polite, and under 150 words.`;

    const response = await client.chat.completions.create({
      model: "auto",
      messages: [
        { role: "system", content: systemPrompt },
        ...history.slice(-4),
        { role: "user", content: userMessage },
      ],
      max_tokens: 350,
      temperature: 0.3, // Low temperature for high precision grounding
    });

    const reply = response.choices[0]?.message?.content;
    if (reply && reply.trim().length > 0) {
      return reply.trim();
    }
  } catch {
    // If external proxy is not responding, seamlessly fall back to deterministic local RAG
  }

  // 3. Fallback: Local deterministic RAG engine using the website's live data
  return generateLocalRAGResponse(userMessage, matchedSalons);
}

// ─── Legacy Export Compatibility ─────────────────────────────────────────────
export async function chatCompletion(
  messages: ChatMessage[],
  options?: { context?: string }
): Promise<string> {
  const lastUserMsg = messages.filter((m) => m.role === "user").pop()?.content || "Recommend salons";
  return handleRAGChat(lastUserMsg, messages);
}

export async function getAIRecommendation(userQuery: string): Promise<string> {
  return handleRAGChat(userQuery);
}

export async function testOmnirouteConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    const client = getClient();
    const res = await client.chat.completions.create({
      model: "auto",
      messages: [{ role: "user", content: "ping" }],
      max_tokens: 5,
    });
    return { connected: true, message: `Connected: ${res.choices[0]?.message?.content || "OK"}` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Proxy unavailable";
    return { connected: false, message: msg };
  }
}

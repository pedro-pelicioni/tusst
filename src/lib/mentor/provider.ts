import "server-only";

// OpenAI-compatible chat-completion client for the AI mentor.
//
// Provider-agnostic on purpose: the default target is GitHub Models (free
// tier, GitHub PAT with models:read), but MENTOR_BASE_URL/MENTOR_MODEL can
// point at Azure OpenAI, OpenRouter or any /chat/completions endpoint
// without code changes. Plain fetch — no SDK dependency.

export type MentorMessage = { role: "system" | "user"; content: string };

export type MentorCompletion =
  | { ok: true; text: string }
  | { ok: false; reason: "rate_limited" | "unavailable" };

// The feature flag: no key, no mentor (endpoint 503s, UI hides the button).
export function mentorConfigured(): boolean {
  return Boolean(process.env.MENTOR_API_KEY);
}

export function mentorModel(): string {
  return process.env.MENTOR_MODEL ?? "openai/gpt-4o-mini";
}

const DEFAULT_BASE_URL = "https://models.github.ai/inference";
const REQUEST_TIMEOUT_MS = 20_000;

export async function chatCompletion(
  messages: MentorMessage[],
): Promise<MentorCompletion> {
  const apiKey = process.env.MENTOR_API_KEY;
  if (!apiKey) return { ok: false, reason: "unavailable" };
  const baseUrl = (process.env.MENTOR_BASE_URL ?? DEFAULT_BASE_URL).replace(
    /\/+$/,
    "",
  );

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: mentorModel(),
        messages,
        max_tokens: 400,
        temperature: 0.4,
      }),
      signal: controller.signal,
    });

    // 429 = the provider's own quota (e.g. GitHub Models daily cap) — a
    // distinct outcome so the route can degrade to static hints.
    if (res.status === 429) return { ok: false, reason: "rate_limited" };
    if (!res.ok) {
      // Status only — provider error bodies never reach logs verbatim to
      // avoid echoing prompt fragments or account details.
      console.error(`[mentor] provider error: HTTP ${res.status}`);
      return { ok: false, reason: "unavailable" };
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: unknown } }[];
    };
    const text = data.choices?.[0]?.message?.content;
    if (typeof text !== "string" || text.trim() === "") {
      return { ok: false, reason: "unavailable" };
    }
    return { ok: true, text: text.trim() };
  } catch {
    // Network failure or the 20s abort — both retryable later.
    return { ok: false, reason: "unavailable" };
  } finally {
    clearTimeout(timer);
  }
}

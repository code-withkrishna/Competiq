/**
 * GET /api/health
 *
 * Lightweight health-check endpoint.
 * Returns 200 when the server is reachable and both API keys are configured.
 * Returns 503 when required environment variables are missing.
 *
 * Safe to hit from uptime monitors (UptimeRobot, Better Uptime, etc.)
 * Does NOT make any external API calls — just checks key presence.
 */

export const dynamic  = "force-dynamic";
export const maxDuration = 5;

export function GET() {
  const anakinConfigured = Boolean(process.env.ANAKIN_API_KEY?.trim());
  const groqConfigured   = Boolean(process.env.GROQ_API_KEY?.trim());
  const allConfigured    = anakinConfigured && groqConfigured;

  const body = {
    status:    allConfigured ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    services: {
      anakin_wire: anakinConfigured ? "configured" : "missing — set ANAKIN_API_KEY",
      groq:        groqConfigured   ? "configured" : "missing — set GROQ_API_KEY",
    },
    model: process.env.GROQ_MODEL_NAME || "llama-3.3-70b-versatile",
  };

  return Response.json(body, { status: allConfigured ? 200 : 503 });
}

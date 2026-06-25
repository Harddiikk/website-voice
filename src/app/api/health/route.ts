// Lightweight health probe for Coolify / load balancers.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ status: "ok", service: "aurelia", voice: Boolean(process.env.GEMINI_API_KEY) });
}

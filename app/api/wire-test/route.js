import { wire } from "@/lib/wire";
import { InputValidationError, readJSONBody, sanitizeError } from "@/lib/api-helpers";

export async function POST(req) {
  try {
    const token = process.env.WIRE_TEST_TOKEN;
    const provided = req.headers.get("x-wire-test-token");

    if (!token || provided !== token) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const { action_id, params } = await readJSONBody(req);
    if (!action_id) return Response.json({ error: "action_id required" }, { status: 400 });

    const result = await wire(action_id, params ?? {});
    return Response.json({ success: true, result });
  } catch (err) {
    if (err instanceof InputValidationError) {
      return Response.json({ error: err.message }, { status: 400 });
    }
    console.error("[wire-test]", err);
    return Response.json({ error: sanitizeError(err, "Wire test could not complete. Please try again.") }, { status: 500 });
  }
}
